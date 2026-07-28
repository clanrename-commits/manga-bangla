import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const rows = await db.setting.findMany();
  const settings: Record<string, string> = {};
  for (const r of rows) settings[r.id] = r.value;
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const { isAdminRequest } = await import("@/lib/auth");
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  for (const [key, value] of Object.entries(body)) {
    await db.setting.upsert({
      where: { id: key },
      create: { id: key, value: String(value) },
      update: { value: String(value) },
    });
  }
  return NextResponse.json({ ok: true });
}
