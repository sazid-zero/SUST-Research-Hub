import { getAllThesesAdmin } from "@/lib/db/theses"
import { getAllPublicationsAdmin, getAllProjectsAdmin } from "@/app/actions/admin"
import ResearchManagementClient from "@/components/admin/research-management-client"

export const revalidate = 0 // Always fetch fresh data

export default async function AdminThesesPage() {
  const [theses, pubResult, projResult] = await Promise.all([
    getAllThesesAdmin(),
    getAllPublicationsAdmin(),
    getAllProjectsAdmin(),
  ])

  const formattedTheses = theses.map((thesis: any) => ({
    id: thesis.id,
    title: thesis.title,
    author: thesis.authors?.[0]?.full_name || 'Unknown',
    supervisor: thesis.supervisor_name || '',
    department: thesis.department,
    status: thesis.status,
    visibility: thesis.visibility || 'visible',
    submittedDate: thesis.submitted_date || thesis.created_at,
  }))

  const formattedPublications = (pubResult.publications ?? []).map((p: any) => ({
    id: p.id,
    title: p.title,
    author: p.owner_name || 'Unknown',
    department: p.department || '',
    status: p.status,
    visibility: p.visibility || 'visible',
    submittedDate: p.submitted_date || p.created_at,
    year: p.year,
  }))

  const formattedProjects = (projResult.projects ?? []).map((p: any) => ({
    id: p.id,
    title: p.title,
    author: p.supervisor_name || 'Unknown',
    department: p.department || '',
    status: p.status,
    visibility: p.visibility || 'visible',
    submittedDate: p.created_at,
  }))

  return (
    <ResearchManagementClient
      initialTheses={formattedTheses}
      initialPublications={formattedPublications}
      initialProjects={formattedProjects}
    />
  )
}
