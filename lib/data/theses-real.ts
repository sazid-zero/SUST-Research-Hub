import { cache } from "react"
import { getAllPublishedTheses, getRecentTheses } from "@/lib/db/theses"
import type { Thesis } from "./theses"

export const getPublishedThesesForDisplay = cache(async (): Promise<Thesis[]> => {
  try {
    const theses = await getAllPublishedTheses()

    return theses.map((thesis) => ({
      id: thesis.id,
      title: thesis.title,
      author: thesis.authors[0]?.full_name || "Unknown",
      authorId: thesis.authors[0]?.student_id || "",
      authors: thesis.authors,
      department: thesis.department,
      supervisor: thesis.supervisor_name,
      supervisorUsername: thesis.supervisor_name, // Using name as fallback since username doesn't exist
      year: thesis.year,
      submitted: thesis.submitted_date,
      status: thesis.status as "approved" | "pending" | "rejected" | "in-review",
      abstract: thesis.abstract,
      keywords: thesis.keywords || [],
      views: thesis.views,
      downloads: thesis.downloads,
      files: thesis.files.map((f) => ({
        name: f.file_name,
        size: `${(f.file_size / 1024 / 1024).toFixed(1)} MB`,
        type: f.file_type,
      })),
    }))
  } catch (error) {
    console.error("[v0] Error fetching all published theses:", error)
    // Return empty array instead of throwing to prevent page crash
    return []
  }
})

export const getRecentThesesForDisplay = cache(async (limit = 9): Promise<Thesis[]> => {
  try {
    const theses = await getRecentTheses(limit)

    return theses.map((thesis) => ({
      id: thesis.id,
      title: thesis.title,
      author: thesis.authors[0]?.full_name || "Unknown",
      authorId: thesis.authors[0]?.student_id || "",
      authors: thesis.authors,
      department: thesis.department,
      supervisor: thesis.supervisor_name,
      supervisorUsername: thesis.supervisor_name, // Using name as fallback since username doesn't exist
      year: thesis.year,
      submitted: thesis.submitted_date,
      status: thesis.status as "approved" | "pending" | "rejected" | "in-review",
      abstract: thesis.abstract,
      keywords: thesis.keywords || [],
      views: thesis.views,
      downloads: thesis.downloads,
      files: thesis.files.map((f) => ({
        name: f.file_name,
        size: `${(f.file_size / 1024 / 1024).toFixed(1)} MB`,
        type: f.file_type,
      })),
    }))
  } catch (error) {
    console.error("[v0] Error fetching recent theses:", error)
    // Return empty array instead of throwing to prevent page crash
    return []
  }
})
