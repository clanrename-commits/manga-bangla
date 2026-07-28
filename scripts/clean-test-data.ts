/**
 * Remove auto-generated test data from the Turso database.
 *
 * - Deletes the test manga created during curl testing ("Test Manga from Turso")
 * - Deletes any auto-created guest users
 * - KEEPS: admin user, categories, genres, settings (infrastructure)
 * - KEEPS: any manga the user posted manually
 *
 * Run with: bun run scripts/clean-test-data.ts
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
  console.log("=== Cleaning auto-generated test data ===\n");

  // 1. Delete the test manga created via curl during testing.
  //    This matches the manga I posted as "Test Manga from Turso".
  //    It also cascades to chapters + chapter pages.
  console.log("1. Removing test manga...");
  const testManga = await client.execute({
    sql: "SELECT id, title FROM Manga WHERE title = ? OR title LIKE ?",
    args: ["Test Manga from Turso", "Test Manga%"],
  });
  for (const row of testManga.rows) {
    console.log(`   Deleting manga: "${row.title}" (id: ${row.id})`);
    // Delete chapter pages first (cascade may not work through raw SQL)
    await client.execute({
      sql: "DELETE FROM ChapterPage WHERE chapterId IN (SELECT id FROM Chapter WHERE mangaId = ?)",
      args: [row.id as string],
    });
    await client.execute({
      sql: "DELETE FROM Chapter WHERE mangaId = ?",
      args: [row.id as string],
    });
    await client.execute({
      sql: "DELETE FROM Favorites WHERE mangaId = ?",
      args: [row.id as string],
    });
    // Delete category/genre associations
    await client.execute({
      sql: "DELETE FROM _CategoryToManga WHERE B = ?",
      args: [row.id as string],
    });
    await client.execute({
      sql: "DELETE FROM _GenreToManga WHERE B = ?",
      args: [row.id as string],
    });
    // Finally delete the manga
    await client.execute({
      sql: "DELETE FROM Manga WHERE id = ?",
      args: [row.id as string],
    });
    console.log("   ✓ Deleted");
  }
  if (testManga.rows.length === 0) {
    console.log("   (no test manga found)");
  }

  // 2. Delete auto-created guest users (from testing).
  //    These have emails ending in @guest.mangabangla
  console.log("\n2. Removing auto-created guest users...");
  const guests = await client.execute(
    "SELECT id, email FROM User WHERE email LIKE ?",
    ["%@guest.mangabangla%"]
  );
  for (const row of guests.rows) {
    console.log(`   Deleting guest user: ${row.email} (id: ${row.id})`);
    // Delete favorites first (cascade may not work through raw SQL)
    await client.execute({
      sql: "DELETE FROM Favorites WHERE userId = ?",
      args: [row.id as string],
    });
    await client.execute({
      sql: "DELETE FROM User WHERE id = ?",
      args: [row.id as string],
    });
    console.log("   ✓ Deleted");
  }
  if (guests.rows.length === 0) {
    console.log("   (no guest users found)");
  }

  // 3. Show what remains
  console.log("\n=== What remains after cleanup ===\n");

  const remainingManga = await client.execute(
    "SELECT title, titleBn, author FROM Manga ORDER BY createdAt ASC"
  );
  console.log(`Manga (${remainingManga.rows.length}):`);
  if (remainingManga.rows.length === 0) {
    console.log("   (none — database is clean, ready for your posts)");
  } else {
    for (const row of remainingManga.rows) {
      console.log(`   • ${row.title} / ${row.titleBn || ""} (by ${row.author})`);
    }
  }

  const remainingUsers = await client.execute(
    "SELECT email, role FROM User ORDER BY role DESC"
  );
  console.log(`\nUsers (${remainingUsers.rows.length}):`);
  for (const row of remainingUsers.rows) {
    console.log(`   • ${row.email} (${row.role})`);
  }

  const cats = await client.execute("SELECT COUNT(*) as c FROM Category");
  const genres = await client.execute("SELECT COUNT(*) as c FROM Genre");
  console.log(`\nCategories: ${cats.rows[0].c}`);
  console.log(`Genres: ${genres.rows[0].c}`);

  const settings = await client.execute("SELECT COUNT(*) as c FROM Setting");
  console.log(`Settings: ${settings.rows[0].c}`);

  console.log("\n✅ Cleanup complete. Your infrastructure is intact.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
