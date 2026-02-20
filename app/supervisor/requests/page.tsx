import { getSupervisionRequests } from "@/app/actions/supervisor"
import { RequestsClient } from "@/components/supervisor/requests-client"

export default async function SupervisorRequestsPage() {
  const requests = await getSupervisionRequests()

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Supervision Requests</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage and respond to student research supervision inquiries</p>
        </div>

        <RequestsClient initialRequests={requests} />
      </div>
    </main>
  )
}
