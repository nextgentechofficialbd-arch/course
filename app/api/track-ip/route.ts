
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { page } = await req.json();
    const supabase = createRouteHandlerClient({ cookies });
    const headerList = headers();
    
    const ip = headerList.get('x-forwarded-for') || '0.0.0.0';
    const ua = headerList.get('user-agent') || 'unknown';
    
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('ip_logs').insert({
      user_id: user?.id || null,
      ip_address: ip.split(',')[0],
      user_agent: ua,
      page_visited: page,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
