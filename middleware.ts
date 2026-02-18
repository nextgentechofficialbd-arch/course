import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Protect Admin Routes
  if (path.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url));
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect Dashboard & Player
  if ((path.startsWith('/dashboard') || path.startsWith('/course')) && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};