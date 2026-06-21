import { neon } from '@neondatabase/serverless'

async function main() {
    const sql = neon(process.env.DATABASE_URL!)
    
    try {
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_department_head BOOLEAN DEFAULT false;`
        console.log("Added is_department_head to users")
    } catch (e: any) {
        console.log("Could not add is_department_head:", e.message)
    }

    try {
        await sql`ALTER TABLE theses ADD COLUMN IF NOT EXISTS visibility VARCHAR(50) DEFAULT 'visible';`
        console.log("Added visibility to theses")
    } catch (e: any) {
        console.log("Could not add visibility:", e.message)
    }
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS resource_requests (
                id SERIAL PRIMARY KEY,
                requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                thesis_id INTEGER REFERENCES theses(id) ON DELETE CASCADE,
                message TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(requester_id, thesis_id)
            );
        `
        console.log("Created resource_requests table")
    } catch (e: any) {
        console.log("Could not create resource_requests table:", e.message)
    }
}

main().catch(console.error)
