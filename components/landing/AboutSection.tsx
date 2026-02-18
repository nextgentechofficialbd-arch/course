
import React from 'react';
import { FEATURES } from '../../constants';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="relative z-10 space-y-8">
              <div className="text-primary font-black uppercase tracking-[0.3em] text-xs">
                Our Story
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight dark:text-white leading-[0.9]">
                Bridging the Gap <br /> Between Education <br /> & Industry.
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 font-medium">
                <p>
                  At EduAgency, we believe that education should be as dynamic as the technology landscape it serves. We are not just an EdTech platform; we are a catalyst for professional transformation.
                </p>
                <p className="font-bengali text-lg italic border-l-4 border-primary pl-6 py-2">
                  "আমাদের লক্ষ্য হলো দক্ষ জনবল তৈরি করা যারা গ্লোবাল মার্কেটে প্রতিযোগিতা করতে সক্ষম।"
                </p>
              </div>
              <button className="bg-slate-900 dark:bg-white dark:text-slate-950 text-white px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95">
                Meet the Mentors
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all group">
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
