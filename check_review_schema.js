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

        console.log("\n--- FINAL TEST QUERY ---");
        const dept = 'Computer Science and Engineering (CSE)';
        const pattern = `%${dept.split(' ')[0]}%`;
        const test = await sql`
                SELECT id, full_name, role, department
                FROM users
                WHERE role IN ('supervisor', 'faculty', 'professor', 'admin')
                AND (
                    LOWER(department) = LOWER(${dept}) 
                    OR department ILIKE ${pattern}
                    OR department IS NULL 
                    OR department = ''
                )
                ORDER BY full_name ASC
        `;
        console.table(test);

    } catch (err) {
        console.error(err);
    }
}

checkSchema();
