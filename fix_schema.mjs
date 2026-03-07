import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    // SSL disabled for local or non-SSL supported connections
});

async function fixSchema() {
    try {
        console.log('Connecting to database...');
        await client.connect();

        const columnsToAdd = [
            { name: 'navbar_brand_name', type: 'TEXT NOT NULL DEFAULT \'Saif Portfolio\'' },
            { name: 'about_image', type: 'TEXT NOT NULL DEFAULT \'\'' },
            { name: 'stats_experience', type: 'TEXT NOT NULL DEFAULT \'5+ Years\'' },
            { name: 'stats_projects', type: 'TEXT NOT NULL DEFAULT \'50+\'' },
            { name: 'stats_certifications', type: 'TEXT NOT NULL DEFAULT \'8\'' },
            { name: 'stats_security_incidents', type: 'TEXT NOT NULL DEFAULT \'100+\'' },
            { name: 'footer_brand_name', type: 'TEXT NOT NULL DEFAULT \'Saif\'' },
            { name: 'footer_brand_subtitle', type: 'TEXT NOT NULL DEFAULT \'Multi-Tech Expert\'' },
            { name: 'footer_description', type: 'TEXT NOT NULL DEFAULT \'Expert in Cybersecurity, Cloud Engineering, AI Prompting, Data Analysis, and Full-Stack Development.\'' },
            { name: 'footer_services', type: 'TEXT NOT NULL DEFAULT \'["Cybersecurity Services","Cloud Engineering","UI/UX Design","Data Analysis & AI","Mobile Development","Network Engineering"]\'' },
            { name: 'footer_quick_links', type: 'TEXT NOT NULL DEFAULT \'[{"name":"Home","href":"#home"},{"name":"Skills","href":"#skills"},{"name":"Projects","href":"#projects"},{"name":"Contact","href":"#contact"}]\'' },
            { name: 'footer_copyright', type: 'TEXT NOT NULL DEFAULT \'© 2024 CyberSec Professional. All rights reserved. | Securing digital assets worldwide.\'' }
        ];

        for (const col of columnsToAdd) {
            console.log(`Checking for column ${col.name}...`);
            const checkRes = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'site_settings' AND column_name = $1
            `, [col.name]);

            if (checkRes.rows.length === 0) {
                console.log(`Adding column ${col.name}...`);
                await client.query(`ALTER TABLE site_settings ADD COLUMN ${col.name} ${col.type}`);
            } else {
                console.log(`Column ${col.name} already exists.`);
            }
        }

        console.log('Schema fix completed successfully.');
        await client.end();
    } catch (err) {
        console.error('Error fixing schema:', err);
        process.exit(1);
    }
}

fixSchema();
