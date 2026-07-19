require('dotenv').config({path: '.env.local'});
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function checkSchema() {
  try {
    console.log("Checking and updating schema...");
    
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0`;
    
    await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`;
    await sql`ALTER TABLE publications ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0`;
    
    await sql`ALTER TABLE theses ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`;
    await sql`ALTER TABLE theses ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0`;
    
    await sql`ALTER TABLE datasets ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`;
    await sql`ALTER TABLE datasets ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0`;
    
    await sql`ALTER TABLE models ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`;
    await sql`ALTER TABLE models ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0`;

    await sql`ALTER TABLE project_members ADD COLUMN IF NOT EXISTS member_name TEXT`;

    console.log("Schema update completed successfully.");
  } catch (error) {
    console.error("Error updating schema:", error);
  }
}

checkSchema();
