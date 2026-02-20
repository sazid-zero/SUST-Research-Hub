"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface ShowcaseStats {
    theses: {
        count: number
        views: number
    }
    models: {
        count: number
        maxAccuracy: number
    }
    projects: {
        count: number
        totalFunding: number
    }
    publications: {
        count: number
        citations: number
    }
    supplements: {
        count: number
        totalSize: number
    }
}

export async function getShowcaseStats(): Promise<ShowcaseStats> {
    try {
        const [theses, models, projects, publications, datasets] = await Promise.all([
            sql`SELECT COUNT(*)::int as count, COALESCE(SUM(views), 0)::int as views FROM theses WHERE status = 'approved'`,
            sql`SELECT COUNT(*)::int as count, COALESCE(MAX(accuracy), 0)::float as max_accuracy FROM models WHERE status = 'published'`,
            sql`SELECT COUNT(*)::int as count, COALESCE(SUM(funding_amount), 0)::float as total_funding FROM projects WHERE status = 'published'`,
            sql`SELECT COUNT(*)::int as count, COALESCE(SUM(citations), 0)::int as total_citations FROM publications WHERE status = 'published'`,
            sql`SELECT COUNT(*)::int as count, COALESCE(SUM(size_mb), 0)::float as total_size FROM datasets WHERE status = 'published'`
        ])

        return {
            theses: {
                count: theses[0].count,
                views: theses[0].views
            },
            models: {
                count: models[0].count,
                maxAccuracy: models[0].max_accuracy
            },
            projects: {
                count: projects[0].count,
                totalFunding: projects[0].total_funding
            },
            publications: {
                count: publications[0].count,
                citations: publications[0].total_citations
            },
            supplements: {
                count: datasets[0].count,
                totalSize: datasets[0].total_size
            }
        }
    } catch (error) {
        console.error("Error fetching showcase stats:", error)
        // Fallback to zeros if something fails
        return {
            theses: { count: 0, views: 0 },
            models: { count: 0, maxAccuracy: 0 },
            projects: { count: 0, totalFunding: 0 },
            publications: { count: 0, citations: 0 },
            supplements: { count: 0, totalSize: 0 }
        }
    }
}
