import { readFileSync } from "fs";
import postgres from "postgres";

const backupPath = process.argv[2] || "/home/eric/.paperclip/instances/teamclip/instances/default/data/backups/paperclip-20260321-031630.sql";
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");

const sql = postgres(url, { max: 1 });

async function main() {
  console.log(`Restoring from: ${backupPath}`);
  const backupSql = readFileSync(backupPath, "utf-8");

  // Run the entire backup as one atomic operation
  // The backup already has BEGIN/COMMIT wrapping it
  console.log(`Executing full backup SQL (${(backupSql.length / 1024).toFixed(0)} KB)...`);

  try {
    await sql.unsafe(backupSql);
    console.log("Restore executed successfully.");
  } catch (err: any) {
    console.error(`Restore error: ${err.message}`);
    console.error("Attempting without transaction wrapper...");

    // Strip BEGIN/COMMIT and run without transaction
    const stripped = backupSql
      .replace(/^BEGIN;\s*/m, "")
      .replace(/\s*COMMIT;\s*$/m, "");
    await sql.unsafe(stripped);
    console.log("Restore executed (no transaction wrapper).");
  }

  // Verify
  const agents = await sql`SELECT count(*) as cnt FROM agents`;
  const issues = await sql`SELECT count(*) as cnt FROM issues`;
  const comments = await sql`SELECT count(*) as cnt FROM issue_comments`;
  console.log(`Verified: ${agents[0].cnt} agents, ${issues[0].cnt} issues, ${comments[0].cnt} comments`);

  await sql.end();
}

main();
