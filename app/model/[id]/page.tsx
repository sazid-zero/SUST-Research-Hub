import { getCurrentUser } from "@/lib/auth"
import { getModelById, incrementModelViews, getModelStats } from "@/lib/db/models"
import { getThesisById } from "@/lib/db/theses"
import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, Brain, Calendar, FileText, Tag, Zap, Code } from "lucide-react"
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

  // Fetch model and thesis data
  let model = null
  let thesis = null
  let stats = null

  try {
    model = await getModelById(modelId)
    if (!model) {
      return <div className="p-8">Model not found</div>
    }

    // Log view
    await incrementModelViews(modelId, user?.id)

    // Get associated thesis
    if (model.thesis_id) {
      thesis = await getThesisById(model.thesis_id)
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
          <span className="text-foreground">{model.title}</span>
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
                    <span className="text-sm font-medium text-muted-foreground capitalize">{model.model_type?.replace(/_/g, ' ')}</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{model.title}</h1>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{stats?.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{stats?.downloads || 0} downloads</span>
                </div>
                {model.published_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(model.published_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {model.description && (
                <p className="text-foreground mb-4 leading-relaxed">{model.description}</p>
              )}

              <div className="flex gap-2">
                <Button asChild className="flex-1 gap-2" size="lg">
                  <a href={model.download_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                    Download Model
                  </a>
                </Button>
                {model.documentation_url && (
                  <Button asChild variant="outline" className="flex-1 gap-2 bg-transparent" size="lg">
                    <a href={model.documentation_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4" />
                      Documentation
                    </a>
                  </Button>
                )}
              </div>
            </Card>

            {/* Model Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Model Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {model.model_size_mb && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Model Size</p>
                    <p className="font-medium">{Number(model.model_size_mb).toFixed(2)} MB</p>
                  </div>
                )}
                {model.framework && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Framework</p>
                    <p className="font-medium">{model.framework}</p>
                  </div>
                )}
                {model.programming_language && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Language</p>
                    <p className="font-medium flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      {model.programming_language}
                    </p>
                  </div>
                )}
                {model.accuracy && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                    <p className="font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      {(model.accuracy * 100).toFixed(2)}%
                    </p>
                  </div>
                )}
                {model.version && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Version</p>
                    <p className="font-medium">{model.version}</p>
                  </div>
                )}
                {model.license && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">License</p>
                    <p className="font-medium">{model.license}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Technical Details */}
            {(model.hyperparameters || model.training_config) && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Technical Details</h2>
                <div className="space-y-4">
                  {model.hyperparameters && (
                    <div>
                      <h3 className="font-medium mb-2">Hyperparameters</h3>
                      <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                        {JSON.stringify(model.hyperparameters, null, 2)}
                      </pre>
                    </div>
                  )}
                  {model.training_config && (
                    <div>
                      <h3 className="font-medium mb-2">Training Configuration</h3>
                      <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                        {JSON.stringify(model.training_config, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Keywords */}
            {model.keywords && model.keywords.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {model.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-medium"
                    >
                      <Tag className="h-3 w-3" />
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Related Info */}
          <div className="space-y-6">
            {/* Associated Thesis */}
            {thesis && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Related Thesis
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Title</p>
                    <Link
                      href={`/thesis/${thesis.id}`}
                      className="font-medium text-primary hover:underline line-clamp-2"
                    >
                      {thesis.title}
                    </Link>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Field</p>
                    <p className="font-medium">{thesis.field}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Year</p>
                    <p className="font-medium">{thesis.year}</p>
                  </div>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={`/thesis/${thesis.id}`}>View Thesis</Link>
                  </Button>
                </div>
              </Card>
            )}

            {/* Metadata */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Metadata</h3>
              <div className="space-y-3 text-sm">
                {model.release_date && (
                  <div>
                    <p className="text-muted-foreground">Release Date</p>
                    <p className="font-medium">{new Date(model.release_date).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(model.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Updated</p>
                  <p className="font-medium">{new Date(model.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
