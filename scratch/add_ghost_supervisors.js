const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function main() {
    try {
        await sql`ALTER TABLE theses ADD COLUMN IF NOT EXISTS ghost_supervisor VARCHAR(255);`;
        console.log("Added ghost_supervisor to theses");
        await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS ghost_supervisor VARCHAR(255);`;
        console.log("Added ghost_supervisor to projects");
    } catch(e) {
        console.error(e);
    }
}
main();
