"use client";

import { Header } from "@/components/manga/header";
import { Footer } from "@/components/manga/footer";
import { MangaExplorer } from "@/components/manga/manga-grid";
import { MangaDetailDialog } from "@/components/manga/manga-detail";
import { ReaderDialog } from "@/components/manga/reader";
import { AuthDialogs } from "@/components/manga/auth-dialogs";
import { AdminPanel } from "@/components/manga/admin-panel";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <MangaExplorer />
      <Footer />
      {/* Overlays */}
      <MangaDetailDialog />
      <ReaderDialog />
      <AuthDialogs />
      <AdminPanel />
    </div>
  );
}
