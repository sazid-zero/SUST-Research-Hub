"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle, Plus, FileText, BookOpen, Briefcase, GraduationCap, TrendingUp, Sparkles, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import type { Thesis } from "@/lib/data/theses"
import type { WorkspaceData } from "@/lib/db/workspace"
import { cn } from "@/lib/utils"

interface StudentDashboardClientProps {
  allTheses: Thesis[]
  userWorkspaces: WorkspaceData[]
  userName: string
}

export function StudentDashboardClient({ allTheses, userWorkspaces, userName }: StudentDashboardClientProps) {
  const stats = [
    { label: "Total Workspaces", value: userWorkspaces.length.toString(), icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    {
      label: "Published",
      value: userWorkspaces.filter((s) => s.status === "approved" || s.status === "published").length.toString(),
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Under Review",
      value: userWorkspaces.filter((s) => s.status === "pending").length.toString(),
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      label: "Active Drafts",
      value: userWorkspaces.filter((s) => s.status === "draft").length.toString(),
      icon: TrendingUp,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "published":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "rejected":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      case "draft":
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
      default:
        return "bg-slate-100 text-slate-600"
    }
  }

  const getWorkspaceIcon = (type: string) => {
      switch (type) {
          case 'thesis': return <GraduationCap className="h-4 w-4" />
          case 'project': return <Briefcase className="h-4 w-4" />
          case 'publication': return <BookOpen className="h-4 w-4" />
          default: return <FileText className="h-4 w-4" />
      }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-[#0b1120]">
      <main className="mb-20 w-full">
        {/* Hero Banner Area */}
        <div className="relative overflow-hidden bg-white dark:bg-[#0f172a] border-b border-border/50 px-6 py-10 sm:py-12 md:py-16">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                            <Sparkles className="h-3 w-3" />
                            Research Command Center
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                            Build Your <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Legacy</span>, {userName.split(' ')[0]}
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-lg">
                            Manage your academic journey, track your research progress, and collaborate with world-class supervisors.
                        </p>
                    </div>
                    <div>
                        <Link href="/student/workspace/create">
                            <Button className="bg-linear-to-r from-primary to-accent hover:scale-105 transition-all text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 border-none">
                                <Plus className="h-5 w-5 mr-2" />
                                Launch New Workspace
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-12">
          {/* Stats Grid */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Overview Metrics</h2>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                    <Card key={idx} className="group relative overflow-hidden border-border/50 bg-background/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all ring-1 ring-primary/5">
                        <div className="flex flex-col gap-4">
                            <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                                <Icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-foreground mt-1">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </Card>
                )
                })}
            </div>
          </section>

          {/* Table Area */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">In-Progress Workspaces</h2>
                </div>
                <Badge variant="outline" className="rounded-full border-border bg-muted/30 font-bold px-3 py-1">
                    {userWorkspaces.length} Active
                </Badge>
            </div>

            <Card className="border-border/50 bg-background/80 backdrop-blur-sm rounded-3xl shadow-sm ring-1 ring-primary/5 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-border/50 bg-muted/10">
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Research Title</th>
                        <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Supervisory Lead</th>
                        <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Classification</th>
                        <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Current Status</th>
                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Last Sync</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                    {userWorkspaces.length > 0 ? userWorkspaces.map((workspace) => (
                        <tr key={`${workspace.type}-${workspace.id}`} className="group hover:bg-muted/30 transition-all">
                        <td className="px-8 py-6">
                            <Link 
                            href={`/student/workspace/${workspace.type}/${workspace.id}`}
                            className="flex flex-col gap-1"
                            >
                                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {workspace.title}
                                </span>
                                <span className="text-[11px] font-medium text-muted-foreground/80">{workspace.department || 'General Research'}</span>
                            </Link>
                        </td>
                        <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                    {workspace.members.find(m => m.role === 'supervisor')?.full_name?.[0] || 'N'}
                                </div>
                                <span className="text-xs font-semibold text-foreground/80">
                                    {workspace.members.find(m => m.role === 'supervisor')?.full_name || 'Unassigned'}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-muted/40 text-xs font-bold text-muted-foreground/80 border border-border/20">
                                {getWorkspaceIcon(workspace.type)}
                                <span className="capitalize">
                                {workspace.type === 'publication' ? 'Paper' : workspace.type}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-6">
                            <Badge className={cn("text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-lg border", getStatusColor(workspace.status))}>
                            {workspace.status}
                            </Badge>
                        </td>
                        <td className="px-8 py-6 text-right">
                            <span className="text-xs font-bold text-muted-foreground/70">
                                {new Date(workspace.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="py-24 text-center">
                                <div className="flex flex-col items-center gap-4 text-muted-foreground/40 font-medium italic">
                                    <Sparkles className="h-12 w-12 opacity-20" />
                                    <p className="text-sm">Your research hub is currently quiet. Launch a workspace to begin.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
