
import React from 'react';
import { ArrowRight, Star, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-bounce">
            <Star className="w-3.5 h-3.5 fill-current" />
            Empowering Next-Gen Talent
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.95] mb-8 dark:text-white">
            Level Up Your <br />
            <span className="text-primary italic">Creative Agency</span> <br />
            Skills Today.
          </h1>

          <div className="space-y-2 mb-10">
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium">
              Join 500+ students mastering high-demand digital skills.
            </p>
            <p className="font-bengali text-lg md:text-xl text-slate-400 dark:text-slate-500 italic">
              সেরা মেন্টরদের সাথে শিখুন আধুনিক সব ডিজিটাল স্কিল এবং নিজেকে তৈরি করুন ভবিষ্যতের জন্য।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <button 
              onClick={onExplore}
              className="w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group"
            >
              Explore Programs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto border-2 border-slate-200 dark:border-slate-800 dark:text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
              Watch Preview
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-slate-100 dark:border-slate-900 pt-12">
            {[
              { label: 'Active Students', value: '500+' },
              { label: 'Certified Programs', value: '05+' },
              { label: 'Success Rate', value: '95%' }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl font-black text-primary">{stat.value}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
