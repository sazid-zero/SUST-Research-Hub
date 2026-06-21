"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Maximize, Minimize } from "lucide-react"

interface SecureDocumentViewerProps {
    url: string
    isOpen: boolean
    onClose: () => void
    title?: string
}

export function SecureDocumentViewer({ url, isOpen, onClose, title = "Secure Document Viewer" }: SecureDocumentViewerProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [viewerUrl, setViewerUrl] = useState<string>("")
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        const isPdf = url.toLowerCase().endsWith(".pdf") || url.includes(".pdf?")
        const isDoc = url.toLowerCase().match(/\.(doc|docx)$/) || url.includes(".doc?") || url.includes(".docx?")

        if (isPdf) {
            // Fetch as blob to prevent IDM/Download Managers from intercepting the URL
            setIsLoading(true)
            fetch(url)
                .then((res) => res.blob())
                .then((blob) => {
                    const blobUrl = URL.createObjectURL(blob)
                    setViewerUrl(`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0`)
                })
                .catch((err) => {
                    console.error("Failed to load PDF blob", err)
                    setViewerUrl(`${url}#toolbar=0&navpanes=0&scrollbar=0`)
                })
        } else if (isDoc) {
            setViewerUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`)
        } else {
            setViewerUrl(url)
        }

        return () => {
            // Cleanup blob URL
            if (viewerUrl.startsWith('blob:')) {
                URL.revokeObjectURL(viewerUrl.split('#')[0])
            }
        }
    }, [url, isOpen])

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
                
                {/* Header bar that prevents dragging/dropping */}
                <div className="h-12 bg-muted border-b border-border flex items-center px-4 justify-between select-none shrink-0">
                    <span className="font-medium text-sm truncate max-w-[70%]">{title}</span>
                    <div className="flex items-center gap-2 pr-8">
                        <span className="text-xs text-muted-foreground uppercase px-2 py-1 bg-background rounded border border-border hidden sm:inline-block">Read Only</span>
                        <button 
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-1.5 hover:bg-background rounded-md text-muted-foreground hover:text-foreground transition-colors"
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        >
                            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div 
                    className="flex-1 relative bg-black/5 flex items-center justify-center select-none"
                    onContextMenu={(e) => e.preventDefault()} // Prevent right-click wrapper
                >
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground animate-pulse">Loading secure document...</p>
                        </div>
                    )}
                    
                    {/* Invisible overlay around iframe edges to prevent right-clicking scrollbars if needed */}
                    <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]"></div>
                    
                    {viewerUrl && (
                        <iframe
                            src={viewerUrl}
                            className="w-full h-full border-none outline-none relative z-0"
                            onLoad={() => setIsLoading(false)}
                            title={title}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
