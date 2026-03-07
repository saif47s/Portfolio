import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function checkColumns() {
    try {
        await client.connect();
        const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'site_settings'
    `);
        console.log('Columns in site_settings:', JSON.stringify(res.rows, null, 2));
        await client.end();
    } catch (err) {
        console.error('Error checking columns:', err);
        process.exit(1);
    }
}

checkColumns();
