import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, FileText } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

export const revalidate = 3600 // Cache for 1 hour

function DashboardLoading() {
  return (
    <>
      <div className="border-b border-border bg-card p-4 sm:p-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
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
  const pendingReviews = [
    {
      id: 1,
      title: "Deep Learning Approaches for Advanced Image Recognition",
      student: "Ahmed Khan",
      department: "Computer Science & Engineering",
      submitted: "2024-11-15",
    },
    {
      id: 2,
      title: "Blockchain Technology: Security Analysis and Applications",
      student: "Karim Hassan",
      department: "Computer Science & Engineering",
      submitted: "2024-11-14",
    },
    {
      id: 3,
      title: "Autonomous Robotics: Navigation and Decision-Making Systems",
      student: "Fatima Ali",
      department: "Computer Science & Engineering",
      submitted: "2024-11-13",
    },
  ]

  const stats = [
    { label: "Pending Reviews", value: pendingReviews.length.toString(), icon: Clock, color: "text-yellow-600" },
    { label: "Approved", value: "156", icon: CheckCircle, color: "text-green-600" },
    { label: "My Students", value: "12", icon: Users, color: "text-primary" },
    { label: "Total Reviewed", value: "342", icon: FileText, color: "text-blue-600" },
  ]

  return (
    <>
      {/* Header */}
      <div className="border-b border-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Welcome back, Dr. Ahmed Hassan</p>
          </div>
          <Link href="/supervisor/reviews">
            <Button className="text-xs sm:text-sm md:text-base bg-gradient-to-r from-primary to-accent hover:scale-105 text-primary-foreground">
              <span className="hidden sm:inline text-base">Review Submission</span>
              <span className="sm:hidden">Review</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx} className="border-border bg-card p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Pending Reviews */}
        <Card className="mb-20 gap-0 border-border bg-card overflow-auto">
          <div className="pt-0 p-4 sm:p-6 sm:pt-0 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Pending Reviews</h2>
            <Badge className="bg-yellow-100 text-yellow-800">{pendingReviews.length} Pending</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Thesis Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Submitted</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingReviews.map((review) => (
                  <tr key={review.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{review.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{review.student}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{review.department}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{review.submitted}</td>
                    <td className="px-6 py-4">
                      <Link href={`/supervisor/review/${review.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}

export default function SupervisorDashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}
