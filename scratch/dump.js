const postgres = require('postgres');

const sql = postgres("postgresql://neondb_owner:npg_02KctxLSXJTw@ep-winter-sea-ahz7s241-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require");

async function dumpSchema() {
    console.log("Fetching tables...");
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    
    for (const row of tables) {
        console.log(`\n-- Table: ${row.table_name}`);
        const cols = await sql`
            SELECT column_name, data_type, character_maximum_length, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = ${row.table_name}
            ORDER BY ordinal_position
        `;
        let createStmt = `CREATE TABLE ${row.table_name} (\n`;
        const colStmts = cols.map(c => {
            let type = c.data_type;
            if (type === 'character varying') type = `VARCHAR(${c.character_maximum_length})`;
            if (type === 'timestamp without time zone') type = 'TIMESTAMP';
            let nullStr = c.is_nullable === 'NO' ? 'NOT NULL' : '';
            let defStr = c.column_default ? `DEFAULT ${c.column_default}` : '';
            return `    ${c.column_name} ${type} ${nullStr} ${defStr}`.trimEnd();
        });
        createStmt += colStmts.join(",\n") + "\n);";
        console.log(createStmt);
    }
    process.exit(0);
}

dumpSchema().catch(console.error);
