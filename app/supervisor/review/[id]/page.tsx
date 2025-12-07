import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getThesisById } from "@/lib/data/theses"
import { ReviewThesisClient } from "@/components/review-thesis-client"

export default async function ReviewThesisPage({ params }: { params: { id: string } }) {
  const thesis = await getThesisById(Number.parseInt(params.id))

  if (!thesis) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Thesis Not Found</h1>
          <Link href="/supervisor/reviews" className="text-primary hover:underline">
            Back to Reviews
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <Link href="/supervisor/reviews" className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Reviews
        </Link>
        <h1 className="text-3xl font-bold text-foreground">{thesis.title}</h1>
        <p className="text-muted-foreground mt-2">
          Submitted by {thesis.author} on {thesis.submitted}
        </p>
      </div>

      <ReviewThesisClient thesis={thesis} />
    </main>
  )
}
