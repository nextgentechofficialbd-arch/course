
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: "Token and password required" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Validate token and get user_id
    const { data: enrollment, error: enrollErr } = await supabaseAdmin
      .from('enrollments')
      .select('*, courses(slug), profiles(email)')
      .eq('access_token', token)
      .eq('payment_status', 'confirmed')
      .single();

    if (enrollErr || !enrollment) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 404 });
    }

    const userId = enrollment.user_id;
    const email = (enrollment.profiles as any).email;
    const courseSlug = (enrollment.courses as any).slug;

    // 2. Update user password
    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: password,
      email_confirm: true
    });

    if (updateErr) throw updateErr;

    // 3. Log user in (create session)
    const supabase = createClient();
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInErr) throw signInErr;

    return NextResponse.json({ 
      success: true, 
      redirect: `/course/${courseSlug}` 
    });

  } catch (err: any) {
    console.error('Set Password API Error:', err);
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
