"use server"

import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function getDebugNotifications() {
    const user = await getCurrentUser()
    if (!user) return { error: "Not authenticated" }

    try {
        const notifications = await sql`
            SELECT id, user_id, type, title, message, created_at
            FROM notifications 
            WHERE user_id = ${user.id} 
            ORDER BY created_at DESC 
            LIMIT 10
        `

        const totalCount = await sql`
            SELECT COUNT(*) as count FROM notifications WHERE user_id = ${user.id}
        `

        // Also check invitations
        const thesisInvites = await sql`
            SELECT 'thesis' as type, COUNT(*) as count FROM team_members 
            WHERE user_id = ${user.id} AND status = 'invited'
        `

        const publicationInvites = await sql`
            SELECT 'publication' as type, COUNT(*) as count FROM coauthor_requests 
            WHERE invited_user_id = ${user.id} AND status = 'pending'
        `

        return {
            user: { id: user.id, name: user.full_name, email: user.email },
            notificationsInDB: notifications,
            totalNotificationCount: totalCount[0]?.count || 0,
            invitationSummary: {
                thesis: thesisInvites[0]?.count || 0,
                publications: publicationInvites[0]?.count || 0
            }
        }
    } catch (error) {
        console.error("Debug error:", error)
        return { error: error instanceof Error ? error.message : "Unknown error" }
    }
}
