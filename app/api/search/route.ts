import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getProjects } from "@/lib/data/projects"

interface SearchResult {
  id: string
  title: string
  type: "thesis" | "paper" | "project" | "dataset" | "model"
  subtitle?: string
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("q")
    const limit = parseInt(searchParams.get("limit") || "8")

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] })
    }

    const searchTerm = query.trim()
    const results: SearchResult[] = []

    // Search theses
    try {
      const thesesQuery = `
        SELECT t.id, t.title, t.abstract, 
               COALESCE(u.full_name, 'Unknown') as supervisor_name
        FROM theses t
        LEFT JOIN users u ON t.supervisor_id = u.id
        WHERE t.status = 'published' 
        AND (t.title ILIKE $1 OR t.abstract ILIKE $1 OR t.keywords::text ILIKE $1)
        ORDER BY t.views DESC
        LIMIT $2
      `
      const theses = await db.query(thesesQuery, [`%${searchTerm}%`, Math.ceil(limit / 5)])
      
      theses.rows.forEach((thesis: any) => {
        results.push({
          id: thesis.id.toString(),
          title: thesis.title,
          type: "thesis",
          subtitle: thesis.supervisor_name || thesis.abstract?.substring(0, 100)
        })
      })
    } catch (error) {
      console.error("Error searching theses:", error)
    }

    // Search papers/publications
    try {
      const papersQuery = `
        SELECT p.id, p.title, p.journal_name, p.publication_type
        FROM publications p
        WHERE p.status = 'published'
        AND (p.title ILIKE $1 OR p.abstract ILIKE $1 OR p.keywords::text ILIKE $1)
        ORDER BY p.citations DESC
        LIMIT $2
      `
      const papers = await db.query(papersQuery, [`%${searchTerm}%`, Math.ceil(limit / 5)])
      
      papers.rows.forEach((paper: any) => {
        results.push({
          id: paper.id.toString(),
          title: paper.title,
          type: "paper",
          subtitle: paper.journal_name || paper.publication_type
        })
      })
    } catch (error) {
      console.error("Error searching papers:", error)
    }

    // Search datasets
    try {
      const datasetsQuery = `
        SELECT id, title, description, dataset_type
        FROM datasets
        WHERE status = 'published'
        AND (title ILIKE $1 OR description ILIKE $1 OR keywords::text ILIKE $1)
        ORDER BY views DESC
        LIMIT $2
      `
      const datasets = await db.query(datasetsQuery, [`%${searchTerm}%`, Math.ceil(limit / 5)])
      
      datasets.rows.forEach((dataset: any) => {
        results.push({
          id: dataset.id.toString(),
          title: dataset.title,
          type: "dataset",
          subtitle: dataset.dataset_type || dataset.description?.substring(0, 100)
        })
      })
    } catch (error) {
      console.error("Error searching datasets:", error)
    }

    // Search models
    try {
      const modelsQuery = `
        SELECT id, title, description, model_type, framework
        FROM models
        WHERE status = 'published'
        AND (title ILIKE $1 OR description ILIKE $1 OR keywords::text ILIKE $1)
        ORDER BY views DESC
        LIMIT $2
      `
      const models = await db.query(modelsQuery, [`%${searchTerm}%`, Math.ceil(limit / 5)])
      
      models.rows.forEach((model: any) => {
        results.push({
          id: model.id.toString(),
          title: model.title,
          type: "model",
          subtitle: model.model_type || model.framework || model.description?.substring(0, 100)
        })
      })
    } catch (error) {
      console.error("Error searching models:", error)
    }

    // Search projects (from mock data)
    try {
      const projects = getProjects()
      const matchingProjects = projects.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, Math.ceil(limit / 5))

      matchingProjects.forEach(project => {
        results.push({
          id: project.id,
          title: project.title,
          type: "project",
          subtitle: project.supervisorName || project.field
        })
      })
    } catch (error) {
      console.error("Error searching projects:", error)
    }

    // Sort by relevance (exact matches first) and limit total results
    const sortedResults = results
      .sort((a, b) => {
        const aExact = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0
        const bExact = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0
        return bExact - aExact
      })
      .slice(0, limit)

    return NextResponse.json({ results: sortedResults })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 })
  }
}
