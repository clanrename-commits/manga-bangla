"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type View = "browse" | "favorites" | "trending";

interface MangaState {
  favorites: string[];
  view: View;
  search: string;
  selectedGenres: string[];
  // Reader state
  openMangaId: string | null; // detail dialog
  readerMangaId: string | null; // reader dialog
  readerChapterId: string | null;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setView: (view: View) => void;
  setSearch: (q: string) => void;
  toggleGenre: (genre: string) => void;
  clearGenres: () => void;
  openManga: (id: string | null) => void;
  openReader: (mangaId: string | null, chapterId: string | null) => void;
}

export const useMangaStore = create<MangaState>()(
  persist(
    (set, get) => ({
      favorites: [],
      view: "browse",
      search: "",
      selectedGenres: [],
      openMangaId: null,
      readerMangaId: null,
      readerChapterId: null,
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
    }),
    {
      name: "manga-reader-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ favorites: s.favorites }),
    }
  )
);
