'use client';

import { useState, useEffect, useRef } from 'react';

interface ArticleShareData {
  title: string;
  excerpt: string;
  url: string;
  genre: string;
  imageUrl?: string;
}

interface ShareSheetProps {
  data: ArticleShareData;
  onClose: () => void;
}

type Theme = 'dark' | 'light' | 'neon';
type ThemeConfig = { bg: string; text: string; accent: string; accentText: string; label: string };

const themeConfig: Record<Theme, ThemeConfig> = {
  dark:  { bg: '#0D0D0D',  text: '#F5F5F5', accent: '#C8FF00', accentText: '#000', label: 'Gelap' },
  light: { bg: '#F0EDE6',  text: '#1A1814', accent: '#C8320A', accentText: '#fff', label: 'Terang' },
  neon:  { bg: '#C8FF00',  text: '#000000', accent: '#000',    accentText: '#C8FF00', label: 'Neon' },
};

export default function ShareSheet({ data, onClose }: ShareSheetProps) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);

  const cfg = themeConfig[theme];

  // Animate open
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 400);
  };

  // Touch swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => { startYRef.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches[0].clientY - startYRef.current > 80) handleClose();
  };

  const shareWA = () => {
    const text = encodeURIComponent(`${data.title}\n${data.url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const shareIG = async () => {
    try {
      // Dynamically import html2canvas only on demand
      const { default: html2canvas } = await import('html2canvas');
      if (!previewRef.current) return;
      
      const canvas = await html2canvas(previewRef.current, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: cfg.bg,
        logging: false,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'distrikbunyi-story.png', { type: 'image/png' });
        
        // Check if Web Share API is available
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Distrik Bunyi',
              text: data.title,
            });
          } catch (err) {
            // User cancelled or error - fallback to download
            downloadImage(blob);
          }
        } else {
          // Fallback: download image
          downloadImage(blob);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Share IG error:', err);
    }
  };

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'distrikbunyi-story.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .share-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .share-overlay.open { opacity: 1; }

        .share-sheet {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: #141414;
          border-radius: 20px 20px 0 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          z-index: 1001;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 90vh;
          overflow-y: auto;
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
        .share-sheet.open { transform: translateY(0); }

        .sheet-handle {
          width: 40px; height: 4px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
          margin: 14px auto 0;
        }

        .story-preview {
          aspect-ratio: 9/16;
          max-height: 280px;
          width: auto;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }

        .style-option {
          width: 52px; height: 52px;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid transparent;
          transition: border-color 0.2s, transform 0.2s;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          flex-shrink: 0;
        }
        .style-option.active { border-color: #C8FF00; transform: scale(1.08); }

        .share-btn {
          flex: 1;
          padding: 14px 16px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 13px;
          transition: transform 0.15s, opacity 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .share-btn:active { transform: scale(0.96); opacity: 0.8; }

        .toast {
          position: fixed;
          bottom: calc(env(safe-area-inset-bottom, 20px) + 80px);
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: #1a1a1a;
          border: 1px solid #C8FF00;
          color: #C8FF00;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          z-index: 1002;
          opacity: 0;
          transition: opacity 0.3s, transform 0.3s;
          white-space: nowrap;
        }
        .toast.visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `}} />

      {/* Backdrop */}
      <div className={`share-overlay ${open ? 'open' : ''}`} onClick={handleClose} />

      {/* Toast */}
      <div className={`toast ${copied ? 'visible' : ''}`}>✓ Tautan disalin!</div>

      {/* Bottom Sheet */}
      <div
        className={`share-sheet ${open ? 'open' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="sheet-handle" />

        <div style={{ padding: '20px 20px 0' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>
                BAGIKAN ARTIKEL
              </p>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                {data.title.length > 50 ? data.title.substring(0, 50) + '…' : data.title}
              </p>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8,
                width: 36, height: 36, cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
                fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >×</button>
          </div>

          {/* Preview + Theme Selector */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24 }}>
            {/* Story Preview */}
            <div
              className="story-preview"
              ref={previewRef}
              style={{ 
                background: cfg.bg, 
                padding: '24px 16px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              {/* Top brand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.accent, boxShadow: `0 0 12px ${cfg.accent}88` }} />
                <span style={{ fontSize: 9, fontWeight: 900, color: cfg.text, letterSpacing: '-0.02em' }}>DISTRIK BUNYI</span>
              </div>
              
              {/* Content area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Image area */}
                {data.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.imageUrl} alt={data.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8 }} />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '16/9', background: cfg.accent + '30', borderRadius: 8 }} />
                )}
                
                {/* Genre badge */}
                <span style={{
                  fontSize: 7, fontWeight: 800, padding: '3px 8px', borderRadius: 4,
                  background: cfg.accent, color: cfg.accentText, letterSpacing: '0.08em',
                  display: 'inline-block', alignSelf: 'flex-start',
                }}>
                  {data.genre.toUpperCase()}
                </span>
                
                {/* Title */}
                <p style={{ fontSize: 10, fontWeight: 800, color: cfg.text, lineHeight: 1.3, marginTop: 4 }}>
                  {data.title.length > 80 ? data.title.substring(0, 80) + '…' : data.title}
                </p>
              </div>
              
              {/* Footer */}
              <div style={{ borderTop: `1px solid ${cfg.text}20`, paddingTop: 8 }}>
                <p style={{ fontSize: 7, color: cfg.text, opacity: 0.6, letterSpacing: '0.1em', fontWeight: 600 }}>
                  Baca selengkapnya →
                </p>
                <p style={{ fontSize: 7, color: cfg.text, opacity: 0.5, letterSpacing: '0.1em', marginTop: 2 }}>
                  distrikbunyi.id
                </p>
              </div>
            </div>

            {/* Theme options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>TEMA</p>
              {(Object.entries(themeConfig) as [Theme, ThemeConfig][]).map(([key, t]) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <button
                    className={`style-option ${theme === key ? 'active' : ''}`}
                    onClick={() => setTheme(key)}
                    style={{ background: t.bg, border: theme === key ? '3px solid #C8FF00' : '3px solid rgba(255,255,255,0.1)' }}
                    aria-label={`Tema ${t.label}`}
                  >
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: t.accent }} />
                  </button>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ padding: '0 20px 24px', display: 'flex', gap: 10 }}>
          <button
            className="share-btn"
            onClick={shareIG}
            style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', color: '#fff' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            IG Story
          </button>

          <button
            className="share-btn"
            onClick={shareWA}
            style={{ background: '#25D366', color: '#fff' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </button>

          <button
            className="share-btn"
            onClick={copyLink}
            style={{ background: 'rgba(255,255,255,0.07)', color: copied ? '#C8FF00' : 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            )}
            {copied ? 'Disalin!' : 'Salin'}
          </button>
        </div>
      </div>
    </>
  );
}
