import { getThesisById } from "@/lib/db/theses"
import { getCurrentUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import { ThesisDetailEnhanced } from "@/components/thesis-detail-enhanced"
import { unstable_cache } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 60

const getCachedThesis = unstable_cache(async (id: number) => getThesisById(id), ["thesis-detail"], {
  revalidate: 60,
  tags: ["thesis"],
})

export default async function ThesisDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [thesis, user] = await Promise.all([getCachedThesis(Number.parseInt(id)), getCurrentUser()])

  if (!thesis) {
    notFound()
  }

  return <ThesisDetailEnhanced thesis={thesis} user={user} />
}
