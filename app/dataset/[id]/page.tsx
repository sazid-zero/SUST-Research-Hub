import { getCurrentUser } from "@/lib/auth"
import { getDatasetById, incrementDatasetViews, getDatasetStats } from "@/lib/db/datasets"
import { getThesisById } from "@/lib/db/theses"
import { getProjectById } from "@/lib/db/projects"
import { getPublicationById as getPaperById } from "@/lib/db/publications"
import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, Database, Calendar, FileText, Tag, Globe, Folder } from "lucide-react"
import Link from "next/link"

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const { id } = await params
  const datasetId = parseInt(id)

  if (!datasetId) {
    return <div className="p-8">Invalid dataset ID</div>
  }

  // Fetch dataset data
  let dataset = null
  let workspace = null
  let stats = null

  try {
    dataset = await getDatasetById(datasetId)
    if (!dataset) {
      return <div className="p-8">Dataset not found</div>
    }

    // Log view
    await incrementDatasetViews(datasetId, user?.id)

    // Get associated workspace
    if (dataset.workspace_id && dataset.workspace_type) {
      if (dataset.workspace_type === 'thesis') {
        workspace = await getThesisById(dataset.workspace_id)
        if (workspace) workspace.typeLabel = 'Thesis'
      } else if (dataset.workspace_type === 'project') {
        workspace = await getProjectById(dataset.workspace_id)
        if (workspace) workspace.typeLabel = 'Project'
      } else if (dataset.workspace_type === 'publication' || dataset.workspace_type === 'paper') {
        workspace = await getPaperById(dataset.workspace_id)
        if (workspace) workspace.typeLabel = 'Publication'
      }
    }

    // Get statistics
    stats = await getDatasetStats(datasetId)
  } catch (error) {
    console.error("Error loading dataset:", error)
    return <div className="p-8">Error loading dataset</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavbar user={user} />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/datasets" className="hover:text-foreground">Datasets</Link>
          <span>/</span>
          <span className="text-foreground">{dataset.title || dataset.name}</span>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-muted-foreground capitalize">{dataset.type || "Dataset"}</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{dataset.title || dataset.name}</h1>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{stats?.views || dataset.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{stats?.downloads || dataset.downloads || 0} downloads</span>
                </div>
                {dataset.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(dataset.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {dataset.description && (
                <p className="text-foreground mb-4 leading-relaxed">{dataset.description}</p>
              )}

              {dataset.location && (
                <Button asChild className="w-full gap-2" size="lg">
                  <a href={dataset.location} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                    Open Dataset Source
                  </a>
                </Button>
              )}
            </Card>

            {/* Dataset Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Dataset Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {dataset.size && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Size</p>
                    <p className="font-medium">{dataset.size}</p>
                  </div>
                )}
                {dataset.type && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Modality</p>
                    <p className="font-medium capitalize">{dataset.type}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Keywords */}
            {dataset.tags && dataset.tags.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-medium"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Related Info */}
          <div className="space-y-6">
            {/* Associated Workspace */}
            {workspace && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  {workspace.typeLabel === 'Thesis' || workspace.typeLabel === 'Publication' ? <FileText className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                  Related {workspace.typeLabel}
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Title</p>
                    <Link
                      href={`/${workspace.typeLabel.toLowerCase()}/${workspace.id}`}
                      className="font-medium text-primary hover:underline line-clamp-2"
                    >
                      {workspace.title}
                    </Link>
                  </div>
                  {workspace.field && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Field</p>
                      <p className="font-medium">{workspace.field}</p>
                    </div>
                  )}
                  {workspace.year && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Year</p>
                      <p className="font-medium">{workspace.year}</p>
                    </div>
                  )}
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={`/${workspace.typeLabel.toLowerCase() === 'publication' ? 'paper' : workspace.typeLabel.toLowerCase()}/${workspace.id}`}>
                      View {workspace.typeLabel}
                    </Link>
                  </Button>
                </div>
              </Card>
            )}

            {/* Metadata */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Metadata</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Added to Hub</p>
                  <p className="font-medium">{new Date(dataset.created_at).toLocaleDateString()}</p>
                </div>
                {dataset.updated_at && (
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date(dataset.updated_at).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
