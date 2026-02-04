import { Suspense } from "react"
import Link from "next/link"
import { Search, FileText, Newspaper, FolderKanban, Database, Brain, ArrowLeft } from "lucide-react"
import { db } from "@/lib/db"
import { getProjects } from "@/lib/data/projects"

interface SearchResult {
  id: string
  title: string
  type: "thesis" | "paper" | "project" | "dataset" | "model"
  subtitle?: string
  description?: string
}

async function getSearchResults(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    return []
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
      LIMIT 50
    `
    const theses = await db.query(thesesQuery, [`%${searchTerm}%`])
    
    theses.rows.forEach((thesis: any) => {
      results.push({
        id: thesis.id.toString(),
        title: thesis.title,
        type: "thesis",
        subtitle: thesis.supervisor_name,
        description: thesis.abstract?.substring(0, 200)
      })
    })
  } catch (error) {
    console.error("Error searching theses:", error)
  }

  // Search papers/publications
  try {
    const papersQuery = `
      SELECT p.id, p.title, p.journal_name, p.publication_type, p.abstract
      FROM publications p
      WHERE p.status = 'published'
      AND (p.title ILIKE $1 OR p.abstract ILIKE $1 OR p.keywords::text ILIKE $1)
      ORDER BY p.citations DESC
      LIMIT 50
    `
    const papers = await db.query(papersQuery, [`%${searchTerm}%`])
    
    papers.rows.forEach((paper: any) => {
      results.push({
        id: paper.id.toString(),
        title: paper.title,
        type: "paper",
        subtitle: paper.journal_name || paper.publication_type,
        description: paper.abstract?.substring(0, 200)
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
      LIMIT 50
    `
    const datasets = await db.query(datasetsQuery, [`%${searchTerm}%`])
    
    datasets.rows.forEach((dataset: any) => {
      results.push({
        id: dataset.id.toString(),
        title: dataset.title,
        type: "dataset",
        subtitle: dataset.dataset_type,
        description: dataset.description?.substring(0, 200)
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
      LIMIT 50
    `
    const models = await db.query(modelsQuery, [`%${searchTerm}%`])
    
    models.rows.forEach((model: any) => {
      results.push({
        id: model.id.toString(),
        title: model.title,
        type: "model",
        subtitle: `${model.model_type}${model.framework ? ` · ${model.framework}` : ''}`,
        description: model.description?.substring(0, 200)
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
    ).slice(0, 50)

    matchingProjects.forEach(project => {
      results.push({
        id: project.id,
        title: project.title,
        type: "project",
        subtitle: project.supervisorName || project.field,
        description: project.abstract?.substring(0, 200)
      })
    })
  } catch (error) {
    console.error("Error searching projects:", error)
  }

  return results
}

const contentTypeConfig = {
  thesis: {
    icon: FileText,
    label: "Theses",
    href: (id: string) => `/thesis/${id}`,
    color: "text-blue-500"
  },
  paper: {
    icon: Newspaper,
    label: "Papers",
    href: (id: string) => `/paper/${id}`,
    color: "text-green-500"
  },
  project: {
    icon: FolderKanban,
    label: "Projects",
    href: (id: string) => `/project/${id}`,
    color: "text-purple-500"
  },
  dataset: {
    icon: Database,
    label: "Datasets",
    href: (id: string) => `/dataset/${id}`,
    color: "text-orange-500"
  },
  model: {
    icon: Brain,
    label: "Models",
    href: (id: string) => `/model/${id}`,
    color: "text-pink-500"
  }
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = params.q || ""
  const results = await getSearchResults(query)

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Search Results</h1>
          </div>
          
          {query ? (
            <p className="text-muted-foreground">
              Found <span className="font-semibold text-foreground">{results.length}</span> results for 
              <span className="font-semibold text-primary"> "{query}"</span>
            </p>
          ) : (
            <p className="text-muted-foreground">Enter a search query to find theses, papers, projects, datasets, and models</p>
          )}
        </div>

        {/* Results */}
        {query && results.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">Try different keywords or check your spelling</p>
          </div>
        ) : query && results.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedResults).map(([type, items]) => {
              const config = contentTypeConfig[type as keyof typeof contentTypeConfig]
              const Icon = config.icon
              
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    <h2 className="text-xl font-semibold">{config.label}</h2>
                    <span className="text-sm text-muted-foreground">({items.length})</span>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <Link
                        key={`${item.type}-${item.id}`}
                        href={config.href(item.id)}
                        className="group p-4 rounded-lg border border-border bg-card hover:border-primary transition-all hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`h-5 w-5 ${config.color} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                              {item.title}
                            </h3>
                            {item.subtitle && (
                              <p className="text-xs text-muted-foreground mb-2">
                                {item.subtitle}
                              </p>
                            )}
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
