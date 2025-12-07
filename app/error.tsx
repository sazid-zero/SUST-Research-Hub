"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void // Made reset optional to prevent undefined errors
}) {
  useEffect(() => {
    console.error("Error boundary caught:", error)
  }, [error])

  const handleReset = () => {
    if (typeof reset === "function") {
      reset()
    } else {
      // Fallback: reload the page
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleReset} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto bg-transparent"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
