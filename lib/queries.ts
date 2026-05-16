import { supabase } from './supabase';
import type { Article, Release, Album } from './data';

// ─── Fetch dari Supabase ───────────────────────────────────────────────────────

export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('order_index', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    // Fallback ke data statis jika Supabase belum diisi
    const { articles } = await import('./data');
    return articles;
  }

  return data.map(row => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    type: row.type,
    genre: row.genre,
    author: row.author,
    date: row.date,
    readTime: row.read_time,
    imageColor: row.image_color,
    imageUrl: row.image_url || undefined,
    deezerId: row.deezer_id || undefined,
    viewCount: row.view_count,
    featured: row.featured,
    tags: row.tags,
  }));
}

export async function getWeeklyReleases(): Promise<Release[]> {
  const { data, error } = await supabase
    .from('weekly_releases')
    .select('*')
    .order('order_index', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    const { weeklyReleases } = await import('./data');
    return weeklyReleases;
  }

  return data.map(row => ({
    id: row.id,
    artist: row.artist,
    title: row.title,
    type: row.type,
    genre: row.genre,
    releaseDate: row.release_date,
    imageColor: row.image_color,
    imageUrl: row.image_url || undefined,
    deezerId: row.deezer_id || undefined,
    tags: row.tags,
  }));
}

export async function getUnderratedAlbums(): Promise<Album[]> {
  const { data, error } = await supabase
    .from('underrated_albums')
    .select('*')
    .order('order_index', { ascending: false })
    .order('rating', { ascending: false });

  if (error || !data || data.length === 0) {
    const { underratedAlbums } = await import('./data');
    return underratedAlbums;
  }

  return data.map(row => ({
    id: row.id,
    artist: row.artist,
    title: row.title,
    year: row.year,
    genre: row.genre,
    imageColor: row.image_color,
    imageUrl: row.image_url || undefined,
    deezerId: row.deezer_id || undefined,
    why: row.why,
    rating: row.rating,
    tags: row.tags,
  }));
}
