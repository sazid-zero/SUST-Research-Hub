import { getPendingPaperSubmissions } from "@/app/actions/admin"
import PapersReviewClient from "@/components/admin/papers-review-client"

export const revalidate = 0 // Always fetch fresh data

export default async function AdminPapersPage() {
  const result = await getPendingPaperSubmissions()

  return (
    <PapersReviewClient
      initialSubmissions={result.success ? result.submissions : []}
    />
  )
}
