'use server'

import { sql } from '@/lib/db'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'


export async function getSupervisorStats() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'supervisor') return null

    try {
        const [stats] = await sql`
            SELECT 
                (SELECT COUNT(*) FROM supervision_requests WHERE supervisor_id = ${user.id} AND status = 'pending') as pending_requests,
                (SELECT COUNT(*) FROM theses WHERE supervisor_id = ${user.id}) as supervised_theses,
                (SELECT COUNT(*) FROM projects p JOIN project_members pm ON p.id = pm.project_id WHERE pm.user_id = ${user.id} AND pm.role = 'supervisor') as supervised_projects
            FROM users 
            WHERE id = ${user.id}
        `

        return {
            pendingRequests: Number(stats?.pending_requests || 0),
            activeStudents: Number(stats?.supervised_theses || 0) + Number(stats?.supervised_projects || 0),
            totalReviewed: 0, // Placeholder for actual review history if added
        }
    } catch (error) {
        console.error("Error fetching supervisor stats:", error)
        return null
    }
}

export async function getSupervisionRequests() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'supervisor') return []

    try {
        const requests = await sql`
            SELECT 
                sr.id,
                sr.status,
                sr.topic_proposal,
                sr.created_at,
                u.full_name as student_name,
                u.department as student_department,
                t.title as thesis_title
            FROM supervision_requests sr
            JOIN users u ON sr.student_id = u.id
            LEFT JOIN theses t ON sr.thesis_id = t.id
            WHERE sr.supervisor_id = ${user.id}
            ORDER BY sr.created_at DESC
        `
        return requests
    } catch (error) {
        console.error("Error fetching supervision requests:", error)
        return []
    }
}

export async function handleSupervisionRequest(requestId: number, action: 'accept' | 'reject') {
    const user = await getCurrentUser()
    if (!user || user.role !== 'supervisor') return { success: false, message: "Unauthorized" }

    try {
        const status = action === 'accept' ? 'accepted' : 'rejected'
        
        await sql`
            UPDATE supervision_requests 
            SET status = ${status}, updated_at = NOW() 
            WHERE id = ${requestId} AND supervisor_id = ${user.id}
        `

        if (action === 'accept') {
            // Automatically assign as supervisor to the thesis or project if linked
            const [request] = await sql`SELECT thesis_id, project_id FROM supervision_requests WHERE id = ${requestId}`
            
            if (request?.thesis_id) {
                // 1. Update theses table
                await sql`
                    UPDATE theses 
                    SET supervisor_id = ${user.id}
                    WHERE id = ${request.thesis_id}
                `
                // 2. Add to team_members if not already there
                const [existingMember] = await sql`SELECT id FROM team_members WHERE thesis_id = ${request.thesis_id} AND user_id = ${user.id}`
                if (existingMember) {
                    await sql`UPDATE team_members SET role = 'supervisor', status = 'active' WHERE id = ${existingMember.id}`
                } else {
                    await sql`
                        INSERT INTO team_members (thesis_id, user_id, role, status, joined_at)
                        VALUES (${request.thesis_id}, ${user.id}, 'supervisor', 'active', NOW())
                    `
                }
            } else if (request?.project_id) {
                // 1. Update projects table
                await sql`
                    UPDATE projects 
                    SET supervisor_id = ${user.id}
                    WHERE id = ${request.project_id}
                `
                // 2. Add to project_members if not already there
                const [existingProjectMember] = await sql`SELECT id FROM project_members WHERE project_id = ${request.project_id} AND user_id = ${user.id}`
                if (existingProjectMember) {
                    await sql`UPDATE project_members SET role = 'supervisor' WHERE id = ${existingProjectMember.id}`
                } else {
                    await sql`
                        INSERT INTO project_members (project_id, user_id, role, joined_at)
                        VALUES (${request.project_id}, ${user.id}, 'supervisor', NOW())
                    `
                }
            }
        }

        // --- Notification Logic ---
        const [requestData] = await sql`
            SELECT student_id, thesis_id, project_id 
            FROM supervision_requests 
            WHERE id = ${requestId}
        `
        
        if (requestData) {
            const title = action === 'accept' ? 'Supervision Accepted' : 'Supervision Rejected'
            const message = action === 'accept' 
                ? `Dr. ${user.full_name} has accepted your supervision request.` 
                : `Dr. ${user.full_name} has declined your supervision request.`
            
            const sourceId = requestData.thesis_id || requestData.project_id
            const sourceType = requestData.thesis_id ? 'thesis' : 'project'

            await createNotification({
                userId: requestData.student_id,
                type: action === 'accept' ? 'supervision_accept' : 'supervision_reject',
                title: title,
                message: message,
                link: `/student/workspace/${sourceType}/${sourceId}`,
                sourceId: sourceId,
                sourceType: sourceType
            })
        }

        revalidatePath('/supervisor/requests')

        revalidatePath('/supervisor/dashboard')
        return { success: true, message: `Request ${action}ed` }
    } catch (error) {
        console.error("Error handling supervision request:", error)
        return { success: false, message: "Failed to process request" }
    }
}

export async function getSupervisedWork() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'supervisor') return []

    try {
        const theses = await sql`
            SELECT id, title, status, department, 'thesis' as type, created_at
            FROM theses 
            WHERE supervisor_id = ${user.id}
        `

        const projects = await sql`
            SELECT p.id, p.title, p.status, p.department, 'project' as type, p.created_at
            FROM projects p
            JOIN project_members pm ON p.id = pm.project_id
            WHERE pm.user_id = ${user.id} AND pm.role = 'supervisor'
        `

        return [...theses, ...projects].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    } catch (error) {
        console.error("Error fetching supervised work:", error)
        return []
    }
}

export async function getSupervisedStudents() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'supervisor') return []

    try {
        const students = await sql`
            SELECT DISTINCT
                u.id, u.full_name as name, u.email, u.department, u.student_id
            FROM users u
            WHERE u.role = 'student' AND (
                -- Linked via Thesis Authors
                u.id IN (
                    SELECT ta.author_id 
                    FROM thesis_authors ta
                    JOIN theses t ON ta.thesis_id = t.id
                    WHERE t.supervisor_id = ${user.id}
                )
                -- Linked via Thesis Team Members
                OR u.id IN (
                    SELECT tm.user_id 
                    FROM team_members tm
                    JOIN theses t ON tm.thesis_id = t.id
                    WHERE t.supervisor_id = ${user.id}
                )
                -- Linked via Project Members
                OR u.id IN (
                    SELECT pm_student.user_id
                    FROM project_members pm_student
                    JOIN projects p ON pm_student.project_id = p.id
                    WHERE p.supervisor_id = ${user.id} AND pm_student.role != 'supervisor'
                )
            )
        `
        return students
    } catch (error) {
        console.error("Error fetching supervised students:", error)
        return []
    }
}
