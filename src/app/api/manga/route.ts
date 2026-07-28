import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/manga
 * Returns the full manga catalog with categories, genres, chapters.
 */
export async function GET() {
  const manga = await db.manga.findMany({
    orderBy: [{ adminPosted: "desc" }, { createdAt: "desc" }],
    include: {
      categories: true,
      genres: true,
      chapters: {
        orderBy: { number: "asc" },
      },
    },
  });
  return NextResponse.json({ manga });
}

/**
 * POST /api/manga
 * Admin-only: create a new manga.
 * Headers: x-admin-secret
 */
export async function POST(req: NextRequest) {
  const { isAdminRequest } = await import("@/lib/auth");
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Validate required fields
  if (!body.title || !body.author) {
    return NextResponse.json(
      { error: "title and author are required" },
      { status: 400 }
    );
  }

  // Resolve category and genre ids by name
  const categoryNames: string[] = body.categories ?? ["Manga"];
  const genreNames: string[] = body.genres ?? ["Action"];

  const categories = await db.category.findMany({
    where: { name: { in: categoryNames } },
  });
  const genres = await db.genre.findMany({
    where: { name: { in: genreNames } },
  });

  // Create the manga with relations
  const manga = await db.manga.create({
    data: {
      title: body.title,
      titleBn: body.titleBn || null,
      author: body.author,
      artist: body.artist || null,
      copyright: body.copyright || null,
      cover: body.cover || `https://picsum.photos/seed/${encodeURIComponent(body.title)}/600/900`,
      banner: body.banner || `https://picsum.photos/seed/${encodeURIComponent(body.title)}-ban/1600/700`,
      status: body.status || "Ongoing",
      year: body.year || new Date().getFullYear(),
      rating: body.rating ?? 8.5,
      views: 0,
      synopsis: body.synopsis || body.title,
      synopsisBn: body.synopsisBn || null,
      featured: body.featured ?? true,
      trending: body.trending ?? true,
      adminPosted: true,
      categories: { connect: categories.map((c) => ({ id: c.id })) },
      genres: { connect: genres.map((g) => ({ id: g.id })) },
      chapters: {
        create: Array.from({ length: body.chaptersCount ?? 1 }, (_, i) => ({
          number: i + 1,
          title: `Chapter ${i + 1}`,
          pagesCount: body.chapterPages?.[i]?.length ?? 12,
          releasedAt: new Date(Date.now() - i * 7 * 86400000),
        })),
      },
    },
    include: {
      categories: true,
      genres: true,
      chapters: { orderBy: { number: "asc" } },
    },
  });

  // Save uploaded chapter pages (image data URLs / PDF data URLs)
  if (body.chapterPages && typeof body.chapterPages === "object") {
    for (const chapter of manga.chapters) {
      const pages = (body.chapterPages as Record<string, Array<{ type: string; src: string; name?: string }>>)[chapter.id] ??
        (body.chapterPages as Record<string, Array<{ type: string; src: string; name?: string }>>)[`c${chapter.number}`] ??
        [];
      if (pages.length === 0) continue;
      await db.chapterPage.createMany({
        data: pages.map((p, idx) => ({
          chapterId: chapter.id,
          seq: idx,
          type: p.type,
          src: p.src,
          name: p.name || null,
        })),
      });
    }
  }

  return NextResponse.json({ manga }, { status: 201 });
}
