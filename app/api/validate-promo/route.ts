
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, course_id } = await req.json();
    const supabase = createRouteHandlerClient({ cookies });

    const { data: promo, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !promo) {
      return NextResponse.json({ valid: false, message: "Promo code not found or inactive" }, { status: 404 });
    }

    const now = new Date();
    if (promo.expires_at && new Date(promo.expires_at) < now) {
      return NextResponse.json({ valid: false, message: "Promo code has expired" }, { status: 400 });
    }

    if (promo.used_count >= promo.max_uses) {
      return NextResponse.json({ valid: false, message: "Promo code usage limit reached" }, { status: 400 });
    }

    return NextResponse.json({ 
      valid: true, 
      discount_percent: promo.discount_percent 
    });

  } catch (err) {
    return NextResponse.json({ valid: false, message: "Internal server error" }, { status: 500 });
  }
}
