import { sql } from './lib/db/index';

async function main() {
  const allUrls = await sql`SELECT file_url FROM thesis_files WHERE file_url LIKE 'http%' ORDER BY id DESC LIMIT 10`;
  console.log("Thesis URLs:", allUrls);
  
  const allPubUrls = await sql`SELECT file_url FROM publication_files WHERE file_url LIKE 'http%' ORDER BY id DESC LIMIT 10`;
  console.log("Pub URLs:", allPubUrls);
}

main().catch(console.error);
