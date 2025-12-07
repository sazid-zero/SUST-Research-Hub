import { StudentDashboardClient } from "@/components/student-dashboard-client"
import { Card } from "@/components/ui/card"
import { Suspense } from "react"
import { getAllTheses } from "@/lib/data/theses"

export const revalidate = 3600 // Cache for 1 hour

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
    const allTheses = await getAllTheses()
    return <StudentDashboardClient allTheses={allTheses} />
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
