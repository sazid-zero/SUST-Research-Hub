const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_02KctxLSXJTw@ep-winter-sea-ahz7s241-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function updateData() {
    const sql = neon(DATABASE_URL);
    try {
        console.log("Updating Project 1 status to published...");
        const result = await sql`UPDATE projects SET status = 'published' WHERE id = 1`;
        console.log("Update result:", result);

        console.log("Updating Project 4 status to published (just in case)...");
        await sql`UPDATE projects SET status = 'published' WHERE id = 4`;

        console.log("Updating Publication 1 status to published...");
        await sql`UPDATE publications SET status = 'published' WHERE id = 1`;

    } catch (err) {
        console.error("Error:", err);
    }
}

updateData();
