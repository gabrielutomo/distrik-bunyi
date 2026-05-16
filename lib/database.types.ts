export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface ArticleRow {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  type: 'news' | 'feature' | 'review';
  genre: 'indie' | 'rap' | 'alternative';
  author: string;
  date: string;
  read_time: number;
  image_color: string;
  image_url?: string | null;
  deezer_id?: string | null;
  view_count: number;
  featured: boolean;
  tags: string[];
  created_at: string;
}

export interface ReleaseRow {
  id: string;
  artist: string;
  title: string;
  type: 'album' | 'ep' | 'single';
  genre: 'indie' | 'rap' | 'alternative';
  release_date: string;
  image_color: string;
  image_url?: string | null;
  deezer_id?: string | null;
  tags: string[];
  created_at: string;
}

export interface AlbumRow {
  id: string;
  artist: string;
  title: string;
  year: number;
  genre: 'indie' | 'rap' | 'alternative';
  image_color: string;
  image_url?: string | null;
  deezer_id?: string | null;
  why: string;
  rating: number;
  tags: string[];
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: ArticleRow;
        Insert: Omit<ArticleRow, 'created_at'>;
        Update: Partial<Omit<ArticleRow, 'created_at'>>;
      };
      weekly_releases: {
        Row: ReleaseRow;
        Insert: Omit<ReleaseRow, 'created_at'>;
        Update: Partial<Omit<ReleaseRow, 'created_at'>>;
      };
      underrated_albums: {
        Row: AlbumRow;
        Insert: Omit<AlbumRow, 'created_at'>;
        Update: Partial<Omit<AlbumRow, 'created_at'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
