const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_02KctxLSXJTw@ep-winter-sea-ahz7s241-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function run() {
    const sql = neon(DATABASE_URL);
    try {
        console.log("Updating theses_status_check...");
        await sql`ALTER TABLE theses DROP CONSTRAINT theses_status_check`;
        await sql`ALTER TABLE theses ADD CONSTRAINT theses_status_check CHECK (status IN ('draft', 'pending_review', 'needs_revision', 'approved', 'pending', 'rejected', 'in-review'))`;
        console.log("theses updated.");

        console.log("Updating publications_status_check...");
        // Wait, did publications have a constraint? Yes: 'published', 'accepted', 'in_press', 'submitted', 'preprint'.
        // My code sets publication to 'draft' initially, and 'pending_review' on submit.
        await sql`ALTER TABLE publications DROP CONSTRAINT publications_status_check`;
        await sql`ALTER TABLE publications ADD CONSTRAINT publications_status_check CHECK (status IN ('draft', 'pending_review', 'needs_revision', 'approved', 'published', 'accepted', 'in_press', 'submitted', 'preprint'))`;
        console.log("publications updated.");
        
        console.log("All constraints updated successfully.");
    } catch (e) {
        console.error("DB Error:", e.message);
    }
}
run();
