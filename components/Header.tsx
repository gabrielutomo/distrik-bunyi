'use client';
import React, { useState, useEffect } from 'react';
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
  { label: 'ID MUSIC',    value: null          },
];

export default function Header({ activeGenre, onGenreChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const accent = activeGenre ? genreAccent[activeGenre] : '#ffffff';

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('distrikbunyi-theme', nextTheme);
  };

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: theme === 'dark' ? 'rgba(8,8,8,0.9)' : 'rgba(240,237,230,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.3s, border-bottom 0.3s',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        {/* Logo */}
        <button
          onClick={() => { onGenreChange(null); setMenuOpen(false); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <span
            className="live-dot"
            style={{ width: 8, height: 8, borderRadius: '50%', background: accent, display: 'inline-block', transition: 'background 0.4s' }}
          />
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', color: 'var(--text-primary)', transition: 'color 0.3s' }}>
            DISTRIK BUNYI
          </span>
        </button>

        {/* Desktop Genre Nav & Theme Toggle */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <nav className="nav-tabs" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {tabs.map(tab => {
              const isActive = activeGenre === tab.value && tab.label !== 'ID MUSIC';
              const color = tab.value && tab.label !== 'ID MUSIC' ? genreAccent[tab.value] : '#C8FF00';
              return (
                <button
                  key={tab.label}
                  onClick={() => tab.label !== 'ID MUSIC' && onGenreChange(tab.value)}
                  className="nav-tab"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: '0.5px',
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: isActive ? `1px solid ${color}` : '1px solid transparent',
                    background: 'transparent',
                    color: isActive ? color : 'var(--text-secondary)',
                    cursor: tab.label !== 'ID MUSIC' ? 'pointer' : 'default',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease, color 0.3s',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
          
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontSize: 14,
              transition: 'all 0.2s ease, background 0.3s, border-color 0.3s, color 0.3s',
            }}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
          >
            {theme === 'dark' ? '☀' : '◑'}
          </button>
        </div>

        {/* Mobile controls wrapper */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Mobile Theme Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              display: 'none',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontSize: 14,
              marginRight: 8,
              textAlign: 'center',
              lineHeight: '30px',
              transition: 'all 0.2s ease, background 0.3s, border-color 0.3s, color 0.3s',
            }}
          >
            {theme === 'dark' ? '☀' : '◑'}
          </button>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            style={{
              display: 'none',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontSize: 18,
              lineHeight: 1,
              transition: 'all 0.2s ease, border-color 0.3s, color 0.3s',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="mobile-dropdown"
          style={{
            background: theme === 'dark' ? 'rgba(12,12,12,0.98)' : 'rgba(240,237,230,0.98)',
            borderTop: '1px solid var(--border)',
            padding: '16px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            transition: 'background 0.3s, border-top 0.3s',
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
                  color: isActive ? color : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease, color 0.3s',
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
