
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendRejectionEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { enrollment_id, reason } = await req.json();
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
      .select('*, profiles(full_name, email), courses(title)')
      .eq('id', enrollment_id)
      .single();

    if (fetchErr || !enrollment) {
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
    }

    // 3. Update Status
    const { error: updateErr } = await supabase
      .from('enrollments')
      .update({ 
        payment_status: 'rejected',
        confirmed_at: new Date().toISOString(),
        confirmed_by: user?.id
      })
      .eq('id', enrollment_id);

    if (updateErr) throw updateErr;

    // 4. Send Email
    await sendRejectionEmail(
      (enrollment.profiles as any).email,
      (enrollment.profiles as any).full_name,
      (enrollment.courses as any).title,
      reason
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
