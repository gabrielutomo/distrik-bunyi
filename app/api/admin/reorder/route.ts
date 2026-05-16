import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function checkAdmin(request: NextRequest) {
  const auth = request.headers.get('x-admin-password');
  return auth === process.env.ADMIN_PASSWORD;
}

export async function PUT(request: NextRequest) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { table, items } = body;

  if (!table || !items || !Array.isArray(items)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Supabase does not support bulk updates natively via a single API call easily,
  // so we'll just do individual updates in parallel. Since it's usually just 2 items, it's very fast.
  const promises = items.map((item: any) => 
    supabase
      .from(table)
      .update({ order_index: item.order_index })
      .eq('id', item.id)
  );

  const results = await Promise.all(promises);

  const errors = results.filter(r => r.error);
  if (errors.length > 0) {
    return NextResponse.json({ error: 'Failed to update some items' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
