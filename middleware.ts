
import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // 1. IP Blocking Security Check
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = (forwarded ? forwarded.split(',')[0] : realIp || 'unknown').trim();

  // We query the blocked_ips table directly. In production, this can be cached.
  if (ip !== 'unknown') {
    const { data: isBlocked } = await supabase
      .from('blocked_ips')
      .select('ip_address')
      .eq('ip_address', ip)
      .maybeSingle();

    if (isBlocked) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Access Denied", 
          message: "Your IP has been flagged for security reasons. Contact support if you believe this is an error." 
        }), 
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // 2. Auth Redirects: From /auth to / if logged in
  if (path === '/auth' && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Admin Route Protection
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 4. Student Course Protection
  if (path.startsWith('/course/')) {
    if (!user) {
      return NextResponse.redirect(new URL(`/auth?redirect=${encodeURIComponent(path)}`, request.url));
    }

    const slug = path.split('/')[2];
    
    // Check confirmed enrollment for this specific course slug
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id, payment_status, courses!inner(slug)')
      .eq('user_id', user.id)
      .eq('courses.slug', slug)
      .eq('payment_status', 'confirmed')
      .maybeSingle();

    if (!enrollment) {
      return NextResponse.redirect(new URL(`/programs/${slug}`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
