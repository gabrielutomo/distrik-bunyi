'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ArticleClientProps {
  id: string;
  excerpt: string;
  content: string;
  accent: string;
  tags: string[];
  deezerId?: string | null;
}

export default function ArticleClient({ id, excerpt, content, accent, tags, deezerId }: ArticleClientProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => typeof window !== 'undefined' ? new Audio() : null);

  useEffect(() => {
    // Increment view count when article is read
    fetch('/api/articles/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(console.error);

    return () => {
      if (audio) {
        audio.pause();
      }
    }
  }, [id, audio]);

  const togglePlay = () => {
    if (!audio || !deezerId) return;

    const currentSrc = audio.src;
    if (!currentSrc.includes(`id=${deezerId}`)) {
      audio.src = `/api/preview?id=${deezerId}`;
      audio.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  return (
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
        {excerpt}
      </p>

      {/* Deezer Official Embed Widget */}
      {deezerId && (
        <div style={{ marginBottom: 48, borderRadius: 12, overflow: 'hidden', background: '#111' }}>
          <iframe 
            title="deezer-widget" 
            src={`https://widget.deezer.com/widget/dark/track/${deezerId}`} 
            width="100%" 
            height="150" 
            frameBorder="0" 
            allowTransparency={true} 
            allow="encrypted-media; clipboard-write"
          ></iframe>
        </div>
      )}

      {/* Markdown Content */}
      <div className="prose prose-invert max-w-none">
        {content ? (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => <p style={{ fontSize: 16, lineHeight: 1.85, color: 'rgba(255,255,255,0.8)', marginBottom: 24 }} {...props} />,
              h2: ({node, ...props}) => <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 48, marginBottom: 24, letterSpacing: '-0.02em' }} {...props} />,
              h3: ({node, ...props}) => <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 16 }} {...props} />,
              ul: ({node, ...props}) => <ul style={{ marginBottom: 24, paddingLeft: 24, listStyleType: 'disc', color: 'rgba(255,255,255,0.8)' }} {...props} />,
              li: ({node, ...props}) => <li style={{ marginBottom: 8, lineHeight: 1.6 }} {...props} />,
              a: ({node, ...props}) => <a style={{ color: accent, textDecoration: 'underline' }} {...props} />,
              strong: ({node, ...props}) => <strong style={{ color: '#fff', fontWeight: 700 }} {...props} />,
              blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 20, fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', margin: '32px 0' }} {...props} />,
              img: ({node, ...props}) => <img style={{ width: '100%', borderRadius: 12, margin: '32px 0' }} {...props} />
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', padding: 40, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12 }}>
            Belum ada konten tulisan untuk artikel ini. Admin dapat menambahkan konten melalui dashboard.
          </p>
        )}
      </div>

      {/* Tags */}
      <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tags.map(tag => (
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
      
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes pulseBar {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }
        .audio-bar {
          width: 4px;
          height: 16px;
          border-radius: 4px;
          animation: pulseBar 0.8s ease-in-out infinite;
        }
      `}} />
    </article>
  );
}
