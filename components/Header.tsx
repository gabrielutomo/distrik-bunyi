'use client';
import React, { useState } from 'react';
import { Genre, genreAccent } from '@/lib/data';

interface HeaderProps {
  activeGenre: Genre | null;
  onGenreChange: (g: Genre | null) => void;
}

const tabs: { label: string; value: Genre | null }[] = [
  { label: 'SEMUA',       value: null          },
  { label: 'INDIE',       value: 'indie'       },
  { label: 'RAP',         value: 'rap'         },
  { label: 'ALTERNATIVE', value: 'alternative' },
];

export default function Header({ activeGenre, onGenreChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const accent = activeGenre ? genreAccent[activeGenre] : '#ffffff';

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,8,8,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        {/* Logo */}
        <button
          onClick={() => { onGenreChange(null); setMenuOpen(false); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="live-dot"
              style={{ width: 8, height: 8, borderRadius: '50%', background: accent, display: 'inline-block', transition: 'background 0.4s' }}
            />
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', color: '#fff' }}>
              DISTRIK BUNYI
            </span>
          </div>
          <span style={{ fontFamily: 'Inter, monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginTop: 1 }}>
            ID MUSIC
          </span>
        </button>

        {/* Desktop Genre Nav */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 4 }}>
          {tabs.map(tab => {
            const isActive = activeGenre === tab.value;
            const color = tab.value ? genreAccent[tab.value] : '#fff';
            return (
              <button
                key={tab.label}
                onClick={() => onGenreChange(tab.value)}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: isActive ? `1px solid ${color}` : '1px solid transparent',
                  background: isActive ? `${color}20` : 'transparent',
                  color: isActive ? color : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: '6px 10px',
            cursor: 'pointer',
            color: '#fff',
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="mobile-dropdown"
          style={{
            background: 'rgba(12,12,12,0.98)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '16px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {tabs.map(tab => {
            const isActive = activeGenre === tab.value;
            const color = tab.value ? genreAccent[tab.value] : '#fff';
            return (
              <button
                key={tab.label}
                onClick={() => { onGenreChange(tab.value); setMenuOpen(false); }}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.08em',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: isActive ? `${color}15` : 'transparent',
                  color: isActive ? color : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
