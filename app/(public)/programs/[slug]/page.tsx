
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CourseHero from '@/components/course-page/CourseHero';
import CurriculumSection from '@/components/course-page/CurriculumSection';
import EnrollmentForm from '@/components/enrollment/EnrollmentForm';
import { Course, Lesson } from '@/types';

interface PageProps {
  params: { slug: string };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const supabase = createClient();
  
  // 1. Fetch Course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (courseError || !course) {
    return notFound();
  }

  // 2. Fetch Lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true });

  // 3. Check Enrollment Status (if logged in)
  const { data: { user } } = await supabase.auth.getUser();
  let enrollmentStatus: string | undefined = undefined;

  if (user) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('payment_status')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .maybeSingle();
    
    enrollmentStatus = enrollment?.payment_status;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <CourseHero course={course as Course} enrollmentStatus={enrollmentStatus} />
      
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section id="curriculum">
              <CurriculumSection lessons={(lessons as Lesson[]) || []} />
            </section>
            
            <section id="overview" className="space-y-6">
              <h2 className="text-3xl font-black text-foreground">Program Overview</h2>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {course.full_description || course.short_description}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div id="enrollment-section" className="sticky top-28 space-y-8">
              {!enrollmentStatus || enrollmentStatus === 'rejected' ? (
                <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5">
                  <h3 className="text-2xl font-black mb-6 text-foreground">
                    Enroll in Program
                  </h3>
                  <EnrollmentForm courseId={course.id} basePrice={course.price} />
                </div>
              ) : (
                <div className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/20 text-center">
                  <h3 className="text-xl font-black mb-4">You are enrolled!</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {enrollmentStatus === 'pending' 
                      ? "Your payment is currently under review by our administration team."
                      : "You have full access to this course's content."}
                  </p>
                  {enrollmentStatus === 'confirmed' && (
                    <a 
                      href={`/course/${course.slug}`}
                      className="inline-block w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black shadow-lg shadow-primary/20"
                    >
                      Go to Classroom
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
