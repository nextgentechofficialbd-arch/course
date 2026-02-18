
"use client";

import React from 'react';
import Link from 'next/link';
import { PlayCircle, CheckCircle2, BookOpen, Clock, ArrowRight, UserCircle } from 'lucide-react';
import ProgressBar from '@/components/course/ProgressBar';

interface StudentDashboardProps {
  enrollments: any[];
  stats: Record<string, { total: number, completed: number }>;
  user: any;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ enrollments, stats, user }) => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black dark:text-white mb-2">Welcome Back!</h1>
          <p className="text-slate-500 font-medium">Ready to continue your learning journey today?</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <UserCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Enrolled Student</p>
            <p className="font-bold dark:text-white">{user.email}</p>
          </div>
        </div>
      </header>

      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrollments.map((enrollment) => {
            const course = enrollment.courses;
            const s = stats[course.id] || { total: 0, completed: 0 };
            
            return (
              <div 
                key={enrollment.id} 
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                   <div 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    style={{ background: course.thumbnail_url || 'linear-gradient(to right, #2563eb, #7c3aed)' }} 
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/course/${course.slug}`}
                      className="bg-white text-primary px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-2xl"
                    >
                      <PlayCircle className="w-5 h-5" />
                      Resume
                    </Link>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-black mb-1 dark:text-white leading-tight">{course.title}</h3>
                  <p className="text-slate-500 text-xs font-medium mb-6">Confirmed: {new Date(enrollment.confirmed_at).toLocaleDateString()}</p>
                  
                  <div className="mt-auto space-y-6">
                    <ProgressBar completedCount={s.completed} totalCount={s.total} />
                    
                    <Link 
                      href={`/course/${course.slug}`}
                      className="w-full border-2 border-slate-100 dark:border-slate-800 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all group"
                    >
                      Enter Classroom
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black dark:text-white mb-2">No active enrollments found</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Discover our world-class programs and start your journey today.</p>
          <Link 
            href="/programs" 
            className="inline-flex bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          >
            Browse Programs
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
