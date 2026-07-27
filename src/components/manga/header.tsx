"use client";

import * as React from "react";
import { BookOpen, Search, Moon, Sun, Heart, Flame, Library, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useMangaStore, type View } from "@/store/manga-store";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const NAV: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "browse", label: "Browse", icon: Library },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "favorites", label: "Favorites", icon: Heart },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const view = useMangaStore((s) => s.view);
  const setView = useMangaStore((s) => s.setView);
  const search = useMangaStore((s) => s.search);
  const setSearch = useMangaStore((s) => s.setSearch);
  const favorites = useMangaStore((s) => s.favorites);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => setView("browse")}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Mangaverse home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="hidden text-lg font-bold tracking-tight sm:inline">
            Manga<span className="text-primary">verse</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <Button
                key={item.id}
                variant={active ? "default" : "ghost"}
                size="sm"
                onClick={() => setView(item.id)}
                className={cn(
                  "gap-1.5",
                  !active && "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {item.id === "favorites" && favorites.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 min-w-5 px-1.5 text-xs"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Search (desktop) */}
        <div className="relative ml-auto hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, authors, tags…"
            className="pl-9"
            aria-label="Search manga"
          />
        </div>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted ? (
              isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <Sun className="h-5 w-5 opacity-0" />
            )}
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="px-1 text-left">Menu</SheetTitle>
              <div className="mt-4 flex flex-col gap-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search manga…"
                    className="pl-9"
                  />
                </div>
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const active = view === item.id;
                  return (
                    <SheetClose asChild key={item.id}>
                      <Button
                        variant={active ? "default" : "ghost"}
                        onClick={() => setView(item.id)}
                        className="justify-start gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                        {item.id === "favorites" && favorites.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-auto h-5 min-w-5 px-1.5 text-xs"
                          >
                            {favorites.length}
                          </Badge>
                        )}
                      </Button>
                    </SheetClose>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
