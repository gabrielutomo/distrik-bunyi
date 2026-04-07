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
    // Teruskan Range header dari browser ke upstream agar dapat 206 Partial Content
    const rangeHeader = request.headers.get('range');

    const upstreamHeaders: HeadersInit = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'audio/mpeg, audio/*, */*',
    };
    if (rangeHeader) {
      upstreamHeaders['Range'] = rangeHeader;
    }

    const audioRes = await fetch(url, { headers: upstreamHeaders });

    if (!audioRes.ok && audioRes.status !== 206) {
      return NextResponse.json(
        { error: `Upstream error: ${audioRes.status}` },
        { status: 502 }
      );
    }

    const audioBuffer = await audioRes.arrayBuffer();
    const totalSize = audioBuffer.byteLength;

    // Bangun response headers
    const resHeaders: Record<string, string> = {
      'Content-Type': audioRes.headers.get('content-type') || 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    };

    // Jika browser minta range, balas dengan 206 + Content-Range
    if (rangeHeader) {
      // Parse range: "bytes=START-"
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      const start = match ? parseInt(match[1], 10) : 0;
      const end = match && match[2] ? parseInt(match[2], 10) : totalSize - 1;

      resHeaders['Content-Range'] = `bytes ${start}-${end}/${totalSize}`;
      resHeaders['Content-Length'] = (end - start + 1).toString();

      return new NextResponse(audioBuffer.slice(start, end + 1), {
        status: 206,
        headers: resHeaders,
      });
    }

    resHeaders['Content-Length'] = totalSize.toString();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: resHeaders,
    });
  } catch {
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}
