
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Courses from '@/components/Courses';

export const metadata = {
  title: 'Our Programs',
  description: 'Explore our range of professional digital training programs.',
};

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
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-none">Curated <br/>Professional Programs</h1>
          <p className="text-slate-500 font-medium max-w-lg">Master in-demand skills with our expert-led curriculum designed for career growth.</p>
        </div>
        <Courses courses={courses || []} />
      </main>
    </div>
  );
}
