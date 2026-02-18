
import React from 'react';
import ProgramCard from './ProgramCard';
import { MOCK_COURSES } from '../../constants';

const ProgramsSection: React.FC = () => {
  return (
    <section id="programs" className="py-32 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4">
              Curated Curriculum
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight dark:text-white mb-6 leading-[0.9]">
              Professional Training <br /> Programs.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium font-bengali">
              আমাদের সকল প্রোগ্রাম ডিজাইন করা হয়েছে আধুনিক ইন্ডাস্ট্রির চাহিদা অনুযায়ী।
            </p>
          </div>
          <button className="text-primary font-black flex items-center gap-2 hover:translate-x-1 transition-transform group">
            View All Programs
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              →
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_COURSES.map((course) => (
            <ProgramCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
