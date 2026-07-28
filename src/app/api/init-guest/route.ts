import { NextRequest, NextResponse } from "next/server";
import { getOrCreateGuestUser } from "@/lib/auth";

/**
 * POST /api/init-guest
 * Ensures a guest user exists for the given (or new) x-user-id.
 * Returns the user id to store client-side.
 */
export async function POST(req: NextRequest) {
  const userId = await getOrCreateGuestUser(req);
  return NextResponse.json({ userId });
}
