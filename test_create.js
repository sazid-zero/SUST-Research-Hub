const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_02KctxLSXJTw@ep-winter-sea-ahz7s241-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function run() {
    const sql = neon(DATABASE_URL);
    try {
        const user = { id: 1, department: 'CSE', specialization: 'SE', full_name: 'Test User' };
        const type = 'thesis';
        const title = 'Test Thesis';
        const description = 'Test Description';
        const department = 'CSE';
        const field = 'SE';
        
        console.log("Attempting to insert thesis...");
        const result = await sql`
        INSERT INTO theses (
          title, abstract, department, field, 
          year, submitted_date,
          status, supervisor_id, created_at, updated_at
        )
        VALUES (
          ${title}, ${description}, ${department || user.department}, ${field || user.specialization},
          EXTRACT(YEAR FROM NOW()), CURRENT_DATE,
          'draft', null, NOW(), NOW()
        )
        RETURNING id
      `;
      const workspaceId = result[0].id;
      console.log("Thesis created", workspaceId);

      await sql`
        INSERT INTO thesis_authors (thesis_id, author_id, author_order)
        VALUES (${workspaceId}, ${user.id}, 1)
      `;
      console.log("Author added");

      await sql`
        INSERT INTO team_members (thesis_id, user_id, role, status, joined_at)
        VALUES (${workspaceId}, ${user.id}, 'leader', 'active', NOW())
      `;
      console.log("Team member added");

    } catch (e) {
        console.error("DB Error:", e.message);
    }
}
run();
