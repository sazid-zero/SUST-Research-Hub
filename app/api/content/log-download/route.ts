import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
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
      // Not logged in or cookies unavailable
    }

    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const fileSizeVal = fileSize || null

    // Log download count
    await sql`
      INSERT INTO download_counts (content_type, content_id, user_id, ip_address, file_size_bytes)
      VALUES (${contentType}, ${contentId}, ${userId}, ${ipAddress}, ${fileSizeVal})
    `

    // Update downloads counter based on content type
    switch (contentType) {
      case "thesis":
        await sql`UPDATE theses SET downloads = COALESCE(downloads, 0) + 1 WHERE id = ${contentId}`
        break
      case "publication":
        await sql`UPDATE publications SET downloads = COALESCE(downloads, 0) + 1 WHERE id = ${contentId}`
        break
      case "dataset":
        await sql`UPDATE datasets SET downloads = COALESCE(downloads, 0) + 1 WHERE id = ${contentId}`
        break
      case "model":
        await sql`UPDATE models SET downloads = COALESCE(downloads, 0) + 1 WHERE id = ${contentId}`
        break
      case "project":
        await sql`UPDATE projects SET downloads = COALESCE(downloads, 0) + 1 WHERE id = ${contentId}`
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging download:", error)
    return NextResponse.json(
      { error: "Failed to log download" },
      { status: 500 }
    )
  }
}
