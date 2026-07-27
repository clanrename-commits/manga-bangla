"use client";

import * as React from "react";
import {
  BookOpen,
  Search,
  Moon,
  Sun,
  Heart,
  Flame,
  Library,
  Menu,
  LogIn,
  UserPlus,
  Shield,
  LogOut,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  useMangaStore,
  type View,
  type AuthDialog,
} from "@/store/manga-store";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const NAV: { id: View; labelKey: "browse" | "trending" | "favorites"; icon: React.ElementType }[] = [
  { id: "browse", labelKey: "browse", icon: Library },
  { id: "trending", labelKey: "trending", icon: Flame },
  { id: "favorites", labelKey: "favorites", icon: Heart },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const t = useT();
  const lang = useMangaStore((s) => s.lang);
  const setLang = useMangaStore((s) => s.setLang);
  const view = useMangaStore((s) => s.view);
  const setView = useMangaStore((s) => s.setView);
  const search = useMangaStore((s) => s.search);
  const setSearch = useMangaStore((s) => s.setSearch);
  const favorites = useMangaStore((s) => s.favorites);
  const currentUser = useMangaStore((s) => s.currentUser);
  const logout = useMangaStore((s) => s.logout);
  const setAuthDialog = useMangaStore((s) => s.setAuthDialog);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";
  const isAdmin = currentUser?.role === "admin";

  const handleLogout = () => {
    logout();
    toast.success(t.logoutSuccess);
  };

  const goAdmin = () => {
    setMobileOpen(false);
    if (isAdmin) {
      router.push("/admin");
    } else {
      setAuthDialog("adminLogin");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        {/* Logo + name + badge */}
        <button
          onClick={() => setView("browse")}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          aria-label={t.siteName}
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="hidden flex-col items-start leading-none sm:flex">
            <span className="text-base font-bold tracking-tight">
              {t.siteName}
            </span>
            <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
              <Sparkles className="h-2.5 w-2.5" />
              {t.firstMangaBadge}
            </span>
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
                {t[item.labelKey]}
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
        <div className="relative ml-auto hidden max-w-xs flex-1 lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="pl-9"
            aria-label={t.searchManga}
          />
        </div>

        {/* Language toggle */}
        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <div className="flex items-center rounded-full border border-border bg-card p-0.5">
            {(["bn", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-bold uppercase transition",
                  lang === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={lang === l}
              >
                {l === "bn" ? "বাং" : "EN"}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Theme"
            className="hidden sm:inline-flex"
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

          {/* Auth buttons (desktop) */}
          {!currentUser ? (
            <div className="hidden items-center gap-1 sm:flex">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => setAuthDialog("login")}
              >
                <LogIn className="h-4 w-4" />
                {t.login}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setAuthDialog("register")}
              >
                <UserPlus className="h-4 w-4" />
                {t.register}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-primary"
                onClick={() => setAuthDialog("adminLogin")}
              >
                <Shield className="h-4 w-4" />
                {t.admin}
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              {isAdmin && (
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5"
                  onClick={goAdmin}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t.adminPanel}
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="max-w-24 truncate hidden md:inline">
                      {currentUser.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span>{currentUser.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {currentUser.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={goAdmin}
                      className="gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {t.adminPanel}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    {t.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={t.menu}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetTitle className="px-1 text-left">{t.menu}</SheetTitle>
              <div className="mt-4 flex flex-col gap-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t.searchPlaceholder}
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
                        {t[item.labelKey]}
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

                <div className="my-1 h-px bg-border" />

                {/* Theme toggle for mobile */}
                <Button
                  variant="ghost"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="justify-start gap-2"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {isDark ? "Light mode" : "Dark mode"}
                </Button>

                {/* Auth for mobile */}
                {!currentUser ? (
                  <>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setAuthDialog("login")}
                        className="justify-start gap-2"
                      >
                        <LogIn className="h-4 w-4" />
                        {t.login}
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => setAuthDialog("register")}
                        className="justify-start gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        {t.register}
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setAuthDialog("adminLogin")}
                        className="justify-start gap-2 text-primary"
                      >
                        <Shield className="h-4 w-4" />
                        {t.adminLogin}
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    {isAdmin && (
                      <SheetClose asChild>
                        <Button
                          variant="default"
                          onClick={goAdmin}
                          className="justify-start gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          {t.adminPanel}
                        </Button>
                      </SheetClose>
                    )}
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="justify-start gap-2 text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      {t.logout}
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
