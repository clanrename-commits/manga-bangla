/**
 * Push schema directly to Turso using @libsql/client (no Prisma migration engine).
 *
 * Run with: bun run scripts/push-schema.ts
 */
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url || !url.startsWith("libsql://")) {
  console.error("DATABASE_URL must be a libsql:// URL");
  process.exit(1);
}

const client = createClient({ url, authToken });

// SQLite-compatible DDL matching the Prisma schema.
// Note: Prisma stores DateTime as INTEGER (unix millis) via @default(now()) on the client side,
// but for raw DDL we use REAL/TEXT and let Prisma handle conversion at runtime.
const DDL = [
  `CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS Category (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS Genre (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS Manga (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    titleBn TEXT,
    author TEXT NOT NULL,
    artist TEXT,
    copyright TEXT,
    cover TEXT NOT NULL,
    banner TEXT,
    status TEXT NOT NULL DEFAULT 'Ongoing',
    year INTEGER NOT NULL DEFAULT 2026,
    rating REAL NOT NULL DEFAULT 8.5,
    views INTEGER NOT NULL DEFAULT 0,
    synopsis TEXT NOT NULL,
    synopsisBn TEXT,
    featured INTEGER NOT NULL DEFAULT 1,
    trending INTEGER NOT NULL DEFAULT 1,
    adminPosted INTEGER NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS _CategoryToManga (
    A TEXT NOT NULL,
    B TEXT NOT NULL,
    CONSTRAINT _CategoryToManga_A_fkey FOREIGN KEY (A) REFERENCES Category(id) ON DELETE CASCADE,
    CONSTRAINT _CategoryToManga_B_fkey FOREIGN KEY (B) REFERENCES Manga(id) ON DELETE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS _CategoryToManga_A_B_unique ON _CategoryToManga(A, B)`,
  `CREATE INDEX IF NOT EXISTS _CategoryToManga_B_index ON _CategoryToManga(B)`,
  `CREATE TABLE IF NOT EXISTS _GenreToManga (
    A TEXT NOT NULL,
    B TEXT NOT NULL,
    CONSTRAINT _GenreToManga_A_fkey FOREIGN KEY (A) REFERENCES Genre(id) ON DELETE CASCADE,
    CONSTRAINT _GenreToManga_B_fkey FOREIGN KEY (B) REFERENCES Manga(id) ON DELETE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS _GenreToManga_A_B_unique ON _GenreToManga(A, B)`,
  `CREATE INDEX IF NOT EXISTS _GenreToManga_B_index ON _GenreToManga(B)`,
  `CREATE TABLE IF NOT EXISTS Chapter (
    id TEXT PRIMARY KEY NOT NULL,
    mangaId TEXT NOT NULL,
    number INTEGER NOT NULL,
    title TEXT NOT NULL,
    pagesCount INTEGER NOT NULL DEFAULT 12,
    releasedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT Chapter_mangaId_fkey FOREIGN KEY (mangaId) REFERENCES Manga(id) ON DELETE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS Chapter_mangaId_number_key ON Chapter(mangaId, number)`,
  `CREATE TABLE IF NOT EXISTS ChapterPage (
    id TEXT PRIMARY KEY NOT NULL,
    chapterId TEXT NOT NULL,
    seq INTEGER NOT NULL,
    type TEXT NOT NULL,
    src TEXT NOT NULL,
    name TEXT,
    CONSTRAINT ChapterPage_chapterId_fkey FOREIGN KEY (chapterId) REFERENCES Chapter(id) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS ChapterPage_chapterId_seq_idx ON ChapterPage(chapterId, seq)`,
  `CREATE TABLE IF NOT EXISTS Favorites (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    mangaId TEXT NOT NULL,
    CONSTRAINT Favorites_userId_fkey FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    CONSTRAINT Favorites_mangaId_fkey FOREIGN KEY (mangaId) REFERENCES Manga(id) ON DELETE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS Favorites_userId_mangaId_key ON Favorites(userId, mangaId)`,
  `CREATE TABLE IF NOT EXISTS Setting (
    id TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  )`,
];

async function main() {
  console.log("Pushing schema to Turso:", url);
  for (const stmt of DDL) {
    try {
      await client.execute(stmt);
      const name = stmt.match(/CREATE\s+(?:TABLE|INDEX|UNIQUE INDEX)\s+(?:IF NOT EXISTS\s+)?(\S+)/i)?.[1] ?? "?";
      console.log("  ✓", name);
    } catch (e) {
      console.error("  ✗ Failed:", (e as Error).message);
      console.error("    SQL:", stmt.slice(0, 120) + "...");
    }
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
