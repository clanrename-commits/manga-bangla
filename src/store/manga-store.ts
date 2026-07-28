"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Lang } from "@/lib/i18n";
import type { Manga, ChapterPage } from "@/lib/manga-data";
import { indexedDBStorage } from "@/lib/indexed-db-storage";

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
  password: string; // demo only — not for production
  role: "user" | "admin";
}

const ADMIN_USER: User = {
  id: "admin-001",
  name: "Admin",
  email: "admin@mangabangla.com",
  password: "admin123",
  role: "admin",
};

const DEFAULT_FACEBOOK_URL = "https://facebook.com/mangabangla";
const DEFAULT_SITE_NAME = "Manga Bangla";
const DEFAULT_COPYRIGHT = "© Manga Bangla";

interface MangaState {
  // i18n
  lang: Lang;
  setLang: (lang: Lang) => void;
  // favorites
  favorites: string[];
  // view / search
  view: View;
  search: string;
  selectedGenres: string[];
  selectedCategories: string[];
  // overlays
  openMangaId: string | null;
  readerMangaId: string | null;
  readerChapterId: string | null;
  authDialog: AuthDialog;
  // auth
  users: User[];
  currentUser: User | null;
  // admin content
  adminManga: Manga[];
  adminGenres: string[];
  adminCategories: string[];
  facebookUrl: string;
  siteName: string;
  defaultCopyright: string;
  // actions: favorites + view
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setView: (view: View) => void;
  setSearch: (q: string) => void;
  toggleGenre: (genre: string) => void;
  toggleCategory: (category: string) => void;
  clearGenres: () => void;
  clearCategories: () => void;
  openManga: (id: string | null) => void;
  openReader: (mangaId: string | null, chapterId: string | null) => void;
  setAuthDialog: (d: AuthDialog) => void;
  // auth actions
  register: (
    name: string,
    email: string,
    password: string
  ) => { ok: boolean; error?: string };
  login: (
    email: string,
    password: string
  ) => { ok: boolean; error?: string };
  logout: () => void;
  // admin content actions — manga CRUD
  postManga: (m: Manga) => void;
  updateManga: (id: string, patch: Partial<Manga>) => void;
  deleteManga: (id: string) => void;
  setChapterPages: (mangaId: string, chapterId: string, pages: ChapterPage[]) => void;
  // admin content actions — genres CRUD
  addGenre: (g: string) => void;
  deleteGenre: (g: string) => void;
  // admin content actions — categories CRUD
  addCategory: (c: string) => void;
  deleteCategory: (c: string) => void;
  // admin settings
  setFacebookUrl: (url: string) => void;
  setSiteName: (name: string) => void;
  setDefaultCopyright: (c: string) => void;
}

export const useMangaStore = create<MangaState>()(
  persist(
    (set, get) => ({
      lang: "bn",
      favorites: [],
      view: "browse",
      search: "",
      selectedGenres: [],
      selectedCategories: [],
      openMangaId: null,
      readerMangaId: null,
      readerChapterId: null,
      authDialog: "none",
      users: [ADMIN_USER],
      currentUser: null,
      adminManga: [],
      adminGenres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Supernatural"],
      adminCategories: ["Manga", "Manhwa", "Manhua", "Webtoon", "One-shot"],
      facebookUrl: DEFAULT_FACEBOOK_URL,
      siteName: DEFAULT_SITE_NAME,
      defaultCopyright: DEFAULT_COPYRIGHT,

      setLang: (lang) => set({ lang }),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),
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

      register: (name, email, password) => {
        const exists = get().users.some(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) return { ok: false, error: "emailExists" };
        const user: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
          role: "user",
        };
        set((s) => ({ users: [...s.users, user], currentUser: user }));
        return { ok: true };
      },
      login: (email, password) => {
        const user = get().users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );
        if (!user) return { ok: false, error: "invalidCredentials" };
        set({ currentUser: user });
        return { ok: true };
      },
      logout: () => set({ currentUser: null }),

      postManga: (m) => set((s) => ({ adminManga: [m, ...s.adminManga] })),
      updateManga: (id, patch) =>
        set((s) => ({
          adminManga: s.adminManga.map((m) =>
            m.id === id ? { ...m, ...patch } : m
          ),
        })),
      deleteManga: (id) =>
        set((s) => ({ adminManga: s.adminManga.filter((m) => m.id !== id) })),
      setChapterPages: (mangaId, chapterId, pages) =>
        set((s) => ({
          adminManga: s.adminManga.map((m) =>
            m.id === mangaId
              ? {
                  ...m,
                  chapterPages: {
                    ...(m.chapterPages ?? {}),
                    [chapterId]: pages,
                  },
                }
              : m
          ),
        })),

      addGenre: (g) =>
        set((s) => {
          const v = g.trim();
          if (!v || s.adminGenres.includes(v)) return s;
          return { adminGenres: [...s.adminGenres, v].sort() };
        }),
      deleteGenre: (g) =>
        set((s) => ({ adminGenres: s.adminGenres.filter((x) => x !== g) })),
      addCategory: (c) =>
        set((s) => {
          const v = c.trim();
          if (!v || s.adminCategories.includes(v)) return s;
          return { adminCategories: [...s.adminCategories, v].sort() };
        }),
      deleteCategory: (c) =>
        set((s) => ({
          adminCategories: s.adminCategories.filter((x) => x !== c),
        })),

      setFacebookUrl: (url) => set({ facebookUrl: url }),
      setSiteName: (name) => set({ siteName: name }),
      setDefaultCopyright: (c) => set({ defaultCopyright: c }),
    }),
    {
      name: "manga-bangla-store-v3",
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (s) => ({
        favorites: s.favorites,
        lang: s.lang,
        users: s.users,
        currentUser: s.currentUser,
        adminManga: s.adminManga,
        adminGenres: s.adminGenres,
        adminCategories: s.adminCategories,
        facebookUrl: s.facebookUrl,
        siteName: s.siteName,
        defaultCopyright: s.defaultCopyright,
      }),
    }
  )
);
