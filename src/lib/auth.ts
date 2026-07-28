import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createHash } from "crypto";

/**
 * Verify the admin secret passed in the x-admin-secret header.
 * Returns true if the request is authorized as admin.
 */
export function isAdminRequest(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const provided = req.headers.get("x-admin-secret");
  return provided === secret;
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
 * In a real app you'd use a session token. For now we use a client-supplied
 * x-user-id header (anonymous uuid stored in localStorage on the client).
 */
export async function getOrCreateGuestUser(req: NextRequest): Promise<string> {
  const userId = req.headers.get("x-user-id");
  if (userId) {
    // Verify it exists
    const existing = await db.user.findUnique({ where: { id: userId } });
    if (existing) return userId;
  }
  // Create a new guest user
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
