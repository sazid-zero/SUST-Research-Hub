import { sql } from '@/lib/db';
(async () => {
  const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name='models' ORDER BY ordinal_position`;
  console.log(cols.map(c => c.column_name).join(','));
})();
