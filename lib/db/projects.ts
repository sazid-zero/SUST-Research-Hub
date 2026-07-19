
import { db, sql } from "./index"
import { Dataset } from "./datasets"
import { Model } from "./models"
import { Publication } from "./publications"
import { ThesisWithAuthors } from "./theses"

export interface Project {
  id: number
  title: string
  description: string | null
  status: string
  department: string | null
  field: string | null
  start_date: string | null
  end_date: string | null
  funding_amount: number | null
  funding_source: string | null
  objectives: string[]
  created_at: string
  updated_at: string
  supervisor_name?: string
  
  // Relations (populated via joins/subqueries)
  team: ProjectMember[]
  theses: ThesisWithAuthors[]
  publications: Publication[]
  datasets: Dataset[]
  models: Model[]
  files: any[]
  resource_links?: Array<{
    id: number
    title: string
    url: string
    category: string
  }>
  keywords?: string[]
  collaborations?: string[] // Derived or stored in JSON
  views?: number // Need to add views column to projects if tracking
}

export interface ProjectMember {
  id: number // member record id
  user_id: number
  project_id: number
  role: string
  joined_at: string
  full_name: string
  profile_pic?: string
}

export async function getProjectById(id: number): Promise<Project | null> {
  try {
    // 1. Fetch Core Project Data with supervisor info if applicable
    const projectResult = await sql`
      SELECT p.*, COALESCE(u.full_name, p.ghost_supervisor) as supervisor_name
      FROM projects p
      LEFT JOIN users u ON p.supervisor_id = u.id
      WHERE p.id = ${id}
    `
    if (projectResult.length === 0) return null
    const project = projectResult[0] as any

    // 2. Fetch Team Members (including ghost members with no user_id)
    await sql`ALTER TABLE project_members ADD COLUMN IF NOT EXISTS member_name TEXT`
    const teamResult = await sql`
      SELECT pm.*, 
        COALESCE(u.full_name, pm.member_name, 'Unknown Member') as full_name, 
        u.profile_pic, u.student_id, u.email
      FROM project_members pm
      LEFT JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ${id}
      ORDER BY pm.joined_at ASC
    `
    
    // 3. Fetch Related Theses
    const thesesResult = await sql`
        SELECT t.*, COALESCE(u.full_name, t.ghost_supervisor) as supervisor_name
        FROM theses t
        LEFT JOIN users u ON t.supervisor_id = u.id
        WHERE t.project_id = ${id}
        ORDER BY t.created_at DESC
    `

    // 4. Fetch Publications
    const publicationsResult = await sql`
        SELECT p.*
        FROM publications p
        WHERE p.project_id = ${id}
        ORDER BY p.published_date DESC
    `

    // 5. Fetch Datasets
    const datasetsResult = await sql`
        SELECT d.id, d.title as name, d.download_url as external_url
        FROM datasets d
        WHERE d.workspace_id = ${id} AND d.workspace_type = 'project'
        ORDER BY d.created_at DESC
    `

    // 6. Fetch Models
    const modelsResult = await sql`
        SELECT m.id, m.title as name, m.description, m.model_url as external_url, m.download_url as file_url, m.framework
        FROM models m
        WHERE m.workspace_id = ${id} AND m.workspace_type = 'project'
        ORDER BY m.created_at DESC
    `

    // 7. Fetch Project Files
    const filesResult = await sql`
        SELECT * FROM project_files
        WHERE project_id = ${id}
        ORDER BY uploaded_at DESC
    `

    // Fetch resource links
    const linksResult = await sql`
        SELECT id, title, url, category FROM resource_links
        WHERE workspace_id = ${id} AND workspace_type = 'project'
        ORDER BY created_at DESC
    `

    return {
      ...project,
      team: teamResult as ProjectMember[],
      theses: thesesResult as any[],
      publications: publicationsResult as any[],
      datasets: datasetsResult as any[],
      models: modelsResult as any[],
      files: filesResult as any[],
      resource_links: linksResult as any[],
      objectives: project.objectives || [],
      keywords: project.keywords || [],
      views: project.views || 0,
      collaborations: project.collaborations || []
    } as Project
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export async function getAllProjects(): Promise<Project[]> {
    try {
        const result = await sql`
            SELECT p.*, COALESCE(u.full_name, p.ghost_supervisor) as supervisor_name 
            FROM projects p 
            LEFT JOIN users u ON p.supervisor_id = u.id 
            WHERE p.status = 'approved' 
            ORDER BY p.created_at DESC
        `;
        return result.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            supervisor_name: p.supervisor_name,
            status: p.status,
            department: p.department,
            field: p.field,
            start_date: p.start_date,
            end_date: p.end_date,
            funding_amount: p.funding_amount,
            funding_source: p.funding_source,
            objectives: p.objectives || [],
            keywords: p.keywords || [],
            views: p.views || 0,
            created_at: p.created_at,
            updated_at: p.updated_at,
            team: [], // TODO: Fetch team
            theses: [], // TODO: Fetch linked theses
            publications: [], // TODO: Fetch linked publications
            datasets: [], // TODO: Fetch linked datasets
            models: [], // TODO: Fetch linked models
            files: [], // TODO: Fetch files
        })) as Project[]

    } catch (error) {
        console.error("Error fetching all projects:", error)
        return []
    }
}

export async function getUserProjects(userId: number): Promise<Project[]> {
    try {
        const result = await sql`
            SELECT p.* 
            FROM projects p
            JOIN project_members pm ON p.id = pm.project_id
            WHERE pm.user_id = ${userId}
            ORDER BY p.created_at DESC
        `
        return result.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            status: p.status,
            department: p.department,
            field: p.field,
            start_date: p.start_date,
            end_date: p.end_date,
            funding_amount: p.funding_amount,
            funding_source: p.funding_source,
            objectives: p.objectives || [],
            created_at: p.created_at,
            updated_at: p.updated_at,
            team: [], 
            theses: [],
            publications: [], 
            datasets: [],
            models: [],
            files: [],
        })) as Project[]
    } catch (error) {
        console.error("Error fetching user projects:", error)
        return []
    }
}
