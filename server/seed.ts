import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
    console.log("Seeding admin user...");

    try {
        const existing = await db.select().from(users).where(eq(users.username, "admin"));

        if (existing.length === 0) {
            await db.insert(users).values({
                username: "admin",
                password: "admin123", // Simplified for demonstration
            });
            console.log("Admin user created: admin / admin123");
        } else {
            console.log("Admin user already exists.");
        }
    } catch (error) {
        console.error("Error during seeding:", error);
    }

    process.exit(0);
}

seed().catch((err) => {
    console.error("Seed execution failed:", err);
    process.exit(1);
});
