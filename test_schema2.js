const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const resModels = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'models';
        `);
        console.log("MODELS TABLE:");
        console.table(resModels.rows);

        const resDatasets = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'datasets';
        `);
        console.log("DATASETS TABLE:");
        console.table(resDatasets.rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

main();
