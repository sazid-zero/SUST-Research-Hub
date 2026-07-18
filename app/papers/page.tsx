import { getCurrentUser } from "@/lib/auth"
import { PapersContentBackend } from "@/components/papers-content-backend"
import { getAllPublications } from "@/lib/db/publications"
import { getSupervisors } from "@/lib/db/users"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export default async function PapersRepositoryPage() {
    const dbSql = neon(process.env.DATABASE_URL!)

    const [user, papers, supervisorUsers, ghostSupervisors] = await Promise.all([
        getCurrentUser(),
        getAllPublications().catch((error) => {
            console.error("[v0] Error loading papers:", error)
            return []
        }),
        getSupervisors().catch(() => []),
        dbSql`SELECT DISTINCT ghost_supervisor FROM theses WHERE ghost_supervisor IS NOT NULL AND ghost_supervisor != ''`.catch(() => []),
    ])

    // Merge registered supervisor names + ghost supervisors, deduplicate
    const registeredNames = (supervisorUsers || []).map((s) => s.full_name).filter(Boolean)
    const ghostNames = (ghostSupervisors || []).map((r: any) => r.ghost_supervisor).filter(Boolean)
    const supervisorNames = [...new Set([...registeredNames, ...ghostNames])].sort()

    return <PapersContentBackend user={user} papers={papers} supervisorNames={supervisorNames} />
}
