import { StudentDashboardClient } from "@/components/student-dashboard-client"
import { Card } from "@/components/ui/card"
import { Suspense } from "react"
import { getAllTheses } from "@/lib/data/theses"
import { getUserWorkspaces } from "@/lib/db/workspace"
import { getCurrentUser } from "@/app/actions/auth"

export const revalidate = 0 // Disable cache for dashboard to reflect real-time changes

function DashboardLoading() {
  return (
    <main className="mb-20 w-full">
      <div className="border-b border-border bg-card p-4 sm:p-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-20 bg-muted animate-pulse rounded" />
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

async function DashboardContent() {
  try {
    const user = await getCurrentUser()
    if (!user) return <div>Unauthorized</div>

    const [userWorkspaces, allTheses] = await Promise.all([
        getUserWorkspaces(user.id),
        getAllTheses()
    ])

    return <StudentDashboardClient allTheses={allTheses} userWorkspaces={userWorkspaces} userName={user.full_name} />
  } catch (error) {
    throw error
  }
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}
