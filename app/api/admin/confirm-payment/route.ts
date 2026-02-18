
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendAccessEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { enrollment_id } = await req.json();
    const supabase = createRouteHandlerClient({ cookies });

    // 1. Verify Admin Role
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // 2. Get Enrollment Details
    const { data: enrollment, error: fetchErr } = await supabase
      .from('enrollments')
      .select('*, profiles(full_name, email), courses(title), access_token')
      .eq('id', enrollment_id)
      .single();

    if (fetchErr || !enrollment) {
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
    }

    // 3. Update Enrollment Status
    const { error: updateErr } = await supabase
      .from('enrollments')
      .update({ 
        payment_status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmed_by: user?.id
      })
      .eq('id', enrollment_id);

    if (updateErr) throw updateErr;

    // 4. Send Email via Resend (Simulated call to lib/email)
    const accessLink = `${process.env.NEXT_PUBLIC_SITE_URL}/access/${enrollment.access_token}`;
    await sendAccessEmail(
      (enrollment.profiles as any).email,
      (enrollment.profiles as any).full_name,
      (enrollment.courses as any).title,
      accessLink
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
