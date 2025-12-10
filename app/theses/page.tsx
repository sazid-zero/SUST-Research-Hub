import { getCurrentUser } from "@/lib/auth"
import { ThesisContent } from "@/components/thesis-content"
import { getAllTheses } from "@/lib/data/theses"
import { unstable_cache } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 60

const getCachedTheses = unstable_cache(async () => getAllTheses(), ["browse-theses"], {
    revalidate: 60,
    tags: ["theses"],
})

export default async function ThesesRepositoryPage() {
    const [user, theses] = await Promise.all([getCurrentUser(), getCachedTheses()])

    return <ThesisContent user={user} theses={theses} pageTitle="Research Theses" />
}
