
import React from 'react';
import { ShieldCheck, Clock, Award, Star } from 'lucide-react';
import { Course } from '@/types';

interface CourseHeroProps {
  course: Course;
}

const CourseHero: React.FC<CourseHeroProps> = ({ course }) => {
  return (
    <section className="relative pt-32 pb-20 bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: course.thumbnail_url }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950 to-slate-950" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {course.category}
            </span>
            <div className="flex items-center gap-1 text-yellow-500 ml-4">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-black">{course.rating}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.9] mb-6">
            {course.title}
          </h1>
          
          {course.bengali_title && (
            <p className="font-bengali text-xl md:text-2xl text-slate-400 italic mb-8">
              {course.bengali_title}
            </p>
          )}

          <div className="flex flex-wrap gap-6 mt-12">
            {[
              { icon: ShieldCheck, text: "Secure Payment" },
              { icon: Clock, text: "Lifetime Access" },
              { icon: Award, text: "Certificate" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest">
                <item.icon className="w-5 h-5 text-primary" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHero;
