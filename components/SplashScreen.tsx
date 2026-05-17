'use client';

import { useEffect, useState, useRef } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const waveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem('splashShown')) {
      return;
    }
    setVisible(true);

    // Build waveform bars
    if (waveRef.current) {
      const heights = [14, 20, 10, 24, 16, 28, 12, 22, 18, 26, 8, 20, 16];
      heights.forEach(h => {
        const b = document.createElement('div');
        b.className = 's-bar';
        b.style.setProperty('--h', h + 'px');
        b.style.setProperty('--d', (0.5 + Math.random() * 0.7) + 's');
        b.style.animationDelay = Math.random() * 0.4 + 's';
        waveRef.current!.appendChild(b);
      });
    }

    // Curtain up after 2.2s
    const t1 = setTimeout(() => {
      setLeaving(true);
      const t2 = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('splashShown', '1');
      }, 800);
      return () => clearTimeout(t2);
    }, 2200);

    return () => clearTimeout(t1);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        #splash {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #080808;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 0;
        }
        #splash.leaving {
          animation: curtainUp 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        @keyframes curtainUp {
          0%   { clip-path: inset(0 0 0% 0); }
          100% { clip-path: inset(0 0 100% 0); }
        }

        .s-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          clip-path: inset(0 100% 0 0);
          animation: revealX 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }
        @keyframes revealX {
          to { clip-path: inset(0 0% 0 0); }
        }

        .s-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #C8FF00;
          box-shadow: 0 0 16px #C8FF0088;
          flex-shrink: 0;
        }

        .s-name {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(24px, 6vw, 48px);
          letter-spacing: -0.04em;
          color: #fff;
        }

        .s-divider {
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(240,237,230,0.2), transparent);
          margin: 18px 0;
          animation: expandW 0.7s ease 1.0s forwards;
        }
        @keyframes expandW { to { width: 200px; } }

        .s-tag {
          font-family: 'DM Mono', 'Courier New', monospace;
          font-size: clamp(10px, 2vw, 13px);
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          opacity: 0;
          animation: fadeIn 0.5s ease 1.3s forwards;
        }
        @keyframes fadeIn { to { opacity: 1; } }

        .s-wave {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 32px;
          margin-top: 32px;
          opacity: 0;
          animation: fadeIn 0.5s ease 1.5s forwards;
        }

        .s-bar {
          width: 2px;
          background: #C8FF00;
          border-radius: 2px;
          opacity: 0.6;
          animation: waveBar var(--d) ease-in-out infinite alternate;
        }
        @keyframes waveBar {
          from { height: 3px; }
          to   { height: var(--h); }
        }
      `}</style>

      <div id="splash" className={leaving ? 'leaving' : ''}>
        <div className="s-logo">
          <div className="s-dot" />
          <span className="s-name">DISTRIK BUNYI</span>
        </div>
        <div className="s-divider" />
        <span className="s-tag">Indonesian Music Media</span>
        <div className="s-wave" ref={waveRef} />
      </div>
    </>
  );
}
