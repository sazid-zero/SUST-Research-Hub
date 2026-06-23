const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_02KctxLSXJTw@ep-winter-sea-ahz7s241-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function run() {
    const sql = neon(DATABASE_URL);
    try {
        const result1 = await sql`
            SELECT pg_get_constraintdef(oid) AS constraint_def
            FROM pg_constraint
            WHERE conname = 'projects_status_check';
        `;
        console.log("Projects:", result1);

        const result2 = await sql`
            SELECT pg_get_constraintdef(oid) AS constraint_def
            FROM pg_constraint
            WHERE conname = 'publications_status_check';
        `;
        console.log("Publications:", result2);
    } catch (e) {
        console.error("DB Error:", e.message);
    }
}
run();
