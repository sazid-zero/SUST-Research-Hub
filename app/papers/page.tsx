import { getCurrentUser } from "@/lib/auth"
import { PapersContentBackend } from "@/components/papers-content-backend"
import { getAllPublications } from "@/lib/db/publications"

export default async function PapersRepositoryPage() {
    const user = await getCurrentUser()

    let papers = []
    try {
        papers = await getAllPublications()
    } catch (error) {
        console.error("[v0] Error loading papers:", error)
    }

    return <PapersContentBackend user={user} papers={papers} />
}
