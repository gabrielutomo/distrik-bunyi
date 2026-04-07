'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import ArticleCard from '@/components/ArticleCard';
import FeaturedArticle from '@/components/FeaturedArticle';
import WeeklyReleases from '@/components/WeeklyReleases';
import UnderratedSection from '@/components/UnderratedSection';
import {
  articles, underratedAlbums,
  Genre, genreAccent,
} from '@/lib/data';
import { DeezerRelease } from '@/lib/deezer';

const genreLabel: Record<string, { title: string; sub: string }> = {
  indie: { title: 'SKENA INDIE', sub: 'Alternative rock, pop rock, indie rock, surf rock, folk' },
  rap: { title: 'SKENA RAP', sub: 'Hip-hop, hyperpop, jersey club, trap, drill, opium' },
  alternative: { title: 'SKENA ALTERNATIF', sub: 'Midwest emo, shoegaze, mathrock, post-punk' },
};

interface HomeClientProps {
  deezerReleases: DeezerRelease[];
}

export default function HomeClient({ deezerReleases }: HomeClientProps) {
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop musik saat berpindah genre atau unmount agar tidak tumpang tindih
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [activeGenre]);

  const filteredArticles = useMemo(() => !activeGenre ? articles : articles.filter(a => a.genre === activeGenre), [activeGenre]);
  const filteredUnderrated = useMemo(() => !activeGenre ? underratedAlbums : underratedAlbums.filter(a => a.genre === activeGenre), [activeGenre]);

  // Filter rilisan Deezer berdasarkan genre aktif (semua genre default)
  const filteredReleases = useMemo(() =>
    !activeGenre
      ? deezerReleases
      : deezerReleases.filter(r => r.genre === activeGenre),
    [activeGenre, deezerReleases]
  );

  const featured = useMemo(() => filteredArticles.find(a => a.featured) ?? filteredArticles[0], [filteredArticles]);
  const latestArticles = useMemo(() => filteredArticles.filter(a => a.id !== featured?.id), [filteredArticles, featured]);

  // Data mandiri untuk widget Native (tidak terblokir ad-blocker)
  const listenNowData = filteredReleases.length > 0 ? filteredReleases[0] : null;

  const accent = activeGenre ? genreAccent[activeGenre] : 'rgba(255,255,255,0.15)';

  const togglePlay = () => {
    const rawUrl = listenNowData?.preview;
    if (!rawUrl) return;

    // Proxy audio melalui API route kita sendiri agar tidak kena restriksi CDN Deezer
    const httpsUrl = rawUrl.replace(/^http:\/\//i, 'https://');
    const previewUrl = `/api/preview?url=${encodeURIComponent(httpsUrl)}`;

    // Buat audio baru jika belum ada atau lagu berbeda
    const currentSrc = audioRef.current?.src ?? '';
    const normalizedSrc = currentSrc.replace(/^http:\/\//i, 'https://');

    if (normalizedSrc !== previewUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(previewUrl);
      audio.onended = () => setIsPlaying(false);
      audioRef.current = audio;
    }

    const currentAudio = audioRef.current;
    if (!currentAudio) return;

    if (isPlaying) {
      currentAudio.pause();
      setIsPlaying(false);
    } else {
      currentAudio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Audio playback error:', err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#f0f0f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Ambient background glow */}
      {activeGenre && (
        <div
          style={{
            position: 'fixed', top: -200, left: '50%', transform: 'translateX(-50%)',
            width: 800, height: 600,
            background: `radial-gradient(ellipse at center, ${genreAccent[activeGenre]}18 0%, transparent 70%)`,
            pointerEvents: 'none', zIndex: 0,
            transition: 'background 0.8s ease',
          }}
        />
      )}

      <Header activeGenre={activeGenre} onGenreChange={g => setActiveGenre(g as Genre | null)} />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: 80, position: 'relative', zIndex: 1 }}>

        {/* ── Hero banner ── */}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="hero-intro">
            <div>
              <h1 style={{ fontWeight: 900, fontSize: 'clamp(38px, 8vw, 90px)', letterSpacing: '-0.05em', lineHeight: 0.9, color: '#fff', textTransform: 'uppercase', marginBottom: 20 }}>
                {activeGenre ? genreLabel[activeGenre].title : 'DISTRIK BUNYI'}
              </h1>
              <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: 'rgba(255,255,255,0.5)', fontWeight: 500, maxWidth: 600, lineHeight: 1.5 }}>
                {activeGenre ? genreLabel[activeGenre].sub : 'Website informasi musik yang menyajikan berita-berita musik serta rilisan sepekan di tanah air'}
              </p>
            </div>
            {/* Native Player Custom - 100% Anti AdBlocker */}
            <div className="spotify-container">
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                LISTEN NOW
              </p>
              {listenNowData ? (
                <div
                  onClick={togglePlay}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    background: 'rgba(255,255,255,0.03)',
                    padding: 16, borderRadius: 12, border: isPlaying ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease', cursor: 'pointer',
                    position: 'relative', overflow: 'hidden'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                >
                  {/* Progress Bar background simulasi */}
                  {isPlaying && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, height: 2, background: accent,
                      animation: 'progress 30s linear forwards', width: '100%'
                    }} />
                  )}

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={listenNowData.imageUrl}
                    alt={listenNowData.title}
                    width={72}
                    height={72}
                    style={{ borderRadius: 6, objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontSize: 10, color: genreAccent[listenNowData.genre as Genre] || '#fff', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.1em' }}>
                      {isPlaying ? 'NOW PLAYING' : 'CLICK TO PREVIEW'}
                    </p>
                    <h4 style={{ fontSize: 15, color: '#fff', fontWeight: 700, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {listenNowData.title}
                    </h4>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {listenNowData.artist}
                    </p>
                  </div>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: isPlaying ? accent : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.3s ease'
                  }}>
                    {isPlaying ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z" /></svg>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ height: 106, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px dotted rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Memuat lagu...</p>
                </div>
              )}
              {listenNowData && (
                <a href={listenNowData.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'right', marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.2)', textDecoration: 'none', fontWeight: 600 }}>
                  FULL VERSION ON DEEZER ↗
                </a>
              )}
            </div>
          </div>

          {/* Featured */}
          {featured && <FeaturedArticle article={featured} />}
        </div>

        {/* ── Two-column feed ── */}
        <div className="main-grid">
          {/* Main articles */}
          <section className="fade-up-1" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>
                TERBARU
              </h2>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {latestArticles.map(a => <ArticleCard key={a.id} article={a} />)}
              {latestArticles.length === 0 && !featured && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 80, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>
                  Tidak ada artikel di kategori ini.
                </div>
              )}
            </div>
          </section>

          {/* Sidebar - Rilisan baru dari Spotify */}
          <section className="fade-up-2" style={{ position: 'sticky', top: 88 }}>
            <WeeklyReleases releases={filteredReleases} />
          </section>
        </div>

        {/* ── Underrated ── */}
        <div className="fade-up-3">
          <UnderratedSection albums={filteredUnderrated} />
        </div>

      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 80, padding: '64px 24px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 48 }}>
          <div style={{ maxWidth: 360 }}>
            <h3 style={{ fontWeight: 900, fontSize: 28, letterSpacing: '-0.04em', color: '#fff', marginBottom: 16 }}>DISTRIK BUNYI</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
              Platform kurasi &amp; arsip musik independen, rap, dan alternatif Indonesia. Untuk kamu yang dengerin musik bukan cuma karena fomo.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 64 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', marginBottom: 20 }}>NAVIGASI</p>
              {['Berita', 'Rilisan', 'Underrated', 'Tentang'].map(l => (
                <p key={l} style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 12, cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >{l}</p>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', marginBottom: 20 }}>SKENA</p>
              {[
                { label: 'Indie', genre: 'indie' as Genre, color: '#c8ff00' },
                { label: 'Rap', genre: 'rap' as Genre, color: '#ff2d6b' },
                { label: 'Alternative', genre: 'alternative' as Genre, color: '#9b5cf6' },
              ].map(item => (
                <p key={item.label}
                  style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 12, cursor: 'pointer', transition: 'color 0.2s' }}
                  onClick={() => setActiveGenre(item.genre)}
                  onMouseEnter={e => (e.currentTarget.style.color = item.color)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >{item.label}</p>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: '48px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>© 2026 Gabriel Adetya Utomo</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>STAY LOUD, STAY ARCHIVED.</span>
        </div>
      </footer>
    </div>
  );
}
