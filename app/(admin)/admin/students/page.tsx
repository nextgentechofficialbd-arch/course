
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  ShieldCheck,
  UserCircle
} from 'lucide-react';

export default async function AdminStudentsPage() {
  const supabase = createClient();

  // Fetch profiles with enrollment counts
  const { data: students } = await supabase
    .from('profiles')
    .select('*, enrollments(id)')
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Learner Directory</h1>
          <p className="text-slate-500 font-medium">Insights into your active student community.</p>
        </div>
        <div className="relative min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm font-medium" 
          />
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Contact Info</th>
                <th className="px-8 py-4">Joined Date</th>
                <th className="px-8 py-4">Enrollments</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students?.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                        <UserCircle size={24} />
                      </div>
                      <div className="font-bold text-sm text-foreground">{student.full_name || 'Anonymous Student'}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <Mail size={12} className="text-primary" /> {student.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <Phone size={12} className="text-primary" /> {student.phone || 'No phone'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                    {new Date(student.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black">
                        {student.enrollments?.length || 0} Programs
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-500">
                      <ShieldCheck size={14} /> Active
                    </span>
                  </td>
                </tr>
              ))}
              {(!students || students.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500 font-bold">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
