import { users, contactSubmissions, testimonials, type User, type InsertUser, type Contact, type InsertContact, type Testimonial, type InsertTestimonial } from "@shared/schema";
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
}

export const storage = new DatabaseStorage();
