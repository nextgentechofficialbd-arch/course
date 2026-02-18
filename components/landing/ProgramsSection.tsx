

import React from 'react';
import Link from 'next/link';
import ProgramCard from './ProgramCard';
import { Course } from '@/types';

interface ProgramsSectionProps {
  courses?: Course[];
}

const ProgramsSection: React.FC<ProgramsSectionProps> = ({ courses = [] }) => {
  return (
    <section id="programs" className="py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4">
              Curated Curriculum
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-[0.9]">
              Our Programs <br />
              <span className="font-bengali text-muted-foreground text-3xl md:text-5xl">আমাদের প্রোগ্রামসমূহ</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Industry-standard training designed to take you from beginner to professional in weeks, not years.
            </p>
          </div>
          <Link href="/programs" className="text-primary font-black flex items-center gap-2 hover:translate-x-1 transition-transform group">
            View All Programs
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              →
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length > 0 ? (
            courses.map((course) => (
              <ProgramCard key={course.id} course={course} />
            ))
          ) : (
            // Skeleton State
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-background rounded-[2rem] h-[450px] animate-pulse border border-border" />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;