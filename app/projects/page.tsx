import { getCurrentUser } from "@/lib/auth"
import ProjectsContent from "@/components/projects-content"
import { getAllProjects } from "@/lib/db/projects"

export default async function ProjectsPage() {
    const user = await getCurrentUser()
    const projects = await getAllProjects()

    return <ProjectsContent user={user} initialProjects={projects} />
}

