import { config } from 'dotenv';
config({ path: '.env.local' });
import { sql } from './lib/db/index';

async function main() {
    const constraints = await sql`SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'publications'::regclass;`;
    console.log(constraints);
}

main().catch(console.error);
