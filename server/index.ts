import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

if (process.env.NODE_ENV === "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for separate frontend deployment
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : true,
  credentials: true,
}));

app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const { pool } = await import("./db");
  const initSql = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      security_question TEXT,
      security_answer TEXT
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
    CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      hero_name TEXT NOT NULL DEFAULT 'Saif - Multi-Tech',
      hero_title TEXT NOT NULL DEFAULT 'Expert',
      hero_subtitle TEXT NOT NULL DEFAULT 'Certified Expert in Cybersecurity',
      hero_image TEXT NOT NULL DEFAULT '',
      about_me TEXT NOT NULL DEFAULT '',
      about_image TEXT NOT NULL DEFAULT '',
      stats_experience TEXT NOT NULL DEFAULT '5+ Years',
      stats_projects TEXT NOT NULL DEFAULT '50+',
      stats_certifications TEXT NOT NULL DEFAULT '8',
      stats_security_incidents TEXT NOT NULL DEFAULT '100+',
      email TEXT NOT NULL DEFAULT '',
      linkedin_url TEXT NOT NULL DEFAULT '',
      github_url TEXT NOT NULL DEFAULT '',
      twitter_url TEXT NOT NULL DEFAULT '',
      medium_url TEXT NOT NULL DEFAULT '',
      footer_brand_name TEXT NOT NULL DEFAULT 'Saif',
      footer_brand_subtitle TEXT NOT NULL DEFAULT 'Multi-Tech Expert',
      footer_description TEXT NOT NULL DEFAULT 'Expert in Cybersecurity, Cloud Engineering, AI Prompting, Data Analysis, and Full-Stack Development.',
      footer_services TEXT NOT NULL DEFAULT '["Cybersecurity Services","Cloud Engineering","UI/UX Design","Data Analysis & AI","Mobile Development","Network Engineering"]',
      footer_quick_links TEXT NOT NULL DEFAULT '[{"name":"Home","href":"#home"},{"name":"Skills","href":"#skills"},{"name":"Projects","href":"#projects"},{"name":"Contact","href":"#contact"}]',
      footer_copyright TEXT NOT NULL DEFAULT '© 2024 CyberSec Professional. All rights reserved. | Securing digital assets worldwide.'
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
  `;
  try {
    await pool.query(initSql);
    // Ensure new columns exist for existing tables
    const alterTableSql = `
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_image TEXT NOT NULL DEFAULT '';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stats_experience TEXT NOT NULL DEFAULT '5+ Years';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stats_projects TEXT NOT NULL DEFAULT '50+';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stats_certifications TEXT NOT NULL DEFAULT '8';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stats_security_incidents TEXT NOT NULL DEFAULT '100+';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_brand_name TEXT NOT NULL DEFAULT 'Saif';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_brand_subtitle TEXT NOT NULL DEFAULT 'Multi-Tech Expert';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_description TEXT NOT NULL DEFAULT 'Expert in Cybersecurity, Cloud Engineering, AI Prompting, Data Analysis, and Full-Stack Development.';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_services TEXT NOT NULL DEFAULT '["Cybersecurity Services","Cloud Engineering","UI/UX Design","Data Analysis & AI","Mobile Development","Network Engineering"]';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_quick_links TEXT NOT NULL DEFAULT '[{"name":"Home","href":"#home"},{"name":"Skills","href":"#skills"},{"name":"Projects","href":"#projects"},{"name":"Contact","href":"#contact"}]';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_copyright TEXT NOT NULL DEFAULT '© 2024 CyberSec Professional. All rights reserved. | Securing digital assets worldwide.';
      
      ALTER TABLE users ADD COLUMN IF NOT EXISTS security_question TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer TEXT;
    `;
    await pool.query(alterTableSql);

    // Check if admin user exists
    const adminCheck = await pool.query("SELECT * FROM users WHERE username = 'admin'");
    if (adminCheck.rows.length === 0) {
      await pool.query("INSERT INTO users (username, password) VALUES ('admin', 'admin123')");
      log("Admin user created (admin/admin123)");
    } else {
      log("Admin user verified");
    }

    log("Database tables verified/created (SSL Fix V2)");
  } catch (err) {
    console.error("Database initialization failed:", err);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
