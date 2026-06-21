"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { createNotification } from "@/app/actions/notifications"

/**
 * Submit an authorship claim for a ghost author entry.
 * The user is claiming that a specific author_name in a publication or thesis belongs to them.
 */
export async function submitAuthorshipClaim(
    workspaceType: "thesis" | "publication",
    workspaceId: number,
    authorNameMatched: string
) {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, message: "Please log in to claim authorship." }
    }

    try {
        // Check if there's already a pending claim by this user for this workspace
        const existing = await sql`
            SELECT id FROM authorship_claims
            WHERE user_id = ${user.id}
              AND workspace_type = ${workspaceType}
              AND workspace_id = ${workspaceId}
              AND status = 'pending'
        `

        if (existing.length > 0) {
            return { success: false, message: "You already have a pending claim for this work." }
        }

        await sql`
            INSERT INTO authorship_claims (user_id, workspace_type, workspace_id, author_name_matched, status, created_at)
            VALUES (${user.id}, ${workspaceType}, ${workspaceId}, ${authorNameMatched}, 'pending', NOW())
        `

        return { success: true, message: "Authorship claim submitted! An administrator will review your request." }
    } catch (error: any) {
        console.error("Submit claim error:", error)
        return { success: false, message: "Failed to submit claim." }
    }
}

/**
 * Get all pending authorship claims (Admin only).
 */
export async function getPendingClaims() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
        return []
    }

    try {
        const claims = await sql`
            SELECT 
                ac.id,
                ac.workspace_type,
                ac.workspace_id,
                ac.author_name_matched,
                ac.status,
                ac.created_at,
                u.id as claimant_id,
                u.full_name as claimant_name,
                u.email as claimant_email,
                u.role as claimant_role,
                u.student_id as claimant_student_id
            FROM authorship_claims ac
            JOIN users u ON ac.user_id = u.id
            WHERE ac.status = 'pending'
            ORDER BY ac.created_at DESC
        `

        // Enrich with workspace titles
        const enriched = await Promise.all(claims.map(async (claim: any) => {
            let workspaceTitle = "Unknown"
            if (claim.workspace_type === 'thesis') {
                const t = await sql`SELECT title FROM theses WHERE id = ${claim.workspace_id}`
                if (t.length > 0) workspaceTitle = t[0].title
            } else if (claim.workspace_type === 'publication') {
                const p = await sql`SELECT title FROM publications WHERE id = ${claim.workspace_id}`
                if (p.length > 0) workspaceTitle = p[0].title
            }
            return { ...claim, workspace_title: workspaceTitle }
        }))

        return enriched
    } catch (error) {
        console.error("Fetch claims error:", error)
        return []
    }
}

/**
 * Approve or reject an authorship claim (Admin only).
 * On approval, links the user_id to the appropriate author record.
 */
export async function resolveAuthorshipClaim(
    claimId: number,
    action: "approved" | "rejected"
) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
        return { success: false, message: "Unauthorized." }
    }

    try {
        // Get claim details
        const claims = await sql`
            SELECT * FROM authorship_claims WHERE id = ${claimId} AND status = 'pending'
        `
        if (claims.length === 0) {
            return { success: false, message: "Claim not found or already resolved." }
        }

        const claim = claims[0]

        if (action === "approved") {
            // Link the user to the author record
            if (claim.workspace_type === "publication") {
                // Find the matching ghost author row and set user_id
                await sql`
                    UPDATE publication_authors 
                    SET user_id = ${claim.user_id}
                    WHERE publication_id = ${claim.workspace_id}
                      AND LOWER(TRIM(author_name)) = LOWER(TRIM(${claim.author_name_matched}))
                      AND (user_id IS NULL)
                    LIMIT 1
                `
            } else if (claim.workspace_type === "thesis") {
                // Add the user as a team member
                await sql`
                    INSERT INTO team_members (thesis_id, user_id, role, status, joined_at)
                    VALUES (${claim.workspace_id}, ${claim.user_id}, 'member', 'active', NOW())
                    ON CONFLICT (thesis_id, user_id) DO NOTHING
                `
            }
        }

        // Update claim status
        await sql`
            UPDATE authorship_claims 
            SET status = ${action}, resolved_at = NOW(), resolved_by = ${user.id}
            WHERE id = ${claimId}
        `

        // Send Notification
        if (action === "approved") {
            await createNotification({
                userId: claim.user_id,
                type: "claim_approved",
                title: "Authorship Claim Approved",
                message: `Your authorship claim for the ${claim.workspace_type} has been approved! You are now linked as an author.`,
                link: `/${claim.workspace_type}/${claim.workspace_id}`,
                sourceId: claim.workspace_id,
                sourceType: claim.workspace_type
            })
        } else {
            await createNotification({
                userId: claim.user_id,
                type: "claim_rejected",
                title: "Authorship Claim Rejected",
                message: `Your authorship claim for the ${claim.workspace_type} could not be verified and was rejected.`,
                link: `/${claim.workspace_type}/${claim.workspace_id}`,
                sourceId: claim.workspace_id,
                sourceType: claim.workspace_type
            })
        }

        revalidatePath("/admin/claims")
        revalidatePath(`/paper/${claim.workspace_id}`)
        revalidatePath(`/thesis/${claim.workspace_id}`)

        return { 
            success: true, 
            message: action === "approved" 
                ? "Claim approved. User is now linked as an author." 
                : "Claim rejected."
        }
    } catch (error: any) {
        console.error("Resolve claim error:", error)
        return { success: false, message: "Failed to resolve claim." }
    }
}
