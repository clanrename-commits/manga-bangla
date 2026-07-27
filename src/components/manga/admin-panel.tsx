"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Plus,
  Trash2,
  Save,
  Facebook,
  BookOpen,
  Settings,
  ImageIcon,
} from "lucide-react";
import { useMangaStore } from "@/store/manga-store";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { Manga, MangaStatus } from "@/lib/manga-data";

function makeChapters(seed: string, count: number): Manga["chapters"] {
  const titles = [
    "Awakening",
    "First Blood",
    "The Oath",
    "Crimson Sky",
    "Hidden Blade",
    "Echoes",
    "Shattered Vow",
    "Dawn Breaks",
  ];
  const now = Date.now();
  const list: Manga["chapters"] = [];
  for (let i = 1; i <= count; i++) {
    list.push({
      id: `${seed}-c${i}`,
      number: i,
      title: titles[(i - 1) % titles.length],
      pages: 12 + ((i * 3) % 9),
      releasedAt: new Date(now - (count - i) * 7 * 86400000).toISOString(),
    });
  }
  return list.reverse();
}

export function AdminPanel() {
  const t = useT();
  const dialog = useMangaStore((s) => s.authDialog);
  const setDialog = useMangaStore((s) => s.setAuthDialog);
  const currentUser = useMangaStore((s) => s.currentUser);

  const open = dialog === "adminPanel" && currentUser?.role === "admin";
  const close = () => setDialog("none");

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border/60 px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            {t.adminPanel}
          </DialogTitle>
          <DialogDescription>{t.postNewManga} · {t.settings}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="post" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-border/60 px-6 pt-3">
            <TabsList>
              <TabsTrigger value="post" className="gap-1.5">
                <Plus className="h-4 w-4" />
                {t.postNewManga}
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-1.5">
                <BookOpen className="h-4 w-4" />
                {t.postedManga}
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5">
                <Settings className="h-4 w-4" />
                {t.settings}
              </TabsTrigger>
            </TabsList>
          </div>
          <ScrollArea className="scrollbar-manga max-h-[calc(92vh-10rem)]">
            <div className="px-6 py-5">
              <TabsContent value="post" className="mt-0">
                <PostMangaForm onDone={() => {}} />
              </TabsContent>
              <TabsContent value="list" className="mt-0">
                <PostedMangaList />
              </TabsContent>
              <TabsContent value="settings" className="mt-0">
                <SettingsTab />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function PostMangaForm({ onDone }: { onDone: () => void }) {
  const t = useT();
  const postManga = useMangaStore((s) => s.postManga);
  const [title, setTitle] = React.useState("");
  const [titleBn, setTitleBn] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [cover, setCover] = React.useState("");
  const [banner, setBanner] = React.useState("");
  const [genres, setGenres] = React.useState("");
  const [synopsis, setSynopsis] = React.useState("");
  const [synopsisBn, setSynopsisBn] = React.useState("");
  const [status, setStatus] = React.useState<MangaStatus>("Ongoing");
  const [year, setYear] = React.useState(String(new Date().getFullYear()));
  const [chapters, setChapters] = React.useState("10");

  const coverPreview = cover.trim() || `https://picsum.photos/seed/${encodeURIComponent(title || "new")}/600/900`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      toast.error(t.requiredField);
      return;
    }
    const id = `admin-${Date.now()}`;
    const genreList = genres
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
    const numChapters = Math.max(1, Math.min(50, parseInt(chapters) || 10));
    const manga: Manga = {
      id,
      title: title.trim(),
      titleBn: titleBn.trim() || undefined,
      author: author.trim(),
      cover: cover.trim() || `https://picsum.photos/seed/${id}/600/900`,
      banner: banner.trim() || `https://picsum.photos/seed/${id}-ban/1600/700`,
      status,
      year: parseInt(year) || new Date().getFullYear(),
      rating: 8 + Math.random() * 1.5,
      views: Math.floor(Math.random() * 500_000) + 10_000,
      genres: genreList.length > 0 ? genreList : ["Action"],
      tags: [],
      synopsis: synopsis.trim() || title.trim(),
      synopsisBn: synopsisBn.trim() || undefined,
      chapters: makeChapters(id, numChapters),
      featured: true,
      trending: true,
      adminPosted: true,
    };
    postManga(manga);
    toast.success(t.mangaPosted);
    // Reset form
    setTitle("");
    setTitleBn("");
    setAuthor("");
    setCover("");
    setBanner("");
    setGenres("");
    setSynopsis("");
    setSynopsisBn("");
    setStatus("Ongoing");
    setChapters("10");
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="m-title">{t.mangaTitleEn} *</Label>
          <Input
            id="m-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Shadow Blade Chronicles"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="m-title-bn">{t.mangaTitleBn}</Label>
          <Input
            id="m-title-bn"
            value={titleBn}
            onChange={(e) => setTitleBn(e.target.value)}
            placeholder="ছায়া ব্লেড ক্রনিকলস"
            dir="auto"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="m-author">{t.authorLabel} *</Label>
          <Input
            id="m-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Ren Takahashi"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="m-genres">{t.genresLabel}</Label>
          <Input
            id="m-genres"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            placeholder="Action, Fantasy, Adventure"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="m-cover">{t.coverUrl}</Label>
          <Input
            id="m-cover"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            placeholder="https://example.com/cover.jpg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="m-banner">{t.bannerUrl}</Label>
          <Input
            id="m-banner"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            placeholder="https://example.com/banner.jpg"
          />
        </div>
      </div>

      {/* Cover preview */}
      <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3">
        <img
          src={coverPreview}
          alt="Cover preview"
          className="h-24 w-16 shrink-0 rounded-md border border-border/60 object-cover"
        />
        <div className="text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5 font-medium text-foreground">
            <ImageIcon className="h-3.5 w-3.5" />
            Cover preview
          </p>
          <p className="mt-0.5">
            {cover.trim() ? "Custom URL" : "Auto-generated placeholder"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="m-status">{t.statusLabel}</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as MangaStatus)}>
            <SelectTrigger id="m-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ongoing">{t.ongoing}</SelectItem>
              <SelectItem value="Completed">{t.completed}</SelectItem>
              <SelectItem value="Hiatus">{t.hiatus}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="m-year">{t.yearLabel}</Label>
          <Input
            id="m-year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1900"
            max="2100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="m-chapters">{t.numberOfChapters}</Label>
          <Input
            id="m-chapters"
            type="number"
            value={chapters}
            onChange={(e) => setChapters(e.target.value)}
            min="1"
            max="50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="m-synopsis">{t.synopsisEn}</Label>
        <Textarea
          id="m-synopsis"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          placeholder="Enter the manga synopsis in English…"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="m-synopsis-bn">{t.synopsisBn}</Label>
        <Textarea
          id="m-synopsis-bn"
          value={synopsisBn}
          onChange={(e) => setSynopsisBn(e.target.value)}
          placeholder="বাংলায় সারসংক্ষেপ লিখুন…"
          rows={3}
          dir="auto"
        />
      </div>

      <Button type="submit" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        {t.post}
      </Button>
    </form>
  );
}

function PostedMangaList() {
  const t = useT();
  const adminManga = useMangaStore((s) => s.adminManga);
  const deleteManga = useMangaStore((s) => s.deleteManga);
  const lang = useMangaStore((s) => s.lang);

  if (adminManga.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
        <BookOpen className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t.noPostedManga}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {adminManga.map((m) => (
        <li
          key={m.id}
          className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3"
        >
          <img
            src={m.cover}
            alt=""
            className="h-16 w-12 shrink-0 rounded-md border border-border/60 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {lang === "bn" && m.titleBn ? m.titleBn : m.title}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {m.author} · {m.chapters.length} {t.chapters}
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {m.genres.slice(0, 3).map((g) => (
                <Badge key={g} variant="secondary" className="text-[10px]">
                  {g}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              deleteManga(m.id);
              toast.success(t.mangaDeleted);
            }}
            aria-label={t.delete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}

function SettingsTab() {
  const t = useT();
  const facebookUrl = useMangaStore((s) => s.facebookUrl);
  const setFacebookUrl = useMangaStore((s) => s.setFacebookUrl);
  const [url, setUrl] = React.useState(facebookUrl);

  React.useEffect(() => setUrl(facebookUrl), [facebookUrl]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setFacebookUrl(url.trim());
    toast.success(t.settingsSaved);
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fb-url" className="flex items-center gap-1.5">
          <Facebook className="h-4 w-4 text-primary" />
          {t.facebookPageUrl}
        </Label>
        <Input
          id="fb-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://facebook.com/mangabangla"
          type="url"
        />
        <p className="text-xs text-muted-foreground">
          {t.follow}: {url || facebookUrl}
        </p>
      </div>
      <Button type="submit" className="gap-2">
        <Save className="h-4 w-4" />
        {t.saveSettings}
      </Button>
    </form>
  );
}
