import { getThesisById } from "@/lib/db/theses"
import { getPublicationsByThesisId } from "@/lib/db/publications"
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

const getCachedPublications = unstable_cache(
    async (id: number) => getPublicationsByThesisId(id),
    ["thesis-publications"],
    {
        revalidate: 60,
        tags: ["publications"],
    },
)

export default async function ThesisDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const thesisId = Number.parseInt(id)

    // If id is not a valid number, return 404
    if (Number.isNaN(thesisId) || !id || id === "undefined") {
        notFound()
    }

    const [thesis, user, publications] = await Promise.all([
        getCachedThesis(thesisId),
        getCurrentUser(),
        getCachedPublications(thesisId),
    ])

    if (!thesis) {
        notFound()
    }

    return <ThesisDetailEnhanced thesis={thesis} user={user} publications={publications} />
}
