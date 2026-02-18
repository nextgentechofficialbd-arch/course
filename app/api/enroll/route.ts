
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const supabase = createRouteHandlerClient({ cookies });

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const transactionId = formData.get('transactionId') as string;
    const courseId = formData.get('courseId') as string;
    const promoCode = formData.get('promoCode') as string;
    const finalPrice = formData.get('finalPrice') as string;
    const screenshot = formData.get('screenshot') as File;

    // 1. Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    // 2. Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      return NextResponse.json({ message: "You are already enrolled in this course" }, { status: 400 });
    }

    // 3. Upload screenshot
    const fileExt = screenshot.name.split('.').pop();
    const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payment-screenshots')
      .upload(fileName, screenshot);

    if (uploadError) {
      return NextResponse.json({ message: "Failed to upload screenshot" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('payment-screenshots')
      .getPublicUrl(fileName);

    // 4. Create enrollment record
    const { error: enrollError } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        payment_status: 'pending',
        payment_method: paymentMethod,
        payment_number: phone,
        transaction_id: transactionId,
        payment_screenshot_url: publicUrl,
        amount_paid: parseInt(finalPrice),
        promo_code_used: promoCode || null,
        access_token: uuidv4(),
      });

    if (enrollError) {
      return NextResponse.json({ message: "Database error" }, { status: 500 });
    }

    // 5. Update promo usage if needed
    if (promoCode) {
      await supabase.rpc('increment_promo_usage', { p_code: promoCode });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
