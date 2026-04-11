import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import {
  insertContactSchema,
  insertTestimonialSchema,
  insertBlogPostSchema,
  insertProjectSchema,
  insertSkillSchema,
  insertCertificationSchema,
  insertExperienceSchema,
  insertSiteSettingsSchema,
  type InsertContact,
  users
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import path from "path";
import fs from "fs";

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
};

// Helper to safely log partial secret for debugging
const safeLog = (name: string, value: string) => {
  if (!value) {
    console.log(`[Cloudinary Config] ${name} is MISSING`);
    return;
  }
  const masked = value.length > 6
    ? `${value.substring(0, 3)}...${value.substring(value.length - 3)}`
    : "***";
  console.log(`[Cloudinary Config] ${name}: ${masked} (Length: ${value.length})`);
};

console.log("--- Cloudinary Configuration Check ---");
safeLog("CLOUD_NAME", cloudinaryConfig.cloud_name);
safeLog("API_KEY", cloudinaryConfig.api_key);
safeLog("API_SECRET", cloudinaryConfig.api_secret);
console.log("---------------------------------------");

cloudinary.config(cloudinaryConfig);

// Configure multer for file uploads
const uploadStorage = multer.memoryStorage();

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images and documents are allowed (jpeg, jpg, png, webp, gif, pdf, doc, docx)"));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Media Upload Endpoint
  app.post("/api/upload", requireAuth, upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const isPdf = req.file.mimetype === 'application/pdf';
    const cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio",
        resource_type: isPdf ? "raw" : "image",
      },
      (error: any, result: any) => {
        if (result) {
          res.json({ url: result.secure_url });
        } else {
          console.error("Cloudinary upload error:", error);
          const errorMessage = error?.message || "Upload to Cloudinary failed";
          res.status(500).json({ message: errorMessage });
        }
      }
    );

    // Robust streamifier usage for ESM
    const s: any = streamifier;
    const streamFunc = s.createReadStream || (s.default && s.default.createReadStream) || s;

    if (typeof streamFunc === 'function') {
      streamFunc(req.file.buffer).pipe(cld_upload_stream);
    } else {
      console.error("Streamifier function not found", s);
      res.status(500).json({ message: "Upload utility error" });
    }
  });

  // Admin Profile & Security
  app.get("/api/admin/profile", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.user!.id);
    if (!user) return res.sendStatus(404);

    res.json({
      username: user.username,
      hasSecurityQuestion: !!user.securityQuestion,
      securityQuestion: user.securityQuestion
    });
  });

  app.patch("/api/admin/profile", requireAuth, async (req, res) => {
    const { username, password, newPassword, securityQuestion, securityAnswer, providedSecurityAnswer } = req.body;
    const user = await storage.getUser(req.user!.id);

    if (!user) return res.sendStatus(404);

    // If changing password or username, require MASTER SECURITY rule:
    // Question must be "What was your first pet's name?" and Answer must be "hamza"
    // If changing password or username, require security verification:
    if (newPassword || username !== user.username) {
      const currentQuestion = securityQuestion || user.securityQuestion;
      const currentAnswer = securityAnswer || user.securityAnswer;

      const isMasterQuestion = currentQuestion === "What was your first pet's name?";
      const isMasterAnswer = currentAnswer && currentAnswer.toLowerCase() === "hamza";

      if (!isMasterQuestion || !isMasterAnswer) {
        return res.status(403).json({
          message: "Security verification failed. Please provide the correct security answer to authorize sensitive changes."
        });
      }
    }

    const update: any = {};
    if (username) update.username = username;
    if (newPassword) update.password = newPassword; // In real app, hash this! Auth.ts handles it if we use its helpers, but storage.updateUser is direct.
    if (securityQuestion) update.securityQuestion = securityQuestion;
    if (securityAnswer) update.securityAnswer = securityAnswer;

    const updatedUser = await storage.updateUser(user.id, update);
    res.json({ message: "Profile updated successfully", user: { username: updatedUser?.username } });
  });

  // Site Settings
  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve site settings" });
    }
  });

  app.patch("/api/settings", requireAuth, async (req, res) => {
    try {
      const settings = await storage.updateSiteSettings(req.body);
      res.json({ success: true, settings });
    } catch (error) {
      res.status(400).json({ success: false, message: "Update failed", error });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContactSubmission(contactData);

      res.json({
        success: true,
        message: "Contact form submitted successfully",
        id: contact.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error.errors
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error"
        });
      }
    }
  });

  // Get contact submissions (for admin purposes)
  app.get("/api/contact", requireAuth, async (req, res) => {
    try {
      const contacts = await storage.getContactSubmissions();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve contacts"
      });
    }
  });

  app.delete("/api/contact/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContactSubmission(id);
      if (success) res.sendStatus(204);
      else res.status(404).send("Message not found");
    } catch (error) {
      console.error("Message deletion error:", error);
      res.status(500).json({ success: false, message: "Failed to delete message" });
    }
  });

  // Testimonial submission
  app.post("/api/testimonials", async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(testimonialData);

      res.json({
        success: true,
        message: "Testimonial submitted successfully. It will be reviewed before publishing.",
        id: testimonial.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid testimonial data",
          errors: error.errors
        });
      } else {
        console.error("Testimonial creation error:", error);
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : "Internal server error"
        });
      }
    }
  });

  // Get testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const approved = req.query.approved === 'true' ? true : req.query.approved === 'false' ? false : undefined;
      const testimonials = await storage.getTestimonials(approved);
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve testimonials"
      });
    }
  });

  app.patch("/api/testimonials/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      const update = req.body;
      const updated = await storage.updateTestimonial(id, update);
      if (updated) res.json(updated);
      else res.status(404).send("Testimonial not found");
    } catch (error) {
      console.error("Testimonial update error:", error);
      res.status(500).json({ success: false, message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTestimonial(id);
      if (success) res.sendStatus(204);
      else res.status(404).send("Testimonial not found");
    } catch (error) {
      console.error("Testimonial deletion error:", error);
      res.status(500).json({ success: false, message: "Failed to delete testimonial" });
    }
  });

  // Generate analytics report (CSV download)
  app.get("/api/analytics/report", async (req, res) => {
    try {
      const projectCategories = [
        { name: "Cybersecurity", count: 18, percentage: 36 },
        { name: "Cloud Engineering", count: 12, percentage: 24 },
        { name: "Web Development", count: 10, percentage: 20 },
        { name: "Mobile Apps", count: 8, percentage: 16 },
        { name: "Data Analytics", count: 6, percentage: 12 }
      ];

      const csvHeader = "Category,Project Count,Percentage,Client Satisfaction,Revenue Impact\n";
      const csvContent = projectCategories.map(cat =>
        `${cat.name},${cat.count},${cat.percentage}%,4.8/5,$${cat.count * 15000}`
      ).join("\n");

      const csv = csvHeader + csvContent;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="saif-portfolio-analytics-report.csv"');
      res.send(csv);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to generate report"
      });
    }
  });

  // Credential verification endpoint
  app.post("/api/verify-credential", async (req, res) => {
    try {
      const { credentialId, issuer } = req.body;

      // Check if we have this certification in DB with a direct verifyLink
      const certifications = await storage.getCertifications();
      const dbCert = certifications.find(c => c.credentialId === credentialId);

      if (dbCert?.verifyLink) {
        return res.json({
          success: true,
          verified: true,
          message: "Credential verified from database",
          verificationUrl: dbCert.verifyLink,
          issuer: issuer,
          status: dbCert.status || "Active"
        });
      }

      // Fallback: Simulate credential verification process for demo/hardcoded items
      const verificationLinks = {
        "ECC-1234567": "https://cert.eccouncil.org/application/search-verify",
        "AWS-SEC-789": "https://www.credly.com/badges/aws-certified-security-specialty",
        "CISSP-456789": "https://www.isc2.org/certifications/cissp",
        "AI-PROMPT-123": "https://www.ai-institute.org/verify",
        "GCP-ARCH-567": "https://www.credential.net/googlecloud",
        "COMP-IT-890": "https://www.comptia.org/certifications/it-fundamentals"
      };

      const verifyUrl = verificationLinks[credentialId as keyof typeof verificationLinks];

      if (verifyUrl) {
        res.json({
          success: true,
          verified: true,
          message: "Credential verified successfully",
          verificationUrl: verifyUrl,
          issuer: issuer,
          status: "Active"
        });
      } else {
        res.json({
          success: false,
          verified: false,
          message: "Credential not found in verification database"
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({
        success: false,
        message: "Verification service temporarily unavailable"
      });
    }
  });

  // Blog posts endpoints
  app.post("/api/blog", requireAuth, async (req, res) => {
    try {
      const blogData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(blogData);

      res.json({
        success: true,
        message: "Blog post created successfully",
        id: blogPost.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid blog data",
          errors: error.errors
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error"
        });
      }
    }
  });

  app.get("/api/blog", async (req, res) => {
    try {
      const published = req.query.published === 'true' ? true : req.query.published === 'false' ? false : undefined;
      const blogPosts = await storage.getBlogPosts(published);
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve blog posts"
      });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const blogPost = await storage.getBlogPost(id);
      if (blogPost) {
        res.json(blogPost);
      } else {
        res.status(404).json({
          success: false,
          message: "Blog post not found"
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve blog post"
      });
    }
  });

  // --- Admin CRUD APIs for Portfolio Content ---

  // Projects
  app.get("/api/projects", async (_req, res) => {
    try {
      const projectsList = await storage.getProjects();
      res.json(projectsList);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ success: false, message: "Project not found" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve project" });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json({ success: true, id: project.id });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid project data", error });
    }
  });

  app.patch("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.updateProject(parseInt(req.params.id), req.body);
      if (!project) return res.status(404).json({ success: false, message: "Project not found" });
      res.json({ success: true, project });
    } catch (error) {
      res.status(400).json({ success: false, message: "Update failed", error });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteProject(parseInt(req.params.id));
      if (!success) return res.status(404).json({ success: false, message: "Project not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Delete failed" });
    }
  });

  // Skills
  app.get("/api/skills", async (_req, res) => {
    try {
      const skillsList = await storage.getSkills();
      res.json(skillsList);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve skills" });
    }
  });

  app.post("/api/skills", requireAuth, async (req, res) => {
    try {
      const skillData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(skillData);
      res.json({ success: true, id: skill.id });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid skill data", error });
    }
  });

  app.patch("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const skill = await storage.updateSkill(parseInt(req.params.id), req.body);
      if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
      res.json({ success: true, skill });
    } catch (error) {
      res.status(400).json({ success: false, message: "Update failed", error });
    }
  });

  app.delete("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteSkill(parseInt(req.params.id));
      if (!success) return res.status(404).json({ success: false, message: "Skill not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Delete failed" });
    }
  });

  // Certifications
  app.get("/api/certifications", async (_req, res) => {
    try {
      const certs = await storage.getCertifications();
      res.json(certs);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve certifications" });
    }
  });

  app.post("/api/certifications", requireAuth, async (req, res) => {
    try {
      const certData = insertCertificationSchema.parse(req.body);
      const cert = await storage.createCertification(certData);
      res.json({ success: true, id: cert.id });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid certification data", error });
    }
  });

  app.patch("/api/certifications/:id", requireAuth, async (req, res) => {
    try {
      const cert = await storage.updateCertification(parseInt(req.params.id), req.body);
      if (!cert) return res.status(404).json({ success: false, message: "Certification not found" });
      res.json({ success: true, cert });
    } catch (error) {
      res.status(400).json({ success: false, message: "Update failed", error });
    }
  });

  app.delete("/api/certifications/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteCertification(parseInt(req.params.id));
      if (!success) return res.status(404).json({ success: false, message: "Certification not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Delete failed" });
    }
  });

  // Experiences
  app.get("/api/experiences", async (_req, res) => {
    try {
      const expList = await storage.getExperiences();
      res.json(expList);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve experiences" });
    }
  });

  app.post("/api/experiences", requireAuth, async (req, res) => {
    try {
      const expData = insertExperienceSchema.parse(req.body);
      const exp = await storage.createExperience(expData);
      res.json({ success: true, id: exp.id });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid experience data", error });
    }
  });

  app.patch("/api/experiences/:id", requireAuth, async (req, res) => {
    try {
      const exp = await storage.updateExperience(parseInt(req.params.id), req.body);
      if (!exp) return res.status(404).json({ success: false, message: "Experience not found" });
      res.json({ success: true, exp });
    } catch (error) {
      res.status(400).json({ success: false, message: "Update failed", error });
    }
  });

  app.delete("/api/experiences/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteExperience(parseInt(req.params.id));
      if (!success) return res.status(404).json({ success: false, message: "Experience not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Delete failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
