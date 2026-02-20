"use server"

import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getNotifications() {
    const user = await getCurrentUser()
    if (!user) return []

    try {
        const notifications = await sql`
            SELECT * FROM notifications 
            WHERE user_id = ${user.id} 
            ORDER BY created_at DESC 
            LIMIT 50
        `
        return notifications
    } catch (error) {
        console.error("Fetch notifications error:", error)
        return []
    }
}

export async function markNotificationAsRead(id: number) {
    const user = await getCurrentUser()
    if (!user) return { success: false }

    try {
        await sql`
            UPDATE notifications 
            SET is_read = TRUE 
            WHERE id = ${id} AND user_id = ${user.id}
        `
        return { success: true }
    } catch (error) {
        console.error("Mark notification error:", error)
        return { success: false }
    }
}

export async function getUnreadCount() {
    const user = await getCurrentUser()
    if (!user) return 0

    try {
        const result = await sql`
            SELECT COUNT(*) as count FROM notifications 
            WHERE user_id = ${user.id} AND is_read = FALSE
        `
        return parseInt(result[0].count)
    } catch (error) {
        return 0
    }
}

/**
 * Internal utility to create notifications
 */
export async function createNotification({
    userId,
    type,
    title,
    message,
    link,
    sourceId,
    sourceType
}: {
    userId: number
    type: string
    title: string
    message: string
    link?: string
    sourceId?: number
    sourceType?: string
}) {
    try {
        await sql`
            INSERT INTO notifications (user_id, type, title, message, link, source_id, source_type)
            VALUES (${userId}, ${type}, ${title}, ${message}, ${link}, ${sourceId}, ${sourceType})
        `
        // Also trigger email logic here in future
        console.log(`Notification created for user ${userId}: ${title}`)
        return { success: true }
    } catch (error) {
        console.error("Create notification error:", error)
        return { success: false }
    }
}
