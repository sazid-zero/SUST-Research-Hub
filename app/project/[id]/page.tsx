import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ProjectDetailContent from "@/components/project-detail-content"
import { getProjectById } from "@/lib/db/projects"
import { getCurrentUser } from "@/lib/auth"
import { unstable_cache } from "next/cache"

export const metadata: Metadata = {
    title: "Project Details",
    description: "View detailed information about research projects",
}

interface ProjectDetailsPageProps {
    params: Promise<{
        id: string
    }>
}

const getCachedProject = unstable_cache(
    async (id: number) => getProjectById(id),
    ["project-detail"],
    {
        revalidate: 60,
        tags: ["project"],
    }
)

export default async function ProjectDetailPage({ params }: ProjectDetailsPageProps) {
    const { id } = await params
    const projectId = Number.parseInt(id)

    if (Number.isNaN(projectId)) {
        notFound()
    }

    const [project, user] = await Promise.all([
        getCachedProject(projectId),
        getCurrentUser()
    ])

    if (!project) {
        notFound()
    }

    const formattedProject = {
        ...project,
        startDate: project.start_date,
        endDate: project.end_date,
        funding: project.funding_amount ? `$${project.funding_amount.toLocaleString()}` : null,
        fundingSource: project.funding_source,
    }

    return <ProjectDetailContent project={formattedProject as any} user={user} />
}
