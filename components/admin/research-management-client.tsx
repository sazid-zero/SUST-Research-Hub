"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  FileText, Search, Eye, EyeOff, Trash2, Loader2, Sparkles,
  LayoutDashboard, GraduationCap, BookOpen, FolderGit2
} from "lucide-react"
import {
  deleteThesis, setThesisVisibility,
  deletePublication, setPublicationVisibility,
  deleteProject, setProjectVisibility,
} from "@/app/actions/admin"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"

// ─── Types ──────────────────────────────────────────────────────────────────

interface ResearchItem {
  id: number
  title: string
  author: string
  supervisor?: string
  department: string
  status: string
  visibility: string
  submittedDate: string
  year?: number
}

interface Props {
  initialTheses: ResearchItem[]
  initialPublications: ResearchItem[]
  initialProjects: ResearchItem[]
}

// ─── Shared helpers ─────────────────────────────────────────────────────────

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "approved":
    case "published":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    case "pending":
    case "under_review":
    case "in-review":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20"
    case "rejected":
    case "needs_revision":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20"
    default:
      return "bg-slate-500/10 text-slate-500 border-slate-500/20"
  }
}

// ─── Reusable Item List Panel ────────────────────────────────────────────────

interface PanelProps {
  items: ResearchItem[]
  type: "thesis" | "publication" | "project"
  viewHref: (id: number) => string
  onDelete: (id: number) => Promise<{ success: boolean; error?: string; message?: string }>
  onVisibility: (id: number, visibility: "visible" | "hidden") => Promise<{ success: boolean; error?: string; message?: string }>
}

function ResearchPanel({ items, type, viewHref, onDelete, onVisibility }: PanelProps) {
  const [list, setList] = useState<ResearchItem[]>(items)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [visibilityId, setVisibilityId] = useState<number | null>(null)

  const filtered = list.filter(item => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.author?.toLowerCase().includes(search.toLowerCase()) ||
      item.supervisor?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status?.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this? This cannot be undone.")) return
    setLoadingId(id)
    try {
      const res = await onDelete(id)
      if (res.success) {
        setList(prev => prev.filter(i => i.id !== id))
        toast.success(res.message)
      } else {
        toast.error(res.error)
      }
    } catch {
      toast.error("Failed to delete")
    } finally {
      setLoadingId(null)
    }
  }

  const handleToggleVisibility = async (id: number, current: string) => {
    const next = current === "visible" ? "hidden" : "visible"
    setVisibilityId(id)
    try {
      const res = await onVisibility(id, next)
      if (res.success) {
        setList(prev => prev.map(i => i.id === id ? { ...i, visibility: next } : i))
        toast.success(res.message)
      } else {
        toast.error(res.error)
      }
    } catch {
      toast.error("Failed to update visibility")
    } finally {
      setVisibilityId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-background/80 backdrop-blur-sm p-4 rounded-3xl border border-border/50 shadow-sm ring-1 ring-primary/5">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${type}s by title, author...`}
            className="pl-12 bg-muted/20 border-border/50 h-10 rounded-xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {["all", "pending", "approved", "published", "rejected", "in-review"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-lg px-4 h-9 text-sm font-bold capitalize transition-all",
                statusFilter === s ? "shadow-lg shadow-primary/20 scale-105" : "border-border/50 bg-white/50 backdrop-blur-sm"
              )}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
            {type === "thesis" ? "Theses" : type === "publication" ? "Publications" : "Projects"}
          </h2>
        </div>
        <Badge variant="outline" className="rounded-full border-border bg-muted/30 font-bold px-3 py-1">
          {filtered.length} Entries
        </Badge>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card key={item.id} className="group overflow-hidden border-border/50 bg-background/80 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all ring-1 ring-primary/5">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">ID: #{item.id}</span>
                        {item.department && (
                          <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">{item.department}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-black border border-border/50">
                        {item.author?.[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 leading-none mb-1">
                          {type === "project" ? "Supervisor" : "Author"}
                        </span>
                        <span className="text-sm font-bold text-foreground/80">{item.author}</span>
                      </div>
                    </div>
                    {item.supervisor && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-[10px] font-black border border-primary/10">
                          {item.supervisor?.[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 leading-none mb-1">Supervisor</span>
                          <span className="text-sm font-bold text-foreground/80">{item.supervisor}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 shrink-0">
                  <Badge className={cn("text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-xl border-2", getStatusColor(item.status))}>
                    {item.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 leading-none mb-1">Submitted</p>
                    <p className="text-xs font-bold text-foreground/60">
                      {item.submittedDate
                        ? new Date(item.submittedDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Link href={viewHref(item.id)}>
                    <Button className="rounded-2xl h-11 px-6 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold transition-all border-none">
                      <Eye className="h-4 w-4 mr-2" />
                      Inspect
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className={cn(
                      "rounded-2xl h-11 px-6 font-bold transition-all gap-2",
                      item.visibility === "hidden"
                        ? "border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
                        : "border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                    )}
                    onClick={() => handleToggleVisibility(item.id, item.visibility || "visible")}
                    disabled={visibilityId === item.id}
                  >
                    {visibilityId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : item.visibility === "hidden" ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {item.visibility === "hidden" ? "Hidden" : "Visible"}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="rounded-2xl h-11 px-6 text-rose-500 hover:bg-rose-500/10 font-bold transition-all"
                  onClick={() => handleDelete(item.id)}
                  disabled={loadingId === item.id}
                >
                  {loadingId === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-muted/5 rounded-3xl border-2 border-dashed border-border/50">
            <div className="p-6 rounded-full bg-muted/20">
              <Search className="h-12 w-12 text-muted-foreground/20" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-black text-foreground/60">No Results Found</p>
              <p className="text-sm font-medium text-muted-foreground/60 max-w-xs mx-auto">
                No {type}s match your current filters. Try broadening your search.
              </p>
            </div>
            <Button variant="outline" className="rounded-2xl font-bold h-12 px-8 border-border" onClick={() => { setSearch(""); setStatusFilter("all") }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ResearchManagementClient({ initialTheses, initialPublications, initialProjects }: Props) {
  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0f172a] border-b border-border/50 px-6 py-6 sm:py-8 md:py-10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              <GraduationCap className="h-3 w-3" />
              Knowledge Repository
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Research <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Management</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium max-w-lg">
              Audit, validate, and manage all research workspaces — theses, publications, and projects.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 mb-10">
        <Tabs defaultValue="theses" className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <LayoutDashboard className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Manage By Type</h2>
          </div>

          <TabsList className="bg-muted/30 border border-border/50 rounded-2xl h-12 p-1 gap-1 w-full sm:w-auto">
            <TabsTrigger value="theses" className="rounded-xl font-bold text-sm flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-5">
              <GraduationCap className="h-4 w-4" />
              Theses
              <Badge variant="secondary" className="text-[10px] font-black ml-1 h-5 px-1.5 rounded-md">
                {initialTheses.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="publications" className="rounded-xl font-bold text-sm flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-5">
              <BookOpen className="h-4 w-4" />
              Publications
              <Badge variant="secondary" className="text-[10px] font-black ml-1 h-5 px-1.5 rounded-md">
                {initialPublications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="projects" className="rounded-xl font-bold text-sm flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-5">
              <FolderGit2 className="h-4 w-4" />
              Projects
              <Badge variant="secondary" className="text-[10px] font-black ml-1 h-5 px-1.5 rounded-md">
                {initialProjects.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theses" className="mt-6">
            <ResearchPanel
              items={initialTheses}
              type="thesis"
              viewHref={(id) => `/thesis/${id}`}
              onDelete={(id) => deleteThesis(id)}
              onVisibility={(id, v) => setThesisVisibility(id, v)}
            />
          </TabsContent>

          <TabsContent value="publications" className="mt-6">
            <ResearchPanel
              items={initialPublications}
              type="publication"
              viewHref={(id) => `/papers/${id}`}
              onDelete={(id) => deletePublication(id)}
              onVisibility={(id, v) => setPublicationVisibility(id, v)}
            />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ResearchPanel
              items={initialProjects}
              type="project"
              viewHref={(id) => `/projects/${id}`}
              onDelete={(id) => deleteProject(id)}
              onVisibility={(id, v) => setProjectVisibility(id, v)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
