'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

const OPENING_MESSAGE =
  'Halo! Gue KURATOR AI dari DistrikBunyi. Mau cari musik Indonesia apa hari ini? Ceritain mood lo atau kasih referensi artis yang lo suka 🎵';

const SUGGESTED_PROMPTS = [
  'Rekomendasiin rap Jakarta yang dark vibes 🔥',
  'Musik indie Indonesia buat late night 🌙',
  'Artis hyperpop lokal yang underrated?',
];

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 14px' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#c8ff00',
            display: 'block',
            animation: 'chatDot 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function MusicChatWidget() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasSentFirst, setHasSentFirst] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Don't close on button click (button is outside panel)
        const btn = document.getElementById('kurator-toggle-btn');
        if (btn && btn.contains(e.target as Node)) return;
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', parts: [{ text: trimmed }] };
    setHistory((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    if (!hasSentFirst) {
      setShowSuggestions(false);
      setHasSentFirst(true);
    }

    try {
      const res = await fetch('/api/music-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: history, // previous history (before this user message)
          message: trimmed,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.reply) throw new Error('API error');

      const aiMsg: Message = { role: 'model', parts: [{ text: data.reply }] };
      setHistory((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        role: 'model',
        parts: [{ text: 'Waduh, koneksi ke kurator lagi gangguan. Coba lagi bentar ya!' }],
      };
      setHistory((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }, [history, loading, hasSentFirst]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes chatDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,255,0,0.35); }
          50% { box-shadow: 0 0 0 8px rgba(200,255,0,0); }
        }
        .kurator-btn-pulse {
          animation: chatPulse 2.4s ease-in-out infinite;
        }
        .kurator-panel {
          animation: chatSlideUp 0.32s cubic-bezier(0.22,1,0.36,1) both;
        }
        .kurator-chip:hover {
          background: rgba(200,255,0,0.15) !important;
          border-color: #c8ff00 !important;
          color: #c8ff00 !important;
        }
        .kurator-send:hover:not(:disabled) {
          background: #a8d900 !important;
        }
        .kurator-send:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .kurator-input:focus {
          outline: none;
          border-color: rgba(200,255,0,0.5) !important;
        }
        .kurator-scroll::-webkit-scrollbar { width: 3px; }
        .kurator-scroll::-webkit-scrollbar-track { background: transparent; }
        .kurator-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 99px; }
      `}</style>

      {/* Floating toggle button */}
      <button
        id="kurator-toggle-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Buka Kurator AI"
        className={!open ? 'kurator-btn-pulse' : ''}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 18px',
          background: open ? '#1a1a1a' : '#c8ff00',
          color: open ? '#c8ff00' : '#000',
          border: open ? '1.5px solid #c8ff00' : 'none',
          borderRadius: 99,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.04em',
          boxShadow: open
            ? '0 4px 24px rgba(0,0,0,0.6)'
            : '0 4px 20px rgba(200,255,0,0.3)',
          transition: 'background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Headphone icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
          <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
        {open ? 'Tutup' : 'Tanya Kurator'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="kurator-panel"
          style={{
            position: 'fixed',
            bottom: 88,
            right: 28,
            zIndex: 9998,
            width: 380,
            maxWidth: 'calc(100vw - 32px)',
            height: 520,
            maxHeight: 'calc(100vh - 120px)',
            background: '#0f0f0f',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,255,0,0.08)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: '#111',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(200,255,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em' }}>
                    KURATOR AI
                  </span>
                  <span style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#000',
                    background: '#c8ff00',
                    padding: '1px 5px',
                    borderRadius: 4,
                  }}>BETA</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
                  Asisten musik Indonesia
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup panel"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: 4,
                borderRadius: 6,
                lineHeight: 1,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            className="kurator-scroll"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {/* Opening AI message */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6,
                background: 'rgba(200,255,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 2,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0 12px 12px 12px',
                padding: '10px 13px',
                fontSize: 13,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.88)',
                maxWidth: '85%',
              }}>
                {OPENING_MESSAGE}
              </div>
            </div>

            {/* Suggested prompts */}
            {showSuggestions && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 34 }}>
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    className="kurator-chip"
                    onClick={() => sendMessage(prompt)}
                    disabled={loading}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 99,
                      color: 'rgba(255,255,255,0.65)',
                      padding: '6px 12px',
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                      lineHeight: 1.4,
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Conversation history */}
            {history.map((msg, i) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    gap: 8,
                    alignItems: 'flex-start',
                  }}
                >
                  {!isUser && (
                    <div style={{
                      width: 26, height: 26, borderRadius: 6,
                      background: 'rgba(200,255,0,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 2,
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13"/>
                        <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                      </svg>
                    </div>
                  )}
                  <div style={{
                    background: isUser ? '#c8ff00' : 'rgba(255,255,255,0.05)',
                    border: isUser ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: isUser ? '12px 0 12px 12px' : '0 12px 12px 12px',
                    padding: '10px 13px',
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: isUser ? '#000' : 'rgba(255,255,255,0.88)',
                    maxWidth: '82%',
                    fontWeight: isUser ? 500 : 400,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {msg.parts[0].text}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: 'rgba(200,255,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 2,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/>
                    <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '0 12px 12px 12px',
                }}>
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: '10px 12px 12px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: '#0f0f0f',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                ref={inputRef}
                className="kurator-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ceritain mood lo..."
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: '10px 13px',
                  color: '#fff',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
              />
              <button
                className="kurator-send"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                aria-label="Kirim pesan"
                style={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  background: '#c8ff00',
                  border: 'none',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s, opacity 0.15s',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            <div style={{
              textAlign: 'center',
              fontSize: 10,
              color: 'rgba(255,255,255,0.2)',
              marginTop: 8,
              letterSpacing: '0.04em',
            }}>
              Powered by Gemini
            </div>
          </div>
        </div>
      )}
    </>
  );
}
