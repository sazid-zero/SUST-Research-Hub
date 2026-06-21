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

    // Log view count
    await sql`
      INSERT INTO view_counts (content_type, content_id, user_id, ip_address)
      VALUES (${contentType}, ${contentId}, ${userId}, ${ipAddress})
    `

    // Update views counter based on content type using tagged template
    switch (contentType) {
      case "thesis":
        await sql`UPDATE theses SET views = COALESCE(views, 0) + 1 WHERE id = ${contentId}`
        break
      case "publication":
        await sql`UPDATE publications SET views = COALESCE(views, 0) + 1 WHERE id = ${contentId}`
        break
      case "dataset":
        await sql`UPDATE datasets SET views = COALESCE(views, 0) + 1 WHERE id = ${contentId}`
        break
      case "model":
        await sql`UPDATE models SET views = COALESCE(views, 0) + 1 WHERE id = ${contentId}`
        break
      case "project":
        await sql`UPDATE projects SET views = COALESCE(views, 0) + 1 WHERE id = ${contentId}`
        break
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
