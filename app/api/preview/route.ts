import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing track id param' }, { status: 400 });
  }

  try {
    // 1. Ambil fresh summary dari Deezer API untuk mendapatkan token preview terbaru
    const res = await fetch(`https://api.deezer.com/track/${id}`, {
      cache: 'no-store' // Wajib no-store agar always dapat token fresh
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Deezer API' }, { status: 502 });
    }

    const data = await res.json();
    if (!data.preview) {
      return NextResponse.json({ error: 'No preview available for this track' }, { status: 404 });
    }

    // Force HTTPS url
    const freshPreviewUrl = data.preview.replace(/^http:\/\//i, 'https://');

    // 2. Redirect browser langsung ke CDN Deezer dengan token fresh
    return NextResponse.redirect(freshPreviewUrl, 302);
  } catch (err) {
    return NextResponse.json({ error: 'Proxy redirect failed' }, { status: 500 });
  }
}
