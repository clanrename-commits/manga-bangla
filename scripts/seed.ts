/**
 * Seed Turso database with:
 *  - Default admin user (admin@mangabangla.com / admin123)
 *  - Default categories (Manga, Manhwa, Manhua, Webtoon, One-shot)
 *  - Default genres (Action, Adventure, Comedy, Drama, Fantasy, ...)
 *  - Default settings (siteName, facebookUrl, defaultCopyright)
 *
 * Run with: bun run scripts/seed.ts
 */
import { createClient } from "@libsql/client";
import { createHash, randomUUID } from "crypto";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const client = createClient({ url, authToken });

// Simple password hash (SHA-256 + salt). NOT for production-grade security,
// but sufficient for a demo. Replace with bcrypt if you need real auth.
function hashPassword(password: string): string {
  const salt = "manga-bangla-salt-v1";
  return createHash("sha256").update(salt + password).digest("hex");
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mangabangla.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const DEFAULT_CATEGORIES = ["Manga", "Manhwa", "Manhua", "Webtoon", "One-shot"];
const DEFAULT_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
  "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Supernatural",
];

const DEFAULT_SETTINGS: Record<string, string> = {
  siteName: "Manga Bangla",
  facebookUrl: "https://facebook.com/mangabangla",
  defaultCopyright: "© Manga Bangla",
};

async function main() {
  console.log("Seeding Turso database...");

  // 1. Admin user (only if no admin exists)
  const existing = await client.execute("SELECT id FROM User WHERE role = 'admin' LIMIT 1");
  if (existing.rows.length === 0) {
    const id = randomUUID();
    await client.execute({
      sql: "INSERT INTO User (id, email, name, passwordHash, role, updatedAt) VALUES (?, ?, ?, ?, 'admin', CURRENT_TIMESTAMP)",
      args: [id, ADMIN_EMAIL, "Admin", hashPassword(ADMIN_PASSWORD)],
    });
    console.log("  ✓ Admin user created:", ADMIN_EMAIL);
  } else {
    console.log("  • Admin user already exists, skipping");
  }

  // 2. Categories
  for (const name of DEFAULT_CATEGORIES) {
    await client.execute({
      sql: "INSERT INTO Category (id, name) VALUES (?, ?) ON CONFLICT(name) DO NOTHING",
      args: [randomUUID(), name],
    });
  }
  console.log("  ✓ Categories ensured:", DEFAULT_CATEGORIES.length);

  // 3. Genres
  for (const name of DEFAULT_GENRES) {
    await client.execute({
      sql: "INSERT INTO Genre (id, name) VALUES (?, ?) ON CONFLICT(name) DO NOTHING",
      args: [randomUUID(), name],
    });
  }
  console.log("  ✓ Genres ensured:", DEFAULT_GENRES.length);

  // 4. Settings
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await client.execute({
      sql: "INSERT INTO Setting (id, value) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET value = excluded.value",
      args: [key, value],
    });
  }
  console.log("  ✓ Settings ensured:", Object.keys(DEFAULT_SETTINGS).length);

  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
