// This file now only contains the interface and helper functions
// All mock data has been removed - data now comes from the database via lib/db/theses.ts

import { cache } from "react"
import { getAllPublishedTheses, getThesisById as getThesisFromDB } from "@/lib/db/theses"

export interface Thesis {
  id: number
  title: string
  author: string
  authorId: string
  authors?: Array<{
    id: number
    full_name: string
    student_id: string
    author_order: number
  }>
  department: string
  supervisor: string
  supervisorUsername?: string
  year: number
  submitted: string
  status: "approved" | "pending" | "rejected" | "in-review"
  abstract: string
  keywords: string[]
  views: number
  downloads: number
  files: {
    name: string
    size: string
    type: string
  }[]
}

// Helper function to format files for display
export function formatThesisFiles(files: any[]): Thesis["files"] {
  return files.map((file) => ({
    name: file.file_name,
    size: formatFileSize(file.file_size),
    type: file.file_type,
  }))
}

// Helper to format file sizes
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

export const getAllTheses = cache(async (): Promise<Thesis[]> => {
  try {
    const dbTheses = await getAllPublishedTheses()
    return dbTheses.map((thesis) => formatThesisForDisplay(thesis))
  } catch (error) {
    console.error("[v0] Error fetching all theses:", error)
    return []
  }
})

export async function getThesisById(id: number): Promise<Thesis | null> {
  try {
    const dbThesis = await getThesisFromDB(id)
    if (!dbThesis) return null
    return formatThesisForDisplay(dbThesis)
  } catch (error) {
    console.error("[v0] Error fetching thesis by ID:", error)
    return null
  }
}

export async function getThesesDatabase(): Promise<Thesis[]> {
  return getAllTheses()
}

// For backward compatibility with components importing thesesDatabase
// This is a placeholder - actual data should be fetched server-side
export const thesesDatabase: Thesis[] = []

// Helper function to convert database thesis format to UI format
function formatThesisForDisplay(thesis: any): Thesis {
  return {
    id: thesis.id,
    title: thesis.title,
    author: thesis.authors?.[0]?.full_name || "Unknown",
    authorId: thesis.authors?.[0]?.student_id || "",
    authors: thesis.authors,
    department: thesis.department,
    supervisor: thesis.supervisor_name,
    supervisorUsername: thesis.supervisor_username,
    year: new Date(thesis.created_at).getFullYear(),
    submitted: thesis.created_at,
    status: thesis.status as "approved" | "pending" | "rejected" | "in-review",
    abstract: thesis.abstract,
    keywords: thesis.keywords || [],
    views: thesis.views,
    downloads: thesis.downloads,
    files: thesis.files.map((f: any) => ({
      name: f.file_name,
      size: `${(f.file_size / 1024 / 1024).toFixed(1)} MB`,
      type: f.file_type,
    })),
  }
}
