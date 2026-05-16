-- Jalankan SQL ini di Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/puyssygsutnovolkedmk/sql

-- ─── Tabel Articles ───────────────────────────────────────────────────────────
create table if not exists articles (
  id text primary key,
  title text not null,
  excerpt text not null,
  type text not null check (type in ('news', 'feature', 'review')),
  genre text not null check (genre in ('indie', 'rap', 'alternative')),
  author text not null,
  date text not null,
  read_time integer not null default 5,
  image_color text not null default '',
  featured boolean not null default false,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ─── Tabel Weekly Releases ────────────────────────────────────────────────────
create table if not exists weekly_releases (
  id text primary key,
  artist text not null,
  title text not null,
  type text not null check (type in ('album', 'ep', 'single')),
  genre text not null check (genre in ('indie', 'rap', 'alternative')),
  release_date text not null,
  image_color text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ─── Tabel Underrated Albums ──────────────────────────────────────────────────
create table if not exists underrated_albums (
  id text primary key,
  artist text not null,
  title text not null,
  year integer not null,
  genre text not null check (genre in ('indie', 'rap', 'alternative')),
  image_color text not null default '',
  why text not null,
  rating numeric(3,1) not null check (rating >= 0 and rating <= 10),
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ─── Row Level Security: Allow public read, no write from anon ────────────────
alter table articles enable row level security;
alter table weekly_releases enable row level security;
alter table underrated_albums enable row level security;

-- Public dapat membaca semua data
create policy "Public read articles" on articles for select using (true);
create policy "Public read releases" on weekly_releases for select using (true);
create policy "Public read albums" on underrated_albums for select using (true);

-- Anon juga bisa insert/update/delete (karena kita proteksi lewat x-admin-password header di API)
create policy "Anon write articles" on articles for all using (true) with check (true);
create policy "Anon write releases" on weekly_releases for all using (true) with check (true);
create policy "Anon write albums" on underrated_albums for all using (true) with check (true);
