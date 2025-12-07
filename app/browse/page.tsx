import { getCurrentUser } from "@/lib/auth"
import { BrowseContent } from "@/components/browse-content"
import { getAllTheses } from "@/lib/data/theses"
import { unstable_cache } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds

const getCachedTheses = unstable_cache(async () => getAllTheses(), ["browse-theses"], {
  revalidate: 60,
  tags: ["theses"],
})

export default async function BrowseRepositoryPage() {
  const [user, theses] = await Promise.all([getCurrentUser(), getCachedTheses()])

  return <BrowseContent user={user} theses={theses} />
}
