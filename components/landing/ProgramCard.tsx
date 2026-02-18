
import React from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { Clock, Users, ArrowRight } from 'lucide-react';

interface ProgramCardProps {
  course: Course;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ course }) => {
  const initials = course.title.charAt(0);
  
  return (
    <div className="group bg-card rounded-[2.5rem] overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden m-4 rounded-[1.5rem] bg-muted">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary text-6xl font-black italic">
            {initials}
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-background/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border border-border/50">
            {course.category || 'Professional'}
          </span>
        </div>
      </div>

      <div className="p-8 pt-2 flex flex-col flex-grow">
        <h3 className="text-2xl font-black mb-3 text-foreground group-hover:text-primary transition-colors leading-tight">
          {course.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-8 font-medium">
          {course.short_description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-border">
          <div>
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Tuition Fee</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-primary">৳{course.price.toLocaleString()}</span>
              {/* If we had original price logic here */}
            </div>
          </div>
          
          <Link 
            href={`/programs/${course.slug}`}
            className="bg-muted group-hover:bg-primary p-3 rounded-2xl transition-all"
          >
            <ArrowRight className="w-6 h-6 text-foreground group-hover:text-primary-foreground transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
