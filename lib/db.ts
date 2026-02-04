import { neon } from '@neondatabase/serverless'

// Single connection point - change DATABASE_URL to switch databases
const sql = neon(process.env.DATABASE_URL!)

// Database wrapper that provides a query interface
export const db = {
  query: async (queryString: string, params?: any[]) => {
    try {
      // @ts-ignore - The type definition for neon might not expose .query yet, but the runtime requires it for non-tagged usage
      const result = await sql.query(queryString, params)
      return { rows: result, rowCount: result.length }
    } catch (error) {
      console.error("[v0] Database query error:", error)
      throw error
    }
  },
}

export { sql }
