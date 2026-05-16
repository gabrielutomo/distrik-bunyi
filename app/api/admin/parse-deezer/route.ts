import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ id: null });
    }

    // Try to get the final redirected URL
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    const finalUrl = res.url;
    
    const match = finalUrl.match(/track\/(\d+)/);
    if (match) {
      return NextResponse.json({ id: match[1] });
    }
    
    return NextResponse.json({ id: null, finalUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
