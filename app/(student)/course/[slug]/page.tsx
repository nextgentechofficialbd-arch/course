
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CoursePlayerLayout from '@/components/course/CoursePlayerLayout';

export default async function CoursePlayerPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string };
  searchParams: { lesson?: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  // 1. Check Session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  // 2. Verify Enrollment
  const { data: enrollment, error: enrollError } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('user_id', session.user.id)
    .eq('payment_status', 'confirmed')
    .filter('courses.slug', 'eq', params.slug)
    .single();

  if (enrollError || !enrollment) {
    redirect(`/programs/${params.slug}`);
  }

  const course = enrollment.courses as any;

  // 3. Fetch Lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true });

  // 4. Fetch Progress
  const { data: progress } = await supabase
    .from('progress')
    .select('lesson_id')
    .eq('user_id', session.user.id)
    .eq('course_id', course.id);

  const completedLessonIds = progress?.map(p => p.lesson_id) || [];
  const activeLesson = lessons?.find(l => l.id === searchParams.lesson) || lessons?.[0];

  return (
    <CoursePlayerLayout 
      course={course}
      lessons={lessons || []}
      completedLessonIds={completedLessonIds}
      activeLesson={activeLesson}
    />
  );
}
