
import React from 'react';
import { PlayCircle, Lock, Clock } from 'lucide-react';

interface Lesson {
  title: string;
  duration_minutes: number;
  is_free_preview: boolean;
  order_index: number;
}

interface CurriculumSectionProps {
  lessons: Lesson[];
}

const CurriculumSection: React.FC<CurriculumSectionProps> = ({ lessons }) => {
  return (
    <div className="space-y-3">
      {lessons.map((lesson, idx) => (
        <div 
          key={idx}
          className="group flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              lesson.is_free_preview 
                ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
            }`}>
              {lesson.is_free_preview ? <PlayCircle className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                {lesson.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Clock className="w-3 h-3" />
                {lesson.duration_minutes} Minutes
              </div>
            </div>
          </div>
          
          {lesson.is_free_preview && (
            <span className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Preview
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CurriculumSection;
