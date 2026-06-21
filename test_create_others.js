const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_02KctxLSXJTw@ep-winter-sea-ahz7s241-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function run() {
    const sql = neon(DATABASE_URL);
    try {
        const user = { id: 1, department: 'CSE', specialization: 'SE', full_name: 'Test User' };
        
        console.log("Attempting to insert project...");
        const result = await sql`
        INSERT INTO projects (
            title, description, department, field, 
            status, created_at, updated_at
        )
        VALUES (
            'test', 'test', 'test', 'test',
            'draft', NOW(), NOW()
        )
        RETURNING id
      `;
      const projectId = result[0].id;
      console.log("Project created", projectId);

      console.log("Attempting to insert publication...");
      const result2 = await sql`
            INSERT INTO publications (
                title, abstract, journal_name, publication_type, paper_subtype, year, status, created_at, updated_at
            )
            VALUES (
                'test', 'test', 'TBD', 'journal', 'journal', EXTRACT(YEAR FROM NOW()), 'draft', NOW(), NOW()
            )
            RETURNING id
        `;
        const pubId = result2[0].id;
        console.log("Pub created", pubId);

    } catch (e) {
        console.error("DB Error:", e.message);
    }
}
run();
