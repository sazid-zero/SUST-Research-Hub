import fs from 'fs';
import { neon } from '@neondatabase/serverless';

const envFile = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = envFile.match(/DATABASE_URL=(.+)/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1].trim() : '';

const sql = neon(dbUrl);

async function run() {
  try {
    // Theses 17 and 18 were incorrectly set to 'pending' by the old requestSupervision bug.
    // Their supervisors have accepted, so they should be 'draft' until student explicitly submits for review.
    // Thesis 17 has accepted supervisor (id 4), thesis 18 has accepted supervisor (id 5).
    const r1 = await sql`UPDATE theses SET status = 'draft' WHERE id = 17 AND status = 'pending'`;
    console.log("Reset thesis 17 to draft:", r1);
    const r2 = await sql`UPDATE theses SET status = 'draft' WHERE id = 18 AND status = 'pending'`;
    console.log("Reset thesis 18 to draft:", r2);
  } catch (err) {
    console.error(err);
  }
}

run();
