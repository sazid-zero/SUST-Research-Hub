import fs from 'fs';
import { neon } from '@neondatabase/serverless';

const envFile = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = envFile.match(/DATABASE_URL=(.+)/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1].trim() : '';

const sql = neon(dbUrl);

async function run() {
  try {
    const res = await sql`
      SELECT pg_get_constraintdef(c.oid) AS constraint_def
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      WHERE c.conname = 'publications_status_check'
    `;
    console.log("publications_status_check definition:", res);
  } catch (err) {
    console.error(err);
  }
}

run();
