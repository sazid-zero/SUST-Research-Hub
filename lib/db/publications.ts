import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Publication {
    id: number
    thesis_id: number
    title: string
    journal_name: string
    publication_type: string
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
    impact_factor?: number
    abstract?: string
    keywords?: string[]
    status: string
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
        slug: string
        status: string
    }
    files?: PublicationFile[]
}

export interface PublicationAuthor {
    id: number
    publication_id: number
    author_name: string
    author_order: number
    affiliation?: string
    corresponding_author: boolean
    user_id?: number
    profile_pic?: string // Added profile_pic field
}

export interface PublicationFile {
    id: number
    publication_id: number
    file_name: string
    file_size?: number
    resource_type: "code" | "dataset" | "model" | "supplementary"
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
                        u.profile_pic
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
            SELECT * FROM publications
            ORDER BY published_date DESC, year DESC
        `

        const publicationsWithAuthors = await Promise.all(
            publications.map(async (pub) => {
                const authors = await sql`
                    SELECT
                        pa.*,
                        u.id as user_id,
                        u.full_name as user_full_name,
                        u.profile_pic
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

export async function getPublicationById(publicationId: number) {
    try {
        const publication = await sql`
            SELECT
                p.*,
                t.id as thesis_id,
                t.title as thesis_title,
                t.status as thesis_status
            FROM publications p
                     LEFT JOIN theses t ON p.thesis_id = t.id
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

        return {
            ...pub,
            authors: authors as PublicationAuthor[],
            files: files as PublicationFile[],
            thesis: pub.thesis_id
                ? {
                    id: pub.thesis_id,
                    title: pub.thesis_title,
                    status: pub.thesis_status,
                }
                : null,
            project: null,
        }
    } catch (error) {
        console.error("[v0] Error fetching publication by ID:", error)
        return null
    }
}
