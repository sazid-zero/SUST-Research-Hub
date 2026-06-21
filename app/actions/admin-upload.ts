"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import fs from "fs"
import path from "path"

interface AuthorInput {
    name: string
    userId: number | null
    regNo: string | null
}

/**
 * Server action for admins to upload legacy theses, publications, or projects
 * with a hybrid author assignment (registered users + ghost authors).
 */
export async function uploadLegacyWorkspace(formData: FormData) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
        return { success: false, message: "Unauthorized. Admin access required." }
    }

    const type = formData.get("type") as string
    const title = formData.get("title") as string
    const abstract = formData.get("abstract") as string || ""
    const department = formData.get("department") as string || ""
    const field = formData.get("field") as string || ""
    const year = parseInt(formData.get("year") as string) || new Date().getFullYear()
    const status = formData.get("status") as string || "approved"
    const keywordsRaw = formData.get("keywords") as string || ""
    const keywords = keywordsRaw ? keywordsRaw.split(',').map(k => k.trim()).filter(Boolean) : []
    
    const supervisorInput = formData.get("supervisor") as string
    let supervisorId: number | null = null
    let ghostSupervisorName: string | null = null
    
    if (supervisorInput) {
        const match = supervisorInput.match(/\(ID:\s*(\d+)\)$/i)
        if (match) {
            supervisorId = parseInt(match[1])
        } else if (!isNaN(Number(supervisorInput))) {
            supervisorId = parseInt(supervisorInput)
        } else {
            ghostSupervisorName = supervisorInput.trim()
        }
    }

    const linkedPublicationId = formData.get("linkedPublicationId") ? parseInt(formData.get("linkedPublicationId") as string) : null
    const resourcesRaw = formData.get("resources") as string || "[]"
    const authorsRaw = formData.get("authors") as string
    
    // Files & Links
    const documentFile = formData.get("documentFile") as File | null
    const paperFile = formData.get("paperFile") as File | null
    const codeUrl = formData.get("codeUrl") as string || ""
    const codeTitle = formData.get("codeTitle") as string || "Source Code"
    
    const datasetUrl = formData.get("datasetUrl") as string || ""
    const datasetTitle = formData.get("datasetTitle") as string || "Legacy Dataset"
    const datasetDescription = formData.get("datasetDescription") as string || ""
    const datasetType = formData.get("datasetType") as string || "tabular"
    const datasetSize = formData.get("datasetSize") as string || ""
    const datasetTagsStr = formData.get("datasetTags") as string || ""
    
    const modelUrl = formData.get("modelUrl") as string || ""
    const modelTitle = formData.get("modelTitle") as string || "Legacy Model"
    const modelDescription = formData.get("modelDescription") as string || ""
    const modelType = formData.get("modelType") as string || "neural-network"
    const modelFramework = formData.get("modelFramework") as string || "other"
    const modelAccuracyStr = formData.get("modelAccuracy") as string || ""
    const modelTagsStr = formData.get("modelTags") as string || ""
    
    if (!title || !type) {
        return { success: false, message: "Title and type are required." }
    }

    let authors: AuthorInput[] = []
    let resources: any[] = []
    try {
        authors = JSON.parse(authorsRaw)
        resources = JSON.parse(resourcesRaw)
    } catch {
        return { success: false, message: "Invalid JSON data." }
    }

    if (authors.length === 0) {
        return { success: false, message: "At least one author is required." }
    }

    try {
        let workspaceId: number

        if (type === "thesis") {
            // Find supervisor from authors list if not explicitly provided
            let finalSupervisorId = supervisorId
            let finalGhostSupervisor = ghostSupervisorName

            if (!finalSupervisorId && !finalGhostSupervisor) {
                for (const author of authors) {
                    if (author.userId) {
                        const userCheck = await sql`SELECT role FROM users WHERE id = ${author.userId}`
                        if (userCheck.length > 0 && userCheck[0].role === 'supervisor') {
                            finalSupervisorId = author.userId
                            break
                        }
                    }
                }
            }

            const result = await sql`
                INSERT INTO theses (
                    title, abstract, department, field,
                    year, submitted_date,
                    status, supervisor_id, ghost_supervisor, keywords, created_at, updated_at
                )
                VALUES (
                    ${title}, ${abstract}, ${department}, ${field},
                    ${year}, CURRENT_DATE,
                    ${status}, ${finalSupervisorId}, ${finalGhostSupervisor}, ${keywords}, NOW(), NOW()
                )
                RETURNING id
            `
            workspaceId = result[0].id

            // Add authors as team_members + thesis_authors
            let authorOrder = 1
            for (const author of authors) {
                if (author.userId) {
                    // Registered user: link directly
                    const userCheck = await sql`SELECT role FROM users WHERE id = ${author.userId}`
                    const role = userCheck[0]?.role === 'supervisor' ? 'supervisor' : (authorOrder === 1 ? 'leader' : 'member')
                    
                    await sql`
                        INSERT INTO team_members (thesis_id, user_id, role, status, joined_at)
                        VALUES (${workspaceId}, ${author.userId}, ${role}, 'active', NOW())
                        ON CONFLICT (thesis_id, user_id) DO NOTHING
                    `
                    await sql`
                        INSERT INTO thesis_authors (thesis_id, author_id, author_name, author_order)
                        VALUES (${workspaceId}, ${author.userId}, ${author.name}, ${authorOrder})
                        ON CONFLICT DO NOTHING
                    `
                } else {
                    // Ghost author
                    const finalName = author.regNo ? `${author.name} (Reg: ${author.regNo})` : author.name
                    await sql`
                        INSERT INTO thesis_authors (thesis_id, author_id, author_name, author_order)
                        VALUES (${workspaceId}, NULL, ${finalName}, ${authorOrder})
                        ON CONFLICT DO NOTHING
                    `
                }
                // Ghost authors are stored via the thesis_authors name and can be tracked
                // through the authorship_claims system when they register later
                authorOrder++
            }

            // Link publication if provided
            if (linkedPublicationId) {
                await sql`UPDATE publications SET thesis_id = ${workspaceId} WHERE id = ${linkedPublicationId}`
            }

        } else if (type === "publication") {
            const doi = formData.get("doi") as string || null
            const journalName = formData.get("journal_name") as string || "TBD"

            const result = await sql`
                INSERT INTO publications (
                    title, abstract, journal_name, publication_type, 
                    doi, year, keywords, status, created_at, updated_at
                )
                VALUES (
                    ${title}, ${abstract}, ${journalName}, 'journal',
                    ${doi}, ${year}, ${keywords}, ${status === 'approved' ? 'published' : status}, NOW(), NOW()
                )
                RETURNING id
            `
            workspaceId = result[0].id

            // Add authors as publication_authors
            let authorOrder = 1
            for (const author of authors) {
                await sql`
                    INSERT INTO publication_authors (
                        publication_id, author_name, author_order, 
                        corresponding_author, user_id
                    )
                    VALUES (
                        ${workspaceId}, ${author.name}, ${authorOrder},
                        ${authorOrder === 1}, ${author.userId}
                    )
                `
                authorOrder++
            }

        } else if (type === "project") {
            const fundingAmount = formData.get("funding") ? parseInt(formData.get("funding") as string) : null
            const startDate = formData.get("startDate") as string || null
            
            const result = await sql`
                INSERT INTO projects (
                    title, description, department, field,
                    funding_amount, start_date, supervisor_id, ghost_supervisor,
                    keywords, status, created_at, updated_at
                )
                VALUES (
                    ${title}, ${abstract}, ${department}, ${field},
                    ${fundingAmount}, ${startDate}, ${supervisorId}, ${ghostSupervisorName},
                    ${keywords}, ${status}, NOW(), NOW()
                )
                RETURNING id
            `
            workspaceId = result[0].id

            // Add authors as project_members
            let memberOrder = 1
            for (const author of authors) {
                if (author.userId) {
                    const userCheck = await sql`SELECT role FROM users WHERE id = ${author.userId}`
                    const role = userCheck[0]?.role === 'supervisor' ? 'supervisor' : (memberOrder === 1 ? 'leader' : 'member')
                    
                    await sql`
                        INSERT INTO project_members (project_id, user_id, role, joined_at)
                        VALUES (${workspaceId}, ${author.userId}, ${role}, NOW())
                        ON CONFLICT (project_id, user_id) DO NOTHING
                    `
                }
                memberOrder++
            }

            // Link publication if provided
            if (linkedPublicationId) {
                await sql`UPDATE publications SET project_id = ${workspaceId} WHERE id = ${linkedPublicationId}`
            }

        } else {
            return { success: false, message: "Invalid workspace type." }
        }

        // Helper to save physical files
        const savePhysicalFile = async (file: File, subFolder: string = "") => {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const uploadDir = path.join(process.cwd(), "public", "uploads", type, workspaceId.toString(), subFolder)
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true })
            }
            const filePath = path.join(uploadDir, file.name)
            fs.writeFileSync(filePath, buffer)
            return `/uploads/${type}/${workspaceId}${subFolder ? '/' + subFolder : ''}/${file.name}`
        }

        // Handle File Uploads (Document)
        if (type === "thesis" || type === "project") {
            if (documentFile) {
                const url = await savePhysicalFile(documentFile)
                if (type === "thesis") {
                    await sql`INSERT INTO thesis_files (thesis_id, file_name, file_url, file_type, file_size, resource_type, uploaded_at) VALUES (${workspaceId}, ${documentFile.name}, ${url}, 'pdf', ${documentFile.size}, 'document', NOW())`
                } else {
                    await sql`INSERT INTO project_files (project_id, file_name, file_url, file_type, file_size, resource_type, uploaded_at) VALUES (${workspaceId}, ${documentFile.name}, ${url}, 'pdf', ${documentFile.size}, 'document', NOW())`
                }
            }
            if (codeUrl) {
                await sql`INSERT INTO resource_links (workspace_type, workspace_id, title, url, category, created_at) VALUES (${type}, ${workspaceId}, ${codeTitle}, ${codeUrl}, 'code', NOW())`
            }
            if (datasetUrl) {
                const dTags = datasetTagsStr ? datasetTagsStr.split(',').map(t => t.trim()) : []
                await sql`INSERT INTO datasets (workspace_id, workspace_type, title, description, type, size, location, tags, download_url, created_at, updated_at) VALUES (${workspaceId}, ${type}, ${datasetTitle}, ${datasetDescription}, ${datasetType}, ${datasetSize}, ${datasetUrl}, ${dTags}, ${datasetUrl}, NOW(), NOW())`
            }
            if (modelUrl) {
                const tags = modelTagsStr ? modelTagsStr.split(',').map(t => t.trim()) : []
                const accuracy = modelAccuracyStr ? parseFloat(modelAccuracyStr) : null
                
                await sql`
                    INSERT INTO models (
                        workspace_id, workspace_type, title, description, 
                        accuracy, framework, tags, model_type, download_url, created_at, updated_at
                    ) VALUES (
                        ${workspaceId}, ${type}, ${modelTitle}, ${modelDescription}, 
                        ${accuracy}, ${modelFramework}, ${tags}, ${modelType}, ${modelUrl}, NOW(), NOW()
                    )
                `
            }
        }

        // Handle Publication PDF
        if (type === "publication" && paperFile) {
            const url = await savePhysicalFile(paperFile)
            await sql`INSERT INTO publication_files (publication_id, file_name, file_url, file_type, file_size, resource_type, uploaded_at) VALUES (${workspaceId}, ${paperFile.name}, ${url}, 'pdf', ${paperFile.size}, 'paper', NOW())`
            await sql`UPDATE publications SET pdf_url = ${url} WHERE id = ${workspaceId}`
        }

        // Handle resource links
        if (resources.length > 0) {
            for (const res of resources) {
                if (res.title && res.url) {
                    await sql`
                        INSERT INTO resource_links (workspace_type, workspace_id, title, url, category, created_at)
                        VALUES (${type}, ${workspaceId}, ${res.title}, ${res.url}, ${res.category || 'document'}, NOW())
                    `
                }
            }
        }

        revalidatePath("/admin/theses")
        revalidatePath("/admin/upload")
        revalidatePath("/")

        return { 
            success: true, 
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} "${title}" imported successfully with ${authors.length} author(s).`
        }

    } catch (error: any) {
        console.error("Admin upload error:", error)
        return { success: false, message: `Database error: ${error.message || "Failed to import record."}` }
    }
}
