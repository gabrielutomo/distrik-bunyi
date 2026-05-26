import React from 'react';
import { Release, genreAccent } from '@/lib/data';

interface LocalReleasesSectionProps { releases: Release[]; }

export default function LocalReleasesSection({ releases }: LocalReleasesSectionProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h2 style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', color: 'var(--text-muted)', whiteSpace: 'nowrap', transition: 'color 0.3s' }}>
          RILISAN TERBARU
        </h2>
        <div style={{ flex: 1, height: 1, background: 'var(--border)', transition: 'background-color 0.3s' }} />
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
        {releases.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 64, color: 'rgba(255,255,255,0.2)', fontSize: 13, fontStyle: 'italic' }}>
            Belum ada rilisan di kategori ini.
          </div>
        )}
        {releases.map(release => {
          const accent = genreAccent[release.genre] ?? '#fff';
          return (
            <div
              key={release.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.3s, border-color 0.3s',
              }}
              onMouseEnter={e => {
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.borderColor = `${accent}50`;
                (e.currentTarget as HTMLElement).style.boxShadow = isLight ? `0 10px 24px rgba(26,24,20,0.06)` : `0 12px 40px rgba(0,0,0,0.5)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Cover Art */}
              <div style={{ width: '100%', aspectRatio: '1/1', background: release.imageColor || '#111', position: 'relative' }}>
                {release.imageUrl && (
                  <img src={release.imageUrl} alt={release.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' }} />
                
                {/* Type overlay */}
                <div style={{ position: 'absolute', top: 10, right: 12, zIndex: 10 }}>
                  <span style={{ 
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                    padding: '4px 8px', borderRadius: 4,
                    background: 'rgba(0,0,0,0.5)', color: '#fff',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {release.type?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.05em', marginBottom: 6 }}>
                  {release.artist.toUpperCase()}
                </p>
                <h4 style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.3s' }}>
                  {release.title}
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: (release as any).deezerId ? 16 : 0, transition: 'color 0.3s' }}>
                  {release.releaseDate}
                </p>
                {(release as any).deezerId && (
                  <div style={{ borderRadius: 8, overflow: 'hidden', marginTop: 16 }} onClick={e => e.stopPropagation()}>
                    <iframe title={`deezer-${release.id}`} src={`https://widget.deezer.com/widget/dark/track/${(release as any).deezerId}`} width="100%" height="90" frameBorder="0" allowTransparency={true} allow="encrypted-media; clipboard-write"></iframe>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
