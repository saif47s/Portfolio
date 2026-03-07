import { db } from "../server/db";
import { siteSettings } from "../shared/schema";

async function checkSettings() {
    try {
        const settings = await db.select().from(siteSettings);
        console.log("Found " + settings.length + " rows in site_settings");
        settings.forEach((s, i) => {
            console.log("Row " + i + " (ID: " + s.id + "):", JSON.stringify(s, null, 2));
        });
    } catch (error) {
        console.error("Query failed:", error);
    } finally {
        process.exit(0);
    }
}

checkSettings();
