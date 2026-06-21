import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, FileText, Sparkles, Plus, LayoutDashboard, ArrowRight, BookOpen, GraduationCap, Briefcase } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { cn } from "@/lib/utils"

export const revalidate = 3600 // Cache for 1 hour

function DashboardLoading() {
  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen p-6 sm:p-8 space-y-8">
      <div className="h-32 bg-muted/20 animate-pulse rounded-3xl" />
      <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-muted/20 animate-pulse rounded-3xl" />
        ))}
      </div>
    </div>
  )
}

import { getSupervisorStats, getSupervisionRequests } from "@/app/actions/supervisor"
import { getCurrentUser } from "@/app/actions/auth"

async function DashboardContent() {
  const user = await getCurrentUser()
  const statsData = await getSupervisorStats()
  const pendingRequests = await getSupervisionRequests()

  const stats = [
    { 
        label: "Pending Requests", 
        value: statsData?.pendingRequests.toString() || "0", 
        icon: Clock, 
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    { 
        label: "Active Students", 
        value: statsData?.activeStudents.toString() || "0", 
        icon: Users, 
        color: "text-primary",
        bg: "bg-primary/10"
    },
    { 
        label: "Total Reviewed", 
        value: statsData?.totalReviewed.toString() || "0", 
        icon: FileText, 
        color: "text-indigo-500",
        bg: "bg-indigo-500/10"
    },
    { 
        label: "Supervised Projects", 
        value: statsData?.activeStudents.toString() || "0", 
        icon: CheckCircle, 
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
  ]

  const getWorkspaceIcon = (type: string) => {
      switch (type) {
          case 'thesis': return <GraduationCap className="h-5 w-5" />
          case 'project': return <Briefcase className="h-5 w-5" />
          case 'publication': return <BookOpen className="h-5 w-5" />
          default: return <FileText className="h-5 w-5" />
      }
  }

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen">
      {/* Header Area */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0f172a] border-b border-border/50 px-6 py-6 sm:py-8 md:py-10">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                          <Sparkles className="h-3 w-3" />
                          Academic Leadership
                      </div>
                      <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                        Research <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Overview</span>
                      </h1>
                      <p className="text-sm text-muted-foreground font-medium max-w-lg">
                        Welcome back, Professor {user?.full_name?.split(' ').pop()}. Monitor your supervision pipeline and student excellence.
                      </p>
                  </div>
                  <div>
                    <Link href="/supervisor/requests">
                        <Button className="bg-linear-to-r from-primary to-accent hover:scale-105 transition-all text-white font-bold h-10 px-6 rounded-xl shadow-md border-none text-sm">
                            Triage Requests
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Stats Grid */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Supervision Pulse</h2>
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
                                <p className="text-2xl font-black text-foreground mt-1">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </Card>
                )
                })}
            </div>
        </section>

        {/* Pending Requests Section */}
        <section className="space-y-4 mb-20">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Urgent Triages</h2>
                </div>
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold px-3 py-1">
                    {pendingRequests.filter(r => r.status === 'pending').length} Action Required
                </Badge>
            </div>

            <div className="grid gap-4">
                {pendingRequests.slice(0, 3).map((request) => (
                    <Card key={request.id} className="group border-border/50 bg-background/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm hover:shadow-md transition-all ring-1 ring-primary/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-lg font-bold shrink-0 border border-border/50">
                                    {request.student_name?.[0]}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                        {request.student_name}
                                    </h3>
                                    <p className="text-sm font-medium text-muted-foreground line-clamp-1 max-w-xl">
                                        {request.topic_proposal || request.thesis_title || "Untitled Research Proposal"}
                                    </p>
                                    <div className="flex items-center gap-3 pt-1">
                                        <Badge variant="outline" className="rounded-lg border-border text-[10px] uppercase font-bold text-muted-foreground/60">
                                            {request.student_department}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter italic">
                                            Submitted {new Date(request.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href={`/supervisor/requests`} className="w-full md:w-auto">
                                    <Button size="sm" className="w-full md:w-auto rounded-xl font-bold bg-primary/5 hover:bg-primary/10 text-primary border-none h-10 px-6">
                                        Review Proposal
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}

                {pendingRequests.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/5">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground/40 font-medium italic">
                            <CheckCircle className="h-12 w-12 opacity-20" />
                            <p className="text-sm">Excellent work, Professor. Your research pipeline is cleared.</p>
                        </div>
                    </div>
                )}

                {pendingRequests.length > 3 && (
                    <Link href="/supervisor/requests" className="flex justify-center pt-4">
                        <Button variant="ghost" className="font-bold text-primary hover:bg-primary/5 rounded-xl">
                            View all {pendingRequests.length} requests
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                )}
            </div>
        </section>
      </div>
    </div>
  )
}

export default function SupervisorDashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}
