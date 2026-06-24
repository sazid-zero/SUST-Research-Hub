const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim().replace(/^"(.*)"$/, '$1');
        }
    });
}

const sql = neon(process.env.DATABASE_URL);

async function checkSchema() {
    try {
        console.log("--- TABLE: paper_review_requests ---");
        const cols = await sql`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'paper_review_requests'
            ORDER BY ordinal_position
        `;
        console.table(cols);

        console.log("\n--- DATA FOR PAPER 16 ---");
        const data = await sql`SELECT journal_name, publication_type, year FROM publications WHERE id = 16`;
        console.table(data);

    } catch (err) {
        console.error(err);
    }
}

checkSchema();
