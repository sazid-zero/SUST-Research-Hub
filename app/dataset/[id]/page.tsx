import { getCurrentUser } from "@/lib/auth"
import { getDatasetById, incrementDatasetViews, getDatasetStats } from "@/lib/db/datasets"
import { getThesisById } from "@/lib/db/theses"
import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, Database, Calendar, FileText, Tag, Lock, Globe } from "lucide-react"
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

  // Fetch dataset and thesis data
  let dataset = null
  let thesis = null
  let stats = null

  try {
    dataset = await getDatasetById(datasetId)
    if (!dataset) {
      return <div className="p-8">Dataset not found</div>
    }

    // Log view
    await incrementDatasetViews(datasetId, user?.id)

    // Get associated thesis
    if (dataset.thesis_id) {
      thesis = await getThesisById(dataset.thesis_id)
    }

    // Get statistics
    stats = await getDatasetStats(datasetId)
  } catch (error) {
    console.error("Error loading dataset:", error)
    return <div className="p-8">Error loading dataset</div>
  }

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "N/A"
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavbar user={user} />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/datasets" className="hover:text-foreground">Datasets</Link>
          <span>/</span>
          <span className="text-foreground">{dataset.title}</span>
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
                    <span className="text-sm font-medium text-muted-foreground">{dataset.dataset_type}</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{dataset.title}</h1>
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
                {dataset.published_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(dataset.published_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {dataset.description && (
                <p className="text-foreground mb-4 leading-relaxed">{dataset.description}</p>
              )}

              <Button asChild className="w-full gap-2" size="lg">
                <a href={dataset.download_url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  Download Dataset
                </a>
              </Button>
            </Card>

            {/* Dataset Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Dataset Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {dataset.size_mb && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Size</p>
                    <p className="font-medium">{Number(dataset.size_mb).toFixed(2)} MB</p>
                  </div>
                )}
                {dataset.file_format && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Format</p>
                    <p className="font-medium uppercase">{dataset.file_format}</p>
                  </div>
                )}
                {dataset.records_count && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Records</p>
                    <p className="font-medium">{dataset.records_count.toLocaleString()}</p>
                  </div>
                )}
                {dataset.license && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">License</p>
                    <p className="font-medium">{dataset.license}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Accessibility</p>
                  <p className="font-medium flex items-center gap-1">
                    {dataset.accessibility_level === 'public' ? (
                      <><Globe className="h-4 w-4" /> Public</>
                    ) : (
                      <><Lock className="h-4 w-4" /> {dataset.accessibility_level}</>
                    )}
                  </p>
                </div>
              </div>
            </Card>

            {/* Keywords */}
            {dataset.keywords && dataset.keywords.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {dataset.keywords.map((keyword) => (
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
                {dataset.collection_date && (
                  <div>
                    <p className="text-muted-foreground">Collection Date</p>
                    <p className="font-medium">{new Date(dataset.collection_date).toLocaleDateString()}</p>
                  </div>
                )}
                {dataset.last_updated && (
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date(dataset.last_updated).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(dataset.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
