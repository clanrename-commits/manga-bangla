"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Eye, Play, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MANGA_LIST, formatViews, type Manga } from "@/lib/manga-data";
import { useMangaStore } from "@/store/manga-store";
import { cn } from "@/lib/utils";

const FEATURED = MANGA_LIST.filter((m) => m.featured).slice(0, 4);

export function Hero() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const openManga = useMangaStore((s) => s.openManga);
  const openReader = useMangaStore((s) => s.openReader);

  const next = React.useCallback(
    () => setIndex((i) => (i + 1) % FEATURED.length),
    []
  );
  const prev = React.useCallback(
    () => setIndex((i) => (i - 1 + FEATURED.length) % FEATURED.length),
    []
  );

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, paused]);

  const manga = FEATURED[index];
  if (!manga) return null;

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={manga.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative h-[60vh] min-h-[460px] w-full"
        >
          {/* Banner */}
          <div className="absolute inset-0">
            <img
              src={manga.banner}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative mx-auto flex h-full max-w-7xl items-end gap-8 px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
            <div className="hidden shrink-0 md:block">
              <div className="overflow-hidden rounded-xl border border-border/60 shadow-2xl">
                <img
                  src={manga.cover}
                  alt={`Cover of ${manga.title}`}
                  className="h-72 w-48 object-cover"
                />
              </div>
            </div>

            <div className="max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="gap-1 bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 fill-current" /> Featured
                </Badge>
                <Badge variant="secondary">{manga.status}</Badge>
                <Badge variant="outline">{manga.year}</Badge>
              </div>
              <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {manga.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                by <span className="text-foreground/90">{manga.author}</span>
                {manga.artist && manga.artist !== manga.author && (
                  <>
                    {" "}· art by <span className="text-foreground/90">{manga.artist}</span>
                  </>
                )}
              </p>
              <p className="line-clamp-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                {manga.synopsis}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold">{manga.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">/ 10</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {formatViews(manga.views)} reads
                </div>
                <div className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
                  · {manga.chapters.length} chapters
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    const first = manga.chapters[manga.chapters.length - 1];
                    if (first) openReader(manga.id, first.id);
                  }}
                >
                  <Play className="h-4 w-4" /> Read first chapter
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => openManga(manga.id)}
                >
                  View details
                </Button>
                <FavoriteButton manga={manga} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-2 sm:px-4">
        <button
          onClick={prev}
          aria-label="Previous featured manga"
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-background/70 backdrop-blur-sm transition hover:bg-background"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next featured manga"
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-background/70 backdrop-blur-sm transition hover:bg-background"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {FEATURED.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full bg-foreground/30 transition-all",
              i === index ? "w-8 bg-primary" : "w-2 hover:bg-foreground/60"
            )}
          />
        ))}
      </div>
    </section>
  );
}

function FavoriteButton({ manga }: { manga: Manga }) {
  const favorites = useMangaStore((s) => s.favorites);
  const toggle = useMangaStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(manga.id);
  return (
    <Button
      size="lg"
      variant="outline"
      className="gap-2"
      onClick={() => toggle(manga.id)}
      aria-pressed={isFav}
    >
      {isFav ? (
        <>
          <Check className="h-4 w-4" /> Favorited
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" /> Add to favorites
        </>
      )}
    </Button>
  );
}
