import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
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

    const user = await getCurrentUser()
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Log view count
    const query = `
      INSERT INTO view_counts (content_type, content_id, user_id, ip_address)
      VALUES ($1, $2, $3, $4)
    `

    await db.query(query, [contentType, contentId, user?.id || null, ipAddress])

    // Update views counter based on content type
    let updateQuery = ""
    switch (contentType) {
      case "thesis":
        updateQuery = "UPDATE theses SET views = views + 1 WHERE id = $1"
        break
      case "publication":
        updateQuery = "UPDATE publications SET views = views + 1 WHERE id = $1"
        break
      case "dataset":
        updateQuery = "UPDATE datasets SET views = views + 1 WHERE id = $1"
        break
      case "model":
        updateQuery = "UPDATE models SET views = views + 1 WHERE id = $1"
        break
      case "project":
        updateQuery = "UPDATE projects SET views = views + 1 WHERE id = $1"
        break
      default:
        return NextResponse.json(
          { error: "Invalid contentType" },
          { status: 400 }
        )
    }

    await db.query(updateQuery, [contentId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging view:", error)
    return NextResponse.json(
      { error: "Failed to log view" },
      { status: 500 }
    )
  }
}
