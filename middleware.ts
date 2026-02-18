import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware for route protection and session management.
 */
export async function middleware(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // 1. Redirect logged-in users away from auth pages
  if ((path === '/login' || path === '/auth') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Protect Admin Routes
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
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

  // 3. Protect Course Player (Enrollment Check)
  if (path.startsWith('/course/')) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(path)}`, request.url));
    }

    const slug = path.split('/')[2];
    if (slug) {
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
  }

  // 4. Protect Dashboard
  if (path === '/dashboard' && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
};