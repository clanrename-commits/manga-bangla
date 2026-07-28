import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createHash, randomBytes } from "crypto";

const SESSION_PREFIX = "admin-session:";

/**
 * Create a new admin session token and store it in the Setting table.
 * Returns the token (without the prefix) that the client should send
 * in the x-admin-secret header for subsequent admin API calls.
 */
export async function createAdminSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const key = `${SESSION_PREFIX}${token}`;
  // Store the session with the user id + expiry (24 hours)
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const value = JSON.stringify({ userId, expiresAt });
  await db.setting.upsert({
    where: { id: key },
    create: { id: key, value },
    update: { value },
  });
  return token;
}

/**
 * Verify the admin secret passed in the x-admin-secret header.
 *
 * Supports two modes:
 * 1. Session token (stored in DB) — created by /api/auth/admin-login
 * 2. Static ADMIN_SECRET env var — fallback for backwards compatibility
 *
 * Returns true if the request is authorized as admin.
 */
export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const provided = req.headers.get("x-admin-secret");
  if (!provided) return false;

  // Mode 1: Check if it's a session token in the DB
  const key = `${SESSION_PREFIX}${provided}`;
  try {
    const session = await db.setting.findUnique({ where: { id: key } });
    if (session) {
      const data = JSON.parse(session.value);
      // Check expiry
      if (data.expiresAt > Date.now()) {
        return true;
      }
      // Session expired — clean it up
      await db.setting.delete({ where: { id: key } }).catch(() => {});
      return false;
    }
  } catch {
    // Not a session token, fall through to env var check
  }

  // Mode 2: Static ADMIN_SECRET env var (fallback)
  const secret = process.env.ADMIN_SECRET;
  if (secret && provided === secret) {
    return true;
  }

  return false;
}

/**
 * Hash a password using the same scheme as the seed script.
 */
export function hashPassword(password: string): string {
  const salt = "manga-bangla-salt-v1";
  return createHash("sha256").update(salt + password).digest("hex");
}

/**
 * Verify a password against a stored hash.
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Get or create a "guest" user id from the request, for favorites.
 */
export async function getOrCreateGuestUser(req: NextRequest): Promise<string> {
  const userId = req.headers.get("x-user-id");
  if (userId) {
    const existing = await db.user.findUnique({ where: { id: userId } });
    if (existing) return userId;
  }
  const id = `guest-${crypto.randomUUID()}`;
  const email = `${id}@guest.mangabangla`;
  await db.user.create({
    data: {
      id,
      email,
      name: "Guest",
      passwordHash: "",
      role: "user",
    },
  });
  return id;
}
