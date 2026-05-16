import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// API ini bersifat public, dipanggil dari client saat membaca artikel
export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) return NextResponse.json({ error: 'Missing article ID' }, { status: 400 });

    // Gunakan RPC (Remote Procedure Call) jika ada, tapi karena kita belum set RPC,
    // kita gunakan pendekatan baca-tambah-simpan sementara, atau rpc jika kita membuat fungsi.
    // Untungnya Supabase memungkinkan increment via `update` jika kita menggunakan API yang tepat, 
    // namun secara standar kita ambil dulu value sekarang, lalu update +1 (ini rentan race condition,
    // tapi cukup untuk skala blog kecil).

    // 1. Ambil data saat ini
    const { data: current, error: fetchError } = await supabase
      .from('articles')
      .select('view_count')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // 2. Update +1
    const { error: updateError } = await supabase
      .from('articles')
      .update({ view_count: current.view_count + 1 })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, view_count: current.view_count + 1 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
