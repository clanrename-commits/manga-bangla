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
import {
  LogIn,
  UserPlus,
  Shield,
  Mail,
  Lock,
  User,
  Sparkles,
} from "lucide-react";
import { useMangaStore } from "@/store/manga-store";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function AuthDialogs() {
  const dialog = useMangaStore((s) => s.authDialog);
  const setDialog = useMangaStore((s) => s.setAuthDialog);

  const close = () => setDialog("none");

  return (
    <>
      <LoginDialog open={dialog === "login"} onClose={close} />
      <RegisterDialog open={dialog === "register"} onClose={close} />
      <AdminLoginDialog open={dialog === "adminLogin"} onClose={close} />
    </>
  );
}

function LoginDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const login = useMangaStore((s) => s.login);
  const setDialog = useMangaStore((s) => s.setAuthDialog);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(email, password);
    if (res.ok) {
      toast.success(t.loginSuccess);
      setEmail("");
      setPassword("");
      onClose();
    } else {
      setError(res.error === "invalidCredentials" ? t.invalidCredentials : res.error ?? "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-primary" />
            {t.login}
          </DialogTitle>
          <DialogDescription>{t.welcomeBack}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">{t.email}</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-9"
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">{t.password}</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
                required
                autoComplete="current-password"
              />
            </div>
          </div>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full gap-2">
            <LogIn className="h-4 w-4" />
            {t.login}
          </Button>
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => setDialog("register")}
              className="text-muted-foreground transition hover:text-primary"
            >
              {t.noAccount} {t.register}
            </button>
            <button
              type="button"
              onClick={() => setDialog("adminLogin")}
              className="flex items-center gap-1 text-muted-foreground transition hover:text-primary"
            >
              <Shield className="h-3.5 w-3.5" />
              {t.switchToAdminLogin}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RegisterDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const register = useMangaStore((s) => s.register);
  const setDialog = useMangaStore((s) => s.setAuthDialog);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 4) {
      setError(t.requiredField);
      return;
    }
    const res = register(name, email, password);
    if (res.ok) {
      toast.success(t.registerSuccess);
      setName("");
      setEmail("");
      setPassword("");
      onClose();
    } else {
      setError(res.error === "emailExists" ? t.emailExists : res.error ?? "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            {t.register}
          </DialogTitle>
          <DialogDescription>{t.createAccount}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-name">{t.name}</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="pl-9"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">{t.email}</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-9"
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">{t.password}</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
                required
                autoComplete="new-password"
              />
            </div>
          </div>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full gap-2">
            <UserPlus className="h-4 w-4" />
            {t.register}
          </Button>
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setDialog("login")}
              className="text-muted-foreground transition hover:text-primary"
            >
              {t.haveAccount} {t.login}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminLoginDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useT();
  const login = useMangaStore((s) => s.login);
  const setDialog = useMangaStore((s) => s.setAuthDialog);
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(email, password);
    if (res.ok) {
      const user = useMangaStore.getState().currentUser;
      if (user?.role !== "admin") {
        setError(t.adminOnly);
        useMangaStore.getState().logout();
        return;
      }
      toast.success(t.loginSuccess);
      setEmail("");
      setPassword("");
      onClose();
      router.push("/admin");
    } else {
      setError(res.error === "invalidCredentials" ? t.invalidCredentials : res.error ?? "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t.adminLogin}
          </DialogTitle>
          <DialogDescription>{t.adminOnly}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">{t.email}</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mangabangla.com"
                className="pl-9"
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">{t.password}</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
                required
                autoComplete="current-password"
              />
            </div>
          </div>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Demo credentials:
            </div>
            <p className="mt-1">admin@mangabangla.com / admin123</p>
          </div>
          <Button type="submit" className="w-full gap-2">
            <Shield className="h-4 w-4" />
            {t.adminLogin}
          </Button>
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setDialog("login")}
              className="text-muted-foreground transition hover:text-primary"
            >
              {t.switchToUserLogin}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
