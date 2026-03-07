const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const SQL = \`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  position TEXT,
  rating INTEGER NOT NULL,
  testimonial TEXT NOT NULL,
  project TEXT,
  approved BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  image TEXT NOT NULL,
  read_time TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  year TEXT NOT NULL,
  technologies TEXT[] NOT NULL,
  image TEXT NOT NULL,
  category_color TEXT NOT NULL,
  status TEXT NOT NULL,
  github_link TEXT,
  live_link TEXT
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  progress INTEGER NOT NULL,
  projects_count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  credential_id TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  image TEXT,
  verify_link TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Remote',
  type TEXT NOT NULL DEFAULT 'Full-time',
  achievements TEXT[] NOT NULL DEFAULT '{}',
  technologies TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  hero_name TEXT NOT NULL DEFAULT 'Saif - Multi-Tech',
  hero_title TEXT NOT NULL DEFAULT 'Expert',
  hero_subtitle TEXT NOT NULL DEFAULT 'Certified Expert in Cybersecurity | Network Engineering | Cloud Engineering | UI/UX Design | AI Prompting | Data Analysis | Python Development | Mobile Apps',
  hero_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
  about_me TEXT NOT NULL DEFAULT 'I am Saif, a passionate multi-disciplinary technology expert with certifications across cybersecurity, cloud engineering, AI prompting, and full-stack development. Currently working on NetSec - a comprehensive networking scanning application for device discovery and management.',
  email TEXT NOT NULL DEFAULT 'saif@example.com',
  linkedin_url TEXT NOT NULL DEFAULT 'https://linkedin.com/in/saif-expert',
  github_url TEXT NOT NULL DEFAULT 'https://github.com/saif-expert',
  twitter_url TEXT NOT NULL DEFAULT 'https://twitter.com/saif_expert',
  medium_url TEXT NOT NULL DEFAULT 'https://medium.com/@saif_expert'
);

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

DO \\$\\$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey') THEN
        ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    END IF;
END \\$\\$;

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
\`;

async function setupDB() {
  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('Connected. Running SQL initialization...');
    await client.query(SQL);
    console.log('All tables created/verified successfully');
    await client.end();
  } catch (err) {
    console.error('Error setting up DB:', err);
    process.exit(1);
  }
}

setupDB();
