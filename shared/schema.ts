import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  securityQuestion: text("security_question"),
  securityAnswer: text("security_answer"),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  securityQuestion: true,
  securityAnswer: true,
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  firstName: true,
  lastName: true,
  email: true,
  service: true,
  message: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactSubmissions.$inferSelect;

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  position: text("position"),
  rating: integer("rating").notNull(),
  testimonial: text("testimonial").notNull(),
  project: text("project"),
  approved: boolean("approved").default(false),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  submittedAt: true,
  approved: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  image: text("image").notNull(),
  readTime: text("read_time").notNull(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  year: text("year").notNull(),
  technologies: text("technologies").array().notNull(),
  image: text("image").notNull(),
  categoryColor: text("category_color").notNull(),
  status: text("status").notNull(),
  githubLink: text("github_link"),
  liveLink: text("live_link"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Skills table
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  progress: integer("progress").notNull(),
  projectsCount: integer("projects_count").notNull(),
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

// Certifications table
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  credentialId: text("credential_id"),
  status: text("status").notNull().default("Active"),
  image: text("image"),
  verifyLink: text("verify_link"),
  skills: text("skills").array().notNull().default([]),
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
});

export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Certification = typeof certifications.$inferSelect;

// Experiences table
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  duration: text("duration").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull().default("Remote"),
  type: text("type").notNull().default("Full-time"),
  achievements: text("achievements").array().notNull().default([]),
  technologies: text("technologies").array().notNull().default([]),
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
});

export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;// Site settings table
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  navbarBrandName: text("navbar_brand_name").notNull().default("Saif Portfolio"),
  heroName: text("hero_name").notNull().default("Saif - Multi-Tech"),
  heroTitle: text("hero_title").notNull().default("Expert"),
  heroSubtitle: text("hero_subtitle").notNull().default("Certified Expert in Cybersecurity"),
  heroImage: text("hero_image").notNull().default(""),
  aboutMe: text("about_me").notNull().default(""),
  aboutImage: text("about_image").notNull().default(""),
  statsExperience: text("stats_experience").notNull().default("5+ Years"),
  statsProjects: text("stats_projects").notNull().default("50+"),
  statsCertifications: text("stats_certifications").notNull().default("8"),
  statsSecurityIncidents: text("stats_security_incidents").notNull().default("100+"),
  email: text("email").notNull().default(""),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  githubUrl: text("github_url").notNull().default(""),
  twitterUrl: text("twitter_url").notNull().default(""),
  mediumUrl: text("medium_url").notNull().default(""),
  whatsappNumber: text("whatsapp_number").notNull().default("03325909163"),
  footerBrandName: text("footer_brand_name").notNull().default("Saif"),
  footerBrandSubtitle: text("footer_brand_subtitle").notNull().default("Multi-Tech Expert"),
  footerDescription: text("footer_description").notNull().default("Expert in Cybersecurity, Cloud Engineering, AI Prompting, Data Analysis, and Full-Stack Development."),
  footerServices: text("footer_services").notNull().default('["Cybersecurity Services","Cloud Engineering","UI/UX Design","Data Analysis & AI","Mobile Development","Network Engineering"]'),
  footerQuickLinks: text("footer_quick_links").notNull().default('[{"name":"Home","href":"#home"},{"name":"Skills","href":"#skills"},{"name":"Projects","href":"#projects"},{"name":"Contact","href":"#contact"}]'),
  footerCopyright: text("footer_copyright").notNull().default("© 2024 CyberSec Professional. All rights reserved. | Securing digital assets worldwide."),
  resumeUrl: text("resume_url").notNull().default(""),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
});

export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
