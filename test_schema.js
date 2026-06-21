const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = "postgresql://neondb_owner:npg_02KctxLSXJTw@ep-winter-sea-ahz7s241-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function run() {
    const sql = neon(DATABASE_URL);
    try {
        const modelsResult = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'models'
        `;
        console.log("Models schema:", modelsResult);

        const datasetsResult = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'datasets'
        `;
        console.log("Datasets schema:", datasetsResult);

    } catch (e) {
        console.error("DB Error:", e.message);
    }
}
run();
