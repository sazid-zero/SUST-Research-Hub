"use server"

import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notifications"

export async function requestThesisAccess(thesisId: number, message: string) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        // Check if a request already exists
        const existing = await sql`
            SELECT id FROM resource_requests 
            WHERE requester_id = ${user.id} AND thesis_id = ${thesisId}
        `
        if (existing.length > 0) {
            return { success: false, message: "Request already submitted." }
        }

        // Insert request
        await sql`
            INSERT INTO resource_requests (requester_id, thesis_id, message, status)
            VALUES (${user.id}, ${thesisId}, ${message}, 'pending')
        `

        // Fetch thesis details for notification
        const thesis = await sql`SELECT title FROM theses WHERE id = ${thesisId}`
        const thesisTitle = thesis[0]?.title || "A Thesis"

        // Fetch authors and supervisor to notify
        const authors = await sql`
            SELECT author_id as user_id FROM thesis_authors WHERE thesis_id = ${thesisId}
            UNION
            SELECT supervisor_id as user_id FROM theses WHERE id = ${thesisId} AND supervisor_id IS NOT NULL
        `

        // Notify each author/supervisor
        for (const author of authors) {
            if (author.user_id && author.user_id !== user.id) {
                await createNotification({
                    userId: author.user_id,
                    type: "access_request",
                    title: "New Access Request",
                    message: `${user.full_name} requested access to "${thesisTitle}".`,
                    link: `/student/workspace/thesis/${thesisId}`
                })
            }
        }

        return { success: true, message: "Request submitted successfully." }
    } catch (error) {
        console.error("requestThesisAccess error:", error)
        return { success: false, message: "Failed to submit request." }
    }
}

export async function getPendingRequests(thesisId: number) {
    const user = await getCurrentUser()
    if (!user) return []

    // Verify user is author or supervisor or dept head before fetching (optional, but good practice)

    try {
        const requests = await sql`
            SELECT r.id, r.message, r.status, r.created_at, u.full_name, u.email
            FROM resource_requests r
            JOIN users u ON r.requester_id = u.id
            WHERE r.thesis_id = ${thesisId} AND r.status = 'pending'
            ORDER BY r.created_at DESC
        `
        return requests
    } catch (error) {
        console.error("getPendingRequests error:", error)
        return []
    }
}

export async function updateRequestStatus(requestId: number, thesisId: number, status: 'approved' | 'rejected') {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        const result = await sql`
            UPDATE resource_requests 
            SET status = ${status}, updated_at = NOW()
            WHERE id = ${requestId}
            RETURNING requester_id
        `
        
        if (result.length > 0) {
            const requesterId = result[0].requester_id
            const thesis = await sql`SELECT title FROM theses WHERE id = ${thesisId}`
            const thesisTitle = thesis[0]?.title || "A Thesis"

            // Notify requester
            await createNotification({
                userId: requesterId,
                type: "access_status",
                title: status === 'approved' ? "Access Approved" : "Access Denied",
                message: `Your request to access "${thesisTitle}" has been ${status}.`,
                link: `/theses/${thesisId}`
            })

            revalidatePath(`/student/workspace/thesis/${thesisId}`)
            revalidatePath(`/theses/${thesisId}`)
            return { success: true, message: `Request ${status}.` }
        }

        return { success: false, message: "Request not found." }
    } catch (error) {
        console.error("updateRequestStatus error:", error)
        return { success: false, message: "Failed to update request." }
    }
}

/** Returns the current user's request status for a thesis: 'none' | 'pending' | 'approved' | 'rejected' */
export async function getRequestStatus(thesisId: number): Promise<'none' | 'pending' | 'approved' | 'rejected'> {
    const user = await getCurrentUser()
    if (!user) return 'none'

    try {
        const existing = await sql`
            SELECT status FROM resource_requests 
            WHERE requester_id = ${user.id} AND thesis_id = ${thesisId}
        `
        if (existing.length === 0) return 'none'
        return existing[0].status as 'pending' | 'approved' | 'rejected'
    } catch (error) {
        console.error("getRequestStatus error:", error)
        return 'none'
    }
}
