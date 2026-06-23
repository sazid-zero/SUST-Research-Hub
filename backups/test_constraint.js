const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_02KctxLSXJTw@ep-winter-sea-ahz7s241-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function run() {
    const sql = neon(DATABASE_URL);
    try {
        const result = await sql`
            SELECT pg_get_constraintdef(oid) AS constraint_def
            FROM pg_constraint
            WHERE conname = 'theses_status_check';
        `;
        console.log(result);
    } catch (e) {
        console.error("DB Error:", e.message);
    }
}
run();
