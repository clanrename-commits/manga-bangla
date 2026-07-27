"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SearchX, HeartCrack, Flame, Sparkles } from "lucide-react";
import {
  getFullCatalog,
  getMangaTitle,
  type Manga,
} from "@/lib/manga-data";
import { useMangaStore } from "@/store/manga-store";
import { useT } from "@/lib/i18n";
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
      m.titleBn ?? "",
      m.author,
      m.artist ?? "",
      m.genres.join(" "),
      m.tags.join(" "),
      m.synopsis,
      m.synopsisBn ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function MangaExplorer() {
  const t = useT();
  const lang = useMangaStore((s) => s.lang);
  const view = useMangaStore((s) => s.view);
  const search = useMangaStore((s) => s.search);
  const selectedGenres = useMangaStore((s) => s.selectedGenres);
  const favorites = useMangaStore((s) => s.favorites);
  const adminManga = useMangaStore((s) => s.adminManga);
  const setView = useMangaStore((s) => s.setView);

  const showHero = view === "browse" && !search && selectedGenres.length === 0;

  const fullCatalog = React.useMemo(
    () => getFullCatalog(adminManga),
    [adminManga]
  );

  let scope = fullCatalog;
  let title = t.browseManga;
  let subtitle = t.browseSubtitle;

  if (view === "favorites") {
    scope = fullCatalog.filter((m) => favorites.includes(m.id));
    title = t.yourFavorites;
    subtitle =
      favorites.length === 0
        ? t.favoritesEmpty
        : t.favoritesCount(scope.length);
  } else if (view === "trending") {
    scope = fullCatalog.filter((m) => m.trending);
    title = t.trendingNow;
    subtitle = t.trendingSubtitle;
  }

  const results = filterManga({
    search,
    genres: selectedGenres,
    scope,
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      {showHero && <Hero />}

      {/* "First Manga in Bangla" prominent banner */}
      {showHero && (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-5 sm:p-6">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-lg font-extrabold tracking-tight sm:text-xl">
                    {lang === "bn" ? "প্রথম বাংলা মাঙ্গা" : "First Manga in Bangla"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lang === "bn"
                      ? "বাংলা ভাষায় প্রথম মাঙ্গা পড়ার প্ল্যাটফর্ম।"
                      : "The first-ever manga reading platform in Bangla."}
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={() => setView("browse")}
              >
                {t.browse}
              </Button>
            </div>
          </div>
        </div>
      )}

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
              {t.results(results.length)}
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
  const t = useT();
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
        {isFavoritesEmpty ? t.noFavorites : t.noResults}
      </h3>
      <p className="max-w-md text-sm text-muted-foreground">
        {isFavoritesEmpty ? t.noFavoritesDesc : t.noResultsDesc}
      </p>
      <Button onClick={onBrowse} className="mt-2">
        {t.browseCatalog}
      </Button>
    </div>
  );
}
