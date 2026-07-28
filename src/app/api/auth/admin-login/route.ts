import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createAdminSession } from "@/lib/auth";

/**
 * POST /api/auth/admin-login
 * Body: { email, password }
 * Returns: { user, adminSecret } — adminSecret is a session token that the
 * client sends in the x-admin-secret header for admin API calls.
 *
 * The session token is stored in the DB (Setting table) and expires after 24h.
 * This means no ADMIN_SECRET env var is required — the session system works
 * out of the box after the admin logs in.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "email and password required" }, { status: 400 });
  }
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Not an admin account" }, { status: 403 });
  }
  if (!verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Create a session token and store it in the DB
  const sessionToken = await createAdminSession(user.id);

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    adminSecret: sessionToken,
  });
}
