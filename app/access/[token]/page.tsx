import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AccessPage({ params }: { params: { token: string } }) {
  const supabase = createClient();

  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .select('*, courses(slug)')
    .eq('access_token', params.token)
    .eq('payment_status', 'confirmed')
    .single();

  if (error || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-border text-center">
          <h1 className="text-2xl font-black mb-4">Invalid Access Link</h1>
          <p className="text-slate-500">This link is no longer valid or payment hasn't been confirmed yet. Please contact support if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  const courseSlug = (enrollment.courses as any).slug;
  redirect(`/set-password?token=${params.token}&course=${courseSlug}`);
}