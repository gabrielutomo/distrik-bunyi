import React from 'react';
import Link from 'next/link';
import { Article, genreAccent } from '@/lib/data';

interface FeaturedArticleProps { article: Article; }

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const accent = genreAccent[article.genre] ?? '#fff';

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 480,
        borderRadius: 16,
        overflow: 'hidden',
        background: article.imageColor,
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Overlay gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(24px, 4vw, 48px)',
        gap: 20,
      }}>
        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            background: accent,
            color: '#000',
            fontWeight: 800, fontSize: 10, letterSpacing: '0.12em',
            padding: '4px 12px', borderRadius: 6,
          }}>
            {article.genre.toUpperCase()}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '0.1em', fontWeight: 600 }}>
            TOP STORY · {article.date}
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(24px, 4vw, 56px)',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: '#fff',
          maxWidth: 720,
        }}>
          {article.title}
        </h2>

        {/* Excerpt */}
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 600, fontWeight: 400 }}>
          {article.excerpt}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 8, flexWrap: 'wrap' }}>
          <Link href={`/articles/${article.id}`} style={{ textDecoration: 'none' }}>
            <button style={{
              background: accent,
              color: '#000',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              BACA SELENGKAPNYA
            </button>
          </Link>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.1em' }}>
            oleh {article.author.toUpperCase()} · {article.readTime} MIN READ
          </span>
        </div>
      </div>
    </section>
  );
}
