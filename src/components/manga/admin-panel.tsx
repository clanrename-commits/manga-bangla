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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Tags,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Save,
  Facebook,
  ImageIcon,
  FileText,
  Upload,
  X,
  Pencil,
  ChevronLeft,
  Library,
  Star,
} from "lucide-react";
import { useMangaStore } from "@/store/manga-store";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Manga, MangaStatus, ChapterPage } from "@/lib/manga-data";

type AdminTab = "dashboard" | "manga" | "categories" | "genres" | "settings";

export function AdminPanel() {
  const t = useT();
  const dialog = useMangaStore((s) => s.authDialog);
  const setDialog = useMangaStore((s) => s.setAuthDialog);
  const currentUser = useMangaStore((s) => s.currentUser);
  const [tab, setTab] = React.useState<AdminTab>("dashboard");
  const [editingMangaId, setEditingMangaId] = React.useState<string | null>(null);

  const open = dialog === "adminPanel" && currentUser?.role === "admin";
  const close = () => {
    setDialog("none");
    setTab("dashboard");
    setEditingMangaId(null);
  };

  const nav: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
    { id: "manga", label: t.mangaManagement, icon: BookOpen },
    { id: "categories", label: t.categoriesManagement, icon: FolderTree },
    { id: "genres", label: t.genresManagement, icon: Tags },
    { id: "settings", label: t.settings, icon: SettingsIcon },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="flex max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-5xl">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 flex-col border-r border-border/60 bg-card/40 sm:flex">
          <div className="border-b border-border/60 px-4 py-4">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <LayoutDashboard className="h-4 w-4 text-primary" />
              {t.adminDashboard}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {currentUser?.email}
            </p>
          </div>
          <nav className="flex-1 space-y-0.5 p-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setEditingMangaId(null);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-border/60 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={close}
            >
              <ChevronLeft className="h-4 w-4" />
              {t.close}
            </Button>
          </div>
        </aside>

        {/* Mobile top tabs */}
        <div className="flex max-h-[92vh] w-full flex-col sm:hidden">
          <DialogHeader className="border-b border-border/60 px-4 py-3">
            <DialogTitle className="flex items-center gap-2 text-base">
              <LayoutDashboard className="h-4 w-4 text-primary" />
              {t.adminDashboard}
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-1 overflow-x-auto border-b border-border/60 p-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setEditingMangaId(null);
                  }}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <ScrollArea className="scrollbar-manga flex-1">
            <div className="p-4">
              <AdminContent
                tab={tab}
                editingMangaId={editingMangaId}
                setEditingMangaId={setEditingMangaId}
                setTab={setTab}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Desktop content */}
        <div className="hidden flex-1 flex-col sm:flex">
          <ScrollArea className="scrollbar-manga flex-1">
            <div className="p-6">
              <AdminContent
                tab={tab}
                editingMangaId={editingMangaId}
                setEditingMangaId={setEditingMangaId}
                setTab={setTab}
              />
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AdminContent({
  tab,
  editingMangaId,
  setEditingMangaId,
  setTab,
}: {
  tab: AdminTab;
  editingMangaId: string | null;
  setEditingMangaId: (id: string | null) => void;
  setTab: (t: AdminTab) => void;
}) {
  if (tab === "dashboard") return <DashboardTab />;
  if (tab === "manga")
    return editingMangaId ? (
      <MangaForm
        editingId={editingMangaId}
        onClose={() => setEditingMangaId(null)}
      />
    ) : (
      <MangaListTab onEdit={(id) => setEditingMangaId(id)} onAdd={() => setEditingMangaId("__new__")} />
    );
  if (tab === "categories") return <CategoriesTab />;
  if (tab === "genres") return <GenresTab />;
  if (tab === "settings") return <SettingsTab />;
  return null;
}

/* ---------- Dashboard ---------- */
function DashboardTab() {
  const t = useT();
  const adminManga = useMangaStore((s) => s.adminManga);
  const adminCategories = useMangaStore((s) => s.adminCategories);
  const adminGenres = useMangaStore((s) => s.adminGenres);
  const favorites = useMangaStore((s) => s.favorites);

  const stats = [
    { label: t.totalManga, value: adminManga.length, icon: BookOpen },
    { label: t.totalCategories, value: adminCategories.length, icon: FolderTree },
    { label: t.totalGenres, value: adminGenres.length, icon: Tags },
    { label: t.totalFavorites, value: favorites.length, icon: Star },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold">{t.dashboard}</h3>
        <p className="text-sm text-muted-foreground">{t.adminDashboard}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-border/60 bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold">{s.value}</span>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h4 className="mb-2 text-sm font-semibold">{t.adminDashboard}</h4>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>• {t.mangaManagement}: {t.addNewManga}, {t.edit}, {t.delete}</li>
          <li>• {t.categoriesManagement}: {t.addCategory}, {t.deleteCategory}</li>
          <li>• {t.genresManagement}: {t.addGenre}, {t.deleteGenre}</li>
          <li>• {t.settings}: {t.facebookPageUrl}, {t.siteNameLabel}, {t.defaultCopyrightLabel}</li>
        </ul>
      </div>
    </div>
  );
}

/* ---------- Manga list ---------- */
function MangaListTab({
  onEdit,
  onAdd,
}: {
  onEdit: (id: string) => void;
  onAdd: () => void;
}) {
  const t = useT();
  const lang = useMangaStore((s) => s.lang);
  const adminManga = useMangaStore((s) => s.adminManga);
  const deleteManga = useMangaStore((s) => s.deleteManga);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold">{t.mangaManagement}</h3>
          <p className="text-sm text-muted-foreground">{t.mangaList} ({adminManga.length})</p>
        </div>
        <Button onClick={onAdd} className="gap-1.5">
          <Plus className="h-4 w-4" />
          {t.addNewManga}
        </Button>
      </div>

      {adminManga.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t.noPostedManga}</p>
          <Button onClick={onAdd} className="mt-2 gap-1.5">
            <Plus className="h-4 w-4" />
            {t.addNewManga}
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {adminManga.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3"
            >
              <img
                src={m.cover}
                alt=""
                className="h-16 w-12 shrink-0 rounded-md border border-border/60 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold" dir="auto">
                  {lang === "bn" && m.titleBn ? m.titleBn : m.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {m.author} · {m.chapters.length} {t.chapters}
                  {m.copyright ? ` · © ${m.copyright}` : ""}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {m.categories.slice(0, 3).map((c) => (
                    <Badge key={c} variant="secondary" className="text-[10px]">
                      {c}
                    </Badge>
                  ))}
                  {m.genres.slice(0, 3).map((g) => (
                    <Badge key={g} variant="outline" className="text-[10px]">
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(m.id)}
                  aria-label={t.edit}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    deleteManga(m.id);
                    toast.success(t.mangaDeleted);
                  }}
                  aria-label={t.delete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Manga form (add / edit) ---------- */
function MangaForm({
  editingId,
  onClose,
}: {
  editingId: string;
  onClose: () => void;
}) {
  const t = useT();
  const lang = useMangaStore((s) => s.lang);
  const adminManga = useMangaStore((s) => s.adminManga);
  const adminGenres = useMangaStore((s) => s.adminGenres);
  const adminCategories = useMangaStore((s) => s.adminCategories);
  const postManga = useMangaStore((s) => s.postManga);
  const updateManga = useMangaStore((s) => s.updateManga);
  const setChapterPages = useMangaStore((s) => s.setChapterPages);

  const isEdit = editingId !== "__new__";
  const existing = isEdit ? adminManga.find((m) => m.id === editingId) : undefined;

  const [title, setTitle] = React.useState(existing?.title ?? "");
  const [titleBn, setTitleBn] = React.useState(existing?.titleBn ?? "");
  const [author, setAuthor] = React.useState(existing?.author ?? "");
  const [copyright, setCopyright] = React.useState(existing?.copyright ?? "");
  const [cover, setCover] = React.useState(existing?.cover ?? "");
  const [banner, setBanner] = React.useState(existing?.banner ?? "");
  const [synopsis, setSynopsis] = React.useState(existing?.synopsis ?? "");
  const [synopsisBn, setSynopsisBn] = React.useState(existing?.synopsisBn ?? "");
  const [status, setStatus] = React.useState<MangaStatus>(existing?.status ?? "Ongoing");
  const [year, setYear] = React.useState(String(existing?.year ?? new Date().getFullYear()));
  const [chapters, setChapters] = React.useState(String(existing?.chapters.length ?? 1));
  const [selGenres, setSelGenres] = React.useState<string[]>(existing?.genres ?? []);
  const [selCats, setSelCats] = React.useState<string[]>(existing?.categories ?? []);
  const [featured, setFeatured] = React.useState(existing?.featured ?? true);
  const [trending, setTrending] = React.useState(existing?.trending ?? true);

  // chapter page uploads (in-memory until save)
  const [chapterPagesMap, setChapterPagesMap] = React.useState<
    Record<string, ChapterPage[]>
  >(existing?.chapterPages ?? {});

  const coverPreview = cover.trim() || `https://picsum.photos/seed/${encodeURIComponent(title || "new")}/600/900`;
  const bannerPreview = banner.trim() || `https://picsum.photos/seed/${encodeURIComponent(title || "new")}-ban/1600/700`;

  // Build chapter list (display only)
  const numChapters = Math.max(1, Math.min(50, parseInt(chapters) || 1));
  const chaptersList = React.useMemo(() => {
    const list: { id: string; number: number }[] = [];
    const base = existing?.chapters ?? [];
    for (let i = 1; i <= numChapters; i++) {
      const ch = base.find((c) => c.number === i);
      list.push({ id: ch?.id ?? `${editingId}-c${i}`, number: i });
    }
    return list;
  }, [numChapters, existing, editingId]);

  const toggleGenre = (g: string) =>
    setSelGenres((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]));
  const toggleCat = (c: string) =>
    setSelCats((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  const handleImageUpload = (
    chapterId: string,
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    Promise.all(
      arr.map(
        (f) =>
          new Promise<ChapterPage>((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: `pg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                type: "image",
                src: reader.result as string,
                name: f.name,
              });
            reader.readAsDataURL(f);
          })
      )
    ).then((pages) => {
      setChapterPagesMap((m) => ({
        ...m,
        [chapterId]: [...(m[chapterId] ?? []), ...pages],
      }));
    });
  };

  const handlePdfUpload = (
    chapterId: string,
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    Promise.all(
      arr.map(
        (f) =>
          new Promise<ChapterPage>((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: `pg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                type: "pdf",
                src: reader.result as string,
                name: f.name,
              });
            reader.readAsDataURL(f);
          })
      )
    ).then((pages) => {
      setChapterPagesMap((m) => ({
        ...m,
        [chapterId]: [...(m[chapterId] ?? []), ...pages],
      }));
    });
  };

  const handleCoverUpload = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const f = files[0];
    const reader = new FileReader();
    reader.onload = () => setCover(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleBannerUpload = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const f = files[0];
    const reader = new FileReader();
    reader.onload = () => setBanner(reader.result as string);
    reader.readAsDataURL(f);
  };

  const removePage = (chapterId: string, pageId: string) =>
    setChapterPagesMap((m) => ({
      ...m,
      [chapterId]: (m[chapterId] ?? []).filter((p) => p.id !== pageId),
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      toast.error(t.requiredField);
      return;
    }

    const now = Date.now();
    const chapterArr = chaptersList.map((c, idx) => {
      const existingCh = existing?.chapters.find((x) => x.id === c.id);
      return (
        existingCh ?? {
          id: c.id,
          number: c.number,
          title: `Chapter ${c.number}`,
          pages: chapterPagesMap[c.id]?.length ?? 12,
          releasedAt: new Date(now - idx * 7 * 86400000).toISOString(),
        }
      );
    });

    const id = isEdit ? existing!.id : `admin-${now}`;
    const manga: Manga = {
      id,
      title: title.trim(),
      titleBn: titleBn.trim() || undefined,
      author: author.trim(),
      copyright: copyright.trim() || undefined,
      cover: cover.trim() || `https://picsum.photos/seed/${id}/600/900`,
      banner: banner.trim() || `https://picsum.photos/seed/${id}-ban/1600/700`,
      status,
      year: parseInt(year) || new Date().getFullYear(),
      rating: existing?.rating ?? 8 + Math.random() * 1.5,
      views: existing?.views ?? Math.floor(Math.random() * 500_000) + 10_000,
      genres: selGenres.length > 0 ? selGenres : ["Action"],
      categories: selCats.length > 0 ? selCats : ["Manga"],
      tags: existing?.tags ?? [],
      synopsis: synopsis.trim() || title.trim(),
      synopsisBn: synopsisBn.trim() || undefined,
      chapters: chapterArr,
      chapterPages: chapterPagesMap,
      featured,
      trending,
      adminPosted: true,
    };

    if (isEdit) {
      updateManga(id, manga);
      // also sync chapter pages
      Object.keys(chapterPagesMap).forEach((cid) =>
        setChapterPages(id, cid, chapterPagesMap[cid])
      );
      toast.success(t.mangaPosted);
    } else {
      postManga(manga);
      toast.success(t.mangaPosted);
    }
    onClose();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onClose} aria-label={t.cancel}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-xl font-bold">
            {isEdit ? t.editManga : t.addNewManga}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t.coverPhoto}, {t.bannerPhoto}, {t.authorLabel}, {t.copyrightLabel}, {t.chapterPages}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Title + author */}
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
            <Label htmlFor="m-copyright">{t.copyrightLabel}</Label>
            <Input
              id="m-copyright"
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
              placeholder="© 2026 Author Name"
              dir="auto"
            />
          </div>
        </div>

        {/* Cover + banner uploads */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t.coverPhoto}</Label>
            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="h-24 w-16 shrink-0 rounded-md border border-border/60 object-cover"
              />
              <div className="flex-1 space-y-2">
                <Input
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  placeholder="Image URL or upload below"
                />
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:bg-accent">
                  <Upload className="h-3.5 w-3.5" />
                  {t.uploadImages}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCoverUpload(e.target.files)}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t.bannerPhoto}</Label>
            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3">
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="h-16 w-28 shrink-0 rounded-md border border-border/60 object-cover"
              />
              <div className="flex-1 space-y-2">
                <Input
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  placeholder="Image URL or upload below"
                />
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:bg-accent">
                  <Upload className="h-3.5 w-3.5" />
                  {t.uploadImages}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleBannerUpload(e.target.files)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Categories + genres */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t.categoriesLabel}</Label>
            <div className="flex flex-wrap gap-1.5 rounded-lg border border-border/60 bg-card/40 p-3">
              {adminCategories.length === 0 && (
                <span className="text-xs text-muted-foreground">{t.noCategories}</span>
              )}
              {adminCategories.map((c) => {
                const active = selCats.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCat(c)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t.genresLabel}</Label>
            <div className="flex flex-wrap gap-1.5 rounded-lg border border-border/60 bg-card/40 p-3">
              {adminGenres.length === 0 && (
                <span className="text-xs text-muted-foreground">{t.noGenres}</span>
              )}
              {adminGenres.map((g) => {
                const active = selGenres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Meta: status, year, chapters, featured, trending */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>{t.statusLabel}</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as MangaStatus)}>
              <SelectTrigger>
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

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            {t.featured}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={trending}
              onChange={(e) => setTrending(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            {t.trendingBadge}
          </label>
        </div>

        {/* Synopsis */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="m-syn">{t.synopsisEn}</Label>
            <Textarea
              id="m-syn"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="m-syn-bn">{t.synopsisBn}</Label>
            <Textarea
              id="m-syn-bn"
              value={synopsisBn}
              onChange={(e) => setSynopsisBn(e.target.value)}
              rows={3}
              dir="auto"
            />
          </div>
        </div>

        {/* Chapter pages uploader */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">{t.chapterPages}</Label>
          <p className="text-xs text-muted-foreground">{t.uploadPagesHint}</p>
          <div className="space-y-3">
            {chaptersList.map((ch) => {
              const pages = chapterPagesMap[ch.id] ?? [];
              return (
                <div
                  key={ch.id}
                  className="rounded-lg border border-border/60 bg-card/40 p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {t.chaptersList} {ch.number}
                    </p>
                    <div className="flex gap-1">
                      <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium transition hover:bg-accent">
                        <ImageIcon className="h-3 w-3" />
                        {t.uploadImages}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleImageUpload(ch.id, e.target.files)}
                        />
                      </label>
                      <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium transition hover:bg-accent">
                        <FileText className="h-3 w-3" />
                        {t.uploadPdf}
                        <input
                          type="file"
                          accept="application/pdf"
                          multiple
                          className="hidden"
                          onChange={(e) => handlePdfUpload(ch.id, e.target.files)}
                        />
                      </label>
                    </div>
                  </div>
                  {pages.length === 0 ? (
                    <p className="text-xs text-muted-foreground">{t.noPagesUploaded}</p>
                  ) : (
                    <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 md:grid-cols-6">
                      {pages.map((p, idx) => (
                        <li
                          key={p.id}
                          className="group relative overflow-hidden rounded-md border border-border/60"
                        >
                          {p.type === "image" ? (
                            <img
                              src={p.src}
                              alt={p.name ?? `Page ${idx + 1}`}
                              className="aspect-[3/4] w-full object-cover"
                            />
                          ) : (
                            <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-1 bg-muted p-2 text-center">
                              <FileText className="h-6 w-6 text-destructive" />
                              <span className="text-[10px] font-medium">PDF</span>
                              <span className="line-clamp-2 text-[9px] text-muted-foreground">
                                {p.name}
                              </span>
                            </div>
                          )}
                          <span className="absolute left-1 top-1 rounded bg-black/60 px-1 text-[9px] font-medium text-white">
                            {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removePage(ch.id, p.id)}
                            className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-white opacity-0 transition group-hover:opacity-100"
                            aria-label={t.removePage}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-2 border-t border-border/60 pt-4">
          <Button type="submit" className="gap-1.5">
            <Save className="h-4 w-4" />
            {isEdit ? t.updateMangaBtn : t.saveManga}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            {t.cancel}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ---------- Categories tab ---------- */
function CategoriesTab() {
  const t = useT();
  const adminCategories = useMangaStore((s) => s.adminCategories);
  const addCategory = useMangaStore((s) => s.addCategory);
  const deleteCategory = useMangaStore((s) => s.deleteCategory);
  const [name, setName] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory(name);
    setName("");
    toast.success(t.settingsSaved);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold">{t.categoriesManagement}</h3>
        <p className="text-sm text-muted-foreground">{t.categoriesLabel} ({adminCategories.length})</p>
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.categoryName}
          dir="auto"
        />
        <Button type="submit" className="gap-1.5">
          <Plus className="h-4 w-4" />
          {t.addCategory}
        </Button>
      </form>
      {adminCategories.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.noCategories}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {adminCategories.map((c) => (
            <li
              key={c}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-3 pr-1 text-sm"
            >
              <FolderTree className="h-3.5 w-3.5 text-primary" />
              <span>{c}</span>
              <button
                onClick={() => {
                  deleteCategory(c);
                  toast.success(t.mangaDeleted);
                }}
                className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                aria-label={t.delete}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Genres tab ---------- */
function GenresTab() {
  const t = useT();
  const adminGenres = useMangaStore((s) => s.adminGenres);
  const addGenre = useMangaStore((s) => s.addGenre);
  const deleteGenre = useMangaStore((s) => s.deleteGenre);
  const [name, setName] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addGenre(name);
    setName("");
    toast.success(t.settingsSaved);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold">{t.genresManagement}</h3>
        <p className="text-sm text-muted-foreground">{t.genresLabel} ({adminGenres.length})</p>
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.genreName}
          dir="auto"
        />
        <Button type="submit" className="gap-1.5">
          <Plus className="h-4 w-4" />
          {t.addGenre}
        </Button>
      </form>
      {adminGenres.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.noGenres}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {adminGenres.map((g) => (
            <li
              key={g}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-3 pr-1 text-sm"
            >
              <Tags className="h-3.5 w-3.5 text-primary" />
              <span>{g}</span>
              <button
                onClick={() => {
                  deleteGenre(g);
                  toast.success(t.mangaDeleted);
                }}
                className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                aria-label={t.delete}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Settings tab ---------- */
function SettingsTab() {
  const t = useT();
  const facebookUrl = useMangaStore((s) => s.facebookUrl);
  const setFacebookUrl = useMangaStore((s) => s.setFacebookUrl);
  const siteName = useMangaStore((s) => s.siteName);
  const setSiteName = useMangaStore((s) => s.setSiteName);
  const defaultCopyright = useMangaStore((s) => s.defaultCopyright);
  const setDefaultCopyright = useMangaStore((s) => s.setDefaultCopyright);

  const [fb, setFb] = React.useState(facebookUrl);
  const [sn, setSn] = React.useState(siteName);
  const [cp, setCp] = React.useState(defaultCopyright);

  React.useEffect(() => {
    setFb(facebookUrl);
    setSn(siteName);
    setCp(defaultCopyright);
  }, [facebookUrl, siteName, defaultCopyright]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setFacebookUrl(fb.trim());
    setSiteName(sn.trim());
    setDefaultCopyright(cp.trim());
    toast.success(t.settingsSaved);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold">{t.settings}</h3>
        <p className="text-sm text-muted-foreground">{t.saveSettings}</p>
      </div>
      <form onSubmit={save} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="set-sitename" className="flex items-center gap-1.5">
            <Library className="h-4 w-4 text-primary" />
            {t.siteNameLabel}
          </Label>
          <Input
            id="set-sitename"
            value={sn}
            onChange={(e) => setSn(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="set-cp" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-primary" />
            {t.defaultCopyrightLabel}
          </Label>
          <Input
            id="set-cp"
            value={cp}
            onChange={(e) => setCp(e.target.value)}
            placeholder="© 2026 Manga Bangla"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="set-fb" className="flex items-center gap-1.5">
            <Facebook className="h-4 w-4 text-primary" />
            {t.facebookPageUrl}
          </Label>
          <Input
            id="set-fb"
            value={fb}
            onChange={(e) => setFb(e.target.value)}
            placeholder="https://facebook.com/mangabangla"
            type="url"
          />
        </div>
        <Button type="submit" className="gap-1.5">
          <Save className="h-4 w-4" />
          {t.saveSettings}
        </Button>
      </form>
    </div>
  );
}
