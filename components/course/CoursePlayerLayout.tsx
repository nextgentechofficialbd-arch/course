
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Menu, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import LessonSidebar from './LessonSidebar';
import VideoPlayer from './VideoPlayer';

interface CoursePlayerLayoutProps {
  course: any;
  lessons: any[];
  completedLessonIds: string[];
  activeLessonId: string;
  userId: string;
}

export default function CoursePlayerLayout({ 
  course, 
  lessons, 
  completedLessonIds, 
  activeLessonId,
  userId
}: CoursePlayerLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(completedLessonIds));

  const activeLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];

  const handleLessonComplete = () => {
    setCompletedIds(prev => new Set([...Array.from(prev), activeLesson.id]));
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h2 className="font-black text-sm truncate max-w-[200px]">{course.title}</h2>
        <Link href="/dashboard" className="p-2 -mr-2"><ChevronLeft size={24} /></Link>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-0 z-40 bg-background lg:relative lg:translate-x-0 transition-transform duration-300 transform lg:w-[320px] lg:shrink-0 flex flex-col border-r border-border ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-border hidden lg:block">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest mb-6 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">E</div>
             <div className="min-w-0">
               <h2 className="font-black dark:text-white leading-tight truncate">{course.title}</h2>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Curriculum</p>
             </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <LessonSidebar 
            lessons={lessons} 
            completedIds={completedIds} 
            activeLessonId={activeLesson.id} 
            courseSlug={course.slug} 
            onItemClick={() => setIsSidebarOpen(false)}
          />
        </div>
      </aside>

      {/* Main Player Content */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-900/30">
        <div className="w-full max-w-6xl mx-auto lg:p-12 space-y-12">
          <div className="bg-black aspect-video rounded-none lg:rounded-[3rem] overflow-hidden shadow-2xl relative ring-1 ring-white/10">
            <VideoPlayer 
              fileId={activeLesson.google_drive_file_id}
              lessonId={activeLesson.id}
              courseId={course.id}
              isCompleted={completedIds.has(activeLesson.id)}
              onComplete={handleLessonComplete}
            />
          </div>

          <div className="px-6 lg:px-0 pb-20">
            <div className="space-y-2 mb-10">
               <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                 <span className="bg-primary/10 px-2 py-1 rounded">Lesson {activeLesson.order_index}</span>
                 <span>•</span>
                 <span>{activeLesson.duration_minutes} Minutes</span>
               </div>
               <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight">{activeLesson.title}</h1>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-black mb-4">Resources & Assets</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Ensure you have all the required software installed as demonstrated in the first module. 
                Any project files or code snippets for this module can be found below.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
                 <button className="flex items-center justify-between p-5 bg-muted/50 rounded-2xl border border-border hover:border-primary transition-all group">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     </div>
                     <div>
                       <p className="text-xs font-black uppercase tracking-widest text-foreground">Download Assets</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase">Cloud Storage</p>
                     </div>
                   </div>
                 </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
