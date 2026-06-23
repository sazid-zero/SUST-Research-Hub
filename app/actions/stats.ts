"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface ShowcaseStats {
    theses: {
        count: number
        views: number
        deptCount: number
    }
    models: {
        count: number
        maxAccuracy: number
        views: number
    }
    projects: {
        count: number
        totalFunding: number
        collaboratorCount: number
    }
    publications: {
        count: number
        citations: number
        views: number
    }
    supplements: {
        count: number
        totalSize: number
    }
    researchersCount: number
    researchFieldsCount: number
}

export async function getShowcaseStats(): Promise<ShowcaseStats> {
    let retries = 2;
    while (retries > 0) {
        try {
            const [theses, models, projects, publications, datasets, researchers, fields, thesesDepts, projectCollaborators, pubViews, modelViews] = await Promise.all([
                sql`SELECT COUNT(*)::int as count, COALESCE(SUM(views), 0)::int as views FROM theses WHERE status = 'approved'`,
                sql`SELECT COUNT(*)::int as count, COALESCE(MAX(accuracy), 0)::float as max_accuracy FROM models WHERE status = 'published'`,
                sql`SELECT COUNT(*)::int as count, COALESCE(SUM(funding_amount), 0)::float as total_funding FROM projects WHERE status = 'published' OR status = 'approved'`,
                sql`SELECT COUNT(*)::int as count, COALESCE(SUM(citations), 0)::int as total_citations FROM publications WHERE status = 'published' OR status = 'approved'`,
                sql`SELECT COUNT(*)::int as count, COALESCE(SUM(size_mb), 0)::float as total_size FROM datasets WHERE status = 'published'`,
                sql`SELECT COUNT(*)::int as count FROM users`,
                sql`SELECT COUNT(DISTINCT department)::int as count FROM (SELECT department FROM theses WHERE department IS NOT NULL AND department <> '' UNION SELECT department FROM users WHERE department IS NOT NULL AND department <> '') as depts`,
                sql`SELECT COUNT(DISTINCT department)::int as count FROM theses WHERE department IS NOT NULL AND department <> '' AND status = 'approved'`,
                sql`SELECT COUNT(DISTINCT pm.user_id)::int as count FROM project_members pm JOIN projects p ON pm.project_id = p.id WHERE p.status IN ('published', 'approved')`,
                sql`SELECT COALESCE(SUM(views), 0)::int as total_views FROM publications WHERE status IN ('published', 'approved')`,
                sql`SELECT COALESCE(SUM(views), 0)::int as total_views FROM models WHERE status = 'published'`
            ])

            return {
                theses: {
                    count: theses[0].count,
                    views: theses[0].views,
                    deptCount: thesesDepts[0].count
                },
                models: {
                    count: models[0].count,
                    maxAccuracy: models[0].max_accuracy,
                    views: modelViews[0].total_views
                },
                projects: {
                    count: projects[0].count,
                    totalFunding: projects[0].total_funding,
                    collaboratorCount: projectCollaborators[0].count
                },
                publications: {
                    count: publications[0].count,
                    citations: publications[0].total_citations,
                    views: pubViews[0].total_views
                },
                supplements: {
                    count: datasets[0].count,
                    totalSize: datasets[0].total_size
                },
                researchersCount: researchers[0].count,
                researchFieldsCount: fields[0].count
            }
        } catch (error: any) {
            if (retries === 1) {
                console.error("Error fetching showcase stats after retries:", error.message || error)
                break;
            }
            // Wait 1.5 seconds before retrying to allow Neon DB to wake up
            await new Promise(resolve => setTimeout(resolve, 1500));
            retries--;
        }
    }

    // Fallback to zeros if something fails
    return {
        theses: { count: 0, views: 0, deptCount: 0 },
        models: { count: 0, maxAccuracy: 0, views: 0 },
        projects: { count: 0, totalFunding: 0, collaboratorCount: 0 },
        publications: { count: 0, citations: 0, views: 0 },
        supplements: { count: 0, totalSize: 0 },
        researchersCount: 0,
        researchFieldsCount: 0
    }
}
