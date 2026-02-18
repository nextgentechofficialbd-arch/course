
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import CourseHero from '@/components/course-landing/CourseHero';
import CurriculumSection from '@/components/course-landing/CurriculumSection';
import EnrollmentForm from '@/components/enrollment/EnrollmentForm';
import LanguageText from '@/components/ui/LanguageText';
import { AlertCircle, CheckCircle2, PlayCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!course) notFound();

  const { data: { session } } = await supabase.auth.getSession();
  
  let enrollmentStatus = null;
  let rejectionReason = null;

  if (session) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('payment_status, rejection_reason')
      .eq('user_id', session.user.id)
      .eq('course_id', course.id)
      .maybeSingle();
    
    if (enrollment) {
      enrollmentStatus = enrollment.payment_status;
      rejectionReason = enrollment.rejection_reason;
    }
  }

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
              <h2 className="text-3xl font-black mb-6 dark:text-white">
                <LanguageText en="Program Overview" bn="প্রোগ্রাম ওভারভিউ" />
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                {course.full_description || course.short_description}
              </div>
            </section>

            <section id="curriculum">
              <h2 className="text-3xl font-black mb-6 dark:text-white">
                <LanguageText en="Curriculum" bn="কারিকুলাম" />
              </h2>
              <CurriculumSection lessons={lessons || []} />
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary/5">
                
                {enrollmentStatus === 'confirmed' ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-black mb-2 dark:text-white">Enrolled Successfully</h3>
                    <p className="text-sm text-slate-500 mb-8">You have full access to this program.</p>
                    <Link 
                      href={`/course/${params.slug}`}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-5 h-5" />
                      Go to Classroom
                    </Link>
                  </div>
                ) : enrollmentStatus === 'pending' ? (
                  <div className="text-center py-6">
                    <RefreshCw className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-spin-slow" />
                    <h3 className="text-xl font-black mb-2 dark:text-white">Verification Pending</h3>
                    <p className="text-sm text-slate-500">Your payment is being verified by our team. Check back soon!</p>
                  </div>
                ) : enrollmentStatus === 'rejected' ? (
                  <div className="space-y-6">
                    <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-2xl border border-red-100 dark:border-red-900">
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-black uppercase">Enrollment Rejected</span>
                      </div>
                      <p className="text-sm text-red-800 dark:text-red-400 font-medium">{rejectionReason || "Transaction verification failed."}</p>
                    </div>
                    <h3 className="text-lg font-black dark:text-white">Retry Enrollment</h3>
                    <EnrollmentForm courseId={course.id} basePrice={course.price} />
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-black mb-6 dark:text-white">
                      <LanguageText en="Join this Program" bn="প্রোগ্রামে যুক্ত হোন" />
                    </h3>
                    <EnrollmentForm courseId={course.id} basePrice={course.price} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
