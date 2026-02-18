
import React from 'react';
import { ShieldCheck, Clock, Award, Star, CheckCircle2 } from 'lucide-react';
import { Course } from '@/types';
import Link from 'next/link';

interface CourseHeroProps {
  course: Course;
  enrollmentStatus?: string;
}

const CourseHero: React.FC<CourseHeroProps> = ({ course, enrollmentStatus }) => {
  const scrollToEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('enrollment-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-40 pb-24 bg-slate-950 text-white overflow-hidden">
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: course.thumbnail_url }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950 to-slate-950" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                {course.category}
              </span>
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Star size={16} className="fill-current" />
                <span className="text-sm font-black">{course.rating || '4.9'}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8">
              {course.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-medium mb-12 leading-relaxed">
              {course.short_description}
            </p>

            <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-white/10">
              {[
                { icon: ShieldCheck, text: "Secure Payment" },
                { icon: Clock, text: "Lifetime Access" },
                { icon: Award, text: "Certificate" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <item.icon size={20} className="text-primary" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
              <div className="mb-8">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Program Tuition Fee</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-white">৳{course.price.toLocaleString()}</span>
                  {course.price < 5000 && (
                    <span className="text-xl text-slate-500 line-through font-bold">৳10,000</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {enrollmentStatus === 'confirmed' ? (
                  <Link 
                    href={`/course/${course.slug}`}
                    className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
                  >
                    Enter Classroom
                    <CheckCircle2 size={24} />
                  </Link>
                ) : enrollmentStatus === 'pending' ? (
                  <div className="w-full bg-orange-500/10 text-orange-500 py-6 rounded-2xl font-black text-lg border border-orange-500/20 text-center">
                    Payment Under Review ⏳
                  </div>
                ) : (
                  <button 
                    onClick={scrollToEnroll}
                    className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-black text-lg hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
                  >
                    Enroll Now
                  </button>
                )}
                <p className="text-center text-xs text-slate-500 font-bold">
                  * 30-Day Money Back Guarantee for unsatisfied students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHero;
