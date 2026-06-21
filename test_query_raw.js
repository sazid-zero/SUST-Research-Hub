const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_02KctxLSXJTw@ep-winter-sea-ahz7s241-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function run() {
    const sql = neon(DATABASE_URL);
    try {
        console.log("Testing thesis 102 query...");
        const id = 102;
        const models = await sql`SELECT id, title as name, description, model_url as external_url, download_url as file_url, framework FROM models WHERE workspace_id = ${id} AND workspace_type = 'thesis'`;
        console.log("Models:", models);

        const datasets = await sql`SELECT id, title as name, download_url as external_url FROM datasets WHERE workspace_id = ${id} AND workspace_type = 'thesis'`;
        console.log("Datasets:", datasets);
    } catch (e) {
        console.error("DB Error:", e.message);
    }
}
run();
