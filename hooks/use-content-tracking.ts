'use client'

import { useEffect } from "react"

export function useContentTracking(contentType: string, contentId: number | string) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch("/api/content/log-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contentType,
            contentId: typeof contentId === "string" ? parseInt(contentId) : contentId,
          }),
        })
      } catch (error) {
        console.error("[v0] Error tracking view:", error)
      }
    }

    trackView()
  }, [contentType, contentId])

  const trackDownload = async (fileSize?: number) => {
    try {
      await fetch("/api/content/log-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType,
          contentId: typeof contentId === "string" ? parseInt(contentId) : contentId,
          fileSize: fileSize || null,
        }),
      })
    } catch (error) {
      console.error("[v0] Error tracking download:", error)
    }
  }

  return { trackDownload }
}
