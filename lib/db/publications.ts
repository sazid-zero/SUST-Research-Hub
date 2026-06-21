import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Publication {
    id: number
    thesis_id: number
    title: string
    journal_name: string
    publication_type: string
    paper_subtype?: string // journal, conference
    doi?: string
    isbn?: string
    issn?: string
    published_date?: string
    year: number
    volume?: string
    issue?: string
    pages?: string
    publisher?: string
    url?: string
    pdf_url?: string
    citations: number
    views?: number
    impact_factor?: number
    abstract?: string
    keywords?: string[]
    status: string
    thesis_department?: string
    created_at: string
    updated_at: string
    authors?: PublicationAuthor[]
    thesis?: {
        id: number
        title: string
        status: string
    }
    project?: {
        id: number
        title: string
        status: string
    }
    project_id?: number
    files?: PublicationFile[]
    resource_links?: Array<{
        id: number
        title: string
        url: string
        category: string
    }>
    models?: Array<{
        id: number
        name: string
        description: string
        external_url?: string
        file_url?: string
        framework?: string
    }>
}

export interface PublicationAuthor {
    id: number
    publication_id: number
    author_name: string
    author_order: number
    affiliation?: string
    corresponding_author: boolean
    user_id?: number
    student_id?: string
    user_role?: string
    profile_pic?: string // Added profile_pic field
}

export interface PublicationFile {
    id: number
    publication_id: number
    file_name: string
    file_size?: number
    resource_type: "code" | "dataset" | "model" | "supplementary" | "result"
    file_url: string
    description?: string
    uploaded_at: string
}

export async function getPublicationsByThesisId(thesisId: number): Promise<Publication[]> {
    try {
        const publications = await sql`
            SELECT * FROM publications
            WHERE thesis_id = ${thesisId}
            ORDER BY published_date DESC, year DESC, created_at DESC
        `

        const publicationsWithAuthors = await Promise.all(
            publications.map(async (pub) => {
                const authors = await sql`
                    SELECT
                        pa.*,
                        u.id as user_id,
                        u.full_name as user_full_name,
                        u.profile_pic,
                        u.role as user_role,
                        u.student_id
                    FROM publication_authors pa
                             LEFT JOIN users u ON LOWER(TRIM(pa.author_name)) = LOWER(TRIM(u.full_name))
                    WHERE pa.publication_id = ${pub.id}
                    ORDER BY pa.author_order ASC
                `
                return {
                    ...pub,
                    authors: authors as PublicationAuthor[],
                }
            }),
        )

        return publicationsWithAuthors as Publication[]
    } catch (error) {
        console.error("[v0] Error fetching publications:", error)
        return []
    }
}

export async function getAllPublications(): Promise<Publication[]> {
    try {
        const publications = await sql`
            SELECT p.*, t.department as thesis_department
            FROM publications p
            LEFT JOIN theses t ON p.thesis_id = t.id
            WHERE p.status IN ('published', 'approved')
            ORDER BY p.published_date DESC, p.year DESC
        `

        const publicationsWithAuthors = await Promise.all(
            publications.map(async (pub) => {
                const authors = await sql`
                    SELECT
                        pa.*,
                        u.id as user_id,
                        u.full_name as user_full_name,
                        u.profile_pic,
                        u.role as user_role,
                        u.student_id
                    FROM publication_authors pa
                             LEFT JOIN users u ON LOWER(TRIM(pa.author_name)) = LOWER(TRIM(u.full_name))
                    WHERE pa.publication_id = ${pub.id}
                    ORDER BY pa.author_order ASC
                `
                return {
                    ...pub,
                    authors: authors as PublicationAuthor[],
                }
            }),
        )

        return publicationsWithAuthors as Publication[]
    } catch (error) {
        console.error("[v0] Error fetching all publications:", error)
        return []
    }
}

export async function getPublicationById(publicationId: number): Promise<Publication | null> {
    try {
        const publication = await sql`
            SELECT
                p.*,
                t.id as thesis_id,
                t.title as thesis_title,
                t.status as thesis_status,
                pr.id as pr_id,
                pr.title as pr_title,
                pr.status as pr_status
            FROM publications p
            LEFT JOIN theses t ON p.thesis_id = t.id
            LEFT JOIN projects pr ON p.project_id = pr.id
            WHERE p.id = ${publicationId}
        `

        if (publication.length === 0) {
            return null
        }

        const pub = publication[0]

        const authors = await sql`
            SELECT
                pa.*,
                u.id as user_id,
                u.full_name as user_full_name,
                u.profile_pic
            FROM publication_authors pa
                     LEFT JOIN users u ON LOWER(TRIM(pa.author_name)) = LOWER(TRIM(u.full_name))
            WHERE pa.publication_id = ${publicationId}
            ORDER BY pa.author_order ASC
        `

        // Fetch publication files (code, datasets, models, supplementary)
        const files = await sql`
            SELECT * FROM publication_files
            WHERE publication_id = ${publicationId}
            ORDER BY resource_type, uploaded_at DESC
        `

        const links = await sql`SELECT id, title, url, category FROM resource_links WHERE workspace_id = ${publicationId} AND workspace_type = 'publication'`
        const models = await sql`SELECT id, title as name, description, model_url as external_url, download_url as file_url, framework FROM models WHERE workspace_id = ${publicationId} AND workspace_type = 'publication'`
        const datasets = await sql`SELECT id, title as name, download_url as external_url FROM datasets WHERE workspace_id = ${publicationId} AND workspace_type = 'publication'`

        let resource_links = links as any
        if (datasets.length > 0) {
            resource_links = [
                ...resource_links,
                ...datasets.map((d: any) => ({ id: d.id, title: d.name, url: d.external_url, category: 'dataset' }))
            ]
        }

        return {
            ...pub,
            authors: authors as PublicationAuthor[],
            files: files as PublicationFile[],
            resource_links: resource_links,
            models: models as any,
            thesis: pub.thesis_id
                ? {
                    id: pub.thesis_id,
                    title: pub.thesis_title,
                    status: pub.thesis_status,
                }
                : undefined,
            project: pub.pr_id
                ? {
                    id: pub.pr_id,
                    title: pub.pr_title,
                    status: pub.pr_status,
                }
                : undefined,
        } as unknown as Publication
    } catch (error) {
        console.error("[v0] Error fetching publication by ID:", error)
        return null
    }
}
export async function getPublicationsByUserId(userId: number): Promise<Publication[]> {
    try {
        const result = await sql`
            SELECT p.* 
            FROM publications p
            JOIN publication_authors pa ON p.id = pa.publication_id
            WHERE pa.user_id = ${userId}
            ORDER BY p.created_at DESC
        `
        
        // If no results by ID, try name matching as fallback (for legacy data)
        if (result.length === 0) {
             const fallback = await sql`
                SELECT p.* 
                FROM publications p
                JOIN publication_authors pa ON p.id = pa.publication_id
                JOIN users u ON LOWER(TRIM(pa.author_name)) = LOWER(TRIM(u.full_name))
                WHERE u.id = ${userId}
                ORDER BY p.created_at DESC
            `
            return fallback as Publication[]
        }

        return result as Publication[]
    } catch (error) {
        console.error("[v0] Error fetching user publications:", error)
        return []
    }
}
