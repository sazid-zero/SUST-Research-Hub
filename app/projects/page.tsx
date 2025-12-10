import { getCurrentUser } from "@/lib/auth"
import ProjectsContent from "@/components/projects-content"

export default async function ProjectsPage() {
    const user = await getCurrentUser()

    return <ProjectsContent user={user} />
}
