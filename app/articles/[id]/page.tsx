import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, genreAccent } from '@/lib/data';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return articles.map(a => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = articles.find(a => a.id === id);
  if (!article) return { title: 'Artikel tidak ditemukan' };
  return {
    title: `${article.title} — Distrik Bunyi`,
    description: article.excerpt,
  };
}

const typeLabel: Record<string, string> = {
  news: 'BERITA',
  feature: 'FEATURE',
  review: 'REVIEW',
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = articles.find(a => a.id === id);

  if (!article) notFound();

  const accent = genreAccent[article.genre] ?? '#fff';

  // Related articles: same genre, excluding current
  const related = articles
    .filter(a => a.genre === article.genre && a.id !== article.id)
    .slice(0, 3);

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#f0f0f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Back nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,8,8,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href="/"
            className="back-nav-link"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
              transition: 'color 0.2s',
            }}
          >
            ← DISTRIK BUNYI
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>/</span>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
            background: accent, color: '#000',
            padding: '3px 10px', borderRadius: 4,
          }}>
            {article.genre.toUpperCase()}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.25)',
          }}>
            {typeLabel[article.type]}
          </span>
        </div>
      </div>

      {/* Hero banner */}
      <div style={{
        width: '100%',
        minHeight: 'clamp(320px, 50vw, 560px)',
        background: article.imageColor,
        position: 'relative',
      }}>
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.5) 50%, rgba(0,0,0,0.1) 100%)',
        }} />

        {/* Hero content */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          maxWidth: 1280, margin: '0 auto',
          padding: 'clamp(32px, 5vw, 64px) 24px',
        }}>
          {/* Tags row */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{
              background: accent, color: '#000',
              fontWeight: 800, fontSize: 10, letterSpacing: '0.12em',
              padding: '4px 12px', borderRadius: 6,
            }}>
              {article.genre.toUpperCase()}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em' }}>
              {typeLabel[article.type]} · {article.date}
            </span>
            {article.featured && (
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em' }}>
                ★ TOP STORY
              </span>
            )}
          </div>

          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(28px, 5vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#fff',
            maxWidth: 900,
            marginBottom: 20,
          }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
              oleh <span style={{ color: accent }}>{article.author}</span>
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
              {article.readTime} MIN READ
            </span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: 'minmax(0,680px) 1fr', gap: 80 }}>

        {/* Content */}
        <article>
          {/* Excerpt / lead */}
          <p style={{
            fontSize: 'clamp(17px, 2vw, 21px)',
            fontWeight: 400,
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.75)',
            borderLeft: `3px solid ${accent}`,
            paddingLeft: 20,
            marginBottom: 48,
            fontStyle: 'italic',
          }}>
            {article.excerpt}
          </p>

          {/* Simulated article body paragraphs */}
          {[
            `Musik Indonesia terus berkembang dengan berbagai warna dan nuansa baru. Dalam konteks ini, karya yang tengah kita bicarakan menjadi salah satu bukti nyata bahwa scene lokal sudah jauh melampaui ekspektasi banyak orang.`,
            `Setiap detail dalam karya ini dirancang dengan teliti. Dari pilihan instrumen hingga aransemen yang tidak terburu-buru, semuanya mencerminkan kematangan artistik yang jarang ditemukan di rilisan mainstream Indonesia saat ini.`,
            `Yang membuat ini menarik bukan hanya kualitas produksinya, tapi juga keberanian untuk tidak mengikuti tren. Di tengah banjir rilisan yang terdengar serupa, karya seperti ini menjadi oase — sesuatu yang benar-benar punya identitas sendiri.`,
            `Bagi mereka yang belum mendengarnya, inilah saat yang tepat. Dan bagi yang sudah familiar, ada banyak hal baru untuk ditemukan di setiap putaran.`,
          ].map((para, i) => (
            <p key={i} style={{
              fontSize: 16,
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 28,
            }}>
              {para}
            </p>
          ))}

          {/* Tags */}
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {article.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                padding: '5px 12px', borderRadius: 6,
                background: `${accent}15`, color: accent,
                border: `1px solid ${accent}30`,
              }}>
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {/* Author card */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 24,
          }}>
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
              PENULIS
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: `linear-gradient(135deg, ${accent}40, ${accent}10)`,
                border: `1px solid ${accent}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 900, color: accent,
              }}>
                {article.author.charAt(0)}
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{article.author}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Kontributor</p>
              </div>
            </div>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
                ARTIKEL TERKAIT
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {related.map(rel => (
                  <Link key={rel.id} href={`/articles/${rel.id}`} style={{ textDecoration: 'none' }}>
                    <div 
                      className="related-article-card"
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 10,
                        cursor: 'pointer',
                        transition: 'border-color 0.2s, background 0.2s',
                        '--hover-border': `${accent}40`,
                      } as React.CSSProperties}
                    >
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: 6 }}>
                        {rel.title}
                      </p>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                        {rel.date} · {rel.readTime} min read
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', color: '#fff', cursor: 'pointer' }}>
              DISTRIK BUNYI
            </span>
          </Link>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>STAY LOUD, STAY ARCHIVED.</span>
        </div>
      </footer>
    </div>
  );
}
