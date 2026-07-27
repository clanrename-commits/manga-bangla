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
  | "adminLogin"
  | "adminPanel";

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
  facebookUrl: string;
  // actions: favorites + view
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setView: (view: View) => void;
  setSearch: (q: string) => void;
  toggleGenre: (genre: string) => void;
  clearGenres: () => void;
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
  // admin content actions
  postManga: (m: Manga) => void;
  deleteManga: (id: string) => void;
  setFacebookUrl: (url: string) => void;
}

export const useMangaStore = create<MangaState>()(
  persist(
    (set, get) => ({
      lang: "bn",
      favorites: [],
      view: "browse",
      search: "",
      selectedGenres: [],
      openMangaId: null,
      readerMangaId: null,
      readerChapterId: null,
      authDialog: "none",
      users: [ADMIN_USER],
      currentUser: null,
      adminManga: [],
      facebookUrl: DEFAULT_FACEBOOK_URL,

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
      clearGenres: () => set({ selectedGenres: [] }),
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
      deleteManga: (id) =>
        set((s) => ({ adminManga: s.adminManga.filter((m) => m.id !== id) })),
      setFacebookUrl: (url) => set({ facebookUrl: url }),
    }),
    {
      name: "manga-bangla-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        favorites: s.favorites,
        lang: s.lang,
        users: s.users,
        currentUser: s.currentUser,
        adminManga: s.adminManga,
        facebookUrl: s.facebookUrl,
      }),
    }
  )
);
