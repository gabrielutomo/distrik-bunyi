import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `Kamu adalah KURATOR AI dari DistrikBunyi — platform kurasi musik independen, rap, dan alternatif Indonesia.

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

Saat merekomendasikan, selalu sebutkan: nama artis, nama lagu/album jika relevan, dan satu kalimat kenapa ini cocok.`;

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  let body: { history?: ChatMessage[]; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { history = [], message } = body;
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }

  const contents: ChatMessage[] = [
    ...history,
    { role: 'user', parts: [{ text: message }] },
  ];

  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents,
    generationConfig: {
      temperature: 0.85,
    },
  };

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini API error:', err);
      return NextResponse.json({ error: 'Gemini API error' }, { status: 502 });
    }

    const data = await res.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ error: 'Network error' }, { status: 503 });
  }
}
