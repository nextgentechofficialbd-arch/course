
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CoursePlayerLayout from '@/components/course/CoursePlayerLayout';
import React from 'react';

export default async function CourseDetailPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string };
  searchParams: { lesson?: string };
}) {
  const supabase = createClient();

  // 1. Verify Session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect(`/login?redirect=/course/${params.slug}`);
  }

  // 2. Fetch Course and Verify Enrollment
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (courseError || !course) {
    redirect('/');
  }

  const { data: enrollment, error: enrollError } = await supabase
    .from('enrollments')
    .select('payment_status')
    .eq('user_id', session.user.id)
    .eq('course_id', course.id)
    .eq('payment_status', 'confirmed')
    .maybeSingle();

  if (enrollError || !enrollment) {
    redirect(`/programs/${params.slug}`);
  }

  // 3. Fetch Curriculum
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true });

  if (!lessons || lessons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 font-bold">Curriculum is coming soon.</p>
      </div>
    );
  }

  // 4. Fetch User Progress
  const { data: progress } = await supabase
    .from('progress')
    .select('lesson_id')
    .eq('user_id', session.user.id)
    .eq('course_id', course.id);

  const completedLessonIds = progress?.map(p => p.lesson_id) || [];
  const activeLessonId = searchParams.lesson || lessons[0].id;

  return (
    <CoursePlayerLayout 
      course={course}
      lessons={lessons}
      completedLessonIds={completedLessonIds}
      activeLessonId={activeLessonId}
      userId={session.user.id}
    />
  );
}
