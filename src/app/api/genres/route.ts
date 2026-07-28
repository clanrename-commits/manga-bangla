import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const genres = await db.genre.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ genres });
}

export async function POST(req: NextRequest) {
  const { isAdminRequest } = await import("@/lib/auth");
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }
  try {
    const genre = await db.genre.create({ data: { name: body.name.trim() } });
    return NextResponse.json({ genre }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Already exists" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const { isAdminRequest } = await import("@/lib/auth");
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await db.genre.deleteMany({ where: { name: body.name } });
  return NextResponse.json({ ok: true });
}
