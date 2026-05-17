# Distrik Bunyi — UI/UX Issue Report & Fix Spec

**Dibuat oleh:** Gabriel Utomo  
**Tanggal:** 17 Mei 2026  
**Ditujukan untuk:** Tim Antigravity

---

## Overview

Berikut adalah daftar isu UI/UX yang perlu diperbaiki pada web **Distrik Bunyi**. Dokumen ini mencakup deskripsi masalah, referensi visual, dan spesifikasi perbaikan yang diharapkan.

---

## Issue #1 — Navbar: Label Kategori Tidak Konsisten & Tidak Full-Width

### Deskripsi
Pada navigation bar atas, tab kategori musik **tidak sejajar** dan **tidak konsisten**. Tab "ID Music" muncul di sisi kiri tanpa mengikuti pola tab lainnya (SEMUA, INDIE, RAP, ALTERNATIVE), sehingga terlihat seperti elemen terpisah padahal harusnya bagian dari satu grup navigasi yang seragam.

### Screenshot Referensi
> Lihat: Image 1 — area navbar atas (SEMUA · INDIE · RAP · ALTERNATIVE)

### Yang Diharapkan
- Semua tab navigasi **berada dalam satu baris yang sejajar** (alignment horizontal konsisten).
- "ID Music" atau label genre lainnya harus **mengikuti style yang sama** dengan tab RAP, INDIE, ALTERNATIVE.
- Semua tab harus memiliki **lebar penuh (full-width)** atau menggunakan sistem tab yang stretch rata ke kanan.
- Gunakan komponen tab yang sama untuk semua item navigasi — tidak ada pengecualian styling.

### Spesifikasi Teknis
```css
/* Contoh target behavior */
.nav-tabs {
  display: flex;
  width: 100%;
  justify-content: space-between; /* atau flex-start dengan gap konsisten */
  align-items: center;
}

.nav-tab {
  /* Semua tab harus pakai class/style yang sama */
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-tab.active {
  border: 1px solid #C8FF00; /* atau warna aksen sesuai brand */
  color: #C8FF00;
}
```

---

## Issue #2 — Card Berita: Tinggi Kotak Tidak Konsisten (Tergantung Panjang Deskripsi)

### Deskripsi
Kartu berita di grid memiliki **tinggi yang bervariasi** tergantung jumlah teks deskripsi. Ini membuat grid terlihat tidak rapi, berantakan secara visual, dan tidak profesional — terutama saat dua kartu berdampingan memiliki ketinggian berbeda.

### Screenshot Referensi
> Lihat: Image 2 dan Image 3 — kartu KLABMUSIK vs Innerborn, atau Ikatan Keluarga Midwest vs "Bulan Bintang Garis Menyilang"

### Yang Diharapkan
- Semua kartu berita harus memiliki **tinggi yang seragam (fixed height)** dalam satu baris grid.
- Deskripsi yang terlalu panjang harus **di-truncate** dengan `line-clamp` (maksimal 3 baris).
- Deskripsi yang terlalu pendek tidak boleh membuat kartu menjadi lebih kecil dari kartu lainnya.
- Gunakan CSS Grid dengan `align-items: stretch` agar kartu dalam satu baris selalu sama tinggi.

### Spesifikasi Teknis
```css
/* Grid container */
.news-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  align-items: stretch;
}

/* Card */
.news-card {
  display: flex;
  flex-direction: column;
  height: 100%; /* stretch mengikuti baris tertinggi */
}

/* Truncate deskripsi */
.news-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1; /* dorong footer card ke bawah */
}

/* Footer card (author + read time) selalu di bawah */
.news-card__footer {
  margin-top: auto;
}
```

---

## Issue #3 — Kurator AI: Pengetahuan Musik Tidak Update (Stuck di 2023)

### Deskripsi
Fitur **"Tanya Kurator"** (AI Chatbot) masih menggunakan model atau system prompt yang tidak di-update. AI tidak mengetahui rilisan musik Indonesia terbaru (2024–2026), sehingga jawabannya **tidak relevan, tidak akurat, dan berpotensi menyesatkan** pengguna.

### Yang Diharapkan
- Kurator AI harus **menggunakan web search / retrieval-augmented generation (RAG)** untuk mengambil data rilisan terbaru.
- Alternatif: Integrasikan dengan **Deezer API** atau **Spotify API** untuk data real-time.
- Jika belum bisa implementasi penuh, tampilkan **disclaimer** yang jelas bahwa info AI terbatas pada data tertentu.
- Update **system prompt** Kurator agar menyebutkan konteks waktu yang sesuai.

### Rekomendasi System Prompt Update
```
Kamu adalah Kurator Distrik Bunyi, pakar musik indie, rap, dan alternative Indonesia. 
Pengetahuanmu mencakup rilisan hingga [TANGGAL_SEKARANG]. 
Jika ditanya tentang rilisan terbaru, jawab berdasarkan data yang tersedia dan sebutkan 
bahwa pengguna bisa mengecek langsung di Deezer atau platform streaming untuk info paling update.
```

### Teknis
- Inject `current_date` dinamis ke dalam system prompt saat inisialisasi session.
- Pertimbangkan web search tool untuk query yang mengandung kata kunci seperti "terbaru", "baru rilis", "2025", "2026".

---

## Issue #4 — Tampilan Tidak Responsif di Mobile (Desktop Mode)

### Deskripsi
Saat diakses di browser mobile, web masih **merender dalam layout desktop** — elemen tidak menyesuaikan ukuran layar, teks terlalu kecil, dan tombol sulit di-tap. Tidak ada responsive breakpoint yang berfungsi dengan baik.

### Yang Diharapkan
- Web harus **mobile-first** atau setidaknya memiliki responsive design yang benar.
- Pastikan `<meta name="viewport">` sudah ada dan benar:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- Gunakan breakpoint yang jelas:

```css
/* Mobile */
@media (max-width: 640px) {
  .news-grid {
    grid-template-columns: 1fr; /* 1 kolom di mobile */
  }

  .nav-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .hero-title {
    font-size: clamp(28px, 8vw, 48px);
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- Ukuran tap target minimum **44×44px** untuk semua tombol dan link.
- Font body minimum **16px** agar tidak perlu zoom di mobile.

---

## Issue #5 — Tema Gelap & Terang: Tambah Light Mode yang Estetik

### Deskripsi
Saat ini web hanya memiliki **dark theme**. Perlu ditambahkan **light mode** yang tidak generik/plain-putih, tetap mempertahankan estetika Distrik Bunyi.

### Arah Desain Light Mode
Bukan putih bersih biasa. Gunakan palet yang **hangat, editorial, sedikit vintage** — seperti majalah musik cetak high-end. Referensi: Pitchfork edisi cetak, Crack Magazine.

### Spesifikasi Warna

```css
/* === DARK MODE (existing) === */
:root[data-theme="dark"] {
  --bg-primary: #0D0D0D;
  --bg-secondary: #1A1A1A;
  --bg-card: #141414;
  --text-primary: #F5F5F5;
  --text-secondary: #999999;
  --text-muted: #555555;
  --accent: #C8FF00;        /* neon lime — brand color */
  --accent-alt: #FF3D00;
  --border: rgba(255,255,255,0.08);
  --tag-indie: #1A3A1A;
  --tag-indie-text: #C8FF00;
  --tag-alternative: #1A1A3A;
  --tag-alternative-text: #8888FF;
}

/* === LIGHT MODE (new) === */
:root[data-theme="light"] {
  --bg-primary: #F0EDE6;       /* krem hangat, bukan putih */
  --bg-secondary: #E8E4DC;     /* sedikit lebih gelap */
  --bg-card: #ECEAE3;          /* kartu: off-white warm */
  --text-primary: #1A1814;     /* hitam kecokelatan */
  --text-secondary: #5C5750;   /* abu hangat */
  --text-muted: #A09890;
  --accent: #1A1814;           /* di light mode, aksen jadi hitam bold */
  --accent-alt: #C8320A;       /* oranye burnt — tetap energik */
  --border: rgba(26,24,20,0.10);
  --tag-indie: #D4E8C2;
  --tag-indie-text: #2A5E1A;
  --tag-alternative: #C2CCE8;
  --tag-alternative-text: #1A2E5E;
}
```

### Implementasi Toggle

```html
<!-- Toggle button di navbar -->
<button id="theme-toggle" aria-label="Toggle theme">
  <span class="icon-sun">☀</span>
  <span class="icon-moon">◑</span>
</button>
```

```javascript
// Simpan preferensi user
const toggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Cek preferensi sistem
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

toggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('distrikbunyi-theme', next);
});

// Load saved preference
const saved = localStorage.getItem('distrikbunyi-theme');
if (saved) root.setAttribute('data-theme', saved);
```

### Catatan Desain Light Mode
- **Jangan** pakai `#FFFFFF` sebagai background — terlalu harsh dan terasa murahan.
- Gunakan `box-shadow` yang lembut (tidak hitam pekat) untuk kartu di light mode:
  ```css
  .news-card {
    box-shadow: 0 2px 12px rgba(26,24,20,0.08);
  }
  ```
- Tag genre (INDIE, ALTERNATIVE, dll) tetap berwarna tapi lebih soft — hindari warna neon di light mode.
- Gambar thumbnail bisa ditambah efek subtle warm overlay di light mode agar tidak terasa terlalu digital.

---

## Feature #6 — Splash Screen / Intro Loading

### Deskripsi
Tambahkan **cinematic splash screen** yang tampil saat pertama kali user membuka web. Memberikan kesan pertama yang kuat, mempertegas identitas brand Distrik Bunyi sebelum masuk ke homepage.

### Behaviour
- Splash tampil selama ±2.2 detik → lalu **curtain exit** (slide ke atas) → homepage muncul dengan stagger animation.
- Hanya muncul sekali per sesi (gunakan `sessionStorage` agar tidak muncul lagi saat navigasi antar halaman).

### Elemen Visual
- Logo **DISTRIK BUNYI** slide masuk dari kiri menggunakan `clip-path` reveal.
- Garis pembatas horizontal yang mengembang pelan.
- Tagline `Indonesian Music Media` fade in.
- Waveform kecil (5–13 bar) bergerak halus sebagai identitas musik.

### Implementasi

```html
<!-- Taruh sebelum konten utama -->
<div id="splash">
  <div class="splash-inner">
    <div class="s-logo">
      <div class="s-dot"></div>
      <span class="s-name">DISTRIK BUNYI</span>
    </div>
    <div class="s-divider"></div>
    <span class="s-tag">Indonesian Music Media</span>
    <div class="s-wave" id="sWave"></div>
  </div>
</div>
```

```css
/* Logo reveal dari kiri */
.s-logo {
  clip-path: inset(0 100% 0 0);
  animation: revealX 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
}

@keyframes revealX {
  to { clip-path: inset(0 0% 0 0); }
}

/* Divider tumbuh */
.s-divider {
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(240,237,230,0.2), transparent);
  animation: expandW 0.7s ease 1.0s forwards;
}

@keyframes expandW { to { width: 200px; } }

/* Exit: splash naik ke atas kayak tirai */
#splash.leaving {
  animation: curtainUp 0.8s cubic-bezier(0.76,0,0.24,1) forwards;
}

@keyframes curtainUp {
  0%   { clip-path: inset(0 0 0% 0); }
  100% { clip-path: inset(0 0 100% 0); }
}

/* Waveform bar */
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
```

```javascript
// Cek session — jangan tampilkan splash jika sudah pernah masuk
if (sessionStorage.getItem('splashShown')) {
  document.getElementById('splash').style.display = 'none';
  document.getElementById('site').classList.add('visible');
} else {
  // Build waveform bars dinamis
  const sw = document.getElementById('sWave');
  [14,20,10,24,16,28,12,22,18,26,8,20,16].forEach(h => {
    const b = document.createElement('div');
    b.className = 's-bar';
    b.style.setProperty('--h', h + 'px');
    b.style.setProperty('--d', (0.5 + Math.random() * 0.7) + 's');
    b.style.animationDelay = Math.random() * 0.4 + 's';
    sw.appendChild(b);
  });

  // Timing: 2.2s → curtain naik → reveal site
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('leaving');
    setTimeout(() => {
      splash.style.display = 'none';
      document.getElementById('site').classList.add('visible');
      sessionStorage.setItem('splashShown', '1');
    }, 800);
  }, 2200);
}
```

### Catatan
- Font yang digunakan: `Bebas Neue` (logo), `DM Mono` (tagline), `Syne` (body) — sudah konsisten dengan brand.
- Dot aksen warna `#C8FF00` dengan `box-shadow` glow agar terasa premium.
- Homepage stagger animation: nav → hero → bottom bar, masing-masing delay 0.15s.
- Di mobile, waveform tetap tampil namun ukuran font logo menyesuaikan `clamp()`.

---

## Feature #7 — Share ke IG Story & WhatsApp

### Deskripsi
Fitur **share artikel/rilisan** langsung ke Instagram Story atau WhatsApp. User bisa memilih tema tampilan story card sebelum membagikannya — memberikan pengalaman yang personal dan estetik, bukan sekadar copy-paste link biasa.

### User Flow
1. User tap tombol **"Bagikan"** di kartu artikel.
2. **Bottom sheet** muncul dari bawah dengan animasi smooth.
3. User melihat **preview story card** dan memilih salah satu dari 3 tema.
4. User tap tombol tujuan: **IG Story**, **WhatsApp**, atau **Salin Tautan**.
5. Sheet tutup, aksi dieksekusi.

### Elemen Fitur
- **Bottom sheet** dengan handle, swipe-down-to-close, dan backdrop blur.
- **Story preview** (rasio 9:16 scaled down) yang berubah real-time saat ganti tema.
- **3 pilihan tema story card:**
  - `Gelap` — dark background, aksen lime.
  - `Terang` — warm cream `#F0EDE6`, aksen burnt orange.
  - `Neon` — background lime `#C8FF00`, teks hitam bold.
- **Tombol IG Story** — capture preview dengan `html2canvas` → kirim via `Web Share API`.
- **Tombol WhatsApp** — buka `wa.me/?text=` dengan judul + link artikel.
- **Salin Tautan** — `navigator.clipboard` dengan animasi feedback + toast notifikasi.

### Spesifikasi Teknis

```html
<!-- Trigger di footer article card -->
<button class="share-trigger" onclick="openShareSheet(articleData)">
  <svg><!-- share icon --></svg>
  Bagikan
</button>

<!-- Bottom Sheet -->
<div class="sheet" id="sheet">
  <div class="sheet-handle"></div>
  <div class="sheet-header">...</div>
  <div class="preview-container">
    <div class="story-preview" id="storyPreview">...</div>
    <div class="style-list">
      <!-- 3 style options -->
    </div>
  </div>
  <div class="share-actions">
    <button class="btn-ig">IG Story</button>
    <button class="btn-wa">WhatsApp</button>
    <button class="btn-copy">Salin Tautan</button>
  </div>
</div>
```

```css
/* Bottom sheet slide up */
.sheet {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  border-radius: 16px 16px 0 0;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
}
.sheet.open { transform: translateY(0); }

/* Story preview — rasio 9:16 */
.story-preview {
  aspect-ratio: 9/16;
  max-height: 280px;
  max-width: 158px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

/* Backdrop overlay */
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s ease;
}
.overlay.open { opacity: 1; pointer-events: all; }
```

```javascript
// Share ke IG Story
async function shareIG() {
  const canvas = await html2canvas(document.getElementById('storyPreview'));
  canvas.toBlob(async blob => {
    const file = new File([blob], 'distrikbunyi-story.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Distrik Bunyi' });
    } else {
      // Fallback: trigger download
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'distrikbunyi-story.png';
      a.click();
    }
  });
}

// Share ke WhatsApp
function shareWA(title, url) {
  const text = encodeURIComponent(`${title}\n${url}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

// Salin tautan
async function copyLink(url) {
  await navigator.clipboard.writeText(url);
  showToast('✓ Tautan disalin!');
}

// Swipe down to close
sheet.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
sheet.addEventListener('touchend', e => {
  if (e.changedTouches[0].clientY - startY > 80) closeSheet();
});
```

### Dependencies
- [`html2canvas`](https://html2canvas.hertzen.com/) — untuk render story card jadi gambar.
- Web Share API (native browser) — sudah didukung di Chrome & Safari mobile.
- Fallback: download gambar jika Web Share API tidak tersedia.

### Catatan Desain
- Story card menggunakan font dan warna yang konsisten dengan brand Distrik Bunyi.
- Tiap tema card menyertakan: dot + nama brand, thumbnail artikel, tag genre, judul, deskripsi singkat, dan URL `distrikbunyi.id`.
- Toast notifikasi muncul di atas bottom sheet dengan animasi slide up.
- Di desktop, bottom sheet bisa diganti dengan modal dialog centered.

---

## Summary Checklist untuk Antigravity

| No | Isu / Fitur | Prioritas | Status |
|----|-------------|-----------|--------|
| 1 | Navbar tab tidak sejajar & tidak konsisten | 🔴 High | Open |
| 2 | Card berita tinggi tidak seragam | 🔴 High | Open |
| 3 | Kurator AI info musik ketinggalan zaman | 🟡 Medium | Open |
| 4 | Layout tidak responsif di mobile | 🔴 High | Open |
| 5 | Tambah light mode estetik | 🟢 Low | Open |
| 6 | Splash screen / intro loading | 🟢 Low | Open |
| 7 | Share ke IG Story & WhatsApp | 🟡 Medium | Open |

---

*Dokumen ini dibuat berdasarkan tangkapan layar dan observasi langsung pada build terbaru Distrik Bunyi per 17 Mei 2026.*
