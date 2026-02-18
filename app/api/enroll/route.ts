
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const payment_method = formData.get('payment_method') as string;
    const transaction_id = formData.get('transaction_id') as string;
    const payment_number = formData.get('payment_number') as string;
    const course_id = formData.get('course_id') as string;
    const amount_paid = parseInt(formData.get('amount_paid') as string);
    const screenshot = formData.get('screenshot') as File;

    if (!email || !course_id || !screenshot) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 1. Handle User Identity
    const { data: userAuth, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      password: uuidv4(),
      user_metadata: { full_name, role: 'student' }
    });

    // If user already exists, it will throw a specific error, we handle that
    let userId;
    if (authError && authError.message.includes('already registered')) {
      const { data: existingUser } = await supabaseAdmin.from('profiles').select('id').eq('email', email).maybeSingle();
      if (!existingUser) {
        // Fallback: search via auth.admin if profile doesn't exist yet
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const found = users.users.find(u => u.email === email);
        userId = found?.id;
      } else {
        userId = existingUser.id;
      }
    } else if (authError) {
      throw authError;
    } else {
      userId = userAuth.user?.id;
    }

    if (!userId) throw new Error("Could not resolve user identity");

    // 2. Upload to Storage
    const fileName = `${course_id}/${Date.now()}_${uuidv4()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('payment-screenshots')
      .upload(fileName, screenshot, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('payment-screenshots')
      .getPublicUrl(fileName);

    // 3. Finalize Enrollment
    const { error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id,
        payment_method,
        payment_number,
        transaction_id,
        payment_screenshot_url: publicUrl,
        amount_paid,
        payment_status: 'pending',
        access_token: uuidv4()
      });

    if (enrollError) throw enrollError;

    return NextResponse.json({ success: true, message: 'Enrollment submitted!' });

  } catch (err: any) {
    console.error('Vercel API Error:', err);
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
