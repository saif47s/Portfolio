import {
  users, contactSubmissions, testimonials, blogPosts, projects, skills, certifications, experiences, siteSettings,
  type User, type InsertUser,
  type Contact, type InsertContact,
  type Testimonial, type InsertTestimonial,
  type BlogPost, type InsertBlogPost,
  type Project, type InsertProject,
  type Skill, type InsertSkill,
  type Certification, type InsertCertification,
  type Experience, type InsertExperience,
  type SiteSettings, type InsertSiteSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;

  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  createContactSubmission(contact: InsertContact): Promise<Contact>;
  getContactSubmissions(): Promise<Contact[]>;
  deleteContactSubmission(id: number): Promise<boolean>;

  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getTestimonials(approved?: boolean): Promise<Testimonial[]>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Skills
  getSkills(): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;

  // Certifications
  getCertifications(): Promise<Certification[]>;
  getCertification(id: number): Promise<Certification | undefined>;
  createCertification(cert: InsertCertification): Promise<Certification>;
  updateCertification(id: number, cert: Partial<InsertCertification>): Promise<Certification | undefined>;
  deleteCertification(id: number): Promise<boolean>;

  // Experiences
  getExperiences(): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  createExperience(exp: InsertExperience): Promise<Experience>;
  updateExperience(id: number, exp: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
    this.init();
  }

  private async init() {
    await this.fixSchema();
    await this.seedAdmin();
    await this.seedSiteSettings();
  }

  private async fixSchema() {
    try {
      console.log('--- STARTING DATABASE SCHEMA VERIFICATION ---');
      const columnsToAdd = [
        { name: 'navbar_brand_name', type: 'text', defaultValue: "'Saif Portfolio'" },
        { name: 'about_image', type: 'text', defaultValue: "''" },
        { name: 'stats_experience', type: 'text', defaultValue: "'5+ Years'" },
        { name: 'stats_projects', type: 'text', defaultValue: "'50+'" },
        { name: 'stats_certifications', type: 'text', defaultValue: "'8'" },
        { name: 'stats_security_incidents', type: 'text', defaultValue: "'100+'" },
        { name: 'footer_brand_name', type: 'text', defaultValue: "'Saif'" },
        { name: 'footer_brand_subtitle', type: 'text', defaultValue: "'Multi-Tech Expert'" },
        { name: 'footer_description', type: 'text', defaultValue: "'Expert in Cybersecurity, Cloud Engineering, AI Prompting, Data Analysis, and Full-Stack Development.'" },
        { name: 'footer_services', type: 'text', defaultValue: '\'["Cybersecurity Services","Cloud Engineering","UI/UX Design","Data Analysis & AI","Mobile Development","Network Engineering"]\'' },
        { name: 'footer_quick_links', type: 'text', defaultValue: '\'[{"name":"Home","href":"#home"},{"name":"Skills","href":"#skills"},{"name":"Projects","href":"#projects"},{"name":"Contact","href":"#contact"}]\' ' },
        { name: 'footer_copyright', type: 'text', defaultValue: "'© 2024 CyberSec Professional. All rights reserved. | Securing digital assets worldwide.'" },
        { name: 'whatsapp_number', type: 'text', defaultValue: "'03325909163'" },
        { name: 'resume_url', type: 'text', defaultValue: "''" }
      ];

      for (const col of columnsToAdd) {
        try {
          const checkQuery = `SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='${col.name}';`;
          const exists = await pool.query(checkQuery);

          if (exists.rowCount === 0) {
            console.log(`Adding missing column: ${col.name}`);
            await pool.query(`ALTER TABLE site_settings ADD COLUMN ${col.name} ${col.type} NOT NULL DEFAULT ${col.defaultValue};`);
          }
        } catch (err: any) {
          console.error(`Error adding column ${col.name}:`, err.message);
        }
      }

      // Check testimonials table existence
      const tableCheck = await pool.query(`SELECT 1 FROM information_schema.tables WHERE table_name = 'testimonials';`);
      if (tableCheck.rowCount === 0) {
        console.log("Creating missing testimonials table...");
        await pool.query(`
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
        `);
      }
      console.log('--- DATABASE SCHEMA VERIFICATION COMPLETE ---');
    } catch (error: any) {
      console.error('CRITICAL: Error during schema verification:', error.message);
    }
  }

  private async seedAdmin() {
    try {
      const existing = await this.getUserByUsername("admin");
      if (!existing) {
        await this.createUser({
          username: "admin",
          password: "admin123",
          securityQuestion: "What is your favorite color?",
          securityAnswer: "blue"
        });
        console.log("Persistent Admin user created: admin / admin123");
      }
    } catch (error) {
      console.error("Error seeding persistent admin:", error);
    }
  }

  private async seedSiteSettings() {
    try {
      const settings = await db.select().from(siteSettings);
      if (settings.length === 0) {
        await db.insert(siteSettings).values({
          navbarBrandName: "Saif Portfolio",
          heroName: "Saif - Multi-Tech",
          heroTitle: "Expert",
          heroSubtitle: "Certified Expert in Cybersecurity",
          heroImage: "",
          aboutMe: "I'm Saif, a passionate multi-disciplinary technology expert with certifications across cybersecurity, cloud engineering, AI prompting, and full-stack development.",
          aboutImage: "",
          statsExperience: "5+ Years",
          statsProjects: "50+",
          statsCertifications: "8",
          statsSecurityIncidents: "100+",
          email: "saif@example.com",
          linkedinUrl: "",
          footerBrandName: "Saif",
          footerBrandSubtitle: "Multi-Tech Expert",
          footerDescription: "Expert in Cybersecurity, Cloud Engineering, AI Prompting, Data Analysis, and Full-Stack Development.",
          footerServices: '["Cybersecurity Services","Cloud Engineering","UI/UX Design","Data Analysis & AI","Mobile Development","Network Engineering"]',
          footerQuickLinks: '[{"name":"Home","href":"#home"},{"name":"Skills","href":"#skills"},{"name":"Projects","href":"#projects"},{"name":"Contact","href":"#contact"}]',
          footerCopyright: "© 2024 CyberSec Professional. All rights reserved. | Securing digital assets worldwide.",
          resumeUrl: "",
        });
        console.log("Initial site settings seeded.");
      }
    } catch (error) {
      console.error("Error seeding site settings:", error);
    }
  }

  async getSiteSettings(): Promise<SiteSettings> {
    const [settings] = await db.select().from(siteSettings);
    if (!settings) {
      return {
        id: 1,
        navbarBrandName: "Saif Portfolio",
        heroName: "Saif - Multi-Tech",
        heroTitle: "Expert",
        heroSubtitle: "Certified Expert in Cybersecurity",
        heroImage: "",
        aboutMe: "I'm Saif, a passionate multi-disciplinary technology expert with certifications across cybersecurity, cloud engineering, AI prompting, and full-stack development.",
        aboutImage: "",
        statsExperience: "5+ Years",
        statsProjects: "50+",
        statsCertifications: "8",
        statsSecurityIncidents: "100+",
        email: "saif@example.com",
        linkedinUrl: "",
        githubUrl: "",
        twitterUrl: "",
        mediumUrl: "",
        whatsappNumber: "03325909163",
        footerBrandName: "Saif",
        footerBrandSubtitle: "Multi-Tech Expert",
        footerDescription: "Expert in Cybersecurity, Cloud Engineering, AI Prompting, Data Analysis, and Full-Stack Development.",
        footerServices: '["Cybersecurity Services","Cloud Engineering","UI/UX Design","Data Analysis & AI","Mobile Development","Network Engineering"]',
        footerQuickLinks: '[{"name":"Home","href":"#home"},{"name":"Skills","href":"#skills"},{"name":"Projects","href":"#projects"},{"name":"Contact","href":"#contact"}]',
        footerCopyright: "© 2024 CyberSec Professional. All rights reserved. | Securing digital assets worldwide.",
        resumeUrl: "",
      };
    }
    return settings;
  }

  async updateSiteSettings(update: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    const [settings] = await db.select().from(siteSettings);
    if (!settings) {
      const [newSettings] = await db.insert(siteSettings).values(update as InsertSiteSettings).returning();
      return newSettings;
    }
    const [updated] = await db.update(siteSettings).set(update).where(eq(siteSettings.id, settings.id)).returning();
    return updated;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(userUpdate).where(eq(users.id, id)).returning();
    return updated;
  }

  async createContactSubmission(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contactSubmissions).values(insertContact).returning();
    return contact;
  }

  async getContactSubmissions(): Promise<Contact[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }
  
  async deleteContactSubmission(id: number): Promise<boolean> {
    const [deleted] = await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id)).returning();
    return !!deleted;
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }

  async getTestimonials(approved?: boolean): Promise<Testimonial[]> {
    if (approved !== undefined) {
      return await db.select().from(testimonials).where(eq(testimonials.approved, approved)).orderBy(desc(testimonials.submittedAt));
    }
    return await db.select().from(testimonials).orderBy(desc(testimonials.submittedAt));
  }

  async updateTestimonial(id: number, testimonialUpdate: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updated] = await db.update(testimonials).set(testimonialUpdate).where(eq(testimonials.id, id)).returning();
    return updated;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const [deleted] = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return !!deleted;
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const [blogPost] = await db.insert(blogPosts).values(insertBlogPost).returning();
    return blogPost;
  }

  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    if (published !== undefined) {
      return await db.select().from(blogPosts).where(eq(blogPosts.published, published)).orderBy(desc(blogPosts.createdAt));
    }
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [blogPost] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return blogPost;
  }

  async updateBlogPost(id: number, blogPostUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts).set(blogPostUpdate).where(eq(blogPosts.id, id)).returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return !!deleted;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db.update(projects).set(projectUpdate).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning();
    return !!deleted;
  }

  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill;
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [skill] = await db.insert(skills).values(insertSkill).returning();
    return skill;
  }

  async updateSkill(id: number, skillUpdate: Partial<InsertSkill>): Promise<Skill | undefined> {
    const [updated] = await db.update(skills).set(skillUpdate).where(eq(skills.id, id)).returning();
    return updated;
  }

  async deleteSkill(id: number): Promise<boolean> {
    const [deleted] = await db.delete(skills).where(eq(skills.id, id)).returning();
    return !!deleted;
  }

  async getCertifications(): Promise<Certification[]> {
    return await db.select().from(certifications);
  }

  async getCertification(id: number): Promise<Certification | undefined> {
    const [cert] = await db.select().from(certifications).where(eq(certifications.id, id));
    return cert;
  }

  async createCertification(insertCert: InsertCertification): Promise<Certification> {
    const [cert] = await db.insert(certifications).values(insertCert).returning();
    return cert;
  }

  async updateCertification(id: number, certUpdate: Partial<InsertCertification>): Promise<Certification | undefined> {
    const [updated] = await db.update(certifications).set(certUpdate).where(eq(certifications.id, id)).returning();
    return updated;
  }

  async deleteCertification(id: number): Promise<boolean> {
    const [deleted] = await db.delete(certifications).where(eq(certifications.id, id)).returning();
    return !!deleted;
  }

  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences).orderBy(desc(experiences.id));
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    const [exp] = await db.select().from(experiences).where(eq(experiences.id, id));
    return exp;
  }

  async createExperience(insertExp: InsertExperience): Promise<Experience> {
    const [exp] = await db.insert(experiences).values(insertExp).returning();
    return exp;
  }

  async updateExperience(id: number, expUpdate: Partial<InsertExperience>): Promise<Experience | undefined> {
    const [updated] = await db.update(experiences).set(expUpdate).where(eq(experiences.id, id)).returning();
    return updated;
  }

  async deleteExperience(id: number): Promise<boolean> {
    const [deleted] = await db.delete(experiences).where(eq(experiences.id, id)).returning();
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();
