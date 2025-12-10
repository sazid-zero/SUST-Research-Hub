import { getCurrentUser } from "@/lib/auth"
import { PapersContent } from "@/components/papers-content"

export default async function PapersRepositoryPage() {
    const user = await getCurrentUser()

    return <PapersContent user={user} />
}
