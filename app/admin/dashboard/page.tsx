import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Suspense } from "react"

export const revalidate = 3600 // Cache for 1 hour

function DashboardLoading() {
  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-card p-4 sm:p-6">
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-20 bg-muted animate-pulse rounded" />
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

async function DashboardContent() {
  const stats = [
    { label: "Total Theses", value: "2,847", icon: FileText, color: "text-primary" },
    { label: "Active Users", value: "1,250", icon: Users, color: "text-blue-600" },
    { label: "Pending Reviews", value: "23", icon: Clock, color: "text-yellow-600" },
    { label: "Approved", value: "2,650", icon: CheckCircle, color: "text-green-600" },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "submission",
      title: "New thesis submitted",
      description: "Ahmed Khan submitted 'AI-Powered Recommendation Systems'",
      time: "2 hours ago",
      icon: FileText,
    },
    {
      id: 2,
      type: "approval",
      title: "Thesis approved",
      description: "Dr. Hassan approved 'Smart Grid Technology'",
      time: "4 hours ago",
      icon: CheckCircle,
    },
    {
      id: 3,
      type: "user",
      title: "New user registered",
      description: "Fatima Ali registered as a student",
      time: "6 hours ago",
      icon: Users,
    },
    {
      id: 4,
      type: "alert",
      title: "System alert",
      description: "Storage usage at 75% capacity",
      time: "1 day ago",
      icon: AlertCircle,
    },
  ]

  const quickActions = [
    { label: "Manage Users", href: "/admin/users", icon: Users },
    { label: "View Theses", href: "/admin/theses", icon: FileText },
    { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { label: "Settings", href: "/admin/settings", icon: "⚙️" },
  ]

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card p-4 sm:p-6">
        <div>
          <h1 className="sm:text-2xl md:text-3xl text-xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">System overview and management</p>
        </div>
        <ThemeToggle />
      </div>
      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx} className="border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card className="border-border bg-card p-6">
          <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
          <div className="grid gap-3 md:grid-cols-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon === "settings" ? "⚙️" : action.icon
              return (
                <Link key={idx} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors bg-transparent"
                  >
                    {action.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="gap-0 border-border bg-card overflow-hidden pt-0">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* System Health Check*/}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border bg-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">System Health</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Storage Usage</p>
                  <p className="text-sm font-semibold text-foreground">75%</p>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-3/4 bg-yellow-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Database Performance</p>
                  <p className="text-sm font-semibold text-foreground">Good</p>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-4/5 bg-green-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">API Response Time</p>
                  <p className="text-sm font-semibold text-foreground">120ms</p>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-1/2 bg-green-500" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-6 mb-20">
            <h2 className="text-lg font-bold text-foreground mb-4">Support Requests</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Open Tickets</p>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </div>
                <Badge className="bg-primary/10 text-primary">5</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">In Progress</p>
                  <p className="text-xs text-muted-foreground">Being handled</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">3</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Resolved</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <Badge className="bg-green-100 text-green-800">12</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}
