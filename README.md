# Manga Bangla — First Manga in Bangla

একটি দ্বিভাষিক (বাংলা/English) মাঙ্গা রিডিং প্ল্যাটফর্ম।

## ✨ Features

- 🌐 **Bilingual UI** — Bangla + English with language toggle
- 🌙 **Dark/Light theme** with rose-accented manga aesthetic
- 📚 **Full manga catalog** — browse, trending, favorites
- 📖 **Chapter reader** — image + PDF page support, keyboard navigation
- 🔐 **User authentication** — register, login, admin login
- 🛠️ **Full admin panel** (`/admin`) with sidebar:
  - Dashboard with stats
  - Manga management (CRUD with cover/banner upload, copyright, categories, genres, chapter image/PDF uploads with strict sequence preservation + reorder controls)
  - Categories management (CRUD)
  - Genres management (CRUD)
  - Settings (site name, default copyright, Facebook URL)
- 🏷️ **"First Manga in Bangla"** prominent branding
- 📱 **Responsive** mobile-first design
- 💾 **Turso (libsql) database** — all users share the same data

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Turso (libsql/SQLite) + Prisma ORM
- **State**: Zustand (client UI state)
- **Animations**: Framer Motion
- **Font**: Noto Sans Bengali

## 🚀 Quick Start

### Prerequisites

1. A [Turso](https://turso.tech) account + database
2. Node.js 18+ and [Bun](https://bun.sh)

### Installation

```bash
# Install dependencies
bun install

# Generate Prisma client
bun run db:generate
```

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token
ADMIN_SECRET=your-strong-admin-secret
ADMIN_EMAIL=admin@mangabangla.com
ADMIN_PASSWORD=admin123
```

### Database Setup

```bash
# Push schema to Turso (creates all tables)
bun run db:push

# Seed default data (admin user, categories, genres, settings)
bun run db:seed
```

### Development

```bash
bun run dev
```

Open http://localhost:3000

## 📋 Admin Access

- **URL**: `/admin`
- **Email**: `admin@mangabangla.com`
- **Password**: `admin123` (change this in production!)

## 🚢 Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in Vercel
3. Add environment variables (see above)
4. Deploy
5. Run `bun run db:push` and `bun run db:seed` locally to set up the database

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes (manga, categories, genres, auth, etc.)
│   ├── admin/            # Admin panel page
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Root layout
├── components/
│   ├── manga/            # Manga-specific components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── db.ts             # Prisma client (Turso adapter)
│   ├── auth.ts           # Auth helpers
│   ├── api-client.ts     # Client-side API helpers
│   ├── i18n.ts           # Bangla/English translations
│   └── manga-data.ts     # Types + default catalog
├── store/
│   └── manga-store.ts    # Zustand UI state
└── hooks/
    └── use-app-data.ts   # App data fetching

scripts/
├── push-schema.ts        # Push DB schema to Turso
├── seed.ts               # Seed default data
├── clean-test-data.ts    # Remove auto-generated test data
└── list-db.ts            # List all DB contents

prisma/
└── schema.prisma         # Database schema
```

## 📝 Database Schema

- **User** — admin + regular users
- **Category** — manga categories (Manga, Manhwa, Manhua, Webtoon, One-shot)
- **Genre** — manga genres (Action, Adventure, Comedy, Drama, Fantasy, ...)
- **Manga** — manga metadata (title, author, copyright, cover, banner, synopsis)
- **Chapter** — chapter list per manga
- **ChapterPage** — image/PDF pages per chapter
- **Favorites** — user favorites
- **Setting** — site settings (key-value)

## ⚠️ Security Notes

- Change `ADMIN_SECRET` and `ADMIN_PASSWORD` before production
- Password hashing uses SHA-256 — consider bcrypt for production
- Rotate Turso auth tokens regularly

## 👨‍💻 Credits

**Idea and developed by**: Abdur Rahman Akash
- WhatsApp: +8801534955065
- Facebook: [Manga Bangla](https://facebook.com/mangabangla)

## 📄 License

© Manga Bangla. All rights reserved.
