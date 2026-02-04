import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentType, contentId, fileSize } = body

    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: "Missing contentType or contentId" },
        { status: 400 }
      )
    }

    const user = await getCurrentUser()
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Log download count
    const query = `
      INSERT INTO download_counts (content_type, content_id, user_id, ip_address, file_size_bytes)
      VALUES ($1, $2, $3, $4, $5)
    `

    await db.query(query, [contentType, contentId, user?.id || null, ipAddress, fileSize || null])

    // Update downloads counter based on content type
    let updateQuery = ""
    switch (contentType) {
      case "thesis":
        updateQuery = "UPDATE theses SET downloads = downloads + 1 WHERE id = $1"
        break
      case "publication":
        updateQuery = "UPDATE publications SET downloads = downloads + 1 WHERE id = $1"
        break
      case "dataset":
        updateQuery = "UPDATE datasets SET downloads = downloads + 1 WHERE id = $1"
        break
      case "model":
        updateQuery = "UPDATE models SET downloads = downloads + 1 WHERE id = $1"
        break
      case "project":
        updateQuery = "UPDATE projects SET downloads = downloads + 1 WHERE id = $1"
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
    console.error("Error logging download:", error)
    return NextResponse.json(
      { error: "Failed to log download" },
      { status: 500 }
    )
  }
}
