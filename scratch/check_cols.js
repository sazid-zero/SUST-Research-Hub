import fs from 'fs';
import { neon } from '@neondatabase/serverless';

const envFile = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = envFile.match(/DATABASE_URL=(.+)/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1].trim() : '';

const sql = neon(dbUrl);

async function run() {
  try {
    const theses = await sql`SELECT id, title, supervisor_id, status FROM theses WHERE id IN (17, 18)`;
    console.log("Theses after fix:", theses);

    const members = await sql`SELECT tm.*, u.full_name FROM team_members tm JOIN users u ON tm.user_id = u.id WHERE thesis_id IN (17, 18)`;
    console.log("Team members after fix:", members);
  } catch (err) {
    console.error(err);
  }
}

run();
