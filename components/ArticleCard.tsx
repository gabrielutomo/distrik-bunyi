import React from 'react';
import Link from 'next/link';
import { Article, genreAccent } from '@/lib/data';

const typeLabel: Record<string, string> = {
  news: 'BERITA',
  feature: 'FEATURE',
  review: 'REVIEW',
};

interface ArticleCardProps { article: Article; }

export default function ArticleCard({ article }: ArticleCardProps) {
  const accent = genreAccent[article.genre] ?? '#fff';
  return (
    <Link
      href={`/articles/${article.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <article
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px rgba(0,0,0,0.4)`;
          (e.currentTarget as HTMLElement).style.borderColor = `${accent}40`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        {/* Image placeholder */}
        <div style={{ width: '100%', aspectRatio: '16/9', background: article.imageColor, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6 }}>
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
        <div style={{ padding: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginBottom: 10 }}>
            {article.date}
          </p>
          <h3 style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.35, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em' }}>
            {article.title}
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 16 }}>
            {article.excerpt}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
              {article.author.toUpperCase()}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: accent, letterSpacing: '0.05em' }}>
              {article.readTime} MIN READ →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
