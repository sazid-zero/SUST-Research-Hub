import { notFound } from "next/navigation"
import { PaperDetailContent } from "@/components/paper-detail-content"
import { getPublicationById } from "@/lib/db/publications"
import { getCurrentUser } from "@/lib/auth"

export default async function PaperDetailPage({ params }: {params: Promise<{ id: string }> }) {
    const { id } = await params
    const publicationId = Number(id)

    if (isNaN(publicationId)) {
        notFound()
    }

    const [publication, user] = await Promise.all([getPublicationById(publicationId), getCurrentUser()])

    if (!publication) {
        notFound()
    }

    return <PaperDetailContent publication={publication} user={user} />
}
