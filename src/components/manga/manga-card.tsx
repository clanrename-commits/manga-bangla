"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Eye, Heart, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MANGA_LIST,
  formatViews,
  type Manga,
} from "@/lib/manga-data";
import { useMangaStore } from "@/store/manga-store";
import { cn } from "@/lib/utils";

interface MangaCardProps {
  manga: Manga;
  index?: number;
}

export function MangaCard({ manga, index = 0 }: MangaCardProps) {
  const openManga = useMangaStore((s) => s.openManga);
  const openReader = useMangaStore((s) => s.openReader);
  const favorites = useMangaStore((s) => s.favorites);
  const toggleFavorite = useMangaStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(manga.id);

  const latest = manga.chapters[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
    >
      {/* Cover */}
      <button
        onClick={() => openManga(manga.id)}
        className="relative block aspect-[2/3] w-full overflow-hidden"
        aria-label={`View details for ${manga.title}`}
      >
        <img
          src={manga.cover}
          alt={`Cover of ${manga.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-90" />

        {/* Top badges */}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {manga.trending && (
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
              Trending
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(manga.id);
          }}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFav}
          className={cn(
            "absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full backdrop-blur-sm transition",
            isFav
              ? "bg-primary text-primary-foreground"
              : "bg-black/40 text-white hover:bg-black/60"
          )}
        >
          <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
        </button>

        {/* Bottom info on cover */}
        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          <div className="mb-1 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{manga.rating.toFixed(1)}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 text-white/80">
              <Eye className="h-3 w-3" />
              {formatViews(manga.views)}
            </span>
          </div>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-balance">
            {manga.title}
          </h3>
        </div>
      </button>

      {/* Footer */}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-wrap gap-1">
          {manga.genres.slice(0, 2).map((g) => (
            <Badge key={g} variant="secondary" className="text-[10px] font-medium">
              {g}
            </Badge>
          ))}
          {manga.genres.length > 2 && (
            <Badge variant="outline" className="text-[10px]">
              +{manga.genres.length - 2}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 flex-1 gap-1.5"
            onClick={() => latest && openReader(manga.id, latest.id)}
            disabled={!latest}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Read
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => openManga(manga.id)}
          >
            Details
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export function MangaCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card">
      <div className="aspect-[2/3] w-full animate-pulse bg-muted" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-8 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export { MANGA_LIST };
