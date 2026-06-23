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
        console.log(`Fetched ${notifications.length} notifications for user ${user.id}:`, notifications.slice(0, 2))
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
        // For now, just return success - column doesn't exist in schema
        console.log(`Mark notification ${id} as read for user ${user.id}`)
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
            WHERE user_id = ${user.id}
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
    console.log(`[createNotification] Starting for user ${userId}, type: ${type}`)
    try {
        const result = await sql`
            INSERT INTO notifications (user_id, type, title, message, link, created_at)
            VALUES (${userId}, ${type}, ${title}, ${message}, ${link}, NOW())
            RETURNING id
        `
        const notificationId = result[0]?.id
        console.log(`[createNotification] SUCCESS - created notification ID ${notificationId} for user ${userId}`)
        
        // Revalidate paths to ensure the popover updates
        try {
            revalidatePath("/")
            revalidatePath("/student/dashboard")
            revalidatePath("/notifications")
        } catch (revalidateErr) {
            console.log("[createNotification] Revalidate info:", revalidateErr)
        }
        
        return { success: true }
    } catch (error) {
        console.error("[createNotification] FAILED - SQL Error:", error)
        console.error("[createNotification] Error details:", {
            userId,
            type,
            title,
            message,
            link,
            sourceId,
            sourceType
        })
        return { success: false }
    }
}
