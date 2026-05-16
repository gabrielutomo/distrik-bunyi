import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { genreAccent } from '@/lib/data';
import ArticleClient from './ArticleClient'; // We will create this for client-side view counting and markdown

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: article } = await supabase.from('articles').select('*').eq('id', id).single();
  
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
  
  // Fetch from Supabase
  const { data: article, error } = await supabase.from('articles').select('*').eq('id', id).single();

  if (error || !article) notFound();

  // Fetch related
  const { data: related } = await supabase
    .from('articles')
    .select('id, title, date, read_time')
    .eq('genre', article.genre)
    .neq('id', id)
    .limit(3);

  const accent = genreAccent[article.genre as keyof typeof genreAccent] ?? '#fff';

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
        background: article.image_color,
        position: 'relative',
      }}>
        {article.image_url && (
          <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
        )}
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
              {article.read_time} MIN READ
            </span>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: 'minmax(0,680px) 1fr', gap: 80 }}>
        
        {/* Client Component for Markdown & Views */}
        <ArticleClient 
          id={article.id} 
          content={article.content} 
          excerpt={article.excerpt} 
          accent={accent}
          tags={article.tags}
          deezerId={article.deezer_id}
        />

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>PENULIS</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}40, ${accent}10)`, border: `1px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: accent }}>
                {article.author.charAt(0)}
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{article.author}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Kontributor</p>
              </div>
            </div>
          </div>

          {related && related.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>ARTIKEL TERKAIT</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {related.map(rel => (
                  <Link key={rel.id} href={`/articles/${rel.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: 6 }}>{rel.title}</p>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{rel.date} · {rel.read_time} min read</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/" style={{ textDecoration: 'none' }}><span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', color: '#fff' }}>DISTRIK BUNYI</span></Link>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>STAY LOUD, STAY ARCHIVED.</span>
        </div>
      </footer>
    </div>
  );
}
