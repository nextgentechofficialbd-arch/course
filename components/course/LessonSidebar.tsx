
'use client';

import React from 'react';
import Link from 'next/link';
import { PlayCircle, CheckCircle2, Circle, Clock } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface LessonSidebarProps {
  lessons: any[];
  completedIds: Set<string>;
  activeLessonId: string;
  courseSlug: string;
  onItemClick?: () => void;
}

export default function LessonSidebar({ lessons, completedIds, activeLessonId, courseSlug, onItemClick }: LessonSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-8 border-b border-border space-y-4">
        <ProgressBar completed={completedIds.size} total={lessons.length} />
      </div>
      <div className="p-4 space-y-1 overflow-y-auto">
        {lessons.map((lesson, idx) => {
          const isCompleted = completedIds.has(lesson.id);
          const isActive = activeLessonId === lesson.id;

          return (
            <Link
              key={lesson.id}
              href={`/course/${courseSlug}?lesson=${lesson.id}`}
              onClick={onItemClick}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                isActive 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'
              }`}
            >
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isCompleted 
                  ? 'bg-green-100 text-green-600' 
                  : isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-muted text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-800'
              }`}>
                {isCompleted ? <CheckCircle2 size={20} /> : isActive ? <PlayCircle size={20} /> : <Circle size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                  Lesson {idx + 1}
                </p>
                <h4 className={`text-sm font-bold truncate leading-tight ${isActive ? 'text-foreground' : 'text-slate-500'}`}>
                  {lesson.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={10} /> {lesson.duration_minutes}m
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
