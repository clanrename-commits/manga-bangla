import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateGuestUser } from "@/lib/auth";

/**
 * GET /api/favorites
 * Returns the user's favorite manga ids.
 * Header: x-user-id (guest user id, stored client-side)
 */
export async function GET(req: NextRequest) {
  const userId = await getOrCreateGuestUser(req);
  const favorites = await db.favorites.findMany({
    where: { userId },
    select: { mangaId: true },
  });
  return NextResponse.json({
    userId,
    favorites: favorites.map((f) => f.mangaId),
  });
}

/**
 * POST /api/favorites
 * Toggle a favorite.
 * Body: { mangaId }
 */
export async function POST(req: NextRequest) {
  const userId = await getOrCreateGuestUser(req);
  const body = await req.json();
  const { mangaId } = body;
  if (!mangaId) {
    return NextResponse.json({ error: "mangaId required" }, { status: 400 });
  }
  const existing = await db.favorites.findUnique({
    where: { userId_mangaId: { userId, mangaId } },
  });
  if (existing) {
    await db.favorites.delete({ where: { id: existing.id } });
    return NextResponse.json({ userId, favorited: false });
  }
  await db.favorites.create({ data: { userId, mangaId } });
  return NextResponse.json({ userId, favorited: true });
}
