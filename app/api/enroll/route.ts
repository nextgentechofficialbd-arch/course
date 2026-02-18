

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Use admin client for user management
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
    const promo_code = formData.get('promo_code') as string;
    const amount_paid = parseInt(formData.get('amount_paid') as string);
    const screenshot = formData.get('screenshot') as File;

    if (!email || !course_id || !screenshot) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 1. Check if user exists, if not create
    // Fix: Access admin property by casting auth as any to avoid TS errors
    const { data: users, error: findUserError } = await (supabaseAdmin.auth as any).admin.listUsers();
    let targetUser = users?.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!targetUser) {
      const { data: newUser, error: createError } = await (supabaseAdmin.auth as any).admin.createUser({
        email,
        email_confirm: true,
        password: uuidv4(), // Temporary secure password
        user_metadata: { full_name, role: 'student' }
      });
      if (createError) throw createError;
      targetUser = newUser.user;
    }

    const userId = targetUser!.id;

    // 2. Upsert Profile
    await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        full_name,
        phone,
        role: 'student'
      });

    // 3. Upload screenshot
    const fileExt = screenshot.name.split('.').pop();
    const fileName = `${course_id}/${Date.now()}_${uuidv4()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('payment-screenshots')
      .upload(fileName, screenshot);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('payment-screenshots')
      .getPublicUrl(fileName);

    // 4. Create Enrollment
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
        promo_code_used: promo_code || null,
        payment_status: 'pending',
        access_token: uuidv4()
      });

    if (enrollError) {
       // Cleanup storage if db fails
       await supabaseAdmin.storage.from('payment-screenshots').remove([fileName]);
       throw enrollError;
    }

    // 5. Update Promo usage
    if (promo_code) {
      const { data: promo } = await supabaseAdmin.from('promo_codes').select('used_count').eq('code', promo_code).single();
      if (promo) {
        await supabaseAdmin.from('promo_codes').update({ used_count: promo.used_count + 1 }).eq('code', promo_code);
      }
    }

    return NextResponse.json({ success: true, message: 'Enrollment submitted! We will confirm within 24 hours.' });

  } catch (err: any) {
    console.error('Enrollment submission error:', err);
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}