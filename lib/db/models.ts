import { db } from "./index"

export interface Model {
  id: number
  thesis_id: number
  title: string
  description: string | null
  model_type: string
  framework: string | null
  programming_language: string | null
  model_size_mb: number | null
  accuracy: number | null
  trained_on_dataset_id: number | null
  download_url: string
  cloudinary_url: string | null
  documentation_url: string | null
  version: string | null
  release_date: string | null
  license: string | null
  hyperparameters: any | null
  training_config: any | null
  keywords: string[] | null
  tags: string[] | null
  views: number
  downloads: number
  status: string
  created_at: string
  updated_at: string
  published_at: string | null
}

export async function getModels(filters?: {
  search?: string
  type?: string
  framework?: string
  sortBy?: string
  limit?: number
  offset?: number
}): Promise<Model[]> {
  try {
    let query = `
      SELECT * FROM models 
      WHERE status = 'published'
    `

    const params: any[] = []

    if (filters?.search) {
      query += ` AND (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`
      params.push(`%${filters.search}%`)
    }

    if (filters?.type && filters.type !== "all") {
      query += ` AND model_type = $${params.length + 1}`
      params.push(filters.type)
    }

    if (filters?.framework && filters.framework !== "all") {
      query += ` AND framework = $${params.length + 1}`
      params.push(filters.framework)
    }

    // Sorting
    switch (filters?.sortBy) {
      case "trending":
        query += ` ORDER BY (views + downloads * 2) DESC`
        break
      case "most_viewed":
        query += ` ORDER BY views DESC`
        break
      case "most_downloaded":
        query += ` ORDER BY downloads DESC`
        break
      case "newest":
        query += ` ORDER BY created_at DESC`
        break
      case "oldest":
        query += ` ORDER BY created_at ASC`
        break
      case "most_accurate":
        query += ` ORDER BY accuracy DESC NULLS LAST`
        break
      default:
        query += ` ORDER BY (views + downloads * 2) DESC`
    }

    // Pagination
    const limit = filters?.limit || 20
    const offset = filters?.offset || 0
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await db.query(query, params)
    return result.rows
  } catch (error) {
    console.error("Error fetching models:", error)
    throw error
  }
}

export async function getModelById(id: number): Promise<Model | null> {
  try {
    const query = `
      SELECT * FROM models 
      WHERE id = $1 AND status = 'published'
    `
    const result = await db.query(query, [id])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching model:", error)
    throw error
  }
}

export async function getModelsByThesis(thesisId: number): Promise<Model[]> {
  try {
    const query = `
      SELECT * FROM models 
      WHERE thesis_id = $1 AND status = 'published'
      ORDER BY created_at DESC
    `
    const result = await db.query(query, [thesisId])
    return result.rows
  } catch (error) {
    console.error("Error fetching thesis models:", error)
    throw error
  }
}

export async function incrementModelViews(modelId: number, userId?: number, ipAddress?: string): Promise<void> {
  try {
    // Log view count
    const viewQuery = `
      INSERT INTO view_counts (content_type, content_id, user_id, ip_address)
      VALUES ('model', $1, $2, $3)
    `
    await db.query(viewQuery, [modelId, userId || null, ipAddress || null])

    // Update model views counter
    const updateQuery = `
      UPDATE models 
      SET views = views + 1
      WHERE id = $1
    `
    await db.query(updateQuery, [modelId])
  } catch (error) {
    console.error("Error incrementing model views:", error)
  }
}

export async function incrementModelDownloads(modelId: number, userId?: number, ipAddress?: string, fileSize?: number): Promise<void> {
  try {
    // Log download count
    const downloadQuery = `
      INSERT INTO download_counts (content_type, content_id, user_id, ip_address, file_size_bytes)
      VALUES ('model', $1, $2, $3, $4)
    `
    await db.query(downloadQuery, [modelId, userId || null, ipAddress || null, fileSize || null])

    // Update model downloads counter
    const updateQuery = `
      UPDATE models 
      SET downloads = downloads + 1
      WHERE id = $1
    `
    await db.query(updateQuery, [modelId])
  } catch (error) {
    console.error("Error incrementing model downloads:", error)
  }
}

export async function searchModels(query: string, limit: number = 10): Promise<Model[]> {
  try {
    const searchQuery = `
      SELECT * FROM models 
      WHERE status = 'published' 
      AND (title ILIKE $1 OR description ILIKE $1 OR keywords @> ARRAY[$2])
      ORDER BY (views + downloads * 2) DESC
      LIMIT $3
    `
    const result = await db.query(searchQuery, [`%${query}%`, query, limit])
    return result.rows
  } catch (error) {
    console.error("Error searching models:", error)
    throw error
  }
}

export async function getModelStats(modelId: number): Promise<{
  views: number
  downloads: number
  unique_viewers: number
  unique_downloaders: number
}> {
  try {
    const query = `
      SELECT 
        views as views,
        downloads as downloads,
        (SELECT COUNT(DISTINCT user_id) FROM view_counts WHERE content_type = 'model' AND content_id = $1) as unique_viewers,
        (SELECT COUNT(DISTINCT user_id) FROM download_counts WHERE content_type = 'model' AND content_id = $1) as unique_downloaders
      FROM models
      WHERE id = $1
    `
    const result = await db.query(query, [modelId])
    return result.rows[0] || { views: 0, downloads: 0, unique_viewers: 0, unique_downloaders: 0 }
  } catch (error) {
    console.error("Error fetching model stats:", error)
    throw error
  }
}
