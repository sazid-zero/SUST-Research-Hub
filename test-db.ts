import { sql } from './lib/db/index';

async function main() {
    await sql`ALTER TABLE publications ADD COLUMN views INTEGER DEFAULT 0;`;
    console.log('Column views added to publications');
}

main().catch(console.error);
