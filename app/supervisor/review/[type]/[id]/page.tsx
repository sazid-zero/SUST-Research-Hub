import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getWorkspace } from "@/lib/db/workspace"
import { ReviewWorkspaceClient } from "@/components/supervisor/review-workspace-client"

export default async function SupervisorReviewPage({ params }: { params: { type: string, id: string } }) {
  const user = await getCurrentUser()
  
  if (!user || user.role === 'student') {
    redirect("/auth/signin")
  }

  const { type, id } = params
  
  if (!["thesis", "project", "publication"].includes(type)) {
    notFound()
  }

  const workspaceId = parseInt(id)
  if (isNaN(workspaceId)) {
    notFound()
  }

  const workspace = await getWorkspace(type as any, workspaceId)
  
  if (!workspace) {
    notFound()
  }

  return (
    <main className="flex-1 overflow-hidden">
        <ReviewWorkspaceClient workspace={workspace} />
    </main>
  )
}
