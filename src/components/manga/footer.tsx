"use client";

import { BookOpen, Github, Twitter, Heart } from "lucide-react";
import { useMangaStore } from "@/store/manga-store";

export function Footer() {
  const setView = useMangaStore((s) => s.setView);

  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <button
              onClick={() => setView("browse")}
              className="flex items-center gap-2"
              aria-label="Mangaverse home"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </span>
              <span className="text-base font-bold">
                Manga<span className="text-primary">verse</span>
              </span>
            </button>
            <p className="max-w-xs text-sm text-muted-foreground">
              A modern manga reader with a curated catalog, dark mode,
              and a built-in chapter reader. Built with Next.js, Tailwind CSS,
              and shadcn/ui.
            </p>
          </div>

          <FooterColumn
            title="Discover"
            links={[
              { label: "Browse", onClick: () => setView("browse") },
              { label: "Trending", onClick: () => setView("trending") },
              { label: "Favorites", onClick: () => setView("favorites") },
            ]}
          />

          <FooterColumn
            title="Genres"
            links={[
              { label: "Action", onClick: () => setView("browse") },
              { label: "Fantasy", onClick: () => setView("browse") },
              { label: "Romance", onClick: () => setView("browse") },
              { label: "Sci-Fi", onClick: () => setView("browse") },
            ]}
          />

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Follow</h4>
            <div className="flex items-center gap-2">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              All cover artwork is procedurally generated placeholder imagery.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Mangaverse. A demo project.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="h-3 w-3 fill-primary text-primary" /> for manga fans
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; onClick: () => void }[];
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.label}>
            <button
              onClick={l.onClick}
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
