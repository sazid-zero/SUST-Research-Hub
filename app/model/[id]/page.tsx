import { getCurrentUser } from "@/lib/auth"
import { getModelById, incrementModelViews, getModelStats } from "@/lib/db/models"
import { getThesisById } from "@/lib/db/theses"
import { getProjectById } from "@/lib/db/projects"
import { getPublicationById as getPaperById } from "@/lib/db/publications"
import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, Brain, Calendar, FileText, Tag, Zap, Code, Globe, Folder } from "lucide-react"
import Link from "next/link"

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const { id } = await params
  const modelId = parseInt(id)

  if (!modelId) {
    return <div className="p-8">Invalid model ID</div>
  }

  // Fetch model data
  let model = null
  let workspace = null
  let stats = null

  try {
    model = await getModelById(modelId)
    if (!model) {
      return <div className="p-8">Model not found</div>
    }

    // Log view
    await incrementModelViews(modelId, user?.id)

    // Get associated workspace
    if (model.workspace_id && model.workspace_type) {
      if (model.workspace_type === 'thesis') {
        workspace = await getThesisById(model.workspace_id)
        if (workspace) workspace.typeLabel = 'Thesis'
      } else if (model.workspace_type === 'project') {
        workspace = await getProjectById(model.workspace_id)
        if (workspace) workspace.typeLabel = 'Project'
      } else if (model.workspace_type === 'publication' || model.workspace_type === 'paper') {
        workspace = await getPaperById(model.workspace_id)
        if (workspace) workspace.typeLabel = 'Publication'
      }
    }

    // Get statistics
    stats = await getModelStats(modelId)
  } catch (error) {
    console.error("Error loading model:", error)
    return <div className="p-8">Error loading model</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavbar user={user} />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/models" className="hover:text-foreground">Models</Link>
          <span>/</span>
          <span className="text-foreground">{model.title || model.name}</span>
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
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-muted-foreground capitalize">{model.model_type?.replace(/-/g, ' ') || "Model"}</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{model.title || model.name}</h1>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{stats?.views || model.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{stats?.downloads || model.downloads || 0} downloads</span>
                </div>
                {model.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(model.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {model.description && (
                <p className="text-foreground mb-4 leading-relaxed">{model.description}</p>
              )}

              {model.download_url && (
                  <Button asChild className="w-full gap-2" size="lg">
                    <a href={model.download_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                      Open Model Source
                    </a>
                  </Button>
              )}
            </Card>

            {/* Model Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Model Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {model.framework && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Framework</p>
                    <p className="font-medium capitalize">{model.framework}</p>
                  </div>
                )}
                {model.model_type && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Model Type</p>
                    <p className="font-medium capitalize">{model.model_type.replace(/-/g, ' ')}</p>
                  </div>
                )}
                {model.accuracy && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                    <p className="font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      {model.accuracy}
                    </p>
                  </div>
                )}
                {model.version && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Version</p>
                    <p className="font-medium">{model.version}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Tags */}
            {model.tags && model.tags.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag: string) => (
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
                      href={`/${workspace.typeLabel.toLowerCase() === 'publication' ? 'paper' : workspace.typeLabel.toLowerCase()}/${workspace.id}`}
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
                  <p className="font-medium">{new Date(model.created_at).toLocaleDateString()}</p>
                </div>
                {model.updated_at && (
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date(model.updated_at).toLocaleDateString()}</p>
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
