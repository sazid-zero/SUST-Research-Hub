import fs from 'fs';
import { neon } from '@neondatabase/serverless';

const envFile = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = envFile.match(/DATABASE_URL=(.+)/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1].trim() : '';

const sql = neon(dbUrl);

async function run() {
  try {
    // Fix thesis 18: set supervisor_id from the accepted supervision_request
    const result1 = await sql`UPDATE theses SET supervisor_id = 5 WHERE id = 18`;
    console.log("Fixed thesis 18 supervisor_id:", result1);

    // Fix thesis 17: set supervisor_id from the accepted supervision_request  
    const result2 = await sql`UPDATE theses SET supervisor_id = 4 WHERE id = 17`;
    console.log("Fixed thesis 17 supervisor_id:", result2);

    // Add supervisor to team_members for thesis 18
    const result3 = await sql`INSERT INTO team_members (thesis_id, user_id, role, status, joined_at) VALUES (18, 5, 'supervisor', 'active', NOW())`;
    console.log("Added supervisor 5 to team_members for thesis 18:", result3);

    // Add supervisor to team_members for thesis 17
    const result4 = await sql`INSERT INTO team_members (thesis_id, user_id, role, status, joined_at) VALUES (17, 4, 'supervisor', 'active', NOW())`;
    console.log("Added supervisor 4 to team_members for thesis 17:", result4);

    console.log("Data repair complete.");
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
