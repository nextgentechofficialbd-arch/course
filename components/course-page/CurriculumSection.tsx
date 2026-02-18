
'use client';

import React, { useState } from 'react';
import { PlayCircle, Lock, ChevronDown, Clock, BookOpen } from 'lucide-react';
import { Lesson } from '@/types';

interface CurriculumSectionProps {
  lessons: Lesson[];
}

const CurriculumSection: React.FC<CurriculumSectionProps> = ({ lessons }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const next = new Set(openItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenItems(next);
  };

  const totalMinutes = lessons.reduce((acc, l) => acc + (l.duration_minutes || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground mb-2">Course Curriculum</h2>
          <div className="flex items-center gap-6 text-sm text-muted-foreground font-bold">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-primary" />
              {lessons.length} Lessons
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m Total
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, idx) => (
          <div 
            key={lesson.id} 
            className="border border-border rounded-2xl overflow-hidden bg-muted/20"
          >
            <button 
              onClick={() => toggleItem(lesson.id)}
              className="w-full flex items-center justify-between p-6 hover:bg-muted/40 transition-colors group"
            >
              <div className="flex items-center gap-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                  lesson.is_free_preview 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {idx + 1}
                </div>
                <div className="text-left">
                  <h4 className="font-black text-foreground group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1.5">
                      <Clock size={12} />
                      {lesson.duration_minutes}m
                    </span>
                    {lesson.is_free_preview && (
                      <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-500/20">
                        Free Preview
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {!lesson.is_free_preview && <Lock size={16} className="text-muted-foreground" />}
                <ChevronDown 
                  size={20} 
                  className={`text-muted-foreground transition-transform duration-300 ${
                    openItems.has(lesson.id) ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </button>
            
            <div className={`transition-all duration-300 overflow-hidden ${
              openItems.has(lesson.id) ? 'max-h-40 border-t border-border bg-background' : 'max-h-0'
            }`}>
              <div className="p-6 text-sm text-muted-foreground font-medium">
                {lesson.is_free_preview 
                  ? "This introductory lesson covers the foundational concepts required for the rest of the course. You can watch this video for free to get a feel for our teaching style." 
                  : "Content locked. Please enroll in the program to unlock access to the full video curriculum, project files, and downloadable resources."}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurriculumSection;
