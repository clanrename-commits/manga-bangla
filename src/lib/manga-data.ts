export type MangaStatus = "Ongoing" | "Completed" | "Hiatus";

export interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: number;
  releasedAt: string; // ISO date
}

export interface Manga {
  id: string;
  title: string;
  author: string;
  artist?: string;
  cover: string; // image URL
  banner?: string;
  status: MangaStatus;
  year: number;
  rating: number; // 0 - 10
  views: number;
  genres: string[];
  tags: string[];
  synopsis: string;
  chapters: Chapter[];
  featured?: boolean;
  trending?: boolean;
}

// Helper to build a stable, deterministic cover image URL.
const cover = (seed: string) =>
  `https://picsum.photos/seed/${seed}/600/900`;
const banner = (seed: string) =>
  `https://picsum.photos/seed/${seed}-ban/1600/700`;

function makeChapters(seed: string, count: number, startDate = "2024-01-01"): Chapter[] {
  const start = new Date(startDate).getTime();
  const now = Date.now();
  const span = now - start;
  const chapters: Chapter[] = [];
  const titles = [
    "Awakening",
    "First Blood",
    "The Oath",
    "Crimson Sky",
    "Hidden Blade",
    "Echoes",
    "Shattered Vow",
    "Dawn Breaks",
    "Silent Strike",
    "The Reckoning",
    "Fractured Crown",
    "Final Verse",
  ];
  for (let i = 1; i <= count; i++) {
    const t = start + Math.floor((span * (i - 1)) / Math.max(count - 1, 1));
    chapters.push({
      id: `${seed}-c${i}`,
      number: i,
      title: titles[(i - 1) % titles.length],
      pages: 12 + ((i * 3) % 9),
      releasedAt: new Date(t).toISOString(),
    });
  }
  return chapters.reverse(); // newest first
}

export const MANGA_LIST: Manga[] = [
  {
    id: "shadow-blade-chronicles",
    title: "Shadow Blade Chronicles",
    author: "Ren Takahashi",
    artist: "Yuki Sato",
    cover: cover("shadow-blade"),
    banner: banner("shadow-blade"),
    status: "Ongoing",
    year: 2021,
    rating: 9.2,
    views: 4_820_000,
    genres: ["Action", "Fantasy", "Adventure"],
    tags: ["Samurai", "Revenge", "Cursed Blade"],
    synopsis:
      "When a wandering swordsman inherits a blade forged from a fallen god's soul, he is thrust into a war between forgotten spirits and the empire that hunts them. As the cursed weapon whispers of bloodlines and betrayals, he must decide whether to break the cycle of vengeance or be consumed by it. Each chapter peels back another layer of an ancient pact that has shaped the fate of nations for a thousand years, weaving political intrigue with breathtaking duels on rain-slicked rooftops and across moonlit battlefields.",
    chapters: makeChapters("shadow-blade", 24, "2023-02-01"),
    featured: true,
    trending: true,
  },
  {
    id: "neon-sakura",
    title: "Neon Sakura",
    author: "Aoi Hoshino",
    cover: cover("neon-sakura"),
    banner: banner("neon-sakura"),
    status: "Ongoing",
    year: 2023,
    rating: 8.9,
    views: 2_310_000,
    genres: ["Sci-Fi", "Romance", "Drama"],
    tags: ["Cyberpunk", "AI", "Tokyo 2099"],
    synopsis:
      "In a neon-drowned Tokyo of 2099, a young mechanic repairs broken androids while quietly mourning a sister she could not save. When a mysterious combat unit lands on her workbench with memories that should not exist, she is pulled into a conspiracy that reaches the highest towers of the city. Neon Sakura blends tender romance with sharp cyberpunk thrills, asking what it means to love someone whose code was written to forget you.",
    chapters: makeChapters("neon-sakura", 18, "2024-05-12"),
    featured: true,
    trending: true,
  },
  {
    id: "iron-fang-academy",
    title: "Iron Fang Academy",
    author: "Daichi Mori",
    cover: cover("iron-fang"),
    banner: banner("iron-fang"),
    status: "Ongoing",
    year: 2022,
    rating: 8.5,
    views: 1_980_000,
    genres: ["Action", "Supernatural", "School"],
    tags: ["Werewolves", "Rivalry", "Training Arc"],
    synopsis:
      "Hidden deep in the northern mountains, Iron Fang Academy trains the next generation of werewolf enforcers — children of rival bloodlines forced to share dorms, classrooms, and lethal sparring rings. When a human scholarship student stumbles into their secret world, the academy's careful balance begins to fracture. Friendships are forged in blood, rivalries smolder into romance, and the headmaster's silence hides a debt the school can never repay.",
    chapters: makeChapters("iron-fang", 16, "2023-09-03"),
    trending: true,
  },
  {
    id: "the-last-librarian",
    title: "The Last Librarian",
    author: "Mei Kuroda",
    cover: cover("last-librarian"),
    banner: banner("last-librarian"),
    status: "Ongoing",
    year: 2024,
    rating: 9.0,
    views: 760_000,
    genres: ["Fantasy", "Mystery", "Slice of Life"],
    tags: ["Books", "Magic", "Post-War"],
    synopsis:
      "In a kingdom that burned every book it could find, one librarian travels from village to village with a cart of forbidden volumes, lending them to anyone brave enough to read. Each chapter follows a different borrower and the story that changed their life, threaded together by the librarian's quiet search for a single page that could rewrite the kingdom's past. A tender, melancholy fantasy for anyone who has ever loved a book so much it hurt.",
    chapters: makeChapters("last-librarian", 12, "2024-10-20"),
    featured: true,
  },
  {
    id: "starlight-pirates",
    title: "Starlight Pirates",
    author: "Hayato Ishida",
    cover: cover("starlight-pirates"),
    banner: banner("starlight-pirates"),
    status: "Ongoing",
    year: 2020,
    rating: 8.7,
    views: 5_410_000,
    genres: ["Sci-Fi", "Action", "Adventure"],
    tags: ["Space", "Crew", "Heist"],
    synopsis:
      "The crew of the Starlight Renegade steals from galactic corporations and gives to the colonies they were built to silence. When their newest heist uncovers a map to a forgotten colony ship, the crew must outrun bounty hunters, naval armadas, and a traitor in their own ranks. Packed with zero-G set pieces and the warmest found-family banter this side of the spiral arm.",
    chapters: makeChapters("starlight-pirates", 32, "2021-01-15"),
    trending: true,
  },
  {
    id: "kitchen-of-souls",
    title: "Kitchen of Souls",
    author: "Sora Fujimoto",
    cover: cover("kitchen-souls"),
    banner: banner("kitchen-souls"),
    status: "Ongoing",
    year: 2022,
    rating: 8.4,
    views: 1_120_000,
    genres: ["Slice of Life", "Supernatural", "Drama"],
    tags: ["Food", "Ghosts", "Healing"],
    synopsis:
      "A tiny midnight diner serves only one dish per customer — the meal that meant the most to them in life. Run by a quiet chef who can see the dead, the kitchen becomes a waypoint for spirits and the living alike, each looking for one last taste of someone they lost. Wholesome, bittersweet, and impossible to read on an empty stomach.",
    chapters: makeChapters("kitchen-souls", 20, "2023-03-08"),
  },
  {
    id: "iron-witch-of-the-east",
    title: "Iron Witch of the East",
    author: "Nana Yamazaki",
    cover: cover("iron-witch"),
    banner: banner("iron-witch"),
    status: "Ongoing",
    year: 2019,
    rating: 9.1,
    views: 6_300_000,
    genres: ["Fantasy", "Action", "Drama"],
    tags: ["Witches", "War", "Politics"],
    synopsis:
      "Exiled to the eastern marches for refusing a king's order, the iron witch Vasilisa builds a free city out of refugees, deserters, and discarded machines. When the king sends an army to drag her home in chains, she must choose between the peace she built and the war she swore she would never fight again. A sweeping military fantasy with one of the most beloved protagonists of the decade.",
    chapters: makeChapters("iron-witch", 28, "2020-04-12"),
    featured: true,
    trending: true,
  },
  {
    id: "summer-of-the-fireflies",
    title: "Summer of the Fireflies",
    author: "Kanae Minato",
    cover: cover("fireflies"),
    banner: banner("fireflies"),
    status: "Completed",
    year: 2018,
    rating: 8.8,
    views: 2_770_000,
    genres: ["Romance", "Drama", "Slice of Life"],
    tags: ["Small Town", "First Love", "Coming of Age"],
    synopsis:
      "Two teenagers spend one impossible summer in a town where the fireflies are said to grant a single wish to whoever catches them at midnight. As the season burns down, they learn that some wishes come true only if you are willing to let them go. A modern classic — read it once for the romance and twice for the elegy underneath.",
    chapters: makeChapters("fireflies", 14, "2018-06-01"),
  },
  {
    id: "mechheart",
    title: "MechHeart",
    author: "Teppei Ono",
    cover: cover("mechheart"),
    banner: banner("mechheart"),
    status: "Ongoing",
    year: 2023,
    rating: 8.6,
    views: 980_000,
    genres: ["Mecha", "Action", "Sci-Fi"],
    tags: ["Pilots", "Rebellion", "Found Family"],
    synopsis:
      "Sixteen-year-old Iri is the youngest mech pilot in the rebellion, and the only one whose mech refuses to fight without her singing to it. As the war grinds on, she begins to suspect the mech is not a machine at all, but a captured god wearing armor plating like a cage. A dazzling blend of music, mech battles, and quiet, devastating character work.",
    chapters: makeChapters("mechheart", 11, "2024-07-09"),
    trending: true,
  },
  {
    id: "the-cartographer-of-dreams",
    title: "The Cartographer of Dreams",
    author: "Rin Saeki",
    cover: cover("cartographer"),
    banner: banner("cartographer"),
    status: "Ongoing",
    year: 2024,
    rating: 8.9,
    views: 540_000,
    genres: ["Fantasy", "Mystery", "Adventure"],
    tags: ["Dreams", "Maps", "Heist"],
    synopsis:
      "A forger who can draw maps of places she has only dreamed of is recruited by a thief to plan the impossible heist of a dream that was stolen from a sleeping emperor. Each chapter is a new map, a new dream, a new city that may or may not exist. Lush, intricate, and impossible to put down.",
    chapters: makeChapters("cartographer", 9, "2025-01-04"),
  },
  {
    id: "tideborn",
    title: "Tideborn",
    author: "Yuna Hayashi",
    cover: cover("tideborn"),
    banner: banner("tideborn"),
    status: "Ongoing",
    year: 2021,
    rating: 8.3,
    views: 1_460_000,
    genres: ["Fantasy", "Adventure", "Action"],
    tags: ["Ocean", "Pirates", "Curses"],
    synopsis:
      "Born with the mark of the drowned god, a young navigator can read the language written in the foam of every wave — but every reading costs her a memory she will never get back. When her crew sails into waters that no chart has ever mapped, she must decide which memories she can bear to lose. Salt-spray adventure with a bittersweet, magical core.",
    chapters: makeChapters("tideborn", 22, "2022-08-21"),
  },
  {
    id: "the-glass-empire",
    title: "The Glass Empire",
    author: "Junichiro Asami",
    cover: cover("glass-empire"),
    banner: banner("glass-empire"),
    status: "Hiatus",
    year: 2017,
    rating: 8.7,
    views: 3_120_000,
    genres: ["Drama", "Fantasy", "Mystery"],
    tags: ["Court Intrigue", "Magic", "Betrayal"],
    synopsis:
      "In an empire where every noble's life is recorded in a mirror that cannot lie, the youngest princess discovers that her mirror has been showing someone else's life for the last ten years. As she untangles the conspiracy around her birth, she realizes the empire itself is a reflection of a kingdom that fell centuries ago. Dense, glittering, and razor-sharp.",
    chapters: makeChapters("glass-empire", 19, "2017-11-30"),
  },
];

export const ALL_GENRES = Array.from(
  new Set(MANGA_LIST.flatMap((m) => m.genres))
).sort();

export const ALL_TAGS = Array.from(
  new Set(MANGA_LIST.flatMap((m) => m.tags))
).sort();

export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
