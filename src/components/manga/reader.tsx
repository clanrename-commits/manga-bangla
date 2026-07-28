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
  FileText,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/manga-data";
import { useMangaStore } from "@/store/manga-store";
import { useT } from "@/lib/i18n";
import { fetchMangaById } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Fallback deterministic page image when no uploaded pages exist.
function fallbackPageImage(mangaId: string, chapterId: string, page: number) {
  return `https://picsum.photos/seed/${mangaId}-${chapterId}-p${page}/900/1300`;
}

export function ReaderDialog() {
  const t = useT();
  const readerMangaId = useMangaStore((s) => s.readerMangaId);
  const readerChapterId = useMangaStore((s) => s.readerChapterId);
  const openReader = useMangaStore((s) => s.openReader);
  const catalog = useMangaStore((s) => s.catalog);

  const manga = catalog.find((m) => m.id === readerMangaId) ?? null;
  const chapter =
    manga?.chapters.find((c) => c.id === readerChapterId) ?? null;

  const open = Boolean(manga && chapter);
  const [page, setPage] = React.useState(0);
  const [chaptersOpen, setChaptersOpen] = React.useState(false);
  const [uploadedPages, setUploadedPages] = React.useState<
    { id: string; type: "image" | "pdf"; src: string; name?: string }[]
  >([]);
  const [pagesLoaded, setPagesLoaded] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Fetch chapter pages on demand from the API
  React.useEffect(() => {
    if (!manga || !chapter) {
      setUploadedPages([]);
      setPagesLoaded(false);
      return;
    }
    setPagesLoaded(false);
    setUploadedPages([]);
    fetchMangaById(manga.id)
      .then((data) => {
        const ch = data.manga?.chapters?.find((c: any) => c.id === chapter.id);
        if (ch?.pages && ch.pages.length > 0) {
          setUploadedPages(
            ch.pages.map((p: any) => ({
              id: p.id,
              type: p.type,
              src: p.src,
              name: p.name ?? undefined,
            }))
          );
        }
      })
      .catch(() => {
        /* fallback to generated pages */
      })
      .finally(() => setPagesLoaded(true));
  }, [manga, chapter]);

  // Pages for this chapter: uploaded (image or PDF) or fallback generated images.
  const pages = React.useMemo(() => {
    if (!manga || !chapter) return [];
    if (uploadedPages.length > 0) return uploadedPages;
    // Fallback: build N image pages using chapter.pages count
    return Array.from({ length: chapter.pages }, (_, i) => ({
      id: `fallback-${i}`,
      type: "image" as const,
      src: fallbackPageImage(manga.id, chapter.id, i),
      name: undefined,
    }));
  }, [manga, chapter, uploadedPages]);

  const totalPages = pages.length || chapter?.pages || 0;
  const chapterIndex = manga && chapter
    ? manga.chapters.findIndex((c) => c.id === chapter.id)
    : -1;
  const nextChapter =
    chapterIndex >= 0 && chapterIndex < (manga?.chapters.length ?? 0) - 1
      ? manga!.chapters[chapterIndex + 1]
      : null;
  const prevChapter = chapterIndex > 0 ? manga!.chapters[chapterIndex - 1] : null;

  const nextPage = () => {
    setPage((p) => {
      if (p + 1 >= totalPages) {
        if (nextChapter && manga) {
          toast.success(`${t.nextChapter}: ${nextChapter.title}`);
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
          toast.info(`${t.prev}: ${prevChapter.title}`);
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

  const currentPage = pages[page];
  const isPdf = currentPage?.type === "pdf";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-[100vw] max-w-[100vw] flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:h-[95vh] sm:max-h-[95vh] sm:max-w-5xl sm:rounded-xl sm:border">
        <DialogTitle className="sr-only">
          {manga.title} — {t.chaptersList} {chapter.number}: {chapter.title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t.page} {page + 1} {t.of} {totalPages}.
        </DialogDescription>

        {/* Reader toolbar */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/95 px-3 backdrop-blur sm:px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label={t.closeReader}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold" dir="auto">
              {manga.titleBn && useMangaStore.getState().lang === "bn"
                ? manga.titleBn
                : manga.title}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {t.chaptersList} {chapter.number} — {chapter.title}
            </p>
          </div>

          {/* Page indicator + nav */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevPage}
              disabled={page === 0 && !prevChapter}
              aria-label={t.prevPage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="min-w-[5.5rem] text-center text-xs font-medium text-muted-foreground tabular-nums">
              {page + 1} {t.of} {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextPage}
              disabled={page + 1 >= totalPages && !nextChapter}
              aria-label={t.nextPage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Chapter list */}
          <Sheet open={chaptersOpen} onOpenChange={setChaptersOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t.chaptersList}>
                <List className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetHeader>
                <SheetTitle>{t.chaptersList}</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {manga.chapters.length} {t.chapters}
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
                              {formatDate(c.releasedAt)} · {c.pages} {t.pages}
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
          className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-background"
        >
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center px-2 py-4 sm:px-4">
            <div className="relative w-full max-w-full overflow-hidden rounded-md border border-border/60 shadow-lg">
              {isPdf ? (
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-muted p-6 text-center">
                  <FileText className="h-16 w-16 text-destructive" />
                  <div>
                    <p className="text-sm font-semibold">{t.pdfViewer}</p>
                    <p className="mt-1 max-w-md text-xs text-muted-foreground" dir="auto">
                      {currentPage?.name ?? t.pdfPage}
                    </p>
                  </div>
                  <a
                    href={currentPage?.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t.openPdf}
                  </a>
                </div>
              ) : (
                <img
                  key={`${chapter.id}-${page}`}
                  src={currentPage?.src ?? fallbackPageImage(manga.id, chapter.id, page)}
                  alt={`${t.page} ${page + 1} ${t.of} ${t.chaptersList} ${chapter.number}`}
                  className="block h-auto w-full"
                  loading="eager"
                />
              )}
              {/* Page watermark */}
              <div className="pointer-events-none absolute right-3 top-3 rounded bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                {manga.title} · {t.chaptersList}.{chapter.number} · {t.page}.{page + 1}
                {isPdf ? " · PDF" : ""}
              </div>
            </div>

            {/* Bottom controls */}
            <div className="mt-4 flex w-full items-center justify-between gap-3 pb-6">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={page === 0 && !prevChapter}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> {t.prev}
              </Button>
              <span className="text-xs text-muted-foreground">
                {t.useArrows}
              </span>
              <Button
                onClick={nextPage}
                disabled={page + 1 >= totalPages && !nextChapter}
                className="gap-2"
              >
                {t.next} <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {page + 1 >= totalPages && (
              <div className="mb-6 w-full max-w-2xl rounded-xl border border-border/60 bg-card p-5 text-center">
                <h3 className="text-lg font-bold">
                  {t.endOfChapter} {chapter.number}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.endOfChapterDesc(chapter.title)}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {nextChapter ? (
                    <Button
                      onClick={() => openReader(manga.id, nextChapter.id)}
                      className="gap-2"
                    >
                      {t.nextChapter}: {nextChapter.title}{" "}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t.reachedLatest}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="gap-2"
                  >
                    {t.closeReaderBtn}
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
                aria-label={t.scrollUp}
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
                aria-label={t.scrollDown}
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
