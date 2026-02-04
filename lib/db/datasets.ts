import { db } from "./index"

export interface Dataset {
  id: number
  thesis_id: number
  title: string
  description: string | null
  dataset_type: string
  size_mb: number | null
  file_format: string | null
  records_count: number | null
  download_url: string
  cloudinary_url: string | null
  collection_date: string | null
  last_updated: string | null
  license: string | null
  accessibility_level: string
  keywords: string[] | null
  tags: string[] | null
  views: number
  downloads: number
  status: string
  created_at: string
  updated_at: string
  published_at: string | null
}

export async function getDatasets(filters?: {
  search?: string
  type?: string
  accessibility?: string
  sortBy?: string
  limit?: number
  offset?: number
}): Promise<Dataset[]> {
  try {
    let query = `
      SELECT * FROM datasets 
      WHERE status = 'published'
    `

    const params: any[] = []

    if (filters?.search) {
      query += ` AND (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`
      params.push(`%${filters.search}%`)
    }

    if (filters?.type && filters.type !== "all") {
      query += ` AND dataset_type = $${params.length + 1}`
      params.push(filters.type)
    }

    if (filters?.accessibility && filters.accessibility !== "all") {
      query += ` AND accessibility_level = $${params.length + 1}`
      params.push(filters.accessibility)
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
    console.error("Error fetching datasets:", error)
    throw error
  }
}

export async function getDatasetById(id: number): Promise<Dataset | null> {
  try {
    const query = `
      SELECT * FROM datasets 
      WHERE id = $1 AND status = 'published'
    `
    const result = await db.query(query, [id])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching dataset:", error)
    throw error
  }
}

export async function getDatasetsByThesis(thesisId: number): Promise<Dataset[]> {
  try {
    const query = `
      SELECT * FROM datasets 
      WHERE thesis_id = $1 AND status = 'published'
      ORDER BY created_at DESC
    `
    const result = await db.query(query, [thesisId])
    return result.rows
  } catch (error) {
    console.error("Error fetching thesis datasets:", error)
    throw error
  }
}

export async function incrementDatasetViews(datasetId: number, userId?: number, ipAddress?: string): Promise<void> {
  try {
    // Log view count
    const viewQuery = `
      INSERT INTO view_counts (content_type, content_id, user_id, ip_address)
      VALUES ('dataset', $1, $2, $3)
    `
    await db.query(viewQuery, [datasetId, userId || null, ipAddress || null])

    // Update dataset views counter
    const updateQuery = `
      UPDATE datasets 
      SET views = views + 1
      WHERE id = $1
    `
    await db.query(updateQuery, [datasetId])
  } catch (error) {
    console.error("Error incrementing dataset views:", error)
  }
}

export async function incrementDatasetDownloads(datasetId: number, userId?: number, ipAddress?: string, fileSize?: number): Promise<void> {
  try {
    // Log download count
    const downloadQuery = `
      INSERT INTO download_counts (content_type, content_id, user_id, ip_address, file_size_bytes)
      VALUES ('dataset', $1, $2, $3, $4)
    `
    await db.query(downloadQuery, [datasetId, userId || null, ipAddress || null, fileSize || null])

    // Update dataset downloads counter
    const updateQuery = `
      UPDATE datasets 
      SET downloads = downloads + 1
      WHERE id = $1
    `
    await db.query(updateQuery, [datasetId])
  } catch (error) {
    console.error("Error incrementing dataset downloads:", error)
  }
}

export async function searchDatasets(query: string, limit: number = 10): Promise<Dataset[]> {
  try {
    const searchQuery = `
      SELECT * FROM datasets 
      WHERE status = 'published' 
      AND (title ILIKE $1 OR description ILIKE $1 OR keywords @> ARRAY[$2])
      ORDER BY (views + downloads * 2) DESC
      LIMIT $3
    `
    const result = await db.query(searchQuery, [`%${query}%`, query, limit])
    return result.rows
  } catch (error) {
    console.error("Error searching datasets:", error)
    throw error
  }
}

export async function getDatasetStats(datasetId: number): Promise<{
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
        (SELECT COUNT(DISTINCT user_id) FROM view_counts WHERE content_type = 'dataset' AND content_id = $1) as unique_viewers,
        (SELECT COUNT(DISTINCT user_id) FROM download_counts WHERE content_type = 'dataset' AND content_id = $1) as unique_downloaders
      FROM datasets
      WHERE id = $1
    `
    const result = await db.query(query, [datasetId])
    return result.rows[0] || { views: 0, downloads: 0, unique_viewers: 0, unique_downloaders: 0 }
  } catch (error) {
    console.error("Error fetching dataset stats:", error)
    throw error
  }
}
