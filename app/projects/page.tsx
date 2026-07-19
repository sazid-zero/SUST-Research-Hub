import { getCurrentUser } from "@/lib/auth"
import ProjectsContent from "@/components/projects-content"
import { getAllProjects } from "@/lib/db/projects"
import { unstable_cache } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 60

const getCachedProjects = unstable_cache(async () => getAllProjects(), ["browse-projects"], {
    revalidate: 60,
    tags: ["projects"],
})

export default async function ProjectsPage() {
    const [user, projects] = await Promise.all([getCurrentUser(), getCachedProjects()])

    return <ProjectsContent user={user} initialProjects={projects} />
}
