import { NextRequest, NextResponse } from 'next/server';

// Proxy audio preview Deezer melalui server agar tidak terkena restriksi CDN
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  // Pastikan hanya URL Deezer CDN yang diizinkan (keamanan)
  const isDeezerUrl =
    url.includes('dzcdn.net') || url.includes('deezer.com');

  if (!isDeezerUrl) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
  }

  try {
    const audioRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Range': 'bytes=0-',
      },
    });

    if (!audioRes.ok && audioRes.status !== 206) {
      return NextResponse.json(
        { error: `Upstream error: ${audioRes.status}` },
        { status: 502 }
      );
    }

    const audioBuffer = await audioRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}
