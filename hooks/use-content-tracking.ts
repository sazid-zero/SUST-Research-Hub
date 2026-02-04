'use client'

import { useEffect } from "react"

export function useContentTracking(
  contentType: string, 
  contentId: number | string,
  callbacks?: {
    onView?: () => void
  }
) {
  useEffect(() => {
    const trackView = async () => {
      try {
        const response = await fetch("/api/content/log-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contentType,
            contentId: typeof contentId === "string" ? parseInt(contentId) : contentId,
          }),
        })
        
        if (response.ok && callbacks?.onView) {
          callbacks.onView()
        }
      } catch (error) {
        console.error("[v0] Error tracking view:", error)
      }
    }

    if (contentId) {
      trackView()
    }
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
      
      // We don't have a callback here because the caller calls this function directly
      // and can handle state updates themselves
      return true
    } catch (error) {
      console.error("[v0] Error tracking download:", error)
      return false
    }
  }

  return { trackDownload }
}
