"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Eye,
  Heart,
  Calendar,
  BookOpen,
  User,
  Brush,
  Play,
  Check,
  Clock,
} from "lucide-react";
import {
  MANGA_LIST,
  formatViews,
  formatDate,
  type Manga,
  type Chapter,
} from "@/lib/manga-data";
import { useMangaStore } from "@/store/manga-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MangaDetailDialog() {
  const openMangaId = useMangaStore((s) => s.openMangaId);
  const openManga = useMangaStore((s) => s.openManga);
  const openReader = useMangaStore((s) => s.openReader);
  const favorites = useMangaStore((s) => s.favorites);
  const toggleFavorite = useMangaStore((s) => s.toggleFavorite);

  const manga = MANGA_LIST.find((m) => m.id === openMangaId) ?? null;
  const open = Boolean(manga);

  // Lock body scroll when open
  const onOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) openManga(null);
    },
    [openManga]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-3xl">
        {manga && (
          <DetailBody
            manga={manga}
            isFav={favorites.includes(manga.id)}
            onToggleFav={() => {
              const wasFav = favorites.includes(manga.id);
              toggleFavorite(manga.id);
              toast.success(
                wasFav
                  ? `Removed "${manga.title}" from favorites`
                  : `Added "${manga.title}" to favorites`
              );
            }}
            onReadChapter={(ch) => {
              openReader(manga.id, ch.id);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailBody({
  manga,
  isFav,
  onToggleFav,
  onReadChapter,
}: {
  manga: Manga;
  isFav: boolean;
  onToggleFav: () => void;
  onReadChapter: (c: Chapter) => void;
}) {
  const firstChapter = manga.chapters[manga.chapters.length - 1];
  const latestChapter = manga.chapters[0];

  return (
    <>
      {/* Banner header */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-56">
        <img
          src={manga.banner}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <DialogHeader className="sr-only">
          <DialogTitle>{manga.title}</DialogTitle>
          <DialogDescription>{manga.synopsis.slice(0, 140)}</DialogDescription>
        </DialogHeader>
      </div>

      <ScrollArea className="scrollbar-manga max-h-[calc(92vh-11rem)]">
        <div className="grid gap-6 px-5 pb-6 pt-0 sm:grid-cols-[200px_1fr] sm:px-6">
          {/* Cover + actions */}
          <div className="-mt-16 sm:-mt-20">
            <div className="overflow-hidden rounded-xl border border-border/60 shadow-xl">
              <img
                src={manga.cover}
                alt={`Cover of ${manga.title}`}
                className="aspect-[2/3] w-full object-cover"
              />
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Button
                className="gap-2"
                onClick={() => firstChapter && onReadChapter(firstChapter)}
              >
                <Play className="h-4 w-4" /> Read from start
              </Button>
              <Button
                variant={isFav ? "default" : "outline"}
                onClick={onToggleFav}
                className="gap-2"
                aria-pressed={isFav}
              >
                {isFav ? (
                  <>
                    <Check className="h-4 w-4" /> Favorited
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4" /> Add to favorites
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Main info */}
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  {manga.status}
                </Badge>
                <Badge variant="outline">{manga.year}</Badge>
                {manga.trending && (
                  <Badge variant="secondary">Trending</Badge>
                )}
              </div>
              <h2 className="text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">
                {manga.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> {manga.author}
                </span>
                {manga.artist && manga.artist !== manga.author && (
                  <span className="inline-flex items-center gap-1">
                    <Brush className="h-3.5 w-3.5" /> {manga.artist}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {manga.year}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold">{manga.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">/ 10</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Eye className="h-4 w-4" /> {formatViews(manga.views)} reads
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen className="h-4 w-4" /> {manga.chapters.length} chapters
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {manga.genres.map((g) => (
                <Badge key={g} variant="secondary">
                  {g}
                </Badge>
              ))}
              {manga.tags.map((t) => (
                <Badge key={t} variant="outline" className="text-muted-foreground">
                  #{t}
                </Badge>
              ))}
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Synopsis
              </h3>
              <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                {manga.synopsis}
              </p>
            </div>

            <Separator />

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Chapters ({manga.chapters.length})
                </h3>
                {latestChapter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-primary"
                    onClick={() => onReadChapter(latestChapter)}
                  >
                    <Play className="h-3.5 w-3.5" /> Read latest
                  </Button>
                )}
              </div>
              <ul className="grid max-h-80 grid-cols-1 gap-1 overflow-y-auto pr-1 sm:grid-cols-2">
                {manga.chapters.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => onReadChapter(c)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-left transition",
                        "hover:border-primary/50 hover:bg-accent"
                      )}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                        {c.number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {c.title}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(c.releasedAt)}
                          <span aria-hidden>·</span>
                          {c.pages} pages
                        </span>
                      </span>
                      <Play className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
