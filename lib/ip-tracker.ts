import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Fix: Swapped 'userId' and 'page' parameters to ensure optional 'userId' comes last.
export async function trackPageVisit(req: NextRequest, page: string, userId?: string) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Extract real IP from headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = (forwarded ? forwarded.split(',')[0] : realIp || '127.0.0.1').trim();
  const ua = req.headers.get('user-agent') || 'unknown';

  // Rate limiting: 1 log per 5 minutes per user/page
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  const { data: recentLog } = await supabase
    .from('ip_logs')
    .select('id')
    .eq('ip_address', ip)
    .eq('page_visited', page)
    .gt('created_at', fiveMinutesAgo)
    .limit(1)
    .single();

  if (recentLog) return; // Skip logging if recently tracked

  await supabase.from('ip_logs').insert({
    user_id: userId || null,
    ip_address: ip,
    user_agent: ua,
    page_visited: page,
  });
}