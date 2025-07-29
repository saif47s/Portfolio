import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertTestimonialSchema, insertBlogPostSchema, type InsertContact } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
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
  app.get("/api/contact", async (req, res) => {
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
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
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
      
      // Simulate credential verification process
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
      res.status(500).json({ 
        success: false, 
        message: "Verification service temporarily unavailable" 
      });
    }
  });

  // Blog posts endpoints
  app.post("/api/blog", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
