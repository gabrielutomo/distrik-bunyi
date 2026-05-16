import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function checkAdmin(request: NextRequest) {
  const auth = request.headers.get('x-admin-password');
  return auth === process.env.ADMIN_PASSWORD;
}

// GET - ambil semua artikel
export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('order_index', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - tambah artikel baru
export async function POST(request: NextRequest) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { data, error } = await supabase
    .from('articles')
    .insert({
      id: body.id || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title: body.title,
      excerpt: body.excerpt,
      content: body.content || '',
      type: body.type,
      genre: body.genre,
      author: body.author,
      date: body.date,
      read_time: body.readTime,
      image_color: body.imageColor,
      image_url: body.imageUrl || null,
      deezer_id: body.deezerId || null,
      featured: body.featured ?? false,
      tags: body.tags ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PUT - update artikel
export async function PUT(request: NextRequest) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from('articles')
    .update({
      title: updates.title,
      excerpt: updates.excerpt,
      content: updates.content || '',
      type: updates.type,
      genre: updates.genre,
      author: updates.author,
      date: updates.date,
      read_time: updates.readTime,
      image_color: updates.imageColor,
      image_url: updates.imageUrl || null,
      deezer_id: updates.deezerId || null,
      featured: updates.featured ?? false,
      tags: updates.tags ?? [],
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE - hapus artikel
export async function DELETE(request: NextRequest) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
