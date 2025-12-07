"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle, Plus, FileText } from "lucide-react"
import Link from "next/link"
import type { Thesis } from "@/lib/data/theses"

interface StudentDashboardClientProps {
  allTheses: Thesis[]
}

export function StudentDashboardClient({ allTheses }: StudentDashboardClientProps) {
  const submissions = allTheses.slice(0, 3).map((thesis) => ({
    id: thesis.id,
    title: thesis.title,
    supervisor: thesis.supervisor,
    department: thesis.department,
    status: thesis.status,
    submitted: thesis.year.toString(),
  }))

  const stats = [
    { label: "Total Theses", value: submissions.length.toString(), icon: FileText, color: "text-primary" },
    {
      label: "Approved",
      value: submissions.filter((s) => s.status === "approved").length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Pending",
      value: submissions.filter((s) => s.status === "pending").length.toString(),
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Rejected",
      value: submissions.filter((s) => s.status === "rejected").length.toString(),
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <main className="mb-20 w-full">
        <div className="border-b border-border bg-card p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">Welcome back, Student Name</p>
            </div>
            <Link href="/student/submit">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-sm sm:text-base h-9 sm:h-10">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Submission</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 md:space-y-8">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 overflow-auto">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <Card key={idx} className="border-border bg-card p-3 sm:p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-1 sm:mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 ${stat.color}`} />
                  </div>
                </Card>
              )
            })}
          </div>

          <Card className="border-border bg-card w-full overflow-auto gap-0">
            <div className="p-3 sm:p-4 md:p-6 border-b border-border pt-0 sm:pt-0 md:pt-0 ">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground">My Submissions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">
                      Title
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">
                      Supervisor
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">
                      Department
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">
                      Submitted
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-foreground font-medium">
                        {submission.title}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground">
                        {submission.supervisor}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground">
                        {submission.department}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <Badge className={`${getStatusColor(submission.status)} text-xs`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground">
                        {submission.submitted}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:bg-primary/10 h-8 text-xs sm:text-sm"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
