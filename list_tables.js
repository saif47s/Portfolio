import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function listTables() {
    try {
        await client.connect();
        const res = await client.query(\`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    \`);
    console.log('Tables:', JSON.stringify(res.rows.map(r => r.table_name), null, 2));
    await client.end();
  } catch (err) {
    console.error('Error listing tables:', err);
    process.exit(1);
  }
}

listTables();
