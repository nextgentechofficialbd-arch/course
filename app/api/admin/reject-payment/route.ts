
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AGENCY_NAME } from '@/lib/constants';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { enrollment_id, reason } = await req.json();
    const supabase = createClient();

    // 1. Verify Admin
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // 2. Fetch Details
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: enrollment, error: fetchErr } = await supabaseAdmin
      .from('enrollments')
      .select('*, profiles(full_name, email), courses(title)')
      .eq('id', enrollment_id)
      .single();

    if (fetchErr || !enrollment) {
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
    }

    const studentEmail = (enrollment.profiles as any).email;
    const studentName = (enrollment.profiles as any).full_name;
    const courseTitle = (enrollment.courses as any).title;

    // 3. Update Enrollment
    const { error: updateErr } = await supabaseAdmin
      .from('enrollments')
      .update({ 
        payment_status: 'rejected',
        rejection_reason: reason
      })
      .eq('id', enrollment_id);

    if (updateErr) throw updateErr;

    // 4. Send Email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    await resend.emails.send({
      from: `${AGENCY_NAME} <${fromEmail}>`,
      to: studentEmail,
      subject: `Payment Verification Update: ${courseTitle}`,
      html: `
        <div style="font-family: sans-serif; padding: 40px; background-color: #fef2f2;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 30px; border: 1px solid #fee2e2;">
            <h1 style="color: #dc2626; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Payment Update</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Hello ${studentName},</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Unfortunately, your payment for <strong>${courseTitle}</strong> could not be verified at this time.
            </p>
            
            <div style="background-color: #fff1f2; padding: 20px; border-radius: 15px; margin: 30px 0;">
              <p style="color: #991b1b; font-size: 14px; font-weight: 800; margin-bottom: 8px;">Reason:</p>
              <p style="color: #be123c; font-size: 15px; margin: 0;">${reason}</p>
            </div>

            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              Please ensure your Transaction ID is correct and the screenshot is clear. You can re-submit your enrollment through the course page.
            </p>

            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            <p style="color: #9ca3af; font-size: 11px; text-align: center;">&copy; ${new Date().getFullYear()} ${AGENCY_NAME}</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
