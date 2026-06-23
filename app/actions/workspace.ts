"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { z } from "zod"
import fs from "fs"
import path from "path"
import { createNotification } from "./notifications"
import { sendEmail } from "@/lib/mail"

const createWorkspaceSchema = z.object({
  type: z.enum(["thesis", "project", "publication"]),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  department: z.string().optional(),
  field: z.string().optional(),
})

export async function createWorkspace(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { message: "Unauthorized", success: false }
  }

  const rawData = {
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description"),
    department: formData.get("department"),
    field: formData.get("field"),
  }

  const validatedFields = createWorkspaceSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      message: "Invalid fields",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    }
  }

  const { type, title, description, department, field } = validatedFields.data
  let workspaceId: number | null = null

  try {
    if (type === "thesis") {
      // Create Thesis
      const result = await sql`
        INSERT INTO theses (
          title, abstract, department, field, 
          year, submitted_date,
          status, supervisor_id, created_at, updated_at
        )
        VALUES (
          ${title}, ${description}, ${department || user.department}, ${field || user.specialization},
          EXTRACT(YEAR FROM NOW()), CURRENT_DATE,
          'draft', null, NOW(), NOW()
        )
        RETURNING id
      `
      workspaceId = result[0].id

      // Add student as author/team member
      // 1. Add to thesis_authors (Legacy support / Display)
      await sql`
        INSERT INTO thesis_authors (thesis_id, author_id, author_order)
        VALUES (${workspaceId}, ${user.id}, 1)
      `
      
      // 2. Add to team_members (New Workspace support)
      await sql`
        INSERT INTO team_members (thesis_id, user_id, role, status, joined_at)
        VALUES (${workspaceId}, ${user.id}, 'leader', 'active', NOW())
      `

    } else if (type === "project") {
      // Create Project
      const result = await sql`
        INSERT INTO projects (
            title, description, department, field, 
            status, created_at, updated_at
        )
        VALUES (
            ${title}, ${description}, ${department || user.department}, ${field || user.specialization},
            'draft', NOW(), NOW()
        )
        RETURNING id
      `
      workspaceId = result[0].id

      // Add student as Project Member
      await sql`
        INSERT INTO project_members (project_id, user_id, role, joined_at)
        VALUES (${workspaceId}, ${user.id}, 'leader', NOW())
      `
    } else if (type === "publication") {
        const paperSubtype = formData.get("paper_subtype") as string
        // Create Publication
        const result = await sql`
            INSERT INTO publications (
                title, abstract, journal_name, publication_type, paper_subtype, year, status, created_at, updated_at
            )
            VALUES (
                ${title}, ${description}, 'TBD', 'journal', ${paperSubtype || 'journal'}, EXTRACT(YEAR FROM NOW()), 'draft', NOW(), NOW()
            )
            RETURNING id
        `
        workspaceId = result[0].id

        // Add author
        await sql`
            INSERT INTO publication_authors (publication_id, author_name, author_order, corresponding_author, user_id)
            VALUES (${workspaceId}, ${user.full_name}, 1, true, ${user.id})
        `
    }
  } catch (error) {
    console.error("Workspace creation error:", error)
    return { message: "Database error: Failed to create workspace", success: false }
  }

  if (workspaceId) {
    revalidatePath("/student/dashboard")
    redirect(`/student/workspace/${type}/${workspaceId}`)
  }

  return { message: "Unknown error", success: false }
}

export async function inviteMember(prevState: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { message: "Unauthorized", success: false }

    const email = formData.get("email") as string
    const role = formData.get("role") as string
    const workspaceId = parseInt(formData.get("workspaceId") as string)
    const type = formData.get("type") as string

    if (!email || !workspaceId || !type) {
        return { message: "Missing fields", success: false }
    }

    try {
        // 1. Find User
        const userResult = await sql`SELECT id, full_name FROM users WHERE email = ${email}`
        if (userResult.length === 0) {
            return { message: "User not found with that email", success: false }
        }
        const inviteeId = userResult[0].id

        if (inviteeId === user.id) {
             return { message: "You cannot invite yourself", success: false }
        }

        // 3. Insert into Team Members
        if (type === 'thesis') {
             await sql`
                INSERT INTO team_members (thesis_id, user_id, role, status, invited_at)
                VALUES (${workspaceId}, ${inviteeId}, ${role || 'member'}, 'invited', NOW())
                ON CONFLICT (thesis_id, user_id) DO UPDATE SET status = 'invited', invited_at = NOW()
            `
        } else if (type === 'project') {
            await sql`
                INSERT INTO project_members (project_id, user_id, role, joined_at)
                VALUES (${workspaceId}, ${inviteeId}, ${role || 'member'}, NOW())
                ON CONFLICT (project_id, user_id) DO NOTHING
            `
        } else if (type === 'publication') {
            // Check if already a co-author
            const existingAuthor = await sql`
                SELECT id FROM publication_authors WHERE publication_id = ${workspaceId} AND user_id = ${inviteeId}
            `
            if (existingAuthor.length > 0) {
                return { message: "User is already a co-author", success: false }
            }

            // Check if already has a pending request
            const existingRequest = await sql`
                SELECT id FROM coauthor_requests WHERE publication_id = ${workspaceId} AND invited_user_id = ${inviteeId}
            `
            if (existingRequest.length > 0) {
                return { message: "Invitation already sent to this user", success: false }
            }

            // Get current max author order
            const orderResult = await sql`
                SELECT MAX(author_order) as max_order FROM publication_authors WHERE publication_id = ${workspaceId}
            `
            const newOrder = (orderResult[0].max_order || 0) + 1

            // Create pending co-author request instead of directly adding
            await sql`
                INSERT INTO coauthor_requests (publication_id, invited_by, invited_user_id, author_order, status)
                VALUES (${workspaceId}, ${user.id}, ${inviteeId}, ${newOrder}, 'pending')
            `
        }
        
        revalidatePath(`/student/workspace/${type}/${workspaceId}`)

        // Send Notification
        await createNotification({
            userId: inviteeId,
            type: 'invite',
            title: 'Workspace Invitation',
            message: `${user.full_name} invited you to join the ${type}: ${formData.get('workspaceTitle') || 'Research Workspace'}`,
            link: `/student/workspace/${type}/${workspaceId}`,
            sourceId: workspaceId,
            sourceType: type
        })

        // Send Email
        await sendEmail({
            to: email,
            subject: `SUST Research Hub: Invitation to join ${type}`,
            text: `You have been invited by ${user.full_name} to join as a ${role || 'member'} in the workspace. Link: ${process.env.NEXT_PUBLIC_APP_URL}/student/workspace/${type}/${workspaceId}`
        })

        return { message: `Invited ${userResult[0].full_name} successfully`, success: true }

    } catch (error) {
        console.error("Invite error:", error)
        return { message: "Failed to invite member", success: false }
    }
}

export async function acceptWorkspaceInvitation(workspaceId: number, type: string) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        if (type === 'thesis') {
            await sql`
                UPDATE team_members 
                SET status = 'active', joined_at = NOW() 
                WHERE thesis_id = ${workspaceId} AND user_id = ${user.id}
            `
        } else if (type === 'project') {
            // Projects currently don't have status, but we can add it or just ensure they are there
            // For now, let's just revalidate
        }

        revalidatePath(`/notifications`)
        revalidatePath(`/student/dashboard`)
        revalidatePath(`/student/workspace/${type}/${workspaceId}`)

        // Notify Lead
        let leader;
        if (type === 'thesis') {
            [leader] = await sql`SELECT user_id FROM team_members WHERE thesis_id = ${workspaceId} AND role = 'leader'`
        } else if (type === 'project') {
            [leader] = await sql`SELECT user_id FROM project_members WHERE project_id = ${workspaceId} AND role = 'leader'`
        }

        if (leader) {
            await createNotification({
                userId: leader.user_id,
                type: 'info',
                title: 'Invitation Accepted',
                message: `${user.full_name} has joined your ${type} team.`,
                link: `/student/workspace/${type}/${workspaceId}`,
                sourceId: workspaceId,
                sourceType: type
            })
        }

        return { success: true, message: "Invitation accepted" }
    } catch (error) {
        console.error("Accept invite error:", error)
        return { success: false, message: "Failed to accept invitation" }
    }
}

export async function declineWorkspaceInvitation(workspaceId: number, type: string) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        if (type === 'thesis') {
            await sql`
                DELETE FROM team_members 
                WHERE thesis_id = ${workspaceId} AND user_id = ${user.id} AND status = 'invited'
            `
        } else if (type === 'project') {
             await sql`
                DELETE FROM project_members 
                WHERE project_id = ${workspaceId} AND user_id = ${user.id}
            `
        }

        revalidatePath(`/notifications`)
        return { success: true, message: "Invitation declined" }
    } catch (error) {
        console.error("Decline invite error:", error)
        return { success: false, message: "Failed to decline invitation" }
    }
}

export async function requestSupervision(prevState: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { message: "Unauthorized", success: false }

    const supervisorId = parseInt(formData.get("supervisorId") as string)
    const topicProposal = formData.get("topicProposal") as string
    const workspaceId = parseInt(formData.get("workspaceId") as string)
    const type = formData.get("type") as string

    if (!supervisorId || !workspaceId || !topicProposal) {
        return { message: "Missing fields", success: false }
    }

    try {
        // 1. Check if workspace already has a supervisor
        let currentSupervisor;
        if (type === 'thesis') {
            currentSupervisor = await sql`
                SELECT user_id FROM team_members 
                WHERE thesis_id = ${workspaceId} AND role = 'supervisor'
            `
        } else if (type === 'project') {
             currentSupervisor = await sql`
                SELECT user_id FROM project_members 
                WHERE project_id = ${workspaceId} AND role = 'supervisor'
            `
        }

        if (currentSupervisor && currentSupervisor.length > 0) {
            return { message: "This workspace already has an assigned supervisor.", success: false }
        }

        // 2. Check if potential duplicate request
        const existing = await sql`
            SELECT id FROM supervision_requests 
            WHERE student_id = ${user.id} 
              AND supervisor_id = ${supervisorId} 
              AND status = 'pending'
              AND (thesis_id = ${type === 'thesis' ? workspaceId : null} OR project_id = ${type === 'project' ? workspaceId : null})
        `

        if (existing.length > 0) {
            return { message: "You already have a pending request to this supervisor for this workspace.", success: false }
        }

        // 3. Create Request
        if (type === 'thesis') {
             await sql`
                INSERT INTO supervision_requests (student_id, supervisor_id, thesis_id, topic_proposal, status, created_at)
                VALUES (${user.id}, ${supervisorId}, ${workspaceId}, ${topicProposal}, 'pending', NOW())
            `
            // Update workspace status to pending
            await sql`UPDATE theses SET status = 'pending' WHERE id = ${workspaceId}`
        } else if (type === 'project') {
            await sql`
                INSERT INTO supervision_requests (student_id, supervisor_id, project_id, topic_proposal, status, created_at)
                VALUES (${user.id}, ${supervisorId}, ${workspaceId}, ${topicProposal}, 'pending', NOW())
            `
            // Update workspace status to pending
            await sql`UPDATE projects SET status = 'pending' WHERE id = ${workspaceId}`
        }
        
        revalidatePath(`/student/workspace/${type}/${workspaceId}`)

        // Get supervisor email
        const supervisorResult = await sql`SELECT email, full_name FROM users WHERE id = ${supervisorId}`
        if (supervisorResult.length > 0) {
            const supervisorEmail = supervisorResult[0].email
            
            // Send Notification
            await createNotification({
                userId: supervisorId,
                type: 'supervision_request',
                title: 'New Supervision Request',
                message: `${user.full_name} requested supervision for their ${type}: ${formData.get('workspaceTitle') || 'Research Workflow'}`,
                link: `/student/workspace/${type}/${workspaceId}`,
                sourceId: workspaceId,
                sourceType: type
            })

            // Send Email
            await sendEmail({
                to: supervisorEmail,
                subject: `New Supervision Request: ${type}`,
                text: `${user.full_name} has requested you to supervise their research: ${topicProposal}. Review here: ${process.env.NEXT_PUBLIC_APP_URL}/student/workspace/${type}/${workspaceId}`
            })
        }

        return { message: "Supervision request sent successfully. Workspace moved to pending.", success: true }

    } catch (error) {
        console.error("Supervision request error:", error)
        return { message: "Failed to send request", success: false }
    }
}

export async function linkPublicationToThesis(publicationId: number, thesisId: number) {
    const user = await getCurrentUser()
    if (!user) return { message: "Unauthorized", success: false }

    try {
        await sql`
            UPDATE publications 
            SET thesis_id = ${thesisId}, updated_at = NOW()
            WHERE id = ${publicationId}
        `
        revalidatePath(`/student/workspace/publication/${publicationId}`)
        // revalidatePath of thesis might be needed if bi-directional view exists
        return { message: "Linked to Thesis successfully", success: true }
    } catch (error) {
        console.error("Link error:", error)
        return { message: "Failed to link", success: false }
    }
}

export async function linkPublicationToProject(publicationId: number, projectId: number) {
    const user = await getCurrentUser()
    if (!user) return { message: "Unauthorized", success: false }

    try {
        await sql`
            UPDATE publications 
            SET project_id = ${projectId}, updated_at = NOW()
            WHERE id = ${publicationId}
        `
        revalidatePath(`/student/workspace/publication/${publicationId}`)
        return { message: "Linked to Project successfully", success: true }
    } catch (error) {
        console.error("Link error:", error)
        return { message: "Failed to link", success: false }
    }
}

export async function updateWorkspaceDetails(prevState: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { message: "Unauthorized", success: false }

    const id = parseInt(formData.get("id") as string)
    const type = formData.get("type") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const keywordsStr = formData.get("keywords") as string
    const paperSubtype = formData.get("paper_subtype") as string
    const visibility = formData.get("visibility") as string

    if (!id || !type || !title) return { message: "Missing required fields", success: false }

    const keywords = keywordsStr ? keywordsStr.split(',').map(k => k.trim()).filter(k => k) : []

    try {
        if (type === 'thesis') {
            await sql`
                UPDATE theses 
                SET title = ${title}, abstract = ${description}, keywords = ${keywords}, visibility = COALESCE(${visibility}, visibility), updated_at = NOW()
                WHERE id = ${id}
            `
        } else if (type === 'project') {
            await sql`
                UPDATE projects 
                SET title = ${title}, description = ${description}, keywords = ${keywords}, updated_at = NOW()
                WHERE id = ${id}
            `
        } else if (type === 'publication') {
            await sql`
                UPDATE publications 
                SET title = ${title}, abstract = ${description}, keywords = ${keywords}, paper_subtype = ${paperSubtype}, updated_at = NOW()
                WHERE id = ${id}
            `
        }

        revalidateWorkspace(id, type)
        return { message: "Updated successfully", success: true }
    } catch (error) {
        console.error("Update error:", error)
        return { message: "Failed to update", success: false }
    }
}

export async function submitForReview(workspaceId: number, workspaceType: string) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        // For publications, route to admin review instead of supervisor
        if (workspaceType === 'publication') {
            // Update publication status to pending_admin_review
            await sql`UPDATE publications SET status = 'pending_admin_review', updated_at = NOW() WHERE id = ${workspaceId}`
            
            // Create paper review request entry
            const publication = await sql`SELECT title FROM publications WHERE id = ${workspaceId}`
            if (publication.length === 0) {
                return { success: false, message: "Publication not found" }
            }
            
            await sql`
                INSERT INTO paper_review_requests (publication_id, student_id, submitted_at, status)
                VALUES (${workspaceId}, ${user.id}, NOW(), 'pending')
            `
            
            // Notify all admins
            const admins = await sql`SELECT id FROM users WHERE role = 'admin'`
            for (const admin of admins) {
                await createNotification({
                    userId: admin.id,
                    type: 'info',
                    title: 'Paper Submitted for Review',
                    message: `${user.full_name} has submitted "${publication[0].title}" for review.`,
                    link: `/admin/papers`,
                    sourceId: workspaceId,
                    sourceType: 'publication'
                })
            }
            
            revalidatePath(`/student/workspace/${workspaceType}/${workspaceId}`)
            return { success: true, message: "Paper submitted for admin review successfully" }
        }
        
        // Find supervisor for thesis/project
        const supervisorId = await getWorkspaceSupervisorId(workspaceId, workspaceType)
        if (!supervisorId) {
            return { success: false, message: "Please request a supervisor first." }
        }

        // Update status to pending_review
        if (workspaceType === 'thesis') {
            await sql`UPDATE theses SET status = 'pending_review', updated_at = NOW() WHERE id = ${workspaceId}`
        } else if (workspaceType === 'project') {
            await sql`UPDATE projects SET status = 'pending_review', updated_at = NOW() WHERE id = ${workspaceId}`
        }

        revalidatePath(`/student/workspace/${workspaceType}/${workspaceId}`)

        // Notify supervisor
        const title = await getWorkspaceTitle(workspaceId, workspaceType)
        await createNotification({
            userId: supervisorId,
            type: 'info',
            title: 'Review Requested',
            message: `${user.full_name} has submitted "${title || 'their workspace'}" for review.`,
            link: `/supervisor/review/${workspaceType}/${workspaceId}`,
            sourceId: workspaceId,
            sourceType: workspaceType
        })

        return { success: true, message: "Submitted for review successfully" }
    } catch (error) {
        console.error("Submit for review error:", error)
        return { success: false, message: "Failed to submit for review" }
    }
}

export async function supervisorReviewAction(
    workspaceId: number, 
    workspaceType: string, 
    action: 'approve' | 'request_revision', 
    feedback?: string
) {
    const user = await getCurrentUser()
    if (!user || user.role === 'student') return { success: false, message: "Unauthorized" }

    try {
        const newStatus = action === 'approve' ? 'approved' : 'needs_revision'
        
        if (workspaceType === 'thesis') {
            await sql`UPDATE theses SET status = ${newStatus}, updated_at = NOW() WHERE id = ${workspaceId}`
        } else if (workspaceType === 'project') {
            await sql`UPDATE projects SET status = ${newStatus}, updated_at = NOW() WHERE id = ${workspaceId}`
        } else if (workspaceType === 'publication') {
            await sql`UPDATE publications SET status = ${newStatus}, updated_at = NOW() WHERE id = ${workspaceId}`
        }

        // Add feedback if provided
        if (feedback && feedback.trim() !== '') {
            await sql`
                INSERT INTO supervision_requests (
                    student_id, supervisor_id, 
                    thesis_id, project_id, 
                    topic_proposal, status, created_at, feedback
                )
                VALUES (
                    (SELECT user_id FROM team_members WHERE thesis_id = ${workspaceId} LIMIT 1), 
                    ${user.id},
                    ${workspaceType === 'thesis' ? workspaceId : null}, 
                    ${workspaceType === 'project' ? workspaceId : null},
                    'Review Feedback', 'feedback', NOW(), ${feedback}
                )
            `
        }

        revalidatePath(`/student/workspace/${workspaceType}/${workspaceId}`)
        revalidatePath(`/supervisor/review/${workspaceType}/${workspaceId}`)

        // Notify team
        const title = await getWorkspaceTitle(workspaceId, workspaceType)
        let members: any[] = []
        if (workspaceType === 'thesis') {
            members = await sql`SELECT user_id FROM team_members WHERE thesis_id = ${workspaceId} AND role != 'supervisor'`
        } else if (workspaceType === 'project') {
            members = await sql`SELECT user_id FROM project_members WHERE project_id = ${workspaceId} AND role != 'supervisor'`
        } else if (workspaceType === 'publication') {
            members = await sql`SELECT user_id FROM publication_authors WHERE publication_id = ${workspaceId}`
        }

        for (const member of members) {
            await createNotification({
                userId: member.user_id,
                type: action === 'approve' ? 'success' : 'warning',
                title: action === 'approve' ? 'Workspace Approved' : 'Revision Requested',
                message: action === 'approve' 
                    ? `Your ${workspaceType} "${title || ''}" has been approved and published.`
                    : `Revisions requested for your ${workspaceType} "${title || ''}".`,
                link: `/student/workspace/${workspaceType}/${workspaceId}`,
                sourceId: workspaceId,
                sourceType: workspaceType
            })
        }

        return { 
            success: true, 
            message: action === 'approve' ? "Workspace approved and published" : "Revision requested" 
        }
    } catch (error) {
        console.error("Supervisor review error:", error)
        return { success: false, message: "Failed to process review" }
    }
}
export async function publishWorkspace(workspaceId: number, workspaceType: string) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        // Only supervisors or admins can publish
        const userRole = user.role
        if (userRole !== 'supervisor' && userRole !== 'admin') {
            return { success: false, message: "Only supervisors and admins can publish work" }
        }

        // Verify user is supervisor of this workspace
        if (userRole === 'supervisor') {
            let isSupervisor = false
            if (workspaceType === 'thesis') {
                const [thesis] = await sql`SELECT supervisor_id FROM theses WHERE id = ${workspaceId}`
                isSupervisor = thesis?.supervisor_id === user.id
            } else if (workspaceType === 'project') {
                const [member] = await sql`SELECT user_id FROM project_members WHERE project_id = ${workspaceId} AND user_id = ${user.id} AND role = 'supervisor'`
                isSupervisor = !!member
            }
            if (!isSupervisor) {
                return { success: false, message: "You are not the supervisor of this work" }
            }
        }

        // Update status to published
        if (workspaceType === 'thesis') {
            await sql`UPDATE theses SET status = 'published', visibility = 'public', updated_at = NOW() WHERE id = ${workspaceId}`
        } else if (workspaceType === 'project') {
            await sql`UPDATE projects SET status = 'published', updated_at = NOW() WHERE id = ${workspaceId}`
        }

        // Get workspace title and team members
        const title = await getWorkspaceTitle(workspaceId, workspaceType)
        let members: any[] = []
        if (workspaceType === 'thesis') {
            members = await sql`SELECT user_id FROM team_members WHERE thesis_id = ${workspaceId}`
        } else if (workspaceType === 'project') {
            members = await sql`SELECT user_id FROM project_members WHERE project_id = ${workspaceId}`
        }

        // Notify all team members
        for (const member of members) {
            await createNotification({
                userId: member.user_id,
                type: 'success',
                title: 'Work Published',
                message: `Your ${workspaceType} "${title || ''}" has been published to the public repository.`,
                link: `/student/workspace/${workspaceType}/${workspaceId}`,
                sourceId: workspaceId,
                sourceType: workspaceType
            })
        }

        revalidatePath(`/student/workspace/${workspaceType}/${workspaceId}`)
        revalidatePath(`/supervisor/review/${workspaceType}/${workspaceId}`)
        revalidatePath(`/${workspaceType}/${workspaceId}`)
        return { success: true, message: "Workspace published successfully to public repository" }
    } catch (error) {
        console.error("Publish workspace error:", error)
        return { success: false, message: "Failed to publish workspace" }
    }
}

export async function saveResourceMetadata(data: {
    workspaceId: number,
    workspaceType: string,
    fileName: string,
    fileUrl: string,
    fileSize: number,
    resourceType: string,
    publicId: string
}) {
    const user = await getCurrentUser()
    if (!user) return { message: "Unauthorized", success: false }

    try {
        if (data.workspaceType === 'publication') {
            await sql`
                INSERT INTO publication_files (publication_id, file_name, file_url, file_size, resource_type, uploaded_at)
                VALUES (${data.workspaceId}, ${data.fileName}, ${data.fileUrl}, ${data.fileSize}, ${data.resourceType}, NOW())
            `
        } else if (data.workspaceType === 'thesis') {
             await sql`
                INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, resource_type, uploaded_at)
                VALUES (${data.workspaceId}, ${data.fileName}, ${data.fileUrl}, ${data.fileSize}, ${data.resourceType}, NOW())
            `
        } else if (data.workspaceType === 'project') {
             await sql`
                INSERT INTO project_files (project_id, file_name, file_url, file_size, resource_type, uploaded_at)
                VALUES (${data.workspaceId}, ${data.fileName}, ${data.fileUrl}, ${data.fileSize}, ${data.resourceType}, NOW())
            `
        }

        revalidatePath(`/student/workspace/${data.workspaceType}/${data.workspaceId}`)
        return { message: "File saved successfully", success: true }
    } catch (error) {
        console.error("Save resource error:", error)
        return { message: "Failed to save file info", success: false }
    }
}

// --- Models Actions ---

export async function getWorkspaceModels(workspaceId: number, workspaceType: string) {
    try {
        const models = await sql`
            SELECT * FROM models 
            WHERE workspace_id = ${workspaceId} AND workspace_type = ${workspaceType}
            ORDER BY created_at DESC
        `
        return models
    } catch (error) {
        console.error("Fetch models error:", error)
        return []
    }
}

export async function createModel(prevState: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { message: "Unauthorized", success: false }

    const workspaceId = parseInt(formData.get("workspaceId") as string)
    const workspaceType = formData.get("workspaceType") as string
    const title = (formData.get("title") || formData.get("name")) as string
    const description = formData.get("description") as string
    const status = formData.get("status") as string
    const accuracyStr = formData.get("accuracy") as string
    const framework = formData.get("framework") as string
    const version = formData.get("version") as string
    const model_type = (formData.get("model_type") || "neural_network") as string
    const download_url = (formData.get("download_url") || "") as string
    const tagsStr = formData.get("tags") as string

    if (!workspaceId || !workspaceType || !title) {
        return { message: "Missing required fields", success: false }
    }

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : []
    const accuracy = accuracyStr ? parseFloat(accuracyStr) : null

    try {
        await sql`
            INSERT INTO models (
                workspace_id, workspace_type, title, description, 
                status, accuracy, framework, version, tags, 
                model_type, download_url, created_at, updated_at
            )
            VALUES (
                ${workspaceId}, ${workspaceType}, ${title}, ${description}, 
                ${status}, ${accuracy}, ${framework}, ${version}, ${tags}, 
                ${model_type}, ${download_url}, NOW(), NOW()
            )
        `
        revalidateWorkspace(workspaceId, workspaceType)
        return { message: "Model registered successfully", success: true }
    } catch (error) {
        console.error("Create model error:", error)
        return { message: "Failed to register model", success: false }
    }
}

// --- Datasets Actions ---

export async function getWorkspaceDatasets(workspaceId: number, workspaceType: string) {
    try {
        const datasets = await sql`
            SELECT * FROM datasets 
            WHERE workspace_id = ${workspaceId} AND workspace_type = ${workspaceType}
            ORDER BY created_at DESC
        `
        return datasets
    } catch (error) {
        console.error("Fetch datasets error:", error)
        return []
    }
}

export async function createDataset(prevState: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { message: "Unauthorized", success: false }

    const workspaceId = parseInt(formData.get("workspaceId") as string)
    const workspaceType = formData.get("workspaceType") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const type = formData.get("type") as string
    const size = formData.get("size") as string
    const location = formData.get("location") as string
    const version = formData.get("version") as string
    const tagsStr = formData.get("tags") as string

    if (!workspaceId || !workspaceType || !title) {
        return { message: "Missing required fields", success: false }
    }

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : []

    try {
        await sql`
            INSERT INTO datasets (workspace_id, workspace_type, title, description, type, size, location, version, tags, created_at, updated_at)
            VALUES (${workspaceId}, ${workspaceType}, ${title}, ${description}, ${type}, ${size}, ${location}, ${version}, ${tags}, NOW(), NOW())
        `
        revalidateWorkspace(workspaceId, workspaceType)
        return { message: "Dataset added successfully", success: true }
    } catch (error) {
        console.error("Create dataset error:", error)
        return { message: "Failed to add dataset", success: false }
    }
}

export async function deleteWorkspaceDataset(datasetId: number, workspaceId: number, workspaceType: string) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        await sql`DELETE FROM datasets WHERE id = ${datasetId}`
        revalidateWorkspace(workspaceId, workspaceType)
        return { success: true, message: "Dataset removed successfully" }
    } catch (error) {
        console.error("Delete dataset error:", error)
        return { success: false, message: "Failed to delete dataset" }
    }
}

// --- Documents Actions ---

export async function uploadDocument(
    workspaceId: number, 
    workspaceType: string, 
    formData: FormData, 
    resourceType: 'document' | 'result' | 'supplementary' | 'code' | 'dataset' | 'model' = 'document'
) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    const file = formData.get("file") as File
    if (!file) return { success: false, message: "No file provided" }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Local storage for dev (in public/uploads)
        const uploadDir = path.join(process.cwd(), "public", "uploads", workspaceType, workspaceId.toString())
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        const filePath = path.join(uploadDir, file.name)
        fs.writeFileSync(filePath, buffer)

        const fileUrl = `/uploads/${workspaceType}/${workspaceId}/${file.name}`

        // Insert into specific table based on workspaceType (Source of Truth)
        if (workspaceType === 'thesis') {
            await sql`
                INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, resource_type, uploaded_at)
                VALUES (${workspaceId}, ${sanitizedFilename}, ${fileUrl}, ${file.size}, ${resourceType}, NOW())
            `
        } else if (workspaceType === 'project') {
            await sql`
                INSERT INTO project_files (project_id, file_name, file_url, file_size, resource_type, uploaded_at)
                VALUES (${workspaceId}, ${sanitizedFilename}, ${fileUrl}, ${file.size}, ${resourceType}, NOW())
            `
        } else if (workspaceType === 'publication') {
            await sql`
                INSERT INTO publication_files (publication_id, file_name, file_url, file_size, resource_type, uploaded_at)
                VALUES (${workspaceId}, ${sanitizedFilename}, ${fileUrl}, ${file.size}, ${resourceType}, NOW())
            `
        }

        // Also keep documents table for global search/history if needed
        await sql`
            INSERT INTO documents (workspace_id, workspace_type, name, file_path, file_size, file_type, uploaded_by, created_at)
            VALUES (${workspaceId}, ${workspaceType}, ${sanitizedFilename}, ${fileUrl}, ${file.size}, ${file.type}, ${user.id}, NOW())
        `

        revalidateWorkspace(workspaceId, workspaceType)
        return { success: true, message: `Uploaded to ${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}` }
    } catch (error) {
        console.error("Upload error:", error)
        return { success: false, message: "Upload failed" }
    }
}

export async function getWorkspaceDocuments(workspaceId: number, workspaceType: string) {
    try {
        let documents: any[] = []
        if (workspaceType === 'thesis') {
            documents = await sql`SELECT * FROM thesis_files WHERE thesis_id = ${workspaceId} ORDER BY uploaded_at DESC`
        } else if (workspaceType === 'project') {
             documents = await sql`SELECT * FROM project_files WHERE project_id = ${workspaceId} ORDER BY uploaded_at DESC`
        } else if (workspaceType === 'publication') {
             documents = await sql`SELECT * FROM publication_files WHERE publication_id = ${workspaceId} ORDER BY uploaded_at DESC`
        }
        return documents
    } catch (error) {
         console.error("Fetch documents error:", error)
         return []
    }
}

// --- Simplified Resource Links (Code, Datasets) ---

export async function addResourceLink(
    workspaceId: number, 
    workspaceType: string, 
    title: string, 
    url: string, 
    category: 'code' | 'dataset' | 'result' | 'supplementary' | 'model' | 'other'
) {
    const user = await getCurrentUser()
    if (!user) return { message: "Unauthorized", success: false }

    try {
        // Validate URL
        if (!title || title.trim().length === 0) {
            return { message: "Title is required", success: false }
        }

        if (!url || url.trim().length === 0) {
            return { message: "URL is required", success: false }
        }

        // Basic URL validation
        try {
            new URL(url)
        } catch {
            return { message: "Invalid URL format", success: false }
        }

        if (title.length > 255) {
            return { message: "Title must be less than 255 characters", success: false }
        }

        await sql`
            INSERT INTO resource_links (workspace_id, workspace_type, title, url, category, updated_at)
            VALUES (${workspaceId}, ${workspaceType}, ${title}, ${url}, ${category}, NOW())
        `
        revalidateWorkspace(workspaceId, workspaceType)
        return { message: "Resource link added successfully", success: true }
    } catch (error) {
        console.error("Add resource link error:", error)
        return { message: "Failed to add resource link", success: false }
    }
}

export async function getResourceLinks(workspaceId: number, workspaceType: string) {
    try {
        const links = await sql`
            SELECT * FROM resource_links 
            WHERE workspace_id = ${workspaceId} AND workspace_type = ${workspaceType}
            ORDER BY created_at DESC
        `
        return links
    } catch (error) {
        console.error("Fetch resource links error:", error)
        return []
    }
}

export async function deleteResourceLink(linkId: number, workspaceId: number, workspaceType: string) {
    const user = await getCurrentUser()
    if (!user) return { message: "Unauthorized", success: false }

    try {
        await sql`DELETE FROM resource_links WHERE id = ${linkId}`
        revalidateWorkspace(workspaceId, workspaceType)
        return { success: true }
    } catch (error) {
        console.error("Delete resource link error:", error)
        return { success: false, message: "Failed to delete link" }
    }
}

export async function getModel(modelId: number) {
    try {
        const models = await sql`
            SELECT * FROM models WHERE id = ${modelId}
        `
        return models[0] || null
    } catch (error) {
        console.error("Fetch model error:", error)
        return null
    }
}

// --- Related Work Actions ---

export async function linkRelatedWork(sourceId: number, sourceType: string, targetId: number, targetType: string, description?: string) {
    const user = await getCurrentUser()
    if (!user) return { message: "Unauthorized", success: false }

    try {
        await sql`
            INSERT INTO related_work (source_id, source_type, target_id, target_type, description)
            VALUES (${sourceId}, ${sourceType}, ${targetId}, ${targetType}, ${description})
            ON CONFLICT (source_id, source_type, target_id, target_type) DO NOTHING
        `
        revalidatePath(`/student/workspace/${sourceType}/${sourceId}`)
        return { message: "Related work linked successfully", success: true }
    } catch (error) {
        console.error("Link related work error:", error)
        return { message: "Failed to link related work", success: false }
    }
}

export async function getRelatedWork(sourceId: number, sourceType: string) {
    try {
        const related = await sql`
            SELECT rw.*, 
                   CASE 
                      WHEN rw.target_type = 'thesis' THEN (SELECT title FROM theses WHERE id = rw.target_id)
                      WHEN rw.target_type = 'project' THEN (SELECT title FROM projects WHERE id = rw.target_id)
                      WHEN rw.target_type = 'publication' THEN (SELECT title FROM publications WHERE id = rw.target_id)
                   END as target_title
            FROM related_work rw
            WHERE source_id = ${sourceId} AND source_type = ${sourceType}
        `
        return related
    } catch (error) {
        console.error("Fetch related work error:", error)
        return []
    }
}

export async function updateWorkspaceSettings(id: number, type: string, data: { department?: string, visibility?: string }) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        if (type === 'thesis') {
            await sql`
                UPDATE theses 
                SET department = ${data.department || 'CSE'},
                    visibility = COALESCE(${data.visibility}, visibility),
                    updated_at = NOW()
                WHERE id = ${id}
            `
        } else if (type === 'project') {
            await sql`
                UPDATE projects 
                SET department = ${data.department || 'CSE'},
                    updated_at = NOW()
                WHERE id = ${id}
            `
        } else if (type === 'publication') {
            await sql`
                UPDATE publications 
                SET department = ${data.department || 'CSE'},
                    updated_at = NOW()
                WHERE id = ${id}
            `
        }

        revalidateWorkspace(id, type)

        return { success: true, message: "Settings updated" }
    } catch (error) {
        console.error("Update settings error:", error)
        return { success: false, message: "Failed to update settings" }
    }
}

// Helper to get workspace title for notification
async function getWorkspaceTitle(id: number, type: string) {
    try {
        if (type === 'thesis') {
            const [row] = await sql`SELECT title FROM theses WHERE id = ${id}`
            return row?.title
        } else if (type === 'project') {
            const [row] = await sql`SELECT title FROM projects WHERE id = ${id}`
            return row?.title
        } else if (type === 'publication') {
            const [row] = await sql`SELECT title FROM publications WHERE id = ${id}`
            return row?.title
        }
    } catch (e) {
        return null
    }
}

async function getWorkspaceSupervisorId(id: number, type: string) {
    try {
        if (type === 'thesis') {
            const [result] = await sql`SELECT user_id FROM team_members WHERE thesis_id = ${id} AND role = 'supervisor'`
            return result?.user_id
        } else if (type === 'project') {
            const [result] = await sql`SELECT user_id FROM project_members WHERE project_id = ${id} AND role = 'supervisor'`
            return result?.user_id
        }
    } catch (e) {
        console.error("Error fetching supervisor ID:", e)
        return null
    }
}

function revalidateWorkspace(workspaceId: number, workspaceType: string) {
    revalidatePath(`/student/workspace/${workspaceType}/${workspaceId}`)
    const publicType = workspaceType === 'publication' ? 'paper' : workspaceType
    revalidatePath(`/${publicType}/${workspaceId}`)
}

export async function deleteDocument(fileId: number, workspaceId: number, workspaceType: string) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        let fileUrl = ""
        if (workspaceType === 'thesis') {
            const [file] = await sql`SELECT file_url FROM thesis_files WHERE id = ${fileId}`
            if (file) fileUrl = file.file_url
            await sql`DELETE FROM thesis_files WHERE id = ${fileId}`
        } else if (workspaceType === 'project') {
            const [file] = await sql`SELECT file_url FROM project_files WHERE id = ${fileId}`
            if (file) fileUrl = file.file_url
            await sql`DELETE FROM project_files WHERE id = ${fileId}`
        } else if (workspaceType === 'publication') {
            const [file] = await sql`SELECT file_url FROM publication_files WHERE id = ${fileId}`
            if (file) fileUrl = file.file_url
            await sql`DELETE FROM publication_files WHERE id = ${fileId}`
        }

        if (fileUrl) {
            await sql`DELETE FROM documents WHERE workspace_id = ${workspaceId} AND workspace_type = ${workspaceType} AND file_path = ${fileUrl}`
            
            try {
                const diskPath = path.join(process.cwd(), "public", fileUrl)
                if (fs.existsSync(diskPath)) {
                    fs.unlinkSync(diskPath)
                }
            } catch (fsErr) {
                console.error("FS delete error:", fsErr)
            }
        }

        revalidateWorkspace(workspaceId, workspaceType)
        return { success: true, message: "Document deleted successfully" }
    } catch (error) {
        console.error("Delete document error:", error)
        return { success: false, message: "Failed to delete document" }
    }
}

export async function uploadPublicationPDF(
    workspaceId: number,
    formData: FormData
) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    const file = formData.get("file") as File
    if (!file) return { success: false, message: "No file provided" }

    try {
        // PDF validation
        const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB for PDFs
        
        if (file.type !== 'application/pdf') {
            return { success: false, message: `Only PDF files are allowed. Received: ${file.type}` }
        }

        if (file.size > MAX_FILE_SIZE) {
            return { success: false, message: `PDF file size exceeds maximum limit of 100MB` }
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uploadDir = path.join(process.cwd(), "public", "uploads", "publication", workspaceId.toString())
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        const filePath = path.join(uploadDir, file.name)
        fs.writeFileSync(filePath, buffer)

        const fileUrl = `/uploads/publication/${workspaceId}/${file.name}`

        await sql`
            UPDATE publications
            SET pdf_url = ${fileUrl}, updated_at = NOW()
            WHERE id = ${workspaceId}
        `

        revalidateWorkspace(workspaceId, "publication")
        return { success: true, message: "Main paper PDF uploaded successfully" }
    } catch (error) {
        console.error("Upload publication PDF error:", error)
        return { success: false, message: "Upload failed" }
    }
}

export async function deletePublicationPDF(workspaceId: number) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        const [pub] = await sql`SELECT pdf_url FROM publications WHERE id = ${workspaceId}`
        if (pub && pub.pdf_url) {
            try {
                const diskPath = path.join(process.cwd(), "public", pub.pdf_url)
                if (fs.existsSync(diskPath)) {
                    fs.unlinkSync(diskPath)
                }
            } catch (fsErr) {
                console.error("FS delete publication PDF error:", fsErr)
            }
        }

        await sql`
            UPDATE publications
            SET pdf_url = NULL, updated_at = NOW()
            WHERE id = ${workspaceId}
        `

        revalidateWorkspace(workspaceId, "publication")
        return { success: true, message: "Main paper PDF removed successfully" }
    } catch (error) {
        console.error("Delete publication PDF error:", error)
        return { success: false, message: "Failed to remove PDF" }
    }
}

export async function deleteWorkspaceModel(modelId: number, workspaceId: number, workspaceType: string) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        await sql`DELETE FROM models WHERE id = ${modelId}`
        revalidateWorkspace(workspaceId, workspaceType)
        return { success: true, message: "Model removed successfully" }
    } catch (error) {
        console.error("Delete model error:", error)
        return { success: false, message: "Failed to delete model" }
    }
}

// Co-author Request Functions
export async function acceptCoauthorRequest(requestId: number, publicationId: number) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        // Get the request details
        const request = await sql`
            SELECT cr.*, p.title, u.full_name as inviter_name
            FROM coauthor_requests cr
            JOIN publications p ON cr.publication_id = p.id
            JOIN users u ON cr.invited_by = u.id
            WHERE cr.id = ${requestId} AND cr.invited_user_id = ${user.id} AND cr.publication_id = ${publicationId}
        `

        if (request.length === 0) {
            return { success: false, message: "Request not found" }
        }

        const req = request[0]

        // Add user as co-author
        await sql`
            INSERT INTO publication_authors (publication_id, user_id, author_name, author_order, corresponding_author)
            VALUES (${publicationId}, ${user.id}, ${user.full_name}, ${req.author_order}, false)
        `

        // Mark request as accepted
        await sql`
            UPDATE coauthor_requests 
            SET status = 'accepted', responded_at = NOW()
            WHERE id = ${requestId}
        `

        // Notify the inviter
        await createNotification({
            userId: req.invited_by,
            type: 'success',
            title: 'Co-author Request Accepted',
            message: `${user.full_name} accepted your co-author invitation for "${req.title}".`,
            link: `/student/workspace/publication/${publicationId}`,
            sourceId: publicationId,
            sourceType: 'publication'
        })

        revalidatePath(`/student/workspace/publication/${publicationId}`)
        revalidatePath(`/student/notifications`)
        return { success: true, message: "Co-author request accepted" }
    } catch (error) {
        console.error("Accept co-author request error:", error)
        return { success: false, message: "Failed to accept request" }
    }
}

export async function declineCoauthorRequest(requestId: number, publicationId: number) {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        // Get the request details
        const request = await sql`
            SELECT cr.*, p.title, u.full_name as inviter_name
            FROM coauthor_requests cr
            JOIN publications p ON cr.publication_id = p.id
            JOIN users u ON cr.invited_by = u.id
            WHERE cr.id = ${requestId} AND cr.invited_user_id = ${user.id} AND cr.publication_id = ${publicationId}
        `

        if (request.length === 0) {
            return { success: false, message: "Request not found" }
        }

        const req = request[0]

        // Mark request as declined
        await sql`
            UPDATE coauthor_requests 
            SET status = 'declined', responded_at = NOW()
            WHERE id = ${requestId}
        `

        // Notify the inviter
        await createNotification({
            userId: req.invited_by,
            type: 'warning',
            title: 'Co-author Request Declined',
            message: `${user.full_name} declined your co-author invitation for "${req.title}".`,
            link: `/student/workspace/publication/${publicationId}`,
            sourceId: publicationId,
            sourceType: 'publication'
        })

        revalidatePath(`/student/workspace/publication/${publicationId}`)
        revalidatePath(`/student/notifications`)
        return { success: true, message: "Co-author request declined" }
    } catch (error) {
        console.error("Decline co-author request error:", error)
        return { success: false, message: "Failed to decline request" }
    }
}

export async function getPendingCoauthorRequests(publicationId: number) {
    const user = await getCurrentUser()
    if (!user) return { success: false, requests: [] }

    try {
        const requests = await sql`
            SELECT cr.*, u.full_name, u.email
            FROM coauthor_requests cr
            JOIN users u ON cr.invited_user_id = u.id
            WHERE cr.publication_id = ${publicationId} AND cr.status = 'pending'
            ORDER BY cr.created_at DESC
        `

        return { success: true, requests }
    } catch (error) {
        console.error("Get pending coauthor requests error:", error)
        return { success: false, requests: [] }
    }
}
