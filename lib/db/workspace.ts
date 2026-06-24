
import { db, sql } from "./index"
import { getProjectById, Project } from "./projects"
import { getThesisById, ThesisWithAuthors } from "./theses"
import { getPublicationById, Publication } from "./publications"
import { Model } from "./models"
import { Dataset } from "./datasets"

export type WorkspaceType = "thesis" | "project" | "publication"

export interface WorkspaceMember {
  user_id: number
  full_name: string
  role: string // 'leader', 'member', 'supervisor'
  status?: string // 'active', 'invited', 'pending'
  profile_pic?: string
  email?: string
}

export interface WorkspaceData {
  type: WorkspaceType
  id: number
  title: string
  description: string | null
  status: string
  department: string | null
  field: string | null
  created_at: string
  updated_at: string
  
  // Unified Members (Leader, Members, Supervisors)
  members: WorkspaceMember[]
  
  // Assets
  publications: Publication[] // Linked publications
  models: Model[]
  datasets: Dataset[]
  files: any[] // content files (code, docs)
  
  // Specifics
  thesis?: ThesisWithAuthors
  project?: Project
  publication?: Publication
  
  keywords: string[]
  paper_subtype?: string // journal, conference
}

export async function getWorkspace(type: WorkspaceType, id: number): Promise<WorkspaceData | null> {
  try {
    if (type === "project") {
      const project = await getProjectById(id)
      if (!project) return null
      
      return {
        type: "project",
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        department: project.department,
        field: project.field,
        created_at: project.created_at,
        updated_at: project.updated_at,
        members: project.team.map(m => ({
            user_id: m.user_id,
            full_name: m.full_name,
            role: m.role,
            status: "active", // Projects typically implicit active for now
            profile_pic: m.profile_pic
        })),
        publications: project.publications,
        models: project.models,
        datasets: project.datasets,
        files: project.files || [],
        project: project,
        keywords: project.keywords || []
      }
    } else if (type === "publication") {
        const pub = await getPublicationById(id)
        if (!pub) return null

        // Get accepted authors
        const acceptedMembers = (pub.authors || []).map(a => ({
            user_id: a.user_id || 0, 
            full_name: a.author_name,
            role: a.corresponding_author ? 'leader' : 'member',
            status: 'active' as const,
            profile_pic: a.profile_pic
        }))

        // Get pending coauthor requests
        const pendingRequests = await sql`
            SELECT cr.*, u.full_name, u.profile_pic
            FROM coauthor_requests cr
            JOIN users u ON cr.invited_user_id = u.id
            WHERE cr.publication_id = ${id} AND cr.status = 'pending'
        `
        
        const pendingMembers = pendingRequests.map((req: any) => ({
            user_id: req.invited_user_id,
            full_name: req.full_name,
            role: 'member',
            status: 'invited' as const,
            profile_pic: req.profile_pic
        }))

        return {
            type: "publication",
            id: pub.id,
            title: pub.title,
            description: pub.abstract || null,
            status: pub.status,
            department: null, 
            field: null,
            created_at: pub.created_at,
            updated_at: pub.updated_at,
            members: [...acceptedMembers, ...pendingMembers],
            publications: [], 
            models: [], 
            datasets: [], 
            files: (pub.files || []).map(f => ({
                id: f.id,
                file_name: f.file_name,
                file_url: f.file_url,
                file_size: f.file_size,
                file_type: f.resource_type, 
                uploaded_at: f.uploaded_at,
                file_path: f.file_name 
            })), 
            publication: pub,
            keywords: pub.keywords || [],
            paper_subtype: pub.paper_subtype
        }

    } else {
      // Thesis
      const thesis = await getThesisById(id)
      if (!thesis) return null

      // Fetch Team Members specifically for Thesis Workspace
      const teamQuery = await sql`
        SELECT tm.*, u.full_name, u.email, u.profile_pic
        FROM team_members tm
        JOIN users u ON tm.user_id = u.id
        WHERE tm.thesis_id = ${id}
      `
      
      let members: WorkspaceMember[] = teamQuery.map((row: any) => ({
          user_id: row.user_id,
          full_name: row.full_name,
          role: row.role,
          status: row.status,
          profile_pic: row.profile_pic,
          email: row.email
      }))

      if (members.length === 0 && thesis.authors) {
          members = thesis.authors.map(a => ({
              user_id: a.id, 
              full_name: a.full_name,
              role: a.author_order === 1 ? 'leader' : 'member',
              status: 'active',
          }))
      }
      
      // Add Supervisor from theses table if not already in team_members
      if (thesis.supervisor_name && thesis.supervisor_id) {
          const alreadyInMembers = members.some(m => m.user_id === thesis.supervisor_id)
          if (!alreadyInMembers) {
             members.push({
                 user_id: thesis.supervisor_id,
                 full_name: thesis.supervisor_name,
                 role: 'supervisor',
                 status: 'active'
             })
          }
      }

      return {
        type: "thesis",
        id: thesis.id,
        title: thesis.title,
        description: thesis.abstract,
        status: thesis.status,
        department: thesis.department,
        field: thesis.field,
        created_at: thesis.created_at,
        updated_at: thesis.updated_at,
        members,
        publications: [], 
        models: [], 
        datasets: [], 
        files: thesis.files || [],
        thesis: thesis,
        keywords: thesis.keywords || []
      }
    }
  } catch (error) {
    console.error("Error fetching workspace:", error)
    return null
  }
}

export async function getUserWorkspaces(userId: number): Promise<WorkspaceData[]> {
    try {
        const theses = await sql`
            SELECT t.id FROM theses t
            JOIN thesis_authors ta ON t.id = ta.thesis_id
            WHERE ta.author_id = ${userId}
            UNION
            SELECT t.id FROM theses t
            WHERE t.supervisor_id = ${userId}
        `
        
        const projects = await sql`
            SELECT p.id FROM projects p
            JOIN project_members pm ON p.id = pm.project_id
            WHERE pm.user_id = ${userId}
        `
        
        const publications = await sql`
            SELECT p.id FROM publications p
            JOIN publication_authors pa ON p.id = pa.publication_id
            LEFT JOIN users u ON LOWER(TRIM(pa.author_name)) = LOWER(TRIM(u.full_name))
            WHERE pa.user_id = ${userId} OR u.id = ${userId}
            GROUP BY p.id
        `
        
        const results: WorkspaceData[] = []
        
        for (const t of theses) {
            const data = await getWorkspace("thesis", t.id)
            if (data) results.push(data)
        }
        
        for (const p of projects) {
            const data = await getWorkspace("project", p.id)
            if (data) results.push(data)
        }
        
        for (const pub of publications) {
            const data = await getWorkspace("publication", pub.id)
            if (data) results.push(data)
        }
        
        return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } catch (error) {
        console.error("Error fetching user workspaces:", error)
        return []
    }
}
