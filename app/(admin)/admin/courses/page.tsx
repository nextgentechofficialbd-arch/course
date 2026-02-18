
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Plus, Edit, Trash2, List } from 'lucide-react';
import Link from 'next/link';

export default async function AdminCoursesPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('order_index', { ascending: true });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Course Manager</h1>
          <p className="text-slate-500">Create and edit your educational programs.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
          <Plus className="w-4 h-4" />
          Add New Course
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {courses?.map((course) => (
          <div key={course.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="h-40 relative">
              <div className="absolute inset-0 opacity-50" style={{ background: course.thumbnail_url }} />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${course.is_active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                   {course.is_active ? 'Active' : 'Inactive'}
                 </span>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <h3 className="text-xl font-black dark:text-white line-clamp-1">{course.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{course.short_description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                <span className="text-lg font-black text-primary">৳{course.price}</span>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/admin/courses/${course.id}/lessons`}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all"
                    title="Manage Lessons"
                  >
                    <List className="w-4 h-4" />
                  </Link>
                  <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
