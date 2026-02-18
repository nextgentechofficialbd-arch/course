
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import React from 'react';
import Link from 'next/link';

export default async function AccessPage({ params }: { params: { token: string } }) {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Verify token in enrollments
  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .select('*, courses(slug, title), profiles(email, role)')
    .eq('access_token', params.token)
    .eq('payment_status', 'confirmed')
    .single();

  if (error || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h1 className="text-3xl font-black mb-4 text-foreground leading-tight">Link Invalid or Expired</h1>
          <p className="text-slate-500 mb-10 font-medium">This access link has already been used or is no longer valid. Please check your email or contact our support team on WhatsApp.</p>
          <Link href="/" className="inline-block w-full bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const userId = enrollment.user_id;
  const courseSlug = (enrollment.courses as any).slug;
  const email = (enrollment.profiles as any).email;

  // 2. Check if user has logged in before by checking for password/identities
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
  
  // If user has a last_sign_in_at, they've set a password or used OAuth
  if (userData?.user?.last_sign_in_at) {
    redirect(`/login?email=${encodeURIComponent(email)}&redirect=/course/${courseSlug}`);
  }

  // 3. New user: proceed to set password
  redirect(`/set-password?token=${params.token}&course=${courseSlug}&email=${encodeURIComponent(email)}`);
}
