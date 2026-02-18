
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AccessPage({ params }: { params: { token: string } }) {
  const supabase = createServerComponentClient({ cookies });

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
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-center">
          <h1 className="text-2xl font-black mb-4 text-red-500">Invalid or Expired Link</h1>
          <p className="text-slate-500 mb-8">This access link is either invalid or has already been used. Please contact support if you think this is an error.</p>
          <a href="/" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-black">Back to Home</a>
        </div>
      </div>
    );
  }

  const email = (enrollment.profiles as any).email;
  const slug = (enrollment.courses as any).slug;

  // 2. Check if user already has a password set (exists in auth.users)
  const { data: { user } } = await supabase.auth.getUser();
  
  // If not logged in, we try to see if the user needs to set a password
  // For the purpose of this flow, we redirect to set-password with email context
  redirect(`/set-password?email=${encodeURIComponent(email)}&course=${slug}&token=${params.token}`);
}
