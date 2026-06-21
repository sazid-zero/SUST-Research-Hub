"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Users, FileText, CheckCircle, Sparkles, LayoutDashboard, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalyticsData {
  submissionTrend: any[]
  departmentStats: any[]
  statusDistribution: any[]
}

interface StatsData {
  totalTheses: number
  activeUsers: number
  pendingReviews: number
  approvedTheses: number
}

interface AnalyticsClientProps {
  data: AnalyticsData
  stats: StatsData
}

export default function AnalyticsClient({ data, stats }: AnalyticsClientProps) {
  const statsCards = [
    { label: "Research Repository", value: stats.totalTheses.toLocaleString(), icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Nodes", value: stats.activeUsers.toLocaleString(), icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Validated Work", value: stats.approvedTheses.toLocaleString(), icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" },
    { label: "Growth Vector", value: stats.pendingReviews.toLocaleString(), icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
  ]

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen">
      {/* Header Area */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0f172a] border-b border-border/50 px-6 py-6 sm:py-8 md:py-10">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                          <Activity className="h-3 w-3" />
                          Platform Metrics
                      </div>
                      <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                        Research <span className="bg-linear-to-r from-emerald-500 to-primary bg-clip-text text-transparent">Intelligence</span>
                      </h1>
                      <p className="text-sm text-muted-foreground font-medium max-w-lg">
                        Analyze submission trends, department output, and system growth metrics through real-time data visualization.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 mb-10">
        {/* Stats Grid */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
                <LayoutDashboard className="h-4 w-4 text-emerald-500" />
                <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Metric Overview</h2>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                {statsCards.map((stat, idx) => {
                const Icon = stat.icon
                return (
                    <Card key={idx} className="group relative overflow-hidden border-border/50 bg-background/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all ring-1 ring-emerald-500/5">
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

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Submission Trend */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Submissions Curve</h2>
                </div>
                <Card className="border-border/50 bg-background/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm ring-1 ring-primary/5">
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.submissionTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 10, fontWeight: 700 }} 
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis 
                                tick={{ fontSize: 10, fontWeight: 700 }} 
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700 }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                            <Line type="monotone" dataKey="submissions" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Total Submissions" />
                            <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Approved Works" />
                        </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </section>

            {/* Department Distribution */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <LayoutDashboard className="h-4 w-4 text-purple-500" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Faculty Distribution</h2>
                </div>
                <Card className="border-border/50 bg-background/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm ring-1 ring-primary/5">
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.departmentStats}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45} 
                                textAnchor="end" 
                                height={80} 
                                tick={{ fontSize: 9, fontWeight: 700 }} 
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis 
                                tick={{ fontSize: 10, fontWeight: 700 }} 
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip 
                                cursor={{fill: 'rgba(0,0,0,0.02)'}}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700 }}
                            />
                            <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} name="Research Count" />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </section>
        </div>

        {/* Status Breakdown Section */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Verification Status Distribution</h2>
            </div>
            <Card className="border-border/50 bg-background/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm ring-1 ring-primary/5">
                <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={data.statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={8}
                        dataKey="value"
                    >
                        {data.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700 }}
                    />
                    <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                        formatter={(value, entry: any) => (
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-2">
                                {value}: {entry.payload.value}
                            </span>
                        )}
                    />
                    </PieChart>
                </ResponsiveContainer>
                </div>
            </Card>
        </section>
      </div>
    </div>
  )
}
