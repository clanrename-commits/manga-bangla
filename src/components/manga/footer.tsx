"use client";

import {
  BookOpen,
  Facebook,
  Heart,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useMangaStore } from "@/store/manga-store";
import { useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
  const setView = useMangaStore((s) => s.setView);
  const facebookUrl = useMangaStore((s) => s.facebookUrl);
  const lang = useMangaStore((s) => s.lang);

  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <button
              onClick={() => setView("browse")}
              className="flex items-center gap-2"
              aria-label={t.siteName}
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </span>
              <span className="flex flex-col items-start leading-none">
                <span className="text-base font-bold">
                  {t.siteName}
                </span>
                <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                  <Sparkles className="h-2.5 w-2.5" />
                  {t.firstMangaBadge}
                </span>
              </span>
            </button>
            <p className="max-w-xs text-sm text-muted-foreground">
              {t.footerDesc}
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={facebookUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!facebookUrl) e.preventDefault();
                }}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                aria-label={t.facebook}
                title={t.facebook}
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/8801534955065"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                aria-label={t.whatsapp}
                title={t.whatsapp}
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Discover column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t.discover}</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setView("browse")}
                  className="text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {t.browse}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("trending")}
                  className="text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {t.trending}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("favorites")}
                  className="text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {t.favorites}
                </button>
              </li>
            </ul>
          </div>

          {/* Genres column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t.genres3}</h4>
            <ul className="space-y-1.5">
              {["Action", "Fantasy", "Romance", "Sci-Fi"].map((g) => (
                <li key={g}>
                  <button
                    onClick={() => setView("browse")}
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    {g}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer credit */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t.ideaAndDevBy}</h4>
            <div className="rounded-lg border border-border/60 bg-background/50 p-3">
              <p className="text-sm font-bold text-foreground">
                Abdur Rahman Akash
              </p>
              <a
                href="https://wa.me/8801534955065"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-primary"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {t.whatsapp}: +8801534955065
              </a>
              <a
                href={facebookUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!facebookUrl) e.preventDefault();
                }}
                className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-primary"
              >
                <Facebook className="h-3.5 w-3.5" />
                {t.facebook}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {t.siteName}. {t.allRights}
          </p>
          <p className="flex items-center gap-1.5">
            {t.madeWith}{" "}
            <Heart className="h-3 w-3 fill-primary text-primary" />{" "}
            {t.forMangaFans}
          </p>
        </div>

        {/* Prominent tagline strip */}
        <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-center text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {lang === "bn" ? "প্রথম বাংলা মাঙ্গা প্ল্যাটফর্ম" : "The first manga platform in Bangla"}
        </div>
      </div>
    </footer>
  );
}
