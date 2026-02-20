const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_02KctxLSXJTw@ep-winter-sea-ahz7s241-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function checkData() {
    const sql = neon(DATABASE_URL);
    try {
        console.log("--- PROJECTS ---");
        const projects = await sql`SELECT id, title, status, created_at FROM projects`;
        projects.forEach(p => console.log(`[${p.id}] ${p.status.padEnd(10)} | ${p.title}`));

        console.log("\n--- PUBLICATIONS ---");
        const publications = await sql`SELECT id, title, status, created_at FROM publications`;
        publications.forEach(p => console.log(`[${p.id}] ${p.status.padEnd(10)} | ${p.title}`));

        console.log("\n--- THESES (Top 10) ---");
        const theses = await sql`SELECT id, title, status, created_at, year FROM theses ORDER BY created_at DESC LIMIT 10`;
        theses.forEach(p => console.log(`[${p.id}] ${p.status.padEnd(10)} | ${p.year} | ${p.title}`));

    } catch (err) {
        console.error("Error:", err);
    }
}

checkData();
