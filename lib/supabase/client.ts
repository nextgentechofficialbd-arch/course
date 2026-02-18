import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types';

/**
 * Creates a Supabase client for use in the browser.
 * Uses environment variables for the URL and Anonymous Key.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}