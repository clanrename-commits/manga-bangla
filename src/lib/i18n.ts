"use client";

import { useMangaStore } from "@/store/manga-store";

export type Lang = "en" | "bn";

type Dict = {
  // Brand
  siteName: string;
  tagline: string;
  firstMangaBadge: string;
  // Nav
  browse: string;
  trending: string;
  favorites: string;
  // Search
  searchPlaceholder: string;
  searchManga: string;
  // Hero
  readFirstChapter: string;
  viewDetails: string;
  addToFavorites: string;
  favorited: string;
  featured: string;
  reads: string;
  chapters: string;
  // Sections
  browseManga: string;
  browseSubtitle: string;
  trendingNow: string;
  trendingSubtitle: string;
  yourFavorites: string;
  favoritesEmpty: string;
  favoritesCount: (n: number) => string;
  results: (n: number) => string;
  // Filters
  filter: string;
  clear: string;
  // Card
  read: string;
  details: string;
  trendingBadge: string;
  // Detail
  status: string;
  ongoing: string;
  completed: string;
  hiatus: string;
  by: string;
  artBy: string;
  synopsis: string;
  readFromStart: string;
  readLatest: string;
  pages: string;
  // Reader
  page: string;
  of: string;
  prev: string;
  next: string;
  prevPage: string;
  nextPage: string;
  chaptersList: string;
  closeReader: string;
  scrollUp: string;
  scrollDown: string;
  useArrows: string;
  endOfChapter: string;
  endOfChapterDesc: (title: string) => string;
  nextChapter: string;
  reachedLatest: string;
  closeReaderBtn: string;
  // Empty states
  noFavorites: string;
  noFavoritesDesc: string;
  noResults: string;
  noResultsDesc: string;
  browseCatalog: string;
  // Auth
  login: string;
  register: string;
  logout: string;
  admin: string;
  adminPanel: string;
  email: string;
  password: string;
  name: string;
  loginToContinue: string;
  createAccount: string;
  welcomeBack: string;
  hello: string;
  noAccount: string;
  haveAccount: string;
  adminLogin: string;
  adminOnly: string;
  switchToAdminLogin: string;
  switchToUserLogin: string;
  // Admin panel
  postNewManga: string;
  mangaTitleEn: string;
  mangaTitleBn: string;
  authorLabel: string;
  coverUrl: string;
  bannerUrl: string;
  genresLabel: string;
  synopsisEn: string;
  synopsisBn: string;
  statusLabel: string;
  yearLabel: string;
  numberOfChapters: string;
  post: string;
  postedManga: string;
  delete: string;
  facebookPageUrl: string;
  saveSettings: string;
  settings: string;
  noPostedManga: string;
  // Footer
  discover: string;
  genres3: string;
  follow: string;
  footerDesc: string;
  allRights: string;
  madeWith: string;
  forMangaFans: string;
  ideaAndDevBy: string;
  whatsapp: string;
  facebook: string;
  coverArtworkNote: string;
  // Toast messages
  loginSuccess: string;
  registerSuccess: string;
  logoutSuccess: string;
  invalidCredentials: string;
  emailExists: string;
  mangaPosted: string;
  mangaDeleted: string;
  settingsSaved: string;
  addedToFavorites: string;
  removedFromFavorites: string;
  requiredField: string;
  // Misc
  language: string;
  menu: string;
  close: string;
};

export const translations: Record<Lang, Dict> = {
  en: {
    siteName: "Manga Bangla",
    tagline: "First Manga in Bangla.",
    firstMangaBadge: "First Manga in Bangla",
    browse: "Browse",
    trending: "Trending",
    favorites: "Favorites",
    searchPlaceholder: "Search titles, authors, tags…",
    searchManga: "Search manga",
    readFirstChapter: "Read first chapter",
    viewDetails: "View details",
    addToFavorites: "Add to favorites",
    favorited: "Favorited",
    featured: "Featured",
    reads: "reads",
    chapters: "chapters",
    browseManga: "Browse Manga",
    browseSubtitle:
      "Discover hundreds of titles across every genre. Pick a favorite and start reading in seconds.",
    trendingNow: "Trending Now",
    trendingSubtitle: "What everyone is reading this week.",
    yourFavorites: "Your Favorites",
    favoritesEmpty: "Tap the heart on any manga to save it here for later.",
    favoritesCount: (n) => `${n} saved title${n === 1 ? "" : "s"}.`,
    results: (n) => `${n} result${n === 1 ? "" : "s"}`,
    filter: "Filter",
    clear: "Clear",
    read: "Read",
    details: "Details",
    trendingBadge: "Trending",
    status: "Status",
    ongoing: "Ongoing",
    completed: "Completed",
    hiatus: "Hiatus",
    by: "by",
    artBy: "art by",
    synopsis: "Synopsis",
    readFromStart: "Read from start",
    readLatest: "Read latest",
    pages: "pages",
    page: "Page",
    of: "of",
    prev: "Prev",
    next: "Next",
    prevPage: "Previous page",
    nextPage: "Next page",
    chaptersList: "Chapters",
    closeReader: "Close reader",
    scrollUp: "Scroll up",
    scrollDown: "Scroll down",
    useArrows: "Use ← / → to navigate",
    endOfChapter: "End of Chapter",
    endOfChapterDesc: (title) => `You finished "${title}".`,
    nextChapter: "Next chapter",
    reachedLatest: "You've reached the latest chapter. Check back soon!",
    closeReaderBtn: "Close reader",
    noFavorites: "No favorites yet",
    noFavoritesDesc:
      "Browse the catalog and tap the heart on any cover to save it here.",
    noResults: "No manga match your search",
    noResultsDesc: "Try a different title, author, or clear some filters.",
    browseCatalog: "Browse the catalog",
    login: "Login",
    register: "Register",
    logout: "Logout",
    admin: "Admin",
    adminPanel: "Admin Panel",
    email: "Email",
    password: "Password",
    name: "Name",
    loginToContinue: "Login to continue",
    createAccount: "Create an account",
    welcomeBack: "Welcome back",
    hello: "Hello",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    adminLogin: "Admin Login",
    adminOnly: "Admin access only",
    switchToAdminLogin: "Admin login",
    switchToUserLogin: "User login",
    postNewManga: "Post New Manga",
    mangaTitleEn: "Manga Title (English)",
    mangaTitleBn: "Manga Title (Bangla)",
    authorLabel: "Author",
    coverUrl: "Cover Image URL",
    bannerUrl: "Banner Image URL (optional)",
    genresLabel: "Genres (comma separated)",
    synopsisEn: "Synopsis (English)",
    synopsisBn: "Synopsis (Bangla)",
    statusLabel: "Status",
    yearLabel: "Year",
    numberOfChapters: "Number of chapters",
    post: "Post Manga",
    postedManga: "Posted Manga",
    delete: "Delete",
    facebookPageUrl: "Facebook Page URL",
    saveSettings: "Save Settings",
    settings: "Settings",
    noPostedManga: "No manga posted yet.",
    discover: "Discover",
    genres3: "Genres",
    follow: "Follow",
    footerDesc:
      "The first manga platform in Bangla. A modern reader with a curated catalog, dark mode, and a built-in chapter reader.",
    allRights: "All rights reserved.",
    madeWith: "Made with",
    forMangaFans: "for manga fans",
    ideaAndDevBy: "Idea and developed by",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    coverArtworkNote:
      "All cover artwork is procedurally generated placeholder imagery.",
    loginSuccess: "Logged in successfully",
    registerSuccess: "Account created successfully",
    logoutSuccess: "Logged out",
    invalidCredentials: "Invalid email or password",
    emailExists: "Email already registered",
    mangaPosted: "Manga posted successfully",
    mangaDeleted: "Manga deleted",
    settingsSaved: "Settings saved",
    addedToFavorites: "Added to favorites",
    removedFromFavorites: "Removed from favorites",
    requiredField: "This field is required",
    language: "Language",
    menu: "Menu",
    close: "Close",
  },
  bn: {
    siteName: "মাঙ্গা বাংলা",
    tagline: "প্রথম বাংলা মাঙ্গা।",
    firstMangaBadge: "প্রথম বাংলা মাঙ্গা",
    browse: "ব্রাউজ",
    trending: "ট্রেন্ডিং",
    favorites: "প্রিয়",
    searchPlaceholder: "শিরোনাম, লেখক, ট্যাগ খুঁজুন…",
    searchManga: "মাঙ্গা খুঁজুন",
    readFirstChapter: "প্রথম অধ্যায় পড়ুন",
    viewDetails: "বিস্তারিত দেখুন",
    addToFavorites: "প্রিয়তে যোগ করুন",
    favorited: "প্রিয় হয়েছে",
    featured: "ফিচার্ড",
    reads: "বার পড়া হয়েছে",
    chapters: "অধ্যায়",
    browseManga: "মাঙ্গা ব্রাউজ করুন",
    browseSubtitle:
      "প্রতিটি ধরনের শত শত শিরোনাম আবিষ্কার করুন। একটি প্রিয় বেছে নিন এবং সেকেন্ডের মধ্যে পড়া শুরু করুন।",
    trendingNow: "এখন ট্রেন্ডিং",
    trendingSubtitle: "এই সপ্তাহে সবাই কী পড়ছে।",
    yourFavorites: "আপনার প্রিয়",
    favoritesEmpty: "যেকোনো মাঙ্গায় হার্ট চিহ্ন ট্যাপ করে এখানে সংরক্ষণ করুন।",
    favoritesCount: (n) => `${n} টি সংরক্ষিত শিরোনাম।`,
    results: (n) => `${n} টি ফলাফল`,
    filter: "ফিল্টার",
    clear: "মুছুন",
    read: "পড়ুন",
    details: "বিস্তারিত",
    trendingBadge: "ট্রেন্ডিং",
    status: "অবস্থা",
    ongoing: "চলমান",
    completed: "সম্পূর্ণ",
    hiatus: "স্থগিত",
    by: "লিখেছেন",
    artBy: "চিত্রকর্ম",
    synopsis: "সারসংক্ষেপ",
    readFromStart: "শুরু থেকে পড়ুন",
    readLatest: "সর্বশেষ পড়ুন",
    pages: "পৃষ্ঠা",
    page: "পৃষ্ঠা",
    of: "/",
    prev: "পূর্ববর্তী",
    next: "পরবর্তী",
    prevPage: "পূর্ববর্তী পৃষ্ঠা",
    nextPage: "পরবর্তী পৃষ্ঠা",
    chaptersList: "অধ্যায়সমূহ",
    closeReader: "রিডার বন্ধ করুন",
    scrollUp: "উপরে স্ক্রল করুন",
    scrollDown: "নিচে স্ক্রল করুন",
    useArrows: "নেভিগেট করতে ← / → ব্যবহার করুন",
    endOfChapter: "অধ্যায়ের শেষ",
    endOfChapterDesc: (title) => `আপনি "${title}" সম্পূর্ণ করেছেন।`,
    nextChapter: "পরবর্তী অধ্যায়",
    reachedLatest: "আপনি সর্বশেষ অধ্যায়ে পৌঁছেছেন। শীঘ্রই ফিরে আসুন!",
    closeReaderBtn: "রিডার বন্ধ করুন",
    noFavorites: "এখনো কোনো প্রিয় নেই",
    noFavoritesDesc:
      "ক্যাটালগ ব্রাউজ করুন এবং যেকোনো কভারে হার্ট ট্যাপ করে এখানে সংরক্ষণ করুন।",
    noResults: "কোনো মাঙ্গা আপনার অনুসন্ধানের সাথে মেলে না",
    noResultsDesc: "ভিন্ন শিরোনাম, লেখক চেষ্টা করুন বা কিছু ফিল্টার মুছুন।",
    browseCatalog: "ক্যাটালগ ব্রাউজ করুন",
    login: "লগইন",
    register: "নিবন্ধন",
    logout: "লগআউট",
    admin: "অ্যাডমিন",
    adminPanel: "অ্যাডমিন প্যানেল",
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    name: "নাম",
    loginToContinue: "চালিয়ে যেতে লগইন করুন",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    welcomeBack: "আবার স্বাগতম",
    hello: "নমস্কার",
    noAccount: "অ্যাকাউন্ট নেই?",
    haveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    adminLogin: "অ্যাডমিন লগইন",
    adminOnly: "শুধুমাত্র অ্যাডমিন অ্যাক্সেস",
    switchToAdminLogin: "অ্যাডমিন লগইন",
    switchToUserLogin: "ইউজার লগইন",
    postNewManga: "নতুন মাঙ্গা পোস্ট করুন",
    mangaTitleEn: "মাঙ্গা শিরোনাম (ইংরেজি)",
    mangaTitleBn: "মাঙ্গা শিরোনাম (বাংলা)",
    authorLabel: "লেখক",
    coverUrl: "কভার ছবি URL",
    bannerUrl: "ব্যানার ছবি URL (ঐচ্ছিক)",
    genresLabel: "ধরন (কমা দিয়ে আলাদা)",
    synopsisEn: "সারসংক্ষেপ (ইংরেজি)",
    synopsisBn: "সারসংক্ষেপ (বাংলা)",
    statusLabel: "অবস্থা",
    yearLabel: "বছর",
    numberOfChapters: "অধ্যায়ের সংখ্যা",
    post: "মাঙ্গা পোস্ট করুন",
    postedManga: "পোস্ট করা মাঙ্গা",
    delete: "মুছুন",
    facebookPageUrl: "ফেসবুক পেজ URL",
    saveSettings: "সেটিংস সংরক্ষণ",
    settings: "সেটিংস",
    noPostedManga: "এখনো কোনো মাঙ্গা পোস্ট করা হয়নি।",
    discover: "আবিষ্কার",
    genres3: "ধরন",
    follow: "ফলো করুন",
    footerDesc:
      "প্রথম বাংলা মাঙ্গা প্ল্যাটফর্ম। একটি আধুনিক রিডার যাতে কিউরেটেড ক্যাটালগ, ডার্ক মোড এবং বিল্ট-ইন চ্যাপ্টার রিডার রয়েছে।",
    allRights: "সর্বস্বত্ব সংরক্ষিত।",
    madeWith: "তৈরি",
    forMangaFans: "মাঙ্গা ভক্তদের জন্য",
    ideaAndDevBy: "আইডিয়া ও ডেভেলপমেন্ট",
    whatsapp: "হোয়াটসঅ্যাপ",
    facebook: "ফেসবুক",
    coverArtworkNote: "সমস্ত কভার আর্টওয়ার্ক প্রোগ্রামে তৈরি প্লেসহোল্ডার চিত্র।",
    loginSuccess: "সফলভাবে লগইন হয়েছে",
    registerSuccess: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে",
    logoutSuccess: "লগআউট হয়েছে",
    invalidCredentials: "ভুল ইমেইল বা পাসওয়ার্ড",
    emailExists: "ইমেইল ইতিমধ্যে নিবন্ধিত",
    mangaPosted: "মাঙ্গা সফলভাবে পোস্ট হয়েছে",
    mangaDeleted: "মাঙ্গা মুছে ফেলা হয়েছে",
    settingsSaved: "সেটিংস সংরক্ষিত হয়েছে",
    addedToFavorites: "প্রিয়তে যোগ হয়েছে",
    removedFromFavorites: "প্রিয় থেকে সরানো হয়েছে",
    requiredField: "এই ঘরটি পূরণ আবশ্যক",
    language: "ভাষা",
    menu: "মেনু",
    close: "বন্ধ",
  },
};

export function useT(): Dict {
  const lang = useMangaStore((s) => s.lang);
  return translations[lang];
}
