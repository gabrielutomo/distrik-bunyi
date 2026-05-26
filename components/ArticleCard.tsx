'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Article, genreAccent } from '@/lib/data';
import ShareSheet from '@/components/ShareSheet';

const typeLabel: Record<string, string> = {
  news: 'BERITA',
  feature: 'FEATURE',
  review: 'REVIEW',
};

interface ArticleCardProps { article: Article; }

export default function ArticleCard({ article }: ArticleCardProps) {
  const accent = genreAccent[article.genre] ?? '#fff';
  const [shareOpen, setShareOpen] = useState(false);

  const articleUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/articles/${article.id}`
    : `/articles/${article.id}`;

  return (
    <>
      <Link
        href={`/articles/${article.id}`}
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        <article
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.3s, border-color 0.3s',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
          onMouseEnter={e => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
            (e.currentTarget as HTMLElement).style.boxShadow = isLight ? `0 12px 32px rgba(26,24,20,0.08)` : `0 16px 48px rgba(0,0,0,0.4)`;
            (e.currentTarget as HTMLElement).style.borderColor = `${accent}40`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          }}
        >
          {/* Image or gradient placeholder */}
          <div style={{ width: '100%', aspectRatio: '16/9', background: article.imageColor, position: 'relative' }}>
            {article.imageUrl && (
              <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
            )}
            {/* Gradient overlay for readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6, zIndex: 10 }}>
              <span style={{
                background: accent,
                color: '#000',
                fontWeight: 800,
                fontSize: 9,
                letterSpacing: '0.1em',
                padding: '3px 8px',
                borderRadius: 4,
              }}>
                {article.genre.toUpperCase()}
              </span>
              <span style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                fontSize: 9,
                letterSpacing: '0.1em',
                padding: '3px 8px',
                borderRadius: 4,
              }}>
                {typeLabel[article.type]}
              </span>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: 10, transition: 'color 0.3s' }}>
              {article.date}
            </p>
            <h3 style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.35, color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.02em', minHeight: 46, transition: 'color 0.3s' }}>
              {article.title.length > 60 ? article.title.substring(0, 60) + '...' : article.title}
            </h3>
            <p style={{
              fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 16, flex: 1,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              transition: 'color 0.3s',
            }}>
              {article.excerpt}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 'auto', transition: 'border-color 0.3s' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', transition: 'color 0.3s' }}>
                {article.author.toUpperCase()}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: accent, letterSpacing: '0.05em' }}>
                  {article.readTime} MIN READ →
                </span>
                {/* Share button */}
                <button
                  id={`share-btn-${article.id}`}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShareOpen(true);
                  }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: '2px 4px', borderRadius: 4,
                    transition: 'color 0.2s',
                    display: 'flex', alignItems: 'center',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  aria-label="Bagikan artikel"
                  title="Bagikan"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      </Link>

      {shareOpen && (
        <ShareSheet
          data={{
            title: article.title,
            excerpt: article.excerpt,
            url: articleUrl,
            genre: article.genre,
            imageUrl: article.imageUrl,
          }}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
}
