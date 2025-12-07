import { neon } from '@neondatabase/serverless'

// Single connection point - change DATABASE_URL to switch databases
const sql = neon(process.env.DATABASE_URL!)

export { sql }
