import { DeezerRelease } from '@/lib/deezer';
import { genreAccent } from '@/lib/data';
import Image from 'next/image';

interface WeeklyReleasesProps { releases: DeezerRelease[]; }

export default function WeeklyReleases({ releases }: WeeklyReleasesProps) {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>
          RILISAN BARU DEEZER
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {releases.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, textAlign: 'center', padding: 32, fontStyle: 'italic' }}>
            Memuat rilisan teranyar...
          </p>
        )}
        {releases.map((r, i) => {
          const accent = genreAccent[r.genre] ?? '#fff';
          return (
            <div
              key={r.id}
              style={{
                display: 'flex', flexDirection: 'column', gap: 12,
                padding: '12px 14px', borderRadius: 10,
                background: 'transparent', transition: 'background 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Number */}
              <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.2)', minWidth: 18, textAlign: 'right' }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Cover Art riil dari Deezer */}
              <Image
                src={r.imageUrl}
                alt={r.title}
                width={44}
                height={44}
                style={{
                  borderRadius: 8, flexShrink: 0,
                  objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)',
                }}
              />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>
                  {r.title}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.artist}
                </p>
              </div>

              {/* Type badge */}
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                padding: '2px 7px', borderRadius: 4,
                background: `${accent}20`, color: accent, flexShrink: 0,
              }}>
                {r.type.toUpperCase()}
              </span>
              </div>
              
              {/* Deezer Widget if deezerId exists */}
              {(r as any).deezerId && (
                <div style={{ borderRadius: 8, overflow: 'hidden' }}>
                  <iframe title={`deezer-${r.id}`} src={`https://widget.deezer.com/widget/dark/track/${(r as any).deezerId}`} width="100%" height="90" frameBorder="0" allowTransparency={true} allow="encrypted-media; clipboard-write"></iframe>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
