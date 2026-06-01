import { NextRequest, NextResponse } from 'next/server';

function buildSystemInstruction(): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });

  return `Kamu adalah KURATOR AI dari DistrikBunyi — platform kurasi musik independen, rap, dan alternatif Indonesia.

Konteks waktu: Hari ini adalah ${dateStr}. Pengetahuanmu mencakup rilisan hingga awal 2025. Untuk rilisan yang sangat baru (2025–sekarang), jujur saja bahwa kamu mungkin belum punya datanya, dan sarankan user untuk cek langsung di Deezer, Spotify, atau distrikbunyi.id.

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
- Jika ditanya rilisan terbaru 2025-2026, sebutkan yang kamu tahu dan arahkan ke platform streaming untuk info paling update

Yang kamu TIDAK lakukan:
- Jangan rekomendasiin artis internasional sebagai jawaban utama (boleh sebagai referensi perbandingan saja)
- Jangan jawab pertanyaan di luar musik
- Jangan berpura-pura punya data real-time — kalau tidak tahu, katakan dengan jujur

Saat merekomendasikan, selalu sebutkan: nama artis, nama lagu/album jika relevan, dan satu kalimat kenapa ini cocok.`;
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not found in environment');
    return NextResponse.json({ 
      error: 'Kurator AI sedang offline. Silakan coba lagi nanti.',
      details: 'API key not configured' 
    }, { status: 500 });
  }

  let body: { history?: ChatMessage[]; message?: string };
  try {
    body = await request.json();
  } catch (e) {
    console.error('Invalid JSON body:', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { history = [], message } = body;
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
  }

  const contents: ChatMessage[] = [
    ...history,
    { role: 'user', parts: [{ text: message }] },
  ];

  const payload = {
    systemInstruction: { parts: [{ text: buildSystemInstruction() }] },
    contents,
    generationConfig: {
      temperature: 0.85,
      maxOutputTokens: 500,
    },
  };

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

  // Retry logic for high demand
  let lastError: any = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`Gemini API error (attempt ${attempt}):`, res.status, err);
        
        // If 503 (high demand), retry after delay
        if (res.status === 503 && attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // 1s, 2s delay
          continue;
        }
        
        if (res.status === 429) {
          return NextResponse.json({ 
            error: 'Kurator AI sedang sibuk. Tunggu sebentar ya!' 
          }, { status: 429 });
        }
        
        lastError = err;
        break;
      }

      const data = await res.json();
      const text: string =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 
        'Maaf, aku lagi bingung. Coba tanya lagi ya!';

      return NextResponse.json({ reply: text });
    } catch (err) {
      console.error(`Fetch error (attempt ${attempt}):`, err);
      lastError = err;
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  // All retries failed
  return NextResponse.json({ 
    error: 'Kurator AI lagi overload. Coba lagi dalam beberapa saat ya!' 
  }, { status: 503 });
}
