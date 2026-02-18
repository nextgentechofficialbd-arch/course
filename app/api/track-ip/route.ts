
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { page } = await req.json();
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = (forwarded ? forwarded.split(',')[0] : realIp || 'unknown').trim();
    const ua = req.headers.get('user-agent') || 'unknown';

    if (ip === 'unknown') {
      return NextResponse.json({ success: false, message: 'Invalid IP' });
    }

    // 1. Check if IP is blocked
    const { data: blocked } = await supabaseAdmin
      .from('blocked_ips')
      .select('ip_address')
      .eq('ip_address', ip)
      .maybeSingle();

    if (blocked) {
      return NextResponse.json({ blocked: true, success: false }, { status: 403 });
    }

    // 2. Anti-Spam: Check last log
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentLog } = await supabaseAdmin
      .from('ip_logs')
      .select('id')
      .eq('ip_address', ip)
      .eq('page_visited', page)
      .gt('visited_at', fiveMinutesAgo)
      .limit(1)
      .maybeSingle();

    if (recentLog) {
      return NextResponse.json({ success: true, skipped: true });
    }

    // 3. Insert Log
    await supabaseAdmin.from('ip_logs').insert({
      ip_address: ip,
      user_agent: ua,
      page_visited: page,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('IP Track Error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
