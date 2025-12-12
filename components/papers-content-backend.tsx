import { GlobalNavbar } from "@/components/global-navbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, DownloadIcon, Search, X, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Publication } from "@/lib/db/publications"

interface PapersContentBackendProps {
  user: any
  papers: Publication[]
}

export function PapersContentBackend({ user, papers }: PapersContentBackendProps) {
  // Extract unique values for filters
  const safePapers = papers || []
  const types = ["All Types", ...new Set(safePapers.map((p) => p.publication_type).filter(Boolean))]
  const years = [
    "All",
    ...new Set(
      safePapers
        .map((p) => p.year)
        .filter(Boolean)
        .sort((a, b) => b - a),
    ),
  ]
  const allKeywords = [...new Set(safePapers.flatMap((p) => p.keywords || []))]
  const fields = ["All Fields", ...allKeywords.slice(0, 20)]

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavbar user={user} />

      <div className="lg:mx-20 mx-auto px-4 lg:px-8 pb-12 mt-8">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-4">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="border border-border bg-card p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-foreground">Filters</h2>
                <form action="/papers-backend">
                  <button type="submit" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Clear
                  </button>
                </form>
              </div>

              <form className="space-y-4">
                <div>
                  <Label className="text-xs text-foreground font-medium mb-2 block">Type</Label>
                  <Select name="type" defaultValue="All Types">
                    <SelectTrigger className="bg-background border-border text-foreground h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-foreground font-medium mb-2 block">Field</Label>
                  <Select name="field" defaultValue="All Fields">
                    <SelectTrigger className="bg-background border-border text-foreground h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {fields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-foreground font-medium mb-3 block">Year</Label>
                  <div className="flex gap-4">
                    <div className="flex gap-1 items-center">
                      <p className="text-xs text-muted-foreground mb-1">From</p>
                      <Select name="yearFrom" defaultValue="All">
                        <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {years.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-1 items-center">
                      <p className="text-xs text-muted-foreground mb-1">To</p>
                      <Select name="yearTo" defaultValue="All">
                        <SelectTrigger className="bg-background border-border text-foreground h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {years.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{safePapers.length}</span> papers
                  </p>
                </div>
              </form>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground whitespace-nowrap mr-2">
                <p className="font-semibold text-lg">Papers</p>
                {safePapers.length}
              </div>
              <div className="flex-1 min-w-0">
                <form className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                  <Input
                    name="search"
                    placeholder="Search papers..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border-2 border-border text-sm text-muted-foreground dark:text-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-colors"
                  />
                </form>
              </div>

              <Select name="sort" defaultValue="recent">
                <SelectTrigger className="w-44 bg-background border-border h-9 text-xs">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-xs">
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="citations">Most Cited</SelectItem>
                  <SelectItem value="impact">Impact Factor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {safePapers.length > 0 ? (
              <div className="space-y-3">
                {safePapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="border border-border hover:border-primary/50 rounded-lg p-4 transition-all hover:shadow-sm group cursor-pointer"
                  >
                    <div className="space-y-3">
                      {/* Title and Meta */}
                      <div>
                        <Link href={`/paper/${paper.id}`}>
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {paper.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">
                          By{" "}
                          {paper.authors?.map((author, idx) => (
                            <span key={author.id}>
                              <span className="font-medium">{author.author_name}</span>
                              {idx < paper.authors.length - 1 && ", "}
                            </span>
                          ))}
                          {paper.authors && paper.authors.length > 0 && " • "}
                          {paper.journal_name} • {paper.year}
                        </p>
                      </div>

                      {/* Abstract */}
                      {paper.abstract && (
                        <p className="text-xs text-foreground leading-relaxed line-clamp-2">{paper.abstract}</p>
                      )}

                      {/* Keywords */}
                      {paper.keywords && paper.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {paper.keywords.slice(0, 3).map((keyword, idx) => (
                            <Badge key={idx} className="bg-primary/10 text-primary border border-primary/20 text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {paper.keywords.length > 3 && (
                            <Badge className="bg-muted text-muted-foreground border border-border text-xs">
                              +{paper.keywords.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Stats and Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-border">
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{paper.citations} citations</span>
                          </div>
                          {paper.impact_factor && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">IF: {paper.impact_factor}</span>
                            </div>
                          )}
                          {paper.thesis && (
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/thesis/${paper.thesis.id}`}
                                className="text-primary hover:underline font-medium"
                              >
                                Linked to Thesis
                              </Link>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Link href={`/paper/${paper.id}`} className="flex-1 sm:flex-none">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border hover:bg-muted bg-transparent w-full sm:w-auto text-xs"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          {paper.pdf_url && (
                            <Link href={paper.pdf_url} target="_blank" className="flex-1 sm:flex-none">
                              <Button
                                size="sm"
                                className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground text-xs w-full"
                              >
                                <DownloadIcon className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="border border-border bg-card p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-sm font-semibold text-foreground mb-1">No papers found</h3>
                <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
