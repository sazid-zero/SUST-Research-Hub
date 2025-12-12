"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface ThesisWithAuthors {
    id: number
    title: string
    abstract: string
    department: string
    field: string
    year: number
    submitted_date: string
    supervisor_id: number
    supervisor_name: string
    status: string
    views: number
    downloads: number
    keywords: string[]
    created_at: string
    updated_at: string
    authors: Array<{
        id: number
        full_name: string
        student_id: string
        author_order: number
        profile_pic?: string // Added profile_pic field
    }>
    files: Array<{
        id: number
        file_name: string
        file_url: string
        file_type: string
        file_size: number
        resource_type?: string
        external_url?: string
        description?: string
    }>
}

async function executeQueryWithRetry<T>(queryFn: () => Promise<T>, maxRetries = 3, baseDelay = 100): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await queryFn()
        } catch (error: any) {
            lastError = error
            // Check if error is transient (connection timeouts, temporary failures)
            const isTransientError =
                error?.message?.includes("Failed to fetch") ||
                error?.message?.includes("ECONNREFUSED") ||
                error?.message?.includes("timeout") ||
                error?.code === "ENOTFOUND"

            if (!isTransientError || attempt === maxRetries - 1) {
                throw error
            }

            // Exponential backoff
            const delay = baseDelay * Math.pow(2, attempt)
            await new Promise((resolve) => setTimeout(resolve, delay))
        }
    }

    throw lastError
}

export async function getAllPublishedTheses(): Promise<ThesisWithAuthors[]> {
    return executeQueryWithRetry(async () => {
        const result = await sql`
            SELECT
                t.id,
                t.title,
                t.abstract,
                t.department,
                t.field,
                t.year,
                t.submitted_date,
                t.supervisor_id,
                t.status,
                t.views,
                t.downloads,
                t.keywords,
                t.created_at,
                t.updated_at,
                u.full_name as supervisor_name,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', u2.id,
                                                   'full_name', u2.full_name,
                                                   'student_id', u2.student_id,
                                                   'author_order', ta.author_order,
                                                   'profile_pic', u2.profile_pic
                                           ) ORDER BY ta.author_order
                                   )
                            FROM thesis_authors ta
                                     LEFT JOIN users u2 ON ta.author_id = u2.id
                            WHERE ta.thesis_id = t.id
                        ),
                        '[]'::json
                ) as authors,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', tf.id,
                                                   'file_name', tf.file_name,
                                                   'file_url', COALESCE(tf.file_url, ''),
                                                   'file_type', tf.file_type,
                                                   'file_size', tf.file_size,
                                                   'resource_type', COALESCE(tf.resource_type, 'document'),
                                                   'external_url', tf.external_url,
                                                   'description', tf.description
                                           ) ORDER BY tf.uploaded_at
                                   )
                            FROM thesis_files tf
                            WHERE tf.thesis_id = t.id
                        ),
                        '[]'::json
                ) as files
            FROM theses t
                     LEFT JOIN users u ON t.supervisor_id = u.id
            WHERE t.status = 'approved'
            ORDER BY t.created_at DESC
        `

        return result as ThesisWithAuthors[]
    }).catch((error: any) => {
        console.error("[v0] Database error in getAllPublishedTheses after retries:", error?.message)
        return []
    })
}

export async function getRecentTheses(limit = 9): Promise<ThesisWithAuthors[]> {
    return executeQueryWithRetry(async () => {
        const result = await sql`
            SELECT
                t.id,
                t.title,
                t.abstract,
                t.department,
                t.field,
                t.year,
                t.submitted_date,
                t.supervisor_id,
                t.status,
                t.views,
                t.downloads,
                t.keywords,
                t.created_at,
                t.updated_at,
                u.full_name as supervisor_name,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', u2.id,
                                                   'full_name', u2.full_name,
                                                   'student_id', u2.student_id,
                                                   'author_order', ta.author_order,
                                                   'profile_pic', u2.profile_pic
                                           ) ORDER BY ta.author_order
                                   )
                            FROM thesis_authors ta
                                     LEFT JOIN users u2 ON ta.author_id = u2.id
                            WHERE ta.thesis_id = t.id
                        ),
                        '[]'::json
                ) as authors,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', tf.id,
                                                   'file_name', tf.file_name,
                                                   'file_url', COALESCE(tf.file_url, ''),
                                                   'file_type', tf.file_type,
                                                   'file_size', tf.file_size,
                                                   'resource_type', COALESCE(tf.resource_type, 'document'),
                                                   'external_url', tf.external_url,
                                                   'description', tf.description
                                           ) ORDER BY tf.uploaded_at
                                   )
                            FROM thesis_files tf
                            WHERE tf.thesis_id = t.id
                        ),
                        '[]'::json
                ) as files
            FROM theses t
                     LEFT JOIN users u ON t.supervisor_id = u.id
            WHERE t.status = 'approved'
            ORDER BY t.created_at DESC
                LIMIT ${limit}
        `

        return result as ThesisWithAuthors[]
    }).catch((error: any) => {
        console.error("[v0] Database error in getRecentTheses after retries:", error?.message)
        return []
    })
}

export async function getThesesByDepartment(department: string): Promise<ThesisWithAuthors[]> {
    return executeQueryWithRetry(async () => {
        const result = await sql`
            SELECT
                t.id,
                t.title,
                t.abstract,
                t.department,
                t.field,
                t.year,
                t.submitted_date,
                t.supervisor_id,
                t.status,
                t.views,
                t.downloads,
                t.keywords,
                t.created_at,
                t.updated_at,
                u.full_name as supervisor_name,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', u2.id,
                                                   'full_name', u2.full_name,
                                                   'student_id', u2.student_id,
                                                   'author_order', ta.author_order,
                                                   'profile_pic', u2.profile_pic
                                           ) ORDER BY ta.author_order
                                   )
                            FROM thesis_authors ta
                                     LEFT JOIN users u2 ON ta.author_id = u2.id
                            WHERE ta.thesis_id = t.id
                        ),
                        '[]'::json
                ) as authors,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', tf.id,
                                                   'file_name', tf.file_name,
                                                   'file_url', COALESCE(tf.file_url, ''),
                                                   'file_type', tf.file_type,
                                                   'file_size', tf.file_size,
                                                   'resource_type', COALESCE(tf.resource_type, 'document'),
                                                   'external_url', tf.external_url,
                                                   'description', tf.description
                                           ) ORDER BY tf.uploaded_at
                                   )
                            FROM thesis_files tf
                            WHERE tf.thesis_id = t.id
                        ),
                        '[]'::json
                ) as files
            FROM theses t
                     LEFT JOIN users u ON t.supervisor_id = u.id
            WHERE t.status = 'approved' AND t.department = ${department}
            ORDER BY t.created_at DESC
        `

        return result as ThesisWithAuthors[]
    }).catch((error: any) => {
        console.error("[v0] Database error in getThesesByDepartment after retries:", error)
        return []
    })
}

export async function searchTheses(query: string): Promise<ThesisWithAuthors[]> {
    return executeQueryWithRetry(async () => {
        const searchTerm = `%${query.toLowerCase()}%`

        const result = await sql`
            SELECT
                t.id,
                t.title,
                t.abstract,
                t.department,
                t.field,
                t.year,
                t.submitted_date,
                t.supervisor_id,
                t.status,
                t.views,
                t.downloads,
                t.keywords,
                t.created_at,
                t.updated_at,
                u.full_name as supervisor_name,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', u2.id,
                                                   'full_name', u2.full_name,
                                                   'student_id', u2.student_id,
                                                   'author_order', ta.author_order,
                                                   'profile_pic', u2.profile_pic
                                           ) ORDER BY ta.author_order
                                   )
                            FROM thesis_authors ta
                                     LEFT JOIN users u2 ON ta.author_id = u2.id
                            WHERE ta.thesis_id = t.id
                        ),
                        '[]'::json
                ) as authors,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', tf.id,
                                                   'file_name', tf.file_name,
                                                   'file_url', COALESCE(tf.file_url, ''),
                                                   'file_type', tf.file_type,
                                                   'file_size', tf.file_size,
                                                   'resource_type', COALESCE(tf.resource_type, 'document'),
                                                   'external_url', tf.external_url,
                                                   'description', tf.description
                                           ) ORDER BY tf.uploaded_at
                                   )
                            FROM thesis_files tf
                            WHERE tf.thesis_id = t.id
                        ),
                        '[]'::json
                ) as files
            FROM theses t
                     LEFT JOIN users u ON t.supervisor_id = u.id
            WHERE t.status = 'approved'
              AND EXISTS (
                SELECT 1 FROM thesis_authors ta
                                  LEFT JOIN users u2 ON ta.author_id = u2.id
                WHERE ta.thesis_id = t.id
                  AND (
                    LOWER(t.title) LIKE ${searchTerm}
                        OR LOWER(t.abstract) LIKE ${searchTerm}
                        OR LOWER(u2.full_name) LIKE ${searchTerm}
                        OR EXISTS (
                        SELECT 1 FROM unnest(t.keywords) keyword
                        WHERE LOWER(keyword) LIKE ${searchTerm}
                    )
                    )
            )
            ORDER BY t.created_at DESC
        `

        return result as ThesisWithAuthors[]
    }).catch((error: any) => {
        console.error("[v0] Database error in searchTheses after retries:", error)
        return []
    })
}

export async function getThesisById(id: number): Promise<ThesisWithAuthors | null> {
    return executeQueryWithRetry(async () => {
        const result = await sql`
            SELECT
                t.id,
                t.title,
                t.abstract,
                t.department,
                t.field,
                t.year,
                t.submitted_date,
                t.supervisor_id,
                t.status,
                t.views,
                t.downloads,
                t.keywords,
                t.created_at,
                t.updated_at,
                u.full_name as supervisor_name,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', u2.id,
                                                   'full_name', u2.full_name,
                                                   'student_id', u2.student_id,
                                                   'author_order', ta.author_order,
                                                   'profile_pic', u2.profile_pic
                                           ) ORDER BY ta.author_order
                                   )
                            FROM thesis_authors ta
                                     LEFT JOIN users u2 ON ta.author_id = u2.id
                            WHERE ta.thesis_id = t.id
                        ),
                        '[]'::json
                ) as authors,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', tf.id,
                                                   'file_name', tf.file_name,
                                                   'file_url', COALESCE(tf.file_url, ''),
                                                   'file_type', tf.file_type,
                                                   'file_size', tf.file_size,
                                                   'resource_type', COALESCE(tf.resource_type, 'document'),
                                                   'external_url', tf.external_url,
                                                   'description', tf.description
                                           ) ORDER BY tf.uploaded_at
                                   )
                            FROM thesis_files tf
                            WHERE tf.thesis_id = t.id
                        ),
                        '[]'::json
                ) as files
            FROM theses t
                     LEFT JOIN users u ON t.supervisor_id = u.id
            WHERE t.id = ${id}
                LIMIT 1
        `

        if (result.length === 0) return null

        return result[0] as ThesisWithAuthors
    }).catch((error: any) => {
        console.error("[v0] Database error in getThesisById after retries:", error)
        return null
    })
}

export async function getThesesByStudentId(studentId: string): Promise<ThesisWithAuthors[]> {
    return executeQueryWithRetry(async () => {
        const result = await sql`
            SELECT
                t.id,
                t.title,
                t.abstract,
                t.department,
                t.field,
                t.year,
                t.submitted_date,
                t.supervisor_id,
                t.status,
                t.views,
                t.downloads,
                t.keywords,
                t.created_at,
                t.updated_at,
                u.full_name as supervisor_name,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', u2.id,
                                                   'full_name', u2.full_name,
                                                   'student_id', u2.student_id,
                                                   'author_order', ta.author_order,
                                                   'profile_pic', u2.profile_pic
                                           ) ORDER BY ta.author_order
                                   )
                            FROM thesis_authors ta
                                     LEFT JOIN users u2 ON ta.author_id = u2.id
                            WHERE ta.thesis_id = t.id
                        ),
                        '[]'::json
                ) as authors,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', tf.id,
                                                   'file_name', tf.file_name,
                                                   'file_url', COALESCE(tf.file_url, ''),
                                                   'file_type', tf.file_type,
                                                   'file_size', tf.file_size,
                                                   'resource_type', COALESCE(tf.resource_type, 'document'),
                                                   'external_url', tf.external_url,
                                                   'description', tf.description
                                           ) ORDER BY tf.uploaded_at
                                   )
                            FROM thesis_files tf
                            WHERE tf.thesis_id = t.id
                        ),
                        '[]'::json
                ) as files
            FROM theses t
                     LEFT JOIN users u ON t.supervisor_id = u.id
                     INNER JOIN thesis_authors ta ON t.id = ta.thesis_id
                     LEFT JOIN users u2 ON ta.author_id = u2.id
            WHERE u2.student_id = ${studentId}
            GROUP BY t.id, t.title, t.abstract, t.department, t.field, t.year, t.submitted_date,
                     t.supervisor_id, t.status, t.views, t.downloads, t.keywords, t.created_at,
                     t.updated_at, u.full_name
            ORDER BY t.created_at DESC
        `

        return result as ThesisWithAuthors[]
    }).catch((error: any) => {
        console.error("[v0] Database error in getThesesByStudentId after retries:", error)
        return []
    })
}

export async function getThesesBySupervisorId(supervisorId: number): Promise<ThesisWithAuthors[]> {
    return executeQueryWithRetry(async () => {
        const result = await sql`
            SELECT
                t.id,
                t.title,
                t.abstract,
                t.department,
                t.field,
                t.year,
                t.submitted_date,
                t.supervisor_id,
                t.status,
                t.views,
                t.downloads,
                t.keywords,
                t.created_at,
                t.updated_at,
                u.full_name as supervisor_name,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', u2.id,
                                                   'full_name', u2.full_name,
                                                   'student_id', u2.student_id,
                                                   'author_order', ta.author_order,
                                                   'profile_pic', u2.profile_pic
                                           ) ORDER BY ta.author_order
                                   )
                            FROM thesis_authors ta
                                     LEFT JOIN users u2 ON ta.author_id = u2.id
                            WHERE ta.thesis_id = t.id
                        ),
                        '[]'::json
                ) as authors,
                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', tf.id,
                                                   'file_name', tf.file_name,
                                                   'file_url', COALESCE(tf.file_url, ''),
                                                   'file_type', tf.file_type,
                                                   'file_size', tf.file_size,
                                                   'resource_type', COALESCE(tf.resource_type, 'document'),
                                                   'external_url', tf.external_url,
                                                   'description', tf.description
                                           ) ORDER BY tf.uploaded_at
                                   )
                            FROM thesis_files tf
                            WHERE tf.thesis_id = t.id
                        ),
                        '[]'::json
                ) as files
            FROM theses t
                     LEFT JOIN users u ON t.supervisor_id = u.id
            WHERE t.supervisor_id = ${supervisorId}
            ORDER BY t.created_at DESC
        `

        return result as ThesisWithAuthors[]
    }).catch((error: any) => {
        console.error("[v0] Database error in getThesesBySupervisorId after retries:", error)
        return []
    })
}
