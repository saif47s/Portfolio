import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

async function seed() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    console.log("Seeding admin user via direct SQL (ESM)...");

    try {
        const client = await pool.connect();

        // Check if table exists first (just in case)
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);

        // Check if user exists
        const checkRes = await client.query('SELECT * FROM users WHERE username = $1', ['admin']);

        if (checkRes.rows.length === 0) {
            await client.query(
                'INSERT INTO users (username, password) VALUES ($1, $2)',
                ['admin', 'admin123']
            );
            console.log("Admin user created: admin / admin123");
        } else {
            console.log("Admin user already exists.");
        }

        client.release();
    } catch (error) {
        console.error("Seed failed:", error);
    } finally {
        await pool.end();
    }
}

seed();
