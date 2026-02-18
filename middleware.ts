
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // 1. Admin Route Protection
  if (path.startsWith('/admin')) {
    if (!session) return NextResponse.redirect(new URL('/login', req.url));
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 2. Course Player Protection
  if (path.startsWith('/course/')) {
    if (!session) return NextResponse.redirect(new URL('/login', req.url));
    // Further granular check for specific course enrollment is done inside the page component
    // for performance and to handle dynamic slugs more easily.
  }

  // 3. Login Redirect
  if (path === '/login' && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/course/:path*', '/login'],
};
