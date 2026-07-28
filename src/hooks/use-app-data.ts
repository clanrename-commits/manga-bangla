"use client";

import * as React from "react";
import { useMangaStore } from "@/store/manga-store";
import {
  fetchManga,
  fetchCategories,
  fetchGenres,
  fetchSettings,
  fetchFavorites,
  initGuest,
  getCurrentUser,
} from "@/lib/api-client";
import type { Manga } from "@/lib/manga-data";

/**
 * On app mount, fetch all server-side data (catalog, categories, genres,
 * settings, favorites) and hydrate the Zustand store. This is the bridge
 * between the Turso database and the client UI.
 */
export function useAppData() {
  const setCatalog = useMangaStore((s) => s.setCatalog);
  const setAdminCategories = useMangaStore((s) => s.setAdminCategories);
  const setAdminGenres = useMangaStore((s) => s.setAdminGenres);
  const setSettings = useMangaStore((s) => s.setSettings);
  const setFavorites = useMangaStore((s) => s.setFavorites);
  const setCurrentUser = useMangaStore((s) => s.setCurrentUser);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // 1. Initialize a guest user id for favorites
        await initGuest().catch(() => {});

        // 2. Fetch everything in parallel
        const [mangaRes, catRes, genreRes, settingsRes, favRes] = await Promise.all([
          fetchManga().catch(() => ({ manga: [] })),
          fetchCategories().catch(() => ({ categories: [] })),
          fetchGenres().catch(() => ({ genres: [] })),
          fetchSettings().catch(() => ({ settings: {} })),
          fetchFavorites().catch(() => ({ favorites: [] })),
        ]);

        if (cancelled) return;

        // 3. Normalize manga (API returns Prisma shape — adapt to Manga interface)
        const manga: Manga[] = (mangaRes.manga ?? []).map((m: any) => ({
          id: m.id,
          title: m.title,
          titleBn: m.titleBn ?? undefined,
          author: m.author,
          artist: m.artist ?? undefined,
          copyright: m.copyright ?? undefined,
          cover: m.cover,
          banner: m.banner ?? undefined,
          status: m.status,
          year: m.year,
          rating: m.rating,
          views: m.views,
          genres: (m.genres ?? []).map((g: any) => g.name),
          categories: (m.categories ?? []).map((c: any) => c.name),
          tags: [],
          synopsis: m.synopsis,
          synopsisBn: m.synopsisBn ?? undefined,
          chapters: (m.chapters ?? []).map((c: any) => ({
            id: c.id,
            number: c.number,
            title: c.title,
            pages: c.pagesCount,
            releasedAt: c.releasedAt,
          })),
          chapterPages: undefined, // fetched on demand in reader
          featured: m.featured,
          trending: m.trending,
          adminPosted: m.adminPosted,
        }));

        setCatalog(manga);
        setAdminCategories((catRes.categories ?? []).map((c: any) => c.name));
        setAdminGenres((genreRes.genres ?? []).map((g: any) => g.name));
        setSettings(settingsRes.settings ?? {});
        setFavorites(favRes.favorites ?? []);

        // 4. Try to restore an existing user session (admin or logged-in user)
        try {
          const userRes = await getCurrentUser();
          if (userRes.user && userRes.user.role !== "user") {
            setCurrentUser(userRes.user);
          } else if (userRes.user && userRes.user.email && !userRes.user.email.includes("@guest.")) {
            setCurrentUser(userRes.user);
          }
        } catch {
          /* guest user — that's fine */
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return loaded;
}
