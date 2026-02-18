
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Courses from '@/components/Courses';

export default async function ProgramsPage() {
  const supabase = createClient();

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
      <main className="pt-24 pb-20">
        <Courses courses={courses || []} />
      </main>
    </div>
  );
}
