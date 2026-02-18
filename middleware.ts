import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // 1. Redirect already logged-in users from /auth
  if (path === '/auth' && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Admin Route Protection
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

  // 3. Course Access Protection
  if (path.startsWith('/course/')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    const slug = path.split('/')[2];
    
    // Check enrollment
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('payment_status, courses!inner(slug)')
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