
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Search, UserCircle, Mail, Phone, Calendar } from 'lucide-react';

export default async function AdminStudentsPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: students } = await supabase
    .from('profiles')
    .select('*, enrollments(course_id)')
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Student Directory</h1>
          <p className="text-slate-500">Manage your active learning community.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            placeholder="Search students..." 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-primary transition-all w-full md:w-80"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {students?.map((student) => (
          <div key={student.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 hover:shadow-xl hover:shadow-primary/5 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                <UserCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black dark:text-white">{student.full_name}</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded">Student</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Mail className="w-4 h-4" />
                {student.email || 'No email'}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Phone className="w-4 h-4" />
                {student.phone || 'No phone'}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                Joined: {new Date(student.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enrolled Courses</div>
               <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-black dark:text-white">
                 {student.enrollments?.length || 0}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
