import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function svgTextToDataUri(svgText: string | null | undefined): string | null {
    if (!svgText) return null

    // Check if it's already a URL (http/https/data URI)
    if (svgText.startsWith("http") || svgText.startsWith("data:")) {
        return svgText
    }

    // Check if it looks like SVG markup
    if (svgText.trim().startsWith("<svg")) {
        try {
            // Convert SVG text to data URI
            return `data:image/svg+xml,${encodeURIComponent(svgText)}`
        } catch (error) {
            console.error("Failed to convert SVG to data URI:", error)
            return null
        }
    }

    // Return as-is if it's some other format
    return svgText
}
