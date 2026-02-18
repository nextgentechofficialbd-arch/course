
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AGENCY_NAME, SITE_URL } from '@/lib/constants';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { enrollment_id } = await req.json();
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

    // 2. Fetch Enrollment details with Profiles and Courses
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: enrollment, error: fetchErr } = await supabaseAdmin
      .from('enrollments')
      .select('*, profiles(full_name, email), courses(title, slug), access_token')
      .eq('id', enrollment_id)
      .single();

    if (fetchErr || !enrollment) {
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
    }

    const studentEmail = (enrollment.profiles as any).email;
    const studentName = (enrollment.profiles as any).full_name;
    const courseTitle = (enrollment.courses as any).title;
    const accessLink = `${SITE_URL}/access/${enrollment.access_token}`;

    // 3. Update Enrollment
    const { error: updateErr } = await supabaseAdmin
      .from('enrollments')
      .update({ 
        payment_status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmed_by: user?.id
      })
      .eq('id', enrollment_id);

    if (updateErr) throw updateErr;

    // 4. Send Email via Resend
    // Note: If you are using a free Resend tier, 'from' must be your verified domain or 'onboarding@resend.dev'
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    await resend.emails.send({
      from: `${AGENCY_NAME} <${fromEmail}>`,
      to: studentEmail,
      subject: `🎉 আপনার কোর্স অ্যাক্সেস প্রস্তুত! | Your Course Access is Ready!`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 60px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #2563eb; padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px;">${AGENCY_NAME}</h1>
            </div>
            <div style="padding: 50px;">
              <h2 style="color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 24px;">Congratulations, ${studentName}!</h2>
              
              <div style="background-color: #ecfdf5; border-left: 6px solid #10b981; padding: 20px; margin-bottom: 30px; border-radius: 12px;">
                <p style="color: #065f46; font-size: 16px; font-weight: 700; margin: 0;">আপনার পেমেন্ট নিশ্চিত হয়েছে এবং কোর্সে প্রবেশের সুযোগ দেওয়া হয়েছে।</p>
              </div>

              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                You now have full, lifetime access to: <br/>
                <strong style="color: #111827; font-size: 20px;">${courseTitle}</strong>
              </p>

              <div style="text-align: center; margin-bottom: 40px;">
                <a href="${accessLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 20px 45px; text-decoration: none; border-radius: 20px; font-weight: 800; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);">
                  কোর্সে প্রবেশ করুন / Access Course
                </a>
              </div>

              <div style="background-color: #fff7ed; padding: 20px; border-radius: 20px; text-align: center;">
                <p style="color: #9a3412; font-size: 13px; font-weight: 700; margin: 0;">
                  ⚠️ এই লিংকটি শুধুমাত্র আপনার জন্য। কারো সাথে শেয়ার করবেন না।
                </p>
              </div>

              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 40px 0;" />
              
              <p style="color: #6b7280; font-size: 12px; text-align: center; line-height: 1.6;">
                If you encounter any issues, please reply to this email or contact our WhatsApp support.<br/>
                &copy; ${new Date().getFullYear()} ${AGENCY_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('Confirm Payment API Error:', err);
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
