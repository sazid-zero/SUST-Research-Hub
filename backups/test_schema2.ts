import { db } from './lib/db';

async function main() {
    try {
        const resModels = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'models';
        `);
        console.log("MODELS TABLE:");
        console.table(resModels.rows);

        const resDatasets = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'datasets';
        `);
        console.log("DATASETS TABLE:");
        console.table(resDatasets.rows);
    } catch (e) {
        console.error(e);
    }
}

main();
