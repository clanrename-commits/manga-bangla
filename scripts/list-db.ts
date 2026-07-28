/**
 * List all manga in the Turso database so we can identify auto/test data
 * vs. user-posted data.
 */
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  console.log("=== ALL MANGA IN DATABASE ===\n");
  const manga = await client.execute(
    "SELECT id, title, titleBn, author, copyright, createdAt FROM Manga ORDER BY createdAt ASC"
  );
  if (manga.rows.length === 0) {
    console.log("(no manga found)");
    return;
  }
  for (const row of manga.rows) {
    console.log(`ID: ${row.id}`);
    console.log(`  Title: ${row.title}`);
    console.log(`  TitleBn: ${row.titleBn || "(none)"}`);
    console.log(`  Author: ${row.author}`);
    console.log(`  Copyright: ${row.copyright || "(none)"}`);
    console.log(`  Created: ${row.createdAt}`);
    console.log("");
  }
  console.log(`Total: ${manga.rows.length} manga`);

  console.log("\n=== ALL CATEGORIES ===");
  const cats = await client.execute("SELECT name FROM Category ORDER BY name");
  console.log(cats.rows.map((r) => r.name).join(", "));

  console.log("\n=== ALL GENRES ===");
  const genres = await client.execute("SELECT name FROM Genre ORDER BY name");
  console.log(genres.rows.map((r) => r.name).join(", "));

  console.log("\n=== ALL USERS ===");
  const users = await client.execute("SELECT email, name, role FROM User");
  for (const u of users.rows) {
    console.log(`  ${u.email} (${u.name}, ${u.role})`);
  }

  console.log("\n=== SETTINGS ===");
  const settings = await client.execute("SELECT id, value FROM Setting");
  for (const s of settings.rows) {
    console.log(`  ${s.id} = ${s.value}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
