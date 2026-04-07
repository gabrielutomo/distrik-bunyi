export type Genre = "indie" | "rap" | "alternative";

export const genreAccent: Record<Genre, string> = {
  indie: '#c8ff00',
  rap: '#ff2d6b',
  alternative: '#9b5cf6',
};
export type ArticleType = "news" | "feature" | "review";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  type: ArticleType;
  genre: Genre;
  author: string;
  date: string;
  readTime: number;
  imageColor: string; // gradient for placeholder
  featured?: boolean;
  tags: string[];
}

export interface Release {
  id: string;
  artist: string;
  title: string;
  type: "album" | "ep" | "single";
  genre: Genre;
  releaseDate: string;
  imageColor: string;
  tags: string[];
}

export interface Album {
  id: string;
  artist: string;
  title: string;
  year: number;
  genre: Genre;
  imageColor: string;
  why: string;
  rating: number; // out of 10
  tags: string[];
}

// ─── Articles Data ────────────────────────────────────────────────────────────
export const articles: Article[] = [
  {
    id: "fourtwnty-hidup-baru",
    title: "Fourtwnty Lepas EP Baru, Masih Setia di Jalur Indie Folk yang Hangat",
    excerpt:
      "Setelah lebih dari setahun absen dari rilisan, duo asal Jakarta ini kembali dengan pendekatan yang lebih stripped-down dan jujur — mencuri perhatian di tengah banjir rilisan pop mainstream.",
    type: "feature",
    genre: "indie",
    author: "Reza Mahardika",
    date: "7 Apr 2026",
    readTime: 5,
    imageColor: "linear-gradient(135deg, #1a2a1a 0%, #2d4a1e 50%, #1a3a2a 100%)",
    featured: true,
    tags: ["indie folk", "jakarta", "ep"],
  },
  {
    id: "pamungkas-tur-2026",
    title: "Pamungkas Umumkan Tur 10 Kota, Bandung Jadi Pembuka",
    excerpt:
      "Singer-songwriter yang identik dengan pop alternatif melankolis ini siap keliling Indonesia lagi. Tiket pre-sale ludes dalam 12 menit.",
    type: "news",
    genre: "indie",
    author: "Siti Fauziah",
    date: "6 Apr 2026",
    readTime: 3,
    imageColor: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    tags: ["tur", "pop rock", "pamungkas"],
  },
  {
    id: "weird-genius-collab",
    title: "Weird Genius x Rich Brian: Kolaborasi yang Bikin Scene Lokal Antusias",
    excerpt:
      "Dua nama besar Indonesia di kancah internasional akhirnya berkolaborasi secara resmi. Single pertama mereka terdengar lebih gelap dari yang diexpect.",
    type: "news",
    genre: "rap",
    author: "Kevin Aditya",
    date: "6 Apr 2026",
    readTime: 4,
    imageColor: "linear-gradient(135deg, #2a0a0a 0%, #4a0e0e 50%, #2a0a1a 100%)",
    tags: ["hiphop", "elektronik", "kolaborasi"],
  },
  {
    id: "hindia-review-album",
    title: "Review: Hindia 'Menari dengan Bayangan' — Album yang Tidak Mau Buru-buru",
    excerpt:
      "Hindia kembali dengan karya yang semakin matang. Shoegaze-pop dengan lapisan lirik introspektif yang meresap perlahan, seperti menghirup embun pagi.",
    type: "review",
    genre: "alternative",
    author: "Rahayu Putri",
    date: "5 Apr 2026",
    readTime: 7,
    imageColor: "linear-gradient(135deg, #0d0a1e 0%, #1a0e2e 50%, #0d1a2e 100%)",
    featured: false,
    tags: ["shoegaze", "indie pop", "review"],
  },
  {
    id: "ramengvrl-hyperpop",
    title: "RAMENGVRL Bawa Hyperpop ke Festival Musik Kampus, Audiens Terpecah",
    excerpt:
      "Penampilan RAMENGVRL di Sounds of Youth Festival menuai reaksi beragam — tapi itulah poin utamanya. Musik yang sengaja mengusik.",
    type: "feature",
    genre: "rap",
    author: "Bima Sakti",
    date: "5 Apr 2026",
    readTime: 6,
    imageColor: "linear-gradient(135deg, #1a0a2a 0%, #2a0a3a 50%, #1a0a1a 100%)",
    tags: ["hyperpop", "festival", "ramengvrl"],
  },
  {
    id: "elephant-kind-mathrock",
    title: "Elephant Kind Rilis Math Rock Epic Berdurasi 9 Menit, Ini Alasannya",
    excerpt:
      "Band asal Jakarta ini tidak takut bikin lagu panjang. Trek terbaru mereka adalah perjalanan yang menuntut perhatian penuh — dan worth it.",
    type: "news",
    genre: "alternative",
    author: "Reza Mahardika",
    date: "4 Apr 2026",
    readTime: 4,
    imageColor: "linear-gradient(135deg, #0a1a2a 0%, #0e2a3a 50%, #0a0a2a 100%)",
    tags: ["mathrock", "progressive", "elephant kind"],
  },
  {
    id: "afternoon-swim-surf",
    title: "Afternoon Swim: Band Surf Rock Banten yang Wajib Kamu Dengarkan",
    excerpt:
      "Lahir dari garasi di Serang, sound mereka terdengar seperti perpaduan Wavves dan The Drums yang dipadukan cita rasa pantai Anyer.",
    type: "feature",
    genre: "indie",
    author: "Siti Fauziah",
    date: "4 Apr 2026",
    readTime: 5,
    imageColor: "linear-gradient(135deg, #0a1a1a 0%, #0e2a2a 50%, #0a1a0a 100%)",
    tags: ["surf rock", "banten", "indie"],
  },
  {
    id: "nosstress-bali",
    title: "Nosstress Buktikan Musik Bali Tidak Melulu Gamelan di Album Ketiga",
    excerpt:
      "Album terbaru mereka memadukan elemen lokal dan modern dengan cara yang terasa sangat natural — tidak dipaksakan, tidak kliché.",
    type: "review",
    genre: "indie",
    author: "Rahayu Putri",
    date: "3 Apr 2026",
    readTime: 6,
    imageColor: "linear-gradient(135deg, #1a0a0a 0%, #2a1a0a 50%, #1a1a0a 100%)",
    tags: ["folk", "bali", "indie"],
  },
];

// ─── This Week's Releases ─────────────────────────────────────────────────────
export const weeklyReleases: Release[] = [
  {
    id: "reality-club-new-single",
    artist: "Reality Club",
    title: "Somewhere Between",
    type: "single",
    genre: "indie",
    releaseDate: "7 Apr 2026",
    imageColor: "linear-gradient(135deg, #1e3a1e 0%, #2a4a1e 100%)",
    tags: ["pop rock", "indie"],
  },
  {
    id: "dipha-barus-ep",
    artist: "Dipha Barus",
    title: "Orbit EP",
    type: "ep",
    genre: "rap",
    releaseDate: "5 Apr 2026",
    imageColor: "linear-gradient(135deg, #3a1e1e 0%, #4a2a1e 100%)",
    tags: ["jersey club", "elektronik"],
  },
  {
    id: "feast-album",
    artist: "FEAST",
    title: "Cermin Retak",
    type: "album",
    genre: "alternative",
    releaseDate: "4 Apr 2026",
    imageColor: "linear-gradient(135deg, #1e1e3a 0%, #2a1e4a 100%)",
    tags: ["post-punk", "alternative"],
  },
  {
    id: "sun-eater-collab",
    artist: "Sun Eater",
    title: "Gravity Pulls",
    type: "single",
    genre: "indie",
    releaseDate: "4 Apr 2026",
    imageColor: "linear-gradient(135deg, #2a2a1e 0%, #3a3a1e 100%)",
    tags: ["alt-pop", "indie"],
  },
  {
    id: "nadin-amizah-single",
    artist: "Nadin Amizah",
    title: "Senyap",
    type: "single",
    genre: "indie",
    releaseDate: "3 Apr 2026",
    imageColor: "linear-gradient(135deg, #1e2a2a 0%, #1e3a3a 100%)",
    tags: ["folk", "indie"],
  },
  {
    id: "jasiah-rap-ep",
    artist: "Jasiah ID",
    title: "Dari Selatan EP",
    type: "ep",
    genre: "rap",
    releaseDate: "2 Apr 2026",
    imageColor: "linear-gradient(135deg, #3a1e2a 0%, #4a1e3a 100%)",
    tags: ["hiphop", "rap"],
  },
  {
    id: "cehage-shoegaze",
    artist: "Cehage",
    title: "Blur",
    type: "single",
    genre: "alternative",
    releaseDate: "1 Apr 2026",
    imageColor: "linear-gradient(135deg, #2a1e3a 0%, #3a1e4a 100%)",
    tags: ["shoegaze", "dream pop"],
  },
];

// ─── Underrated Albums ────────────────────────────────────────────────────────
export const underratedAlbums: Album[] = [
  {
    id: "bottlesmoker-semiotics",
    artist: "Bottlesmoker",
    title: "Semiotics of Silence",
    year: 2019,
    genre: "alternative",
    imageColor: "linear-gradient(135deg, #0d0d1e 0%, #1a0d2e 100%)",
    why: "Ambient elektronik yang terasa seperti meditasi lintas dimensi. Sepi, tapi penuh. Sering dilewatin karena covernya terlalu minimalis.",
    rating: 9.1,
    tags: ["ambient", "elektronik", "experimental"],
  },
  {
    id: "sore-centralismo",
    artist: "Sore",
    title: "Centralismo",
    year: 2008,
    genre: "indie",
    imageColor: "linear-gradient(135deg, #1e0d0d 0%, #2e1a0d 100%)",
    why: "Album indie rock Indonesia yang jauh di depan zamannya. Jika dirilis 2023, pasti viral. Kini hidup diam-diam di Spotify dengan plays yang kurang layak.",
    rating: 9.3,
    tags: ["indie rock", "pop rock", "klasik"],
  },
  {
    id: "yosugi-midwest-emo",
    artist: "Yosugi",
    title: "Terlambat Tiba",
    year: 2022,
    genre: "alternative",
    imageColor: "linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)",
    why: "Midwest emo dengan lirik Bahasa Indonesia yang terasa sangat personal. Gitarnya emo banget, tapi ada ketenangan yang aneh di dalamnya.",
    rating: 8.8,
    tags: ["midwest emo", "emo", "indie"],
  },
  {
    id: "jevin-julian-rap",
    artist: "Jevin Julian",
    title: "Nu-Jek Rap Volume 1",
    year: 2018,
    genre: "rap",
    imageColor: "linear-gradient(135deg, #1e0d0d 0%, #2e0d0d 100%)",
    why: "Rap Jakarta yang lebih jujur dari kebanyakan. Conceptual, penuh kritik sosial, tapi dibungkus flow yang enak. Underrated karena terlalu 'niche'.",
    rating: 8.5,
    tags: ["rap", "jakarta", "social commentary"],
  },
];
