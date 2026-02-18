
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, course_id } = await req.json();
    if (!code) {
      return NextResponse.json({ valid: false, message: "Code is required" }, { status: 400 });
    }

    const supabase = createClient();

    // Query active promo code
    const { data: promo, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !promo) {
      return NextResponse.json({ valid: false, message: "Invalid or inactive promo code" }, { status: 404 });
    }

    // Check expiration
    const now = new Date();
    if (promo.expires_at && new Date(promo.expires_at) < now) {
      return NextResponse.json({ valid: false, message: "This promo code has expired" }, { status: 400 });
    }

    // Check usage limits
    if (promo.used_count >= promo.max_uses) {
      return NextResponse.json({ valid: false, message: "Promo code usage limit reached" }, { status: 400 });
    }

    return NextResponse.json({ 
      valid: true, 
      discount_percent: promo.discount_percent,
      code: promo.code
    });

  } catch (err) {
    console.error('Promo validation error:', err);
    return NextResponse.json({ valid: false, message: "Internal server error" }, { status: 500 });
  }
}
