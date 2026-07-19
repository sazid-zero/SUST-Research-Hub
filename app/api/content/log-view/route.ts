import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentType, contentId } = body

    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: "Missing contentType or contentId" },
        { status: 400 }
      )
    }

    // Validate contentType
    const validTypes = ["thesis", "publication", "dataset", "model", "project"]
    if (!validTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid contentType" },
        { status: 400 }
      )
    }

    let userId: number | null = null
    try {
      const user = await getCurrentUser()
      userId = user?.id || null
    } catch {
      // Not logged in or cookies unavailable — continue with null
    }

    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Rate limiting: Check if user/IP has viewed this content >= 5 times in the last hour
    try {
      const recentViews = await sql`
        SELECT COUNT(*) as count 
        FROM view_counts 
        WHERE content_type = ${contentType} 
          AND content_id = ${contentId} 
          AND (
            (user_id IS NOT NULL AND user_id = ${userId}) 
            OR 
            (user_id IS NULL AND ip_address = ${ipAddress})
          )
          AND created_at >= NOW() - INTERVAL '1 hour'
      `
      
      if (recentViews[0] && parseInt(recentViews[0].count) >= 5) {
        // Limit reached: do not log or increment
        return NextResponse.json({ success: true, limited: true })
      }
    } catch (checkError: any) {
      // Fallback if created_at doesn't exist (e.g. it's named viewed_at)
      try {
        const recentViewsFallback = await sql`
          SELECT COUNT(*) as count 
          FROM view_counts 
          WHERE content_type = ${contentType} 
            AND content_id = ${contentId} 
            AND (
              (user_id IS NOT NULL AND user_id = ${userId}) 
              OR 
              (user_id IS NULL AND ip_address = ${ipAddress})
            )
            AND viewed_at >= NOW() - INTERVAL '1 hour'
        `
        if (recentViewsFallback[0] && parseInt(recentViewsFallback[0].count) >= 5) {
          return NextResponse.json({ success: true, limited: true })
        }
      } catch (fallbackError) {
        console.error("Error checking view limit (fallback):", fallbackError)
        // Continue and log the view if we can't determine the limit
      }
    }

    // Log view count
    await sql`
      INSERT INTO view_counts (content_type, content_id, user_id, ip_address)
      VALUES (${contentType}, ${contentId}, ${userId}, ${ipAddress})
    `

    // Update views counter — each update is isolated so a missing column on one
    // table doesn't prevent the log or other table updates from succeeding.
    try {
      switch (contentType) {
        case "thesis":
          await sql`UPDATE theses SET views = COALESCE(views, 0) + 1 WHERE id = ${contentId}`
          break
        case "publication":
          // Ensure the column exists (idempotent)
          await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS views integer DEFAULT 0`
          await sql`UPDATE publications SET views = COALESCE(views, 0) + 1 WHERE id = ${contentId}`
          break
        case "dataset":
          await sql`UPDATE datasets SET views = COALESCE(views, 0) + 1 WHERE id = ${contentId}`
          break
        case "model":
          await sql`UPDATE models SET views = COALESCE(views, 0) + 1 WHERE id = ${contentId}`
          break
        case "project":
          await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS views integer DEFAULT 0`
          await sql`UPDATE projects SET views = COALESCE(views, 0) + 1 WHERE id = ${contentId}`
          break
      }
    } catch (updateError) {
      // Log the error but still return success — the view_counts row was already inserted.
      console.error("Error updating views counter (non-fatal):", updateError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging view:", error)
    return NextResponse.json(
      { error: "Failed to log view" },
      { status: 500 }
    )
  }
}
