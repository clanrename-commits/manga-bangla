import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

/**
 * POST /api/auth/admin-login
 * Body: { email, password }
 * Returns: { user, adminSecret } — adminSecret is the ADMIN_SECRET env var,
 * which the client uses to authenticate admin API calls.
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
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    adminSecret: process.env.ADMIN_SECRET,
  });
}
