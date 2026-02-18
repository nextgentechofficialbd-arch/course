
"use client";

import React from 'react';
import Link from 'next/link';
import { PlayCircle, CheckCircle, Lock, ChevronRight } from 'lucide-react';

interface LessonSidebarProps {
  lessons: any[];
  completedLessonIds: string[];
  activeLessonId: string;
  courseSlug: string;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({ 
  lessons, 
  completedLessonIds, 
  activeLessonId, 
  courseSlug 
}) => {
  return (
    <div className="p-4 space-y-1">
      {lessons.map((lesson, idx) => {
        const isCompleted = completedLessonIds.includes(lesson.id);
        const isActive = activeLessonId === lesson.id;
        
        return (
          <Link 
            key={lesson.id}
            href={`/course/${courseSlug}?lesson=${lesson.id}`}
            className={`flex items-center justify-between p-4 rounded-xl transition-all group ${
              isActive 
                ? 'bg-primary/5 border border-primary/20' 
                : 'hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isCompleted 
                  ? 'bg-green-100 text-green-600' 
                  : isActive 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <PlayCircle className="w-4 h-4" />}
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-black uppercase tracking-widest mb-0.5 ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                  Lesson {idx + 1}
                </span>
                <span className={`text-sm font-bold leading-tight ${isActive ? 'text-primary' : 'dark:text-white'}`}>
                  {lesson.title}
                </span>
              </div>
            </div>
            {isActive && <ChevronRight className="w-4 h-4 text-primary animate-pulse" />}
          </Link>
        );
      })}
    </div>
  );
};

export default LessonSidebar;
