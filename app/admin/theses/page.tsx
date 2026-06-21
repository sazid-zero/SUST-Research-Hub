import { getAllTheses } from "@/lib/data/theses"
import ThesesManagementClient from "@/components/admin/theses-client"

export const revalidate = 0 // Always fetch fresh data

export default async function AdminThesesPage() {
  const allTheses = await getAllTheses()

  const formattedTheses = allTheses.map((thesis) => ({
    id: thesis.id,
    title: thesis.title,
    author: thesis.author,
    supervisor: thesis.supervisor,
    department: thesis.department,
    status: thesis.status,
    visibility: thesis.visibility || 'visible',
    submittedDate: thesis.submitted,
    approvedDate: thesis.status === "approved" ? thesis.submitted : null,
  }))

  return <ThesesManagementClient initialTheses={formattedTheses} />
}
