
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { lesson_id, course_id } = await req.json();
    const supabase = createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // 1. Verify confirmed enrollment
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('course_id', course_id)
      .eq('payment_status', 'confirmed')
      .single();

    if (!enrollment) {
      return NextResponse.json({ message: "No active enrollment found" }, { status: 403 });
    }

    // 2. Upsert progress
    const { error: upsertErr } = await supabase
      .from('progress')
      .upsert({
        user_id: session.user.id,
        lesson_id: lesson_id,
        course_id: course_id,
        completed_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' });

    if (upsertErr) throw upsertErr;

    // 3. Get updated counts
    const { count: completedCount } = await supabase
      .from('progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('course_id', course_id);

    const { count: totalLessons } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', course_id);

    return NextResponse.json({
      success: true,
      completed_count: completedCount,
      total_lessons: totalLessons,
      percent: Math.round((completedCount! / totalLessons!) * 100)
    });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
