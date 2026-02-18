

import React from 'react';
import { ArrowRight, Star, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onExplore?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-background">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-primary/20">
            <Star size={14} className="fill-current" />
            Top Rated EdTech Platform 2024
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8 text-foreground">
            Master <br />
            <span className="text-primary italic">In-Demand</span> <br />
            Skills Today.
          </h1>

          <div className="space-y-4 mb-10">
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              আপনার ক্যারিয়ার গড়ুন, আমাদের সাথে এগিয়ে চলুন। <br />
              Learn from industry leaders through expert-led sessions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <button 
              onClick={onExplore}
              className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-5 rounded-2xl text-lg font-black hover:scale-105 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group"
            >
              Explore Programs
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto border-2 border-border text-foreground px-10 py-5 rounded-2xl text-lg font-black hover:bg-muted transition-all">
              Contact Us
            </button>
          </div>

          <div className="mt-16 flex flex-wrap gap-8 pt-12 border-t border-border">
            {[
              { label: 'শিক্ষার্থী', value: '৫০০+' },
              { label: 'কোর্স', value: '৫টি' },
              { label: 'সাফল্য', value: '৯৫%' }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl font-black text-primary">{stat.value}</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block relative">
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-background rotate-3 hover:rotate-0 transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
              alt="Education" 
              className="w-full h-auto"
            />
          </div>
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10 animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/30 rounded-full blur-3xl -z-10 animate-bounce" style={{ animationDuration: '5s' }} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;