import { users, contactSubmissions, testimonials, blogPosts, type User, type InsertUser, type Contact, type InsertContact, type Testimonial, type InsertTestimonial, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(contact: InsertContact): Promise<Contact>;
  getContactSubmissions(): Promise<Contact[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getTestimonials(approved?: boolean): Promise<Testimonial[]>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactSubmission(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contactSubmissions)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContactSubmissions(): Promise<Contact[]> {
    const contacts = await db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
    return contacts.reverse(); // Most recent first
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  async getTestimonials(approved?: boolean): Promise<Testimonial[]> {
    const query = db.select().from(testimonials);
    if (approved !== undefined) {
      query.where(eq(testimonials.approved, approved));
    }
    const results = await query.orderBy(testimonials.submittedAt);
    return results.reverse(); // Most recent first
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const [blogPost] = await db
      .insert(blogPosts)
      .values({
        ...insertBlogPost,
        publishedAt: insertBlogPost.published ? new Date() : null,
      })
      .returning();
    return blogPost;
  }

  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    const query = db.select().from(blogPosts);
    if (published !== undefined) {
      query.where(eq(blogPosts.published, published));
    }
    const results = await query.orderBy(blogPosts.createdAt);
    return results.reverse(); // Most recent first
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [blogPost] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return blogPost || undefined;
  }
}

export const storage = new DatabaseStorage();
