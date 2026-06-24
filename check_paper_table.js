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

async function checkColumnDefaults() {
    try {
        console.log("Checking column defaults for notifications...");
        const result = await sql`
            SELECT column_name, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'notifications'
        `;
        console.log("Defaults:", result);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

checkColumnDefaults();
