'use client';
import React from 'react';

interface DeezerPlayerProps { playlistId: string; }

export default function DeezerPlayer({ playlistId }: DeezerPlayerProps) {
  if (!playlistId) return null;
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <iframe 
        title="deezer-widget" 
        src={`https://widget.deezer.com/widget/dark/${playlistId}`} 
        width="100%" 
        height="300" 
        frameBorder="0" 
        allowTransparency={true} 
        allow="encrypted-media; clipboard-write"
        style={{ display: 'block' }}
      ></iframe>
    </div>
  );
}
