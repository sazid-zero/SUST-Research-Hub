import { sql } from './lib/db/index';

async function main() {
  const result = await sql`SELECT file_url FROM publication_files WHERE file_url LIKE '%cloudinary%' ORDER BY id DESC LIMIT 5`;
  console.log(result);
  
  const theses = await sql`SELECT file_url FROM thesis_files WHERE file_url LIKE '%cloudinary%' ORDER BY id DESC LIMIT 5`;
  console.log(theses);
  
  const projects = await sql`SELECT file_url FROM project_files WHERE file_url LIKE '%cloudinary%' ORDER BY id DESC LIMIT 5`;
  console.log(projects);
}

main().catch(console.error);
