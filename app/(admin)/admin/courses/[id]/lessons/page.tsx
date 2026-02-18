
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Plus, GripVertical, Edit2, Trash2, Eye } from 'lucide-react';

export default async function CourseLessonsPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: course } = await supabase
    .from('courses')
    .select('title')
    .eq('id', params.id)
    .single();

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', params.id)
    .order('order_index', { ascending: true });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Lessons Manager</h1>
          <p className="text-slate-500">Course: <span className="text-primary font-bold">{course?.title}</span></p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
          <Plus className="w-4 h-4" />
          Add New Lesson
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-black dark:text-white">Curriculum Structure</h3>
          <span className="text-xs font-bold text-slate-400">{lessons?.length || 0} Lessons total</span>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {lessons?.map((lesson, idx) => (
            <div key={lesson.id} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="text-slate-300 group-hover:text-primary transition-colors cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-xs text-slate-500">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold dark:text-white flex items-center gap-3">
                    {lesson.title}
                    {lesson.is_free_preview && (
                      <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[8px] font-black uppercase">Preview</span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">ID: {lesson.google_drive_file_id} | {lesson.duration_minutes}m</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-primary transition-all"><Edit2 className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {!lessons?.length && (
            <div className="p-20 text-center text-slate-400 font-medium">
              No lessons added to this course yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
