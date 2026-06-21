"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"

/**
 * Fetches the citation count from Semantic Scholar API.
 * Prioritizes DOI if available, otherwise falls back to a title search.
 */
async function fetchSemanticScholarCitations(doi?: string, title?: string): Promise<number | null> {
    try {
        if (doi) {
            // Option 1: Search by exact DOI (Most accurate)
            const cleanDoi = doi.trim()
            const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/DOI:${cleanDoi}?fields=citationCount`, {
                headers: {
                    'Accept': 'application/json'
                },
                next: { revalidate: 3600 } // Cache for 1 hour to prevent spamming
            })

            if (response.ok) {
                const data = await response.json()
                if (data && typeof data.citationCount === 'number') {
                    return data.citationCount
                }
            }
        }

        if (title) {
            // Option 2: Search by Title fallback
            const cleanTitle = encodeURIComponent(title.trim())
            const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${cleanTitle}&limit=1&fields=citationCount`, {
                headers: {
                    'Accept': 'application/json'
                },
                next: { revalidate: 3600 }
            })

            if (response.ok) {
                const data = await response.json()
                if (data && data.data && data.data.length > 0 && typeof data.data[0].citationCount === 'number') {
                    return data.data[0].citationCount
                }
            }
        }

        return null
    } catch (error) {
        console.error("Error fetching citations from Semantic Scholar:", error)
        return null
    }
}

/**
 * Server Action to manually sync a specific publication's citations.
 */
export async function syncPublicationCitations(publicationId: number) {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, message: "Unauthorized" }
    }

    try {
        // 1. Get the publication's DOI and Title
        const publicationResult = await sql`
            SELECT id, title, doi, citations FROM publications WHERE id = ${publicationId}
        `

        if (publicationResult.length === 0) {
            return { success: false, message: "Publication not found" }
        }

        const pub = publicationResult[0]

        // 2. Fetch from API
        const newCitationCount = await fetchSemanticScholarCitations(pub.doi, pub.title)

        if (newCitationCount === null) {
            return { success: false, message: "Could not find citation data for this publication on Semantic Scholar." }
        }

        // 3. Update Database if it changed
        if (newCitationCount !== pub.citations) {
            await sql`
                UPDATE publications 
                SET citations = ${newCitationCount}, updated_at = NOW() 
                WHERE id = ${publicationId}
            `
            
            // Revalidate paths to update UI instantly
            revalidatePath(`/student/workspace/publication/${publicationId}`)
            revalidatePath(`/student/dashboard`)
            revalidatePath(`/`)
            
            return { 
                success: true, 
                message: `Synced successfully! Citations updated to ${newCitationCount}.`,
                citations: newCitationCount
            }
        }

        return { 
            success: true, 
            message: "Already up to date. No new citations found.",
            citations: pub.citations
        }

    } catch (error) {
        console.error("Citation sync error:", error)
        return { success: false, message: "An error occurred while syncing citations." }
    }
}
