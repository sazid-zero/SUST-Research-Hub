"use server"

import { sql } from "@/lib/db"

export async function migrateThesisAuthors() {
    try {
        await sql`ALTER TABLE thesis_authors ALTER COLUMN author_id DROP NOT NULL`
        console.log("Dropped NOT NULL constraint from author_id")
    } catch (e: any) {
        console.log("Could not drop constraint (might already be dropped):", e.message)
    }

    try {
        await sql`ALTER TABLE thesis_authors ADD COLUMN IF NOT EXISTS author_name VARCHAR(255)`
        console.log("Added author_name column")
    } catch (e: any) {
        console.log("Could not add column:", e.message)
    }

    return "Migration completed."
}
