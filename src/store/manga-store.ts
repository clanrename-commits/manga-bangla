"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Lang } from "@/lib/i18n";
import type { Manga } from "@/lib/manga-data";

export type View = "browse" | "favorites" | "trending";
export type AuthDialog =
  | "none"
  | "login"
  | "register"
  | "adminLogin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface MangaState {
  // i18n
  lang: Lang;
  setLang: (lang: Lang) => void;
  // view / search (client-only state)
  view: View;
  search: string;
  selectedGenres: string[];
  selectedCategories: string[];
  setView: (view: View) => void;
  setSearch: (q: string) => void;
  toggleGenre: (genre: string) => void;
  toggleCategory: (category: string) => void;
  clearGenres: () => void;
  clearCategories: () => void;
  // overlays (client-only state)
  openMangaId: string | null;
  readerMangaId: string | null;
  readerChapterId: string | null;
  authDialog: AuthDialog;
  openManga: (id: string | null) => void;
  openReader: (mangaId: string | null, chapterId: string | null) => void;
  setAuthDialog: (d: AuthDialog) => void;
  // auth (client-only state — actual data lives in DB)
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  // server data caches (not persisted — fetched on mount)
  catalog: Manga[];
  setCatalog: (m: Manga[]) => void;
  adminGenres: string[];
  setAdminGenres: (g: string[]) => void;
  adminCategories: string[];
  setAdminCategories: (c: string[]) => void;
  facebookUrl: string;
  siteName: string;
  defaultCopyright: string;
  setSettings: (s: { facebookUrl?: string; siteName?: string; defaultCopyright?: string }) => void;
  // favorites (user-specific, fetched from API)
  favorites: string[];
  setFavorites: (ids: string[]) => void;
  toggleFavoriteLocal: (id: string) => void;
}

export const useMangaStore = create<MangaState>()(
  persist(
    (set) => ({
      lang: "bn",
      view: "browse",
      search: "",
      selectedGenres: [],
      selectedCategories: [],
      openMangaId: null,
      readerMangaId: null,
      readerChapterId: null,
      authDialog: "none",
      currentUser: null,
      catalog: [],
      adminGenres: [],
      adminCategories: [],
      facebookUrl: "https://facebook.com/mangabangla",
      siteName: "Manga Bangla",
      defaultCopyright: "© Manga Bangla",
      favorites: [],

      setLang: (lang) => set({ lang }),
      setView: (view) => set({ view }),
      setSearch: (q) => set({ search: q }),
      toggleGenre: (genre) =>
        set((s) => ({
          selectedGenres: s.selectedGenres.includes(genre)
            ? s.selectedGenres.filter((g) => g !== genre)
            : [...s.selectedGenres, genre],
        })),
      toggleCategory: (cat) =>
        set((s) => ({
          selectedCategories: s.selectedCategories.includes(cat)
            ? s.selectedCategories.filter((c) => c !== cat)
            : [...s.selectedCategories, cat],
        })),
      clearGenres: () => set({ selectedGenres: [] }),
      clearCategories: () => set({ selectedCategories: [] }),
      openManga: (id) => set({ openMangaId: id }),
      openReader: (mangaId, chapterId) =>
        set({ readerMangaId: mangaId, readerChapterId: chapterId }),
      setAuthDialog: (authDialog) => set({ authDialog }),
      setCurrentUser: (currentUser) => set({ currentUser }),
      setCatalog: (catalog) => set({ catalog }),
      setAdminGenres: (adminGenres) => set({ adminGenres }),
      setAdminCategories: (adminCategories) => set({ adminCategories }),
      setSettings: (s) =>
        set((state) => ({
          facebookUrl: s.facebookUrl ?? state.facebookUrl,
          siteName: s.siteName ?? state.siteName,
          defaultCopyright: s.defaultCopyright ?? state.defaultCopyright,
        })),
      setFavorites: (favorites) => set({ favorites }),
      toggleFavoriteLocal: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
    }),
    {
      name: "manga-bangla-ui-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist UI preferences — NOT catalog/favorites/users (those come from the DB)
      partialize: (s) => ({
        lang: s.lang,
        view: s.view,
        currentUser: s.currentUser,
      }),
    }
  )
);
