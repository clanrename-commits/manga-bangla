"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ALL_GENRES } from "@/lib/manga-data";
import { useMangaStore } from "@/store/manga-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function GenreFilter() {
  const selected = useMangaStore((s) => s.selectedGenres);
  const toggle = useMangaStore((s) => s.toggleGenre);
  const clear = useMangaStore((s) => s.clearGenres);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="hidden sm:inline">Filter:</span>
      </div>
      {ALL_GENRES.map((g) => {
        const active = selected.includes(g);
        return (
          <button
            key={g}
            onClick={() => toggle(g)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
            aria-pressed={active}
          >
            {g}
          </button>
        );
      })}
      {selected.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clear}
          className="h-7 gap-1 px-2 text-xs text-muted-foreground"
        >
          <X className="h-3 w-3" /> Clear
        </Button>
      )}
    </div>
  );
}
