'use client';

import { useState, useEffect, useCallback } from 'react';

type Tab = 'articles' | 'releases' | 'albums';
type Genre = 'indie' | 'rap' | 'alternative';

const GENRE_COLORS: Record<Genre, string> = {
  indie: '#c8ff00',
  rap: '#ff2d6b',
  alternative: '#9b5cf6',
};

const GRADIENTS = [
  'linear-gradient(135deg, #1a2a1a 0%, #2d4a1e 50%, #1a3a2a 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #2a0a0a 0%, #4a0e0e 50%, #2a0a1a 100%)',
  'linear-gradient(135deg, #0d0a1e 0%, #1a0e2e 50%, #0d1a2e 100%)',
  'linear-gradient(135deg, #1a0a2a 0%, #2a0a3a 50%, #1a0a1a 100%)',
  'linear-gradient(135deg, #0a1a2a 0%, #0e2a3a 50%, #0a0a2a 100%)',
  'linear-gradient(135deg, #0a1a1a 0%, #0e2a2a 50%, #0a1a0a 100%)',
  'linear-gradient(135deg, #1a0a0a 0%, #2a1a0a 50%, #1a1a0a 100%)',
];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authErr, setAuthErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<Tab>('articles');

  const [articles, setArticles] = useState<any[]>([]);
  const [releases, setReleases] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  const [editItem, setEditItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const headers = () => ({
    'Content-Type': 'application/json',
    'x-admin-password': password,
  });

  const fetchAll = async () => {
    const [a, r, al] = await Promise.all([
      fetch('/api/admin/articles', { headers: headers() }).then(r => r.json()),
      fetch('/api/admin/releases', { headers: headers() }).then(r => r.json()),
      fetch('/api/admin/albums', { headers: headers() }).then(r => r.json()),
    ]);
    if (Array.isArray(a)) setArticles(a);
    if (Array.isArray(r)) setReleases(r);
    if (Array.isArray(al)) setAlbums(al);
  };

  const handleLogin = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/articles', {
      headers: { 'x-admin-password': password },
    });
    if (res.ok) {
      setAuthed(true);
      await fetchAll();
    } else {
      setAuthErr('Password salah!');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus item ini?')) return;
    const endpoint = tab === 'articles' ? 'articles' : tab === 'releases' ? 'releases' : 'albums';
    await fetch(`/api/admin/${endpoint}?id=${id}`, { method: 'DELETE', headers: headers() });
    setMsg('Dihapus!');
    await fetchAll();
    setTimeout(() => setMsg(''), 2000);
  };

  const handleSave = async (data: any) => {
    setLoading(true);
    const endpoint = tab === 'articles' ? 'articles' : tab === 'releases' ? 'releases' : 'albums';
    const method = editItem ? 'PUT' : 'POST';
    
    // Parse tags string back to array
    let parsedTags = data.tags;
    if (typeof parsedTags === 'string') {
      parsedTags = parsedTags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    // Parse Deezer URL to get ID if needed
    let parsedDeezerId = data.deezerId;
    if (parsedDeezerId && parsedDeezerId.includes('deezer.com')) {
      // Panggil API kita untuk mendeteksi ID (bisa nge-resolve shortlink)
      try {
        const dRes = await fetch('/api/admin/parse-deezer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: parsedDeezerId })
        });
        const dJson = await dRes.json();
        if (dJson.id) parsedDeezerId = dJson.id;
      } catch(e) {
        // fallback to old regex if api fails
        const match = parsedDeezerId.match(/track\/(\d+)/);
        if (match) parsedDeezerId = match[1];
      }
    }

    const payload = { ...data, tags: parsedTags, deezerId: parsedDeezerId };
    
    const res = await fetch(`/api/admin/${endpoint}`, {
      method,
      headers: headers(),
      body: JSON.stringify(editItem ? { ...payload, id: editItem.id } : payload),
    });
    if (res.ok) {
      setMsg(editItem ? 'Tersimpan!' : 'Ditambahkan!');
      setShowForm(false);
      setEditItem(null);
      await fetchAll();
      setTimeout(() => setMsg(''), 2000);
    } else {
      const err = await res.json();
      setMsg('Error: ' + err.error);
    }
    setLoading(false);
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const list = tab === 'articles' ? articles : tab === 'releases' ? releases : albums;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === list.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const itemA = list[index];
    const itemB = list[targetIndex];

    let orderA = itemB.order_index;
    let orderB = itemA.order_index;

    // Jika kebetulan sama (karena fallback epoch yang bentrok), paksa ada perbedaan
    if (orderA === orderB) {
      if (direction === 'up') {
        orderA += 1;
        orderB -= 1;
      } else {
        orderA -= 1;
        orderB += 1;
      }
    }

    setLoading(true);
    const endpoint = tab === 'articles' ? 'articles' : tab === 'releases' ? 'weekly_releases' : 'underrated_albums';
    const res = await fetch('/api/admin/reorder', {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({
        table: endpoint,
        items: [
          { id: itemA.id, order_index: orderA },
          { id: itemB.id, order_index: orderB },
        ],
      }),
    });

    if (res.ok) {
      await fetchAll();
    } else {
      const err = await res.json();
      setMsg('Error: ' + err.error);
    }
    setLoading(false);
  };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ width: 380, padding: 40, background: '#111', borderRadius: 16, border: '1px solid #222' }}>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 8 }}>DISTRIK BUNYI</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginBottom: 32 }}>Admin Panel — masukkan password untuk lanjut</p>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password admin..."
              value={password}
              onChange={e => { setPassword(e.target.value); setAuthErr(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 40px 12px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', opacity: 0.7 }}
              title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {authErr && (
            <div style={{ background: '#ff2d6b22', border: '1px solid #ff2d6b', color: '#ff2d6b', padding: '10px 12px', borderRadius: 8, marginTop: 16, fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
              ⚠️ {authErr}
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ marginTop: 16, width: '100%', padding: '12px', background: '#c8ff00', color: '#000', fontWeight: 800, fontSize: 14, borderRadius: 8, border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}
          >
            {loading ? 'Memverifikasi...' : 'MASUK'}
          </button>
        </div>
      </div>
    );
  }

  const currentData = tab === 'articles' ? articles : tab === 'releases' ? releases : albums;

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#f0f0f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', color: '#fff' }}>DISTRIK BUNYI</span>
          <span style={{ background: '#c8ff0022', color: '#c8ff00', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.1em' }}>ADMIN</span>
        </div>
        <a href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>← Ke Website</a>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {msg && (
          <div style={{ background: msg.startsWith('Error') ? '#ff2d6b22' : '#c8ff0022', border: `1px solid ${msg.startsWith('Error') ? '#ff2d6b' : '#c8ff00'}`, color: msg.startsWith('Error') ? '#ff2d6b' : '#c8ff00', padding: '10px 16px', borderRadius: 8, marginBottom: 24, fontSize: 13, fontWeight: 700 }}>
            {msg}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {(['articles', 'releases', 'albums'] as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setShowForm(false); setEditItem(null); }}
              style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, letterSpacing: '0.05em', transition: 'all 0.2s',
                background: tab === t ? '#fff' : '#1a1a1a', color: tab === t ? '#000' : 'rgba(255,255,255,0.5)' }}>
              {t === 'articles' ? 'ARTIKEL' : t === 'releases' ? 'RILISAN' : 'UNDERRATED'}
              <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.6 }}>
                {t === 'articles' ? articles.length : t === 'releases' ? releases.length : albums.length}
              </span>
            </button>
          ))}
        </div>

        {/* Add Button */}
        {!showForm && (
          <button onClick={() => { setShowForm(true); setEditItem(null); }}
            style={{ marginBottom: 24, padding: '10px 20px', background: '#c8ff00', color: '#000', fontWeight: 800, fontSize: 13, borderRadius: 8, border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}>
            + TAMBAH {tab === 'articles' ? 'ARTIKEL' : tab === 'releases' ? 'RILISAN' : 'ALBUM'}
          </button>
        )}

        {/* Form */}
        {showForm && (
          <FormPanel
            tab={tab}
            initial={editItem}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditItem(null); }}
            loading={loading}
            gradients={GRADIENTS}
          />
        )}

        {/* List */}
        {!showForm && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentData.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', fontSize: 14 }}>
                Belum ada data. Klik tombol tambah di atas.
              </div>
            )}
            {currentData.map((item: any, index: number) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#111', borderRadius: 12, padding: '16px 20px', border: '1px solid #1e1e1e' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
                  <button onClick={() => handleReorder(index, 'up')} disabled={index === 0 || loading} style={{ background: 'none', border: 'none', cursor: index === 0 || loading ? 'default' : 'pointer', opacity: index === 0 || loading ? 0.2 : 0.7, color: '#fff', padding: 0, fontSize: 12 }}>▲</button>
                  <button onClick={() => handleReorder(index, 'down')} disabled={index === currentData.length - 1 || loading} style={{ background: 'none', border: 'none', cursor: index === currentData.length - 1 || loading ? 'default' : 'pointer', opacity: index === currentData.length - 1 || loading ? 0.2 : 0.7, color: '#fff', padding: 0, fontSize: 12 }}>▼</button>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: item.image_color || '#222', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  {item.image_url && <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title || `${item.artist} — ${item.title}`}
                    {tab === 'articles' && item.featured && <span style={{ marginLeft: 8, fontSize: 10, background: '#c8ff0033', color: '#c8ff00', padding: '2px 6px', borderRadius: 4 }}>FEATURED</span>}
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                    {tab === 'articles' && `${item.author} · ${item.date} · ${item.type}`}
                    {tab === 'releases' && `${item.artist} · ${item.release_date} · ${item.type}`}
                    {tab === 'albums' && `${item.artist} · ${item.year} · ★ ${item.rating}`}
                  </p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: GENRE_COLORS[item.genre as Genre] || '#fff', background: `${GENRE_COLORS[item.genre as Genre]}22`, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.05em' }}>
                  {item.genre?.toUpperCase()}
                </span>
                <button onClick={() => { setEditItem(item); setShowForm(true); }}
                  style={{ padding: '7px 14px', background: '#1e1e1e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)}
                  style={{ padding: '7px 14px', background: '#ff2d6b22', color: '#ff2d6b', border: '1px solid #ff2d6b44', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Form Component ───────────────────────────────────────────────────────────

function FormPanel({ tab, initial, onSave, onCancel, loading, gradients }: {
  tab: Tab; initial: any; onSave: (d: any) => void;
  onCancel: () => void; loading: boolean; gradients: string[];
}) {
  const [form, setForm] = useState<any>(initial ? mapToForm(tab, initial) : defaultForm(tab));
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <div style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: 28, marginBottom: 28 }}>
      <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 24 }}>
        {initial ? 'Edit' : 'Tambah'} {tab === 'articles' ? 'Artikel' : tab === 'releases' ? 'Rilisan' : 'Album Underrated'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {tab === 'articles' && <ArticleFields form={form} set={set} />}
        {tab === 'releases' && <ReleaseFields form={form} set={set} />}
        {tab === 'albums' && <AlbumFields form={form} set={set} />}
      </div>

      {/* Image URL & Gradient Picker */}
      <div style={{ marginTop: 20 }}>
        <label style={labelStyle}>URL Cover Gambar (Opsional)</label>
        <input value={form.imageUrl || ''} onChange={e => set('imageUrl', e.target.value)} style={inputStyle} placeholder="https://contoh.com/gambar.jpg" />
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>* Jika diisi, gambar ini akan menggantikan warna cover.</p>
        
        <label style={{ ...labelStyle, marginTop: 16 }}>Atau pilih Warna Cover (Gradient)</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {gradients.map(g => (
            <div key={g} onClick={() => set('imageColor', g)}
              style={{ width: 36, height: 36, borderRadius: 6, background: g, cursor: 'pointer', border: form.imageColor === g ? '2px solid #c8ff00' : '2px solid transparent', transition: 'border 0.2s' }} />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>Tags (pisahkan dengan koma)</label>
        <input value={form.tags}
          onChange={e => set('tags', e.target.value)}
          style={inputStyle} placeholder="indie, folk, jakarta" />
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button onClick={() => onSave(form)} disabled={loading}
          style={{ padding: '10px 24px', background: '#c8ff00', color: '#000', fontWeight: 800, fontSize: 13, borderRadius: 8, border: 'none', cursor: 'pointer' }}>
          {loading ? 'Menyimpan...' : 'SIMPAN'}
        </button>
        <button onClick={onCancel}
          style={{ padding: '10px 24px', background: '#1e1e1e', color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, borderRadius: 8, border: 'none', cursor: 'pointer' }}>
          Batal
        </button>
      </div>
    </div>
  );
}

function ArticleFields({ form, set }: any) {
  return <>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={labelStyle}>Judul</label>
      <input value={form.title} onChange={e => set('title', e.target.value)} style={inputStyle} placeholder="Judul artikel..." />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={labelStyle}>Excerpt (Ringkasan singkat)</label>
      <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={3}
        style={{ ...inputStyle, resize: 'vertical' }} placeholder="Ringkasan singkat artikel untuk ditampilkan di card..." />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={labelStyle}>Konten Artikel Lengkap (Mendukung Markdown)</label>
      <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={15}
        style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }} 
        placeholder="Tulis artikel di sini. Gunakan **tebal**, *miring*, atau ## Heading..." />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={labelStyle}>Deezer Track ID (Opsional - Untuk memunculkan Audio Player)</label>
      <input value={form.deezerId || ''} onChange={e => set('deezerId', e.target.value)} style={inputStyle} placeholder="Contoh: 123456789" />
    </div>
    <div>
      <label style={labelStyle}>Tipe</label>
      <select value={form.type} onChange={e => set('type', e.target.value)} style={inputStyle}>
        <option value="news">News</option>
        <option value="feature">Feature</option>
        <option value="review">Review</option>
      </select>
    </div>
    <div>
      <label style={labelStyle}>Genre</label>
      <select value={form.genre} onChange={e => set('genre', e.target.value)} style={inputStyle}>
        <option value="indie">Indie</option>
        <option value="rap">Rap</option>
        <option value="alternative">Alternative</option>
      </select>
    </div>
    <div>
      <label style={labelStyle}>Penulis</label>
      <input value={form.author} onChange={e => set('author', e.target.value)} style={inputStyle} placeholder="Nama penulis" />
    </div>
    <div>
      <label style={labelStyle}>Tanggal</label>
      <input value={form.date} onChange={e => set('date', e.target.value)} style={inputStyle} placeholder="1 Mei 2026" />
    </div>
    <div>
      <label style={labelStyle}>Waktu Baca (menit)</label>
      <input type="number" value={form.readTime} onChange={e => set('readTime', Number(e.target.value))} style={inputStyle} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 24 }}>
      <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
      <label htmlFor="featured" style={{ color: '#c8ff00', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Featured (artikel utama)</label>
    </div>
  </>;
}

function ReleaseFields({ form, set }: any) {
  return <>
    <div>
      <label style={labelStyle}>Artis</label>
      <input value={form.artist} onChange={e => set('artist', e.target.value)} style={inputStyle} placeholder="Nama artis" />
    </div>
    <div>
      <label style={labelStyle}>Judul</label>
      <input value={form.title} onChange={e => set('title', e.target.value)} style={inputStyle} placeholder="Judul album/single" />
    </div>
    <div>
      <label style={labelStyle}>Tipe</label>
      <select value={form.type} onChange={e => set('type', e.target.value)} style={inputStyle}>
        <option value="single">Single</option>
        <option value="ep">EP</option>
        <option value="album">Album</option>
      </select>
    </div>
    <div>
      <label style={labelStyle}>Genre</label>
      <select value={form.genre} onChange={e => set('genre', e.target.value)} style={inputStyle}>
        <option value="indie">Indie</option>
        <option value="rap">Rap</option>
        <option value="alternative">Alternative</option>
      </select>
    </div>
    <div>
      <label style={labelStyle}>Tanggal Rilis</label>
      <input value={form.releaseDate} onChange={e => set('releaseDate', e.target.value)} style={inputStyle} placeholder="1 Mei 2026" />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={labelStyle}>Deezer Track ID (Opsional - Untuk memunculkan Audio Player)</label>
      <input value={form.deezerId || ''} onChange={e => set('deezerId', e.target.value)} style={inputStyle} placeholder="Contoh: 123456789 atau link deezer.com/track/..." />
    </div>
  </>;
}

function AlbumFields({ form, set }: any) {
  return <>
    <div>
      <label style={labelStyle}>Artis</label>
      <input value={form.artist} onChange={e => set('artist', e.target.value)} style={inputStyle} placeholder="Nama artis" />
    </div>
    <div>
      <label style={labelStyle}>Judul Album</label>
      <input value={form.title} onChange={e => set('title', e.target.value)} style={inputStyle} placeholder="Judul album" />
    </div>
    <div>
      <label style={labelStyle}>Tahun</label>
      <input type="number" value={form.year} onChange={e => set('year', Number(e.target.value))} style={inputStyle} />
    </div>
    <div>
      <label style={labelStyle}>Genre</label>
      <select value={form.genre} onChange={e => set('genre', e.target.value)} style={inputStyle}>
        <option value="indie">Indie</option>
        <option value="rap">Rap</option>
        <option value="alternative">Alternative</option>
      </select>
    </div>
    <div>
      <label style={labelStyle}>Rating (0-10)</label>
      <input type="number" step="0.1" min="0" max="10" value={form.rating} onChange={e => set('rating', Number(e.target.value))} style={inputStyle} />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={labelStyle}>Kenapa Underrated?</label>
      <textarea value={form.why} onChange={e => set('why', e.target.value)} rows={3}
        style={{ ...inputStyle, resize: 'vertical' }} placeholder="Jelaskan kenapa album ini underrated..." />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={labelStyle}>Deezer Track ID (Opsional - Untuk memunculkan Audio Player)</label>
      <input value={form.deezerId || ''} onChange={e => set('deezerId', e.target.value)} style={inputStyle} placeholder="Contoh: 123456789 atau link deezer.com/track/..." />
    </div>
  </>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' };

function defaultForm(tab: Tab) {
  if (tab === 'articles') return { title: '', excerpt: '', content: '', type: 'news', genre: 'indie', author: '', date: '', readTime: 5, imageColor: '', imageUrl: '', deezerId: '', featured: false, tags: '' };
  if (tab === 'releases') return { artist: '', title: '', type: 'single', genre: 'indie', releaseDate: '', imageColor: '', imageUrl: '', deezerId: '', tags: '' };
  return { artist: '', title: '', year: new Date().getFullYear(), genre: 'indie', imageColor: '', imageUrl: '', deezerId: '', why: '', rating: 8.0, tags: '' };
}

function mapToForm(tab: Tab, item: any) {
  if (tab === 'articles') return { title: item.title, excerpt: item.excerpt, content: item.content || '', type: item.type, genre: item.genre, author: item.author, date: item.date, readTime: item.read_time, imageColor: item.image_color, imageUrl: item.image_url || '', deezerId: item.deezer_id || '', featured: item.featured, tags: item.tags?.join(', ') || '' };
  if (tab === 'releases') return { artist: item.artist, title: item.title, type: item.type, genre: item.genre, releaseDate: item.release_date, imageColor: item.image_color, imageUrl: item.image_url || '', deezerId: item.deezer_id || '', tags: item.tags?.join(', ') || '' };
  return { artist: item.artist, title: item.title, year: item.year, genre: item.genre, imageColor: item.image_color, imageUrl: item.image_url || '', deezerId: item.deezer_id || '', why: item.why, rating: item.rating, tags: item.tags?.join(', ') || '' };
}
