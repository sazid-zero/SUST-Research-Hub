"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Maximize, Minimize, AlertCircle, FileText } from "lucide-react"

interface SecureDocumentViewerProps {
    url: string
    isOpen: boolean
    onClose: () => void
    title?: string
}

export function SecureDocumentViewer({
    url,
    isOpen,
    onClose,
    title = "Secure Document Viewer",
}: SecureDocumentViewerProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [numPages, setNumPages] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const activeRef = useRef(false)

    const isPdf = url.toLowerCase().includes(".pdf")
    const isDoc = /\.(doc|docx)(\?|$)/i.test(url)

    const renderPdf = useCallback(async (pdfUrl: string) => {
        setIsLoading(true)
        setError(null)
        activeRef.current = true

        try {
            // Dynamic import keeps pdfjs-dist out of the server bundle
            const pdfjsLib = await import("pdfjs-dist")

            // Worker served from /public — avoids import.meta.url Turbopack issues
            pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

            if (!activeRef.current) return

            // Fetch PDF bytes (also bypasses IDM since URL is never exposed)
            const response = await fetch(pdfUrl)
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            const arrayBuffer = await response.arrayBuffer()

            if (!activeRef.current) return

            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
            if (!activeRef.current) return

            setNumPages(pdf.numPages)

            // Small defer to ensure the containerRef div is mounted in the DOM
            await new Promise<void>((r) => setTimeout(r, 50))
            if (!activeRef.current) return

            const container = containerRef.current
            if (!container) throw new Error("PDF container not found in DOM")
            container.innerHTML = ""

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                if (!activeRef.current) return

                const page = await pdf.getPage(pageNum)
                const containerWidth = container.clientWidth - 32
                const baseVp = page.getViewport({ scale: 1 })
                const scale = Math.max(containerWidth / baseVp.width, 0.5)
                const viewport = page.getViewport({ scale })

                // Wrapper card per page
                const wrapper = document.createElement("div")
                Object.assign(wrapper.style, {
                    margin: "0 auto 12px",
                    width: `${viewport.width}px`,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    borderRadius: "3px",
                    overflow: "hidden",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    pointerEvents: "none",
                })

                const canvas = document.createElement("canvas")
                canvas.width = viewport.width
                canvas.height = viewport.height
                Object.assign(canvas.style, {
                    display: "block",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                })

                const ctx = canvas.getContext("2d")!
                await page.render({ canvasContext: ctx, viewport }).promise

                wrapper.appendChild(canvas)
                container.appendChild(wrapper)
            }

            setIsLoading(false)
        } catch (err: any) {
            console.error("[SecureDocumentViewer] PDF render error:", err)
            setError(`Failed to load document: ${err?.message ?? "Unknown error"}`)
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!isOpen || !url) return

        setIsLoading(true)
        setError(null)
        setNumPages(0)

        if (isPdf) {
            renderPdf(url)
        } else {
            // Non-PDF files: just show iframe (Google Docs viewer)
            setIsLoading(false)
        }

        return () => {
            activeRef.current = false
        }
    }, [url, isOpen, isPdf, renderPdf])

    const docViewerUrl = isDoc
        ? `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
        : url

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className={`p-0 flex flex-col overflow-hidden bg-background border-border transition-all duration-200 ${
                    isFullscreen
                        ? "!max-w-[100vw] !w-screen !h-screen border-0 !rounded-none"
                        : "!max-w-[95vw] w-[1200px] h-[90vh]"
                }`}
            >
                <div className="sr-only">
                    <DialogTitle>{title}</DialogTitle>
                </div>

                {/* Header */}
                <div className="h-12 bg-muted border-b border-border flex items-center px-4 justify-between select-none shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm truncate max-w-[60%]">{title}</span>
                        {numPages > 0 && (
                            <span className="text-xs text-muted-foreground shrink-0">
                                ({numPages} page{numPages !== 1 ? "s" : ""})
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 pr-8">
                        <span className="text-xs text-muted-foreground uppercase px-2 py-1 bg-background rounded border border-border hidden sm:inline-block">
                            Read Only
                        </span>
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-1.5 hover:bg-background rounded-md text-muted-foreground hover:text-foreground transition-colors"
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        >
                            {isFullscreen ? (
                                <Minimize className="h-4 w-4" />
                            ) : (
                                <Maximize className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">

                    {/* Spinner */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 z-10 bg-zinc-100 dark:bg-zinc-900">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground animate-pulse">
                                Loading secure document...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && !isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 z-10">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                            <p className="text-sm text-muted-foreground text-center max-w-xs">{error}</p>
                        </div>
                    )}

                    {/* PDF canvas pages — text is NOT selectable from canvas */}
                    {isPdf && (
                        <div
                            ref={containerRef}
                            className="w-full h-full overflow-y-auto overflow-x-auto py-4 px-4"
                            style={{
                                userSelect: "none",
                                WebkitUserSelect: "none",
                            }}
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    )}

                    {/* Non-PDF fallback (doc/docx via Google Docs, or raw file) */}
                    {!isPdf && !isLoading && !error && (
                        <iframe
                            src={docViewerUrl}
                            className="w-full h-full border-none"
                            title={title}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
