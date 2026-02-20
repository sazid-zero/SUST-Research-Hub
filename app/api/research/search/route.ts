import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json([])
  }

  try {
    // Search across theses, projects, and publications
    const searchPattern = `%${query}%`
    
    const theses = await sql`
      SELECT id, title, department, 'thesis' as type 
      FROM theses 
      WHERE (title ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
      LIMIT 5
    `

    const projects = await sql`
      SELECT id, title, department, 'project' as type 
      FROM projects 
      WHERE (title ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
      LIMIT 5
    `

    const publications = await sql`
      SELECT id, title, 'publication' as type 
      FROM publications 
      WHERE (title ILIKE ${searchPattern} OR abstract ILIKE ${searchPattern})
      LIMIT 5
    `

    const results = [...theses, ...projects, ...publications]
    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
