import { createDb } from "./client.js";
import { sql } from "drizzle-orm";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");

const db = createDb(url);

console.log("Resetting TeamClip data (preserving company and user accounts)...");

// Nuclear option: TRUNCATE with CASCADE on all data tables
// This preserves the company row and user/session tables
await db.execute(sql`TRUNCATE agents, goals, projects, issues CASCADE`);

console.log("Done. Run seed-teamclip.ts to re-seed.");
process.exit(0);
