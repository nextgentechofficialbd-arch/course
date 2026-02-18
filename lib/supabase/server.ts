

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/types';

export function createClient() {
  // Fix: cookies() returns a Promise in Next.js 15+ which needs to be handled inside the cookie methods
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookieStore;
          return store.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const store = await cookieStore;
            store.set({ name, value, ...options });
          } catch (error) {
            // Handle edge cases where cookies might not be settable
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const store = await cookieStore;
            store.set({ name, value: '', ...options });
          } catch (error) {
            // Handle edge cases
          }
        },
      },
    }
  );
}