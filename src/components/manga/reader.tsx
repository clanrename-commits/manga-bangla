"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  X,
  List,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  MANGA_LIST,
  type Chapter,
} from "@/lib/manga-data";
import { useMangaStore } from "@/store/manga-store";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/manga-data";
import { toast } from "sonner";

// Generate deterministic placeholder "pages" so the reader looks like a real one.
// Each page is a tinted panel with the chapter / page number burned in.
function pageImage(mangaId: string, chapterId: string, page: number) {
  return `https://picsum.photos/seed/${mangaId}-${chapterId}-p${page}/900/1300`;
}

export function ReaderDialog() {
  const readerMangaId = useMangaStore((s) => s.readerMangaId);
  const readerChapterId = useMangaStore((s) => s.readerChapterId);
  const openReader = useMangaStore((s) => s.openReader);

  const manga = MANGA_LIST.find((m) => m.id === readerMangaId) ?? null;
  const chapter =
    manga?.chapters.find((c) => c.id === readerChapterId) ?? null;

  const open = Boolean(manga && chapter);
  const [page, setPage] = React.useState(0);
  const [chaptersOpen, setChaptersOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const totalPages = chapter?.pages ?? 0;
  const chapterIndex = manga && chapter
    ? manga.chapters.findIndex((c) => c.id === chapter.id)
    : -1;
  // manga.chapters is sorted newest first; "next" chapter is the older one (index+1)
  const nextChapter =
    chapterIndex >= 0 && chapterIndex < (manga?.chapters.length ?? 0) - 1
      ? manga!.chapters[chapterIndex + 1]
      : null;
  const prevChapter = chapterIndex > 0 ? manga!.chapters[chapterIndex - 1] : null;

  const nextPage = () => {
    setPage((p) => {
      if (p + 1 >= totalPages) {
        if (nextChapter && manga) {
          toast.success(`Moving to ${nextChapter.title}`);
          openReader(manga.id, nextChapter.id);
        }
        return p;
      }
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      return p + 1;
    });
  };

  const prevPage = () => {
    setPage((p) => {
      if (p === 0) {
        if (prevChapter && manga) {
          toast.info(`Going back to ${prevChapter.title}`);
          openReader(manga.id, prevChapter.id);
        }
        return p;
      }
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      return p - 1;
    });
  };

  // Reset page when chapter changes
  React.useEffect(() => {
    setPage(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [readerChapterId]);

  // Keyboard nav
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextPage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevPage();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onOpenChange = (next: boolean) => {
    if (!next) openReader(null, null);
  };

  if (!manga || !chapter) {
    return (
      <Dialog open={false} onOpenChange={() => openReader(null, null)}>
        <DialogContent />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[100vh] max-h-[100vh] w-[100vw] max-w-[100vw] gap-0 overflow-hidden rounded-none border-0 p-0 sm:h-[95vh] sm:max-h-[95vh] sm:max-w-5xl sm:rounded-xl sm:border">
        <DialogTitle className="sr-only">
          {manga.title} — Chapter {chapter.number}: {chapter.title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Reading page {page + 1} of {totalPages}.
        </DialogDescription>

        {/* Reader toolbar */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/95 px-3 backdrop-blur sm:px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close reader"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{manga.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              Ch. {chapter.number} — {chapter.title}
            </p>
          </div>

          {/* Page indicator + nav */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevPage}
              disabled={page === 0 && !prevChapter}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="min-w-[5.5rem] text-center text-xs font-medium text-muted-foreground tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextPage}
              disabled={page + 1 >= totalPages && !nextChapter}
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Chapter list */}
          <Sheet open={chaptersOpen} onOpenChange={setChaptersOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Chapters">
                <List className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetHeader>
                <SheetTitle>{manga.title}</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {manga.chapters.length} chapters
                </p>
              </SheetHeader>
              <ScrollArea className="scrollbar-manga mt-4 h-[calc(100vh-7rem)] pr-2">
                <ul className="flex flex-col gap-1">
                  {manga.chapters.map((c) => {
                    const active = c.id === chapter.id;
                    return (
                      <li key={c.id}>
                        <button
                          onClick={() => {
                            openReader(manga.id, c.id);
                            setChaptersOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition",
                            active
                              ? "border-primary bg-primary/10"
                              : "border-border/50 hover:border-primary/40 hover:bg-accent"
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-9 w-9 shrink-0 place-items-center rounded-md text-sm font-bold",
                              active
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            {c.number}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                              {c.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(c.releasedAt)} · {c.pages}p
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </header>

        {/* Page view */}
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto bg-background"
        >
          <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center px-2 py-4 sm:px-4">
            <div className="relative w-full overflow-hidden rounded-md border border-border/60 shadow-lg">
              <img
                key={`${chapter.id}-${page}`}
                src={pageImage(manga.id, chapter.id, page)}
                alt={`Page ${page + 1} of chapter ${chapter.number}`}
                className="block h-auto w-full"
                loading="eager"
              />
              {/* Page watermark */}
              <div className="pointer-events-none absolute right-3 top-3 rounded bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                {manga.title} · Ch.{chapter.number} · P.{page + 1}
              </div>
            </div>

            {/* Tap zones for mobile */}
            <div className="mt-4 flex w-full items-center justify-between gap-3 pb-6">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={page === 0 && !prevChapter}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <span className="text-xs text-muted-foreground">
                Use ← / → to navigate
              </span>
              <Button
                onClick={nextPage}
                disabled={page + 1 >= totalPages && !nextChapter}
                className="gap-2"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {page + 1 >= totalPages && (
              <div className="mb-6 w-full max-w-2xl rounded-xl border border-border/60 bg-card p-5 text-center">
                <h3 className="text-lg font-bold">End of Chapter {chapter.number}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  You finished <span className="text-foreground">{chapter.title}</span>.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {nextChapter ? (
                    <Button
                      onClick={() => openReader(manga.id, nextChapter.id)}
                      className="gap-2"
                    >
                      Next chapter: {nextChapter.title}{" "}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You&apos;ve reached the latest chapter. Check back soon!
                    </p>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="gap-2"
                  >
                    Close reader
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Floating scroll controls */}
          <div className="pointer-events-none sticky bottom-4 flex justify-center">
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border/60 bg-background/90 p-1 shadow-lg backdrop-blur">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() =>
                  scrollRef.current?.scrollBy({
                    top: -300,
                    behavior: "smooth",
                  })
                }
                aria-label="Scroll up"
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() =>
                  scrollRef.current?.scrollBy({
                    top: 300,
                    behavior: "smooth",
                  })
                }
                aria-label="Scroll down"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
