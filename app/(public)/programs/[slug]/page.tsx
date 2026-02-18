
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import CourseHero from '@/components/course-landing/CourseHero';
import CurriculumSection from '@/components/course-landing/CurriculumSection';
import EnrollmentForm from '@/components/enrollment/EnrollmentForm';
import { Course } from '@/types';

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !course) {
    notFound();
  }

  // Fetch lessons for curriculum
  const { data: lessons } = await supabase
    .from('lessons')
    .select('title, duration_minutes, is_free_preview, order_index')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <CourseHero course={course} />
      
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section id="overview">
              <h2 className="text-3xl font-black mb-6 dark:text-white">About this Program</h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                {course.full_description || course.short_description}
              </div>
            </section>

            <section id="curriculum">
              <h2 className="text-3xl font-black mb-6 dark:text-white">Curriculum</h2>
              <CurriculumSection lessons={lessons || []} />
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary/5">
                <h3 className="text-2xl font-black mb-6 dark:text-white">Enroll in Program</h3>
                <EnrollmentForm courseId={course.id} basePrice={course.price} />
              </div>
              
              <div className="bg-primary p-8 rounded-[2rem] text-white">
                <h4 className="font-bold mb-2">Need Help?</h4>
                <p className="text-sm text-primary-foreground/80 mb-6">Chat with our support team on WhatsApp for instant assistance.</p>
                <a 
                  href="https://wa.me/8801234567890" 
                  className="block w-full bg-white text-primary text-center py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
