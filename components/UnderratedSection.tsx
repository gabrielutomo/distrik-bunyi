import React from 'react';
import { Album, genreAccent } from '@/lib/data';

interface UnderratedSectionProps { albums: Album[]; }

export default function UnderratedSection({ albums }: UnderratedSectionProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h2 style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
          UNDERRATED PICKS
        </h2>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
        {albums.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 64, color: 'rgba(255,255,255,0.2)', fontSize: 13, fontStyle: 'italic' }}>
            Belum ada kurasi di kategori ini.
          </div>
        )}
        {albums.map(album => {
          const accent = genreAccent[album.genre] ?? '#fff';
          return (
            <div
              key={album.id}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.borderColor = `${accent}50`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.5)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Album art */}
              <div style={{ width: '100%', aspectRatio: '1/1', background: album.imageColor, position: 'relative' }}>
                {/* Rating overlay */}
                <div style={{ position: 'absolute', bottom: 10, right: 12 }}>
                  <span style={{ fontWeight: 900, fontSize: 24, color: '#fff', letterSpacing: '-0.03em', opacity: 0.9 }}>
                    {album.rating}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <h4 style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    {album.title}
                  </h4>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, flexShrink: 0, marginTop: 3 }}>
                    {album.year}
                  </span>
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.05em', marginBottom: 12 }}>
                  {album.artist.toUpperCase()}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, fontStyle: 'italic' }}>
                  &quot;{album.why}&quot;
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
