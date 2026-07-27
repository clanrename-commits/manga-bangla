import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/manga/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manga Bangla — First Manga in Bangla",
  description:
    "Manga Bangla — প্রথম বাংলা মাঙ্গা প্ল্যাটফর্ম। Discover, read, and collect your favorite manga in Bangla and English. A modern reader with a curated catalog and built-in chapter reader.",
  keywords: [
    "manga bangla",
    "bangla manga",
    "manga",
    "bengali manga",
    "মাঙ্গা বাংলা",
    "online manga",
    "manga reader",
    "comics",
  ],
  authors: [{ name: "Abdur Rahman Akash" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-geist-sans), var(--font-bengali), sans-serif" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
