import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export const revalidate = 0

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function VerifyEmailResultPage({ searchParams }: Props) {
  const params = await searchParams
  const error = params.error

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-8 text-center space-y-6 border border-border shadow-xl rounded-2xl bg-card">
        <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto text-2xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Verification Failed</h1>
          <p className="text-sm text-muted-foreground">
            {error || "The verification link is invalid or has expired."}
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button asChild variant="outline" className="flex-1 rounded-xl">
            <Link href="/register">Register Again</Link>
          </Button>
          <Button asChild className="flex-1 rounded-xl">
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
