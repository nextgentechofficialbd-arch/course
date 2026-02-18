import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import CoursePlayerLayout from '@/components/course/CoursePlayerLayout';

export default async function CoursePlayerPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string };
  searchParams: { lesson?: string };
}) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?redirect=/course/${params.slug}`);
  }

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!course) return notFound();

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('payment_status')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('payment_status', 'confirmed')
    .maybeSingle();

  if (!enrollment) {
    redirect(`/programs/${params.slug}`);
  }

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true });

  const { data: progress } = await supabase
    .from('progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('course_id', course.id);

  const completedLessonIds = progress?.map(p => p.lesson_id) || [];
  const activeLessonId = searchParams.lesson || lessons?.[0]?.id;

  return (
    <CoursePlayerLayout 
      course={course}
      lessons={lessons || []}
      completedLessonIds={completedLessonIds}
      activeLessonId={activeLessonId}
      userId={user.id}
    />
  );
}