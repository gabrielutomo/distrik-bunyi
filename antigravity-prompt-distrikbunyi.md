# 🎵 Antigravity Mission Prompt — DistrikBunyi: AI Music Discovery Chat

## Project Context

You are working on **DistrikBunyi**, a curation and archive platform for Indonesian indie, rap, and alternative music. Live at: https://distrik-bunyi.vercel.app/

**Tech stack:**
- Frontend: Next.js (App Router) + Tailwind CSS
- Database: Supabase (PostgreSQL)
- Deployment target: **Google Cloud Run** (mandatory for #JuaraVibeCoding)

---

## ⚠️ Hard Constraints — Read Before Planning

Before generating your implementation plan, acknowledge these non-negotiable constraints:

1. **DO NOT modify, remove, or refactor any existing features.** The following must remain fully functional after this mission:
   - Homepage with hero section, latest music news articles, and new releases from Deezer API
   - Individual article pages with full content
   - Category filter: SEMUA, INDIE, RAP, ALTERNATIVE
   - "UNDERRATED PICKS" section with album ratings and descriptions
   - Footer navigation and copyright
   - All existing Supabase database connections and queries

2. **Only ADD new files and components.** Do not touch existing page files unless strictly necessary to mount the new widget in the root layout.

3. The only allowed edit to existing files is **adding one import and one component render** inside `app/layout.tsx`.

---

## Mission Objective

Add a **floating AI Music Discovery Chat widget** powered by **Google Gemini API** that allows users to get personalized Indonesian music recommendations through natural conversation — like chatting with a real music curator who deeply understands the Indonesian scene.

This feature must feel native to the site, not like an afterthought.

---

## Expected Behavior & Requirements

### Widget UI
- Floating button fixed at **bottom-right corner**, visible on all pages, high z-index
- Button displays a headphone/music icon with small label "Tanya Kurator"
- Clicking it opens a **chat panel** with slide-up animation (approx. 380×520px)
- Panel can be closed via X button or clicking outside
- Panel header shows: **"KURATOR AI"** + small "BETA" badge
- Visual style must match DistrikBunyi's existing dark/moody aesthetic — use the same color tokens and font already in the project, do not introduce new design system

### Chat Panel Layout
```
┌─────────────────────────────┐
│ 🎵 KURATOR AI          BETA │
│ Asisten musik Indonesia  [X]│
├─────────────────────────────┤
│                             │
│   [scrollable chat area]    │
│                             │
├─────────────────────────────┤
│ [input field]    [Kirim ↑]  │
│ Powered by Gemini           │
└─────────────────────────────┘
```

### Opening Message (hardcoded, not from API)
> "Halo! Gue KURATOR AI dari DistrikBunyi. Mau cari musik Indonesia apa hari ini? Ceritain mood lo atau kasih referensi artis yang lo suka 🎵"

### Suggested Prompts
Show 3 clickable chip buttons below the opening message. Hide them after the user sends their first message:
- "Rekomendasiin rap Jakarta yang dark vibes 🔥"
- "Musik indie Indonesia buat late night 🌙"
- "Artis hyperpop lokal yang underrated?"

### Loading State
Show a three-dot animated typing indicator in the AI bubble while waiting for API response.

### Error State
If the API call fails, display: *"Waduh, koneksi ke kurator lagi gangguan. Coba lagi bentar ya!"*

### Multi-turn Memory
The chat must maintain full conversation history within the session (not persisted across page reloads — in-memory only is fine).

---

## API Route Requirements

Create a new API route at `/app/api/music-chat/route.ts` (POST method).

**Gemini model to use:** `gemini-1.5-flash`

**Environment variable required:**
```
GEMINI_API_KEY=
```
Read this from `process.env.GEMINI_API_KEY`. Never hardcode it.

**System instruction for Gemini** (pass as `system_instruction`):

```
Kamu adalah KURATOR AI dari DistrikBunyi — platform kurasi musik independen, rap, dan alternatif Indonesia.

Kepribadianmu:
- Passionate soal musik Indonesia, terutama scene indie, rap, dan alternative
- Bahasa: casual Indonesian, boleh campur sedikit English slang musik (vibe, banger, slept on, dll)
- Singkat tapi berisi — maksimal 3-4 kalimat per jawaban
- Punya opini yang kuat dan berani, bukan sekadar netral
- Selalu rekomendasiin artis/lagu/album Indonesia yang spesifik

Yang kamu bisa bantu:
- Rekomendasi musik Indonesia berdasarkan mood, genre, atau artis referensi
- Penjelasan singkat soal scene musik Indonesia (indie, rap Jaksel, hyperpop lokal, dll)
- Pendapatmu soal artis atau album Indonesia tertentu
- Cari musik Indonesia yang "slept on" / underrated

Yang kamu TIDAK lakukan:
- Jangan rekomendasiin artis internasional sebagai jawaban utama (boleh sebagai referensi perbandingan saja)
- Jangan jawab pertanyaan di luar musik
- Jangan pura-pura punya data real-time (streaming stats, chart terkini)

Saat merekomendasikan, selalu sebutkan: nama artis, nama lagu/album jika relevan, dan satu kalimat kenapa ini cocok.
```

---

## Files to Create (New Files Only)

```
components/
  MusicChatWidget.tsx     ← floating button + chat panel UI + state
  
app/
  api/
    music-chat/
      route.ts            ← Gemini API route handler
```

**One allowed edit to existing file:**
In `app/layout.tsx`, add:
```tsx
import MusicChatWidget from "@/components/MusicChatWidget"
// render <MusicChatWidget /> inside <body>, after {children}
```

---

## Cloud Run Preparation

After completing the chat feature, also create these files at the project root:

**`Dockerfile`:**
```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
```

**`.dockerignore`:**
```
node_modules
.next
.env*.local
.git
```

**Edit `next.config.js`** — add `output: 'standalone'` while preserving all existing config options.

---

## Verification Checklist

After completing the implementation, verify by running the browser agent on the local dev server:

- [ ] Floating chat button visible on homepage, article page, and any other existing page
- [ ] Chat panel opens and closes correctly with animation
- [ ] Opening message and 3 suggested prompts appear on first open
- [ ] Suggested prompts disappear after first user message
- [ ] Multi-turn conversation works (AI remembers earlier messages in session)
- [ ] Loading animation shows while waiting for Gemini response
- [ ] Error message shows if API call fails
- [ ] All existing features still work: article list, category filter, underrated picks, Deezer releases
- [ ] No hardcoded API keys anywhere in the codebase
- [ ] `Dockerfile` and `output: 'standalone'` in next.config exist
