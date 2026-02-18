
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { lesson_id, course_id } = await req.json();
    const supabase = createRouteHandlerClient({ cookies });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Upsert progress
    const { error } = await supabase
      .from('progress')
      .upsert({
        user_id: user.id,
        lesson_id,
        course_id,
        completed_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
