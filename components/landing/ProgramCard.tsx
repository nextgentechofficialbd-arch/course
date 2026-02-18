
import React from 'react';
import { Course } from '../../types';
import { Clock, Users, ArrowUpRight } from 'lucide-react';

interface ProgramCardProps {
  course: Course;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ course }) => {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden m-4 rounded-2xl">
        <div 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          style={{ background: course.thumbnail_url }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 dark:bg-slate-950/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
            {course.category}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-1 text-xs font-bold">
            <Clock className="w-3 h-3" /> 12 Weeks
          </div>
          <div className="flex items-center gap-1 text-xs font-bold">
            <Users className="w-3 h-3" /> 200+
          </div>
        </div>
      </div>

      <div className="p-8 pt-2 flex flex-col flex-grow">
        <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors leading-tight">
          {course.title}
        </h3>
        {course.bengali_title && (
          <p className="font-bengali text-sm text-slate-500 dark:text-slate-400 mb-4 font-bold">
            {course.bengali_title}
          </p>
        )}
        <p className="text-slate-600 dark:text-slate-500 text-sm line-clamp-2 mb-8 font-medium">
          {course.short_description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tuition Fee</div>
            <div className="text-2xl font-black text-primary">৳{course.price.toLocaleString()}</div>
          </div>
          <button className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
