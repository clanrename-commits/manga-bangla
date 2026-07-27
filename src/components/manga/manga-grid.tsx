"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SearchX, HeartCrack, Flame } from "lucide-react";
import {
  MANGA_LIST,
  type Manga,
} from "@/lib/manga-data";
import { useMangaStore } from "@/store/manga-store";
import { MangaCard } from "./manga-card";
import { GenreFilter } from "./genre-filter";
import { Hero } from "./hero";
import { Button } from "@/components/ui/button";

function filterManga(opts: {
  search: string;
  genres: string[];
  scope: Manga[];
}): Manga[] {
  const { search, genres, scope } = opts;
  const q = search.trim().toLowerCase();
  return scope.filter((m) => {
    if (genres.length > 0 && !genres.every((g) => m.genres.includes(g))) {
      return false;
    }
    if (!q) return true;
    const hay = [
      m.title,
      m.author,
      m.artist ?? "",
      m.genres.join(" "),
      m.tags.join(" "),
      m.synopsis,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function MangaExplorer() {
  const view = useMangaStore((s) => s.view);
  const search = useMangaStore((s) => s.search);
  const selectedGenres = useMangaStore((s) => s.selectedGenres);
  const favorites = useMangaStore((s) => s.favorites);
  const setView = useMangaStore((s) => s.setView);

  const showHero = view === "browse" && !search && selectedGenres.length === 0;

  let scope = MANGA_LIST;
  let title = "Browse Manga";
  let subtitle =
    "Discover hundreds of titles across every genre. Pick a favorite and start reading in seconds.";

  if (view === "favorites") {
    scope = MANGA_LIST.filter((m) => favorites.includes(m.id));
    title = "Your Favorites";
    subtitle =
      favorites.length === 0
        ? "Tap the heart on any manga to save it here for later."
        : `${scope.length} saved title${scope.length === 1 ? "" : "s"}.`;
  } else if (view === "trending") {
    scope = MANGA_LIST.filter((m) => m.trending);
    title = "Trending Now";
    subtitle = "What everyone is reading this week.";
  }

  const results = filterManga({
    search,
    genres: selectedGenres,
    scope,
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      {showHero && <Hero />}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Section header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {view === "trending" && (
                  <Flame className="h-7 w-7 text-primary" />
                )}
                {title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
          </div>

          {/* Filters */}
          {view !== "favorites" && (
            <GenreFilter />
          )}

          {/* Grid */}
          {results.length === 0 ? (
            <EmptyState
              view={view}
              hasFavorites={favorites.length > 0}
              onBrowse={() => setView("browse")}
            />
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            >
              {results.map((m, i) => (
                <MangaCard key={m.id} manga={m} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({
  view,
  hasFavorites,
  onBrowse,
}: {
  view: string;
  hasFavorites: boolean;
  onBrowse: () => void;
}) {
  const isFavoritesEmpty = view === "favorites" && !hasFavorites;
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
        {isFavoritesEmpty ? (
          <HeartCrack className="h-7 w-7" />
        ) : (
          <SearchX className="h-7 w-7" />
        )}
      </div>
      <h3 className="text-lg font-semibold">
        {isFavoritesEmpty
          ? "No favorites yet"
          : "No manga match your search"}
      </h3>
      <p className="max-w-md text-sm text-muted-foreground">
        {isFavoritesEmpty
          ? "Browse the catalog and tap the heart on any cover to save it here."
          : "Try a different title, author, or clear some filters."}
      </p>
      <Button onClick={onBrowse} className="mt-2">
        Browse the catalog
      </Button>
    </div>
  );
}
