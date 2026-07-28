import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/manga/[id]
 * Returns a single manga with chapters + chapter pages.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const manga = await db.manga.findUnique({
    where: { id },
    include: {
      categories: true,
      genres: true,
      chapters: {
        orderBy: { number: "asc" },
        include: { pages: { orderBy: { seq: "asc" } } },
      },
    },
  });
  if (!manga) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ manga });
}

/**
 * PUT /api/manga/[id]
 * Admin-only: update a manga.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isAdminRequest } = await import("@/lib/auth");
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();

  const categoryNames: string[] = body.categories ?? [];
  const genreNames: string[] = body.genres ?? [];

  const categories = await db.category.findMany({
    where: { name: { in: categoryNames } },
  });
  const genres = await db.genre.findMany({
    where: { name: { in: genreNames } },
  });

  const manga = await db.manga.update({
    where: { id },
    data: {
      title: body.title,
      titleBn: body.titleBn || null,
      author: body.author,
      artist: body.artist || null,
      copyright: body.copyright || null,
      cover: body.cover,
      banner: body.banner || null,
      status: body.status,
      year: body.year,
      synopsis: body.synopsis,
      synopsisBn: body.synopsisBn || null,
      featured: body.featured,
      trending: body.trending,
      categories: { set: [], connect: categories.map((c) => ({ id: c.id })) },
      genres: { set: [], connect: genres.map((g) => ({ id: g.id })) },
    },
    include: {
      categories: true,
      genres: true,
      chapters: { orderBy: { number: "asc" } },
    },
  });

  // If chapter pages provided, replace them
  if (body.chapterPages && typeof body.chapterPages === "object") {
    for (const chapter of manga.chapters) {
      const pages = (body.chapterPages as Record<string, Array<{ type: string; src: string; name?: string }>>)[chapter.id] ??
        [];
      if (pages.length === 0) continue;
      // Delete existing pages for this chapter
      await db.chapterPage.deleteMany({ where: { chapterId: chapter.id } });
      // Insert new pages in order
      await db.chapterPage.createMany({
        data: pages.map((p, idx) => ({
          chapterId: chapter.id,
          seq: idx,
          type: p.type,
          src: p.src,
          name: p.name || null,
        })),
      });
      // Update chapter.pagesCount
      await db.chapter.update({
        where: { id: chapter.id },
        data: { pagesCount: pages.length },
      });
    }
  }

  return NextResponse.json({ manga });
}

/**
 * DELETE /api/manga/[id]
 * Admin-only: delete a manga (cascades to chapters + pages).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isAdminRequest } = await import("@/lib/auth");
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await db.manga.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
