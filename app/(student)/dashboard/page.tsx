
import React from 'react';
// Fix: Use createClient instead of createServerClient as exported by '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import StudentDashboard from '@/components/student/StudentDashboard';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/auth');

  // Fetch enrollments with course details
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('user_id', session.user.id)
    .eq('payment_status', 'confirmed');

  // Fetch progress to calculate percentages
  const { data: progress } = await supabase
    .from('progress')
    .select('course_id, lesson_id')
    .eq('user_id', session.user.id);

  // Fetch total lesson counts for each course
  const courseIds = enrollments?.map(e => e.course_id) || [];
  const { data: lessonCounts } = await supabase
    .from('lessons')
    .select('course_id')
    .in('course_id', courseIds);

  const statsByCourse = courseIds.reduce((acc: any, cid) => {
    const total = lessonCounts?.filter(l => l.course_id === cid).length || 0;
    const completed = progress?.filter(p => p.course_id === cid).length || 0;
    acc[cid] = { total, completed };
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-24 pb-20">
        <StudentDashboard 
          enrollments={enrollments || []} 
          stats={statsByCourse}
          user={session.user}
        />
      </main>
      <Footer />
    </div>
  );
}
