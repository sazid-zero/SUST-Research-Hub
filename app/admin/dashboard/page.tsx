import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, Users, CheckCircle, Clock, AlertCircle, TrendingUp, 
  Sparkles, LayoutDashboard, ArrowRight, Shield, Activity, 
  Settings as SettingsIcon, MessageSquare
} from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { cn } from "@/lib/utils"

import { getAdminStats, getRecentActivity, getSupportStats, getSystemHealth } from "@/app/actions/admin"
import { getCurrentUser } from "@/app/actions/auth"

export const revalidate = 60 // Cache for 1 minute

function DashboardLoading() {
  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen p-6 sm:p-8 space-y-8">
      <div className="h-48 bg-muted/20 animate-pulse rounded-3xl" />
      <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-muted/20 animate-pulse rounded-3xl" />
        ))}
      </div>
    </div>
  )
}

async function DashboardContent() {
  const user = await getCurrentUser()
  const statsRes = await getAdminStats()
  const activityRes = await getRecentActivity()
  const supportRes = await getSupportStats()
  const healthRes = await getSystemHealth()

  const stats = (statsRes.success && statsRes.stats) ? [
    { label: "Research Assets", value: statsRes.stats.totalTheses.toLocaleString(), icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Nodes", value: statsRes.stats.activeUsers.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending Triages", value: statsRes.stats.pendingReviews.toLocaleString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Validated Work", value: statsRes.stats.approvedTheses.toLocaleString(), icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ] : []

  const recentActivity = (activityRes.success && activityRes.activities) ? activityRes.activities.map((a: any) => ({
    id: a.id,
    type: a.type,
    title: a.title,
    description: a.action,
    time: new Date(a.time).toLocaleDateString() + ' ' + new Date(a.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    icon: a.type === 'submission' ? FileText : Users,
  })) : []

  const supportStats = supportRes.success && supportRes.stats ? supportRes.stats : { open: 0, inProgress: 0, resolved: 0 }
  const systemHealth = healthRes.success && healthRes.health ? healthRes.health : { storage: 0, database: "Unknown", apiResponse: "N/A" }

  const quickActions = [
    { label: "User Directory", href: "/admin/users", icon: Users },
    { label: "Research Vault", href: "/admin/theses", icon: FileText },
    { label: "Platform Metrics", href: "/admin/analytics", icon: TrendingUp },
    { label: "Access Controls", href: "/admin/settings", icon: SettingsIcon },
  ]

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0f172a] border-b border-border/50 px-6 py-10 sm:py-12 md:py-16">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                          <Sparkles className="h-3 w-3" />
                          System Intelligence
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                        Admin <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Command Center</span>
                      </h1>
                      <p className="text-muted-foreground font-medium max-w-lg">
                        Welcome back, {user?.full_name?.split(' ')[0]}. Oversee the entire research ecosystem, manage users, and monitor system performance.
                      </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/admin/settings">
                        <Button className="bg-linear-to-r from-primary to-accent hover:scale-105 transition-all text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 border-none">
                            <SettingsIcon className="h-5 w-5 mr-2" />
                            Security Protocol
                        </Button>
                    </Link>
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-12 mb-20">
        {/* Stats Grid */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">System Pulse</h2>
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

        {/* Quick Actions & System Health */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Quick Actions Table Style */}
          <Card className="md:col-span-2 border-border/50 bg-background/80 backdrop-blur-sm rounded-3xl shadow-sm ring-1 ring-primary/5 overflow-hidden">
             <div className="p-6 border-b border-border/50 bg-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Operational Shortcuts</h2>
                </div>
             </div>
             <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
                {quickActions.map((action, idx) => (
                  <Link key={idx} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full h-16 justify-start gap-4 border-border/50 bg-muted/5 hover:bg-primary hover:text-white hover:border-primary transition-all rounded-2xl font-bold group"
                    >
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-white/20 transition-colors">
                        <action.icon className="h-5 w-5 text-primary group-hover:text-white" />
                      </div>
                      {action.label}
                    </Button>
                  </Link>
                ))}
             </div>
          </Card>

          {/* System Health Card */}
          <Card className="border-border/50 bg-background/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm ring-1 ring-primary/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6 px-1">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Core Integrity</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-tighter">Nodes Capacity</p>
                    <p className="text-xs font-black text-foreground">{systemHealth.storage}%</p>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted/30 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        systemHealth.storage > 90 ? 'bg-rose-500' : systemHealth.storage > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      )} 
                      style={{ width: `${systemHealth.storage}%` }} 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between py-1 border-t border-border/30 pt-4">
                  <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-tighter">DB Sync</p>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[10px] uppercase">{systemHealth.database}</Badge>
                </div>
                <div className="flex items-center justify-between py-1 border-t border-border/30 pt-4">
                  <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-tighter">Response Latency</p>
                  <p className="font-black text-sm text-foreground">{systemHealth.apiResponse}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Support & Activity */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Support Stats */}
           <Card className="border-border/50 bg-background/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm ring-1 ring-primary/5">
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Service Desk</h2>
                </div>
                <Badge variant="outline" className="rounded-full border-border bg-muted/30 font-bold px-3 py-1">
                    {supportStats.open + supportStats.inProgress} Active
                </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <span className="text-sm font-black text-primary">{supportStats.open}</span>
                  <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/60">Open</span>
               </div>
               <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <span className="text-sm font-black text-amber-500">{supportStats.inProgress}</span>
                  <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/60">Processing</span>
               </div>
               <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                  <span className="text-sm font-black text-emerald-500">{supportStats.resolved}</span>
                  <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/60">Resolved</span>
               </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50 bg-background/80 backdrop-blur-sm rounded-3xl shadow-sm ring-1 ring-primary/5 overflow-hidden">
             <div className="p-6 border-b border-border/50 bg-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Event Stream</h2>
                </div>
                <Link href="/admin/analytics">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-primary px-2 h-7 hover:bg-primary/10">View Log</Button>
                </Link>
             </div>
             <div className="p-0 max-h-[280px] overflow-y-auto no-scrollbar">
                {recentActivity.map((activity, idx) => (
                  <div key={`${activity.type}-${activity.id}-${idx}`} className={cn(
                    "p-4 flex items-start gap-4 hover:bg-muted/30 transition-all",
                    idx !== recentActivity.length - 1 && "border-b border-border/20"
                  )}>
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 shrink-0">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground line-clamp-1">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{activity.description}</p>
                      <p className="text-[10px] font-medium text-muted-foreground/40 mt-1 uppercase">{activity.time}</p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="p-10 text-center italic text-muted-foreground/40 text-sm">
                    No recent events logged.
                  </div>
                )}
             </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}
