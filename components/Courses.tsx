
'use client';

import React, { useState } from 'react';
import { Route, Course } from '../types';
import { Search, BookOpen, Star, Clock } from 'lucide-react';
import Link from 'next/link';

interface CoursesProps {
  courses: Course[];
  onNavigate?: (route: Route, params?: any) => void;
}

const Courses: React.FC<CoursesProps> = ({ courses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (course.short_description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-grow relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search for courses..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category!)}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === category 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.map(course => (
            <Link 
              key={course.id}
              href={`/programs/${course.slug}`}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 group cursor-pointer hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col h-full"
            >
              <div className="relative aspect-[16/10] overflow-hidden m-4 rounded-[1.5rem] bg-muted">
                {course.thumbnail_url ? (
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: course.thumbnail_url.includes('linear-gradient') ? course.thumbnail_url : `url(${course.thumbnail_url})` }}
                  />
                ) : (
                   <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                      <BookOpen size={40} className="text-primary/40" />
                   </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-white/20">
                    {course.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 pt-0 flex flex-col flex-grow">
                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-black">{course.rating || '4.9'}</span>
                </div>
                
                <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors leading-tight">
                  {course.title}
                </h3>
                
                <p className="text-slate-500 text-sm line-clamp-2 mb-8 font-medium">
                  {course.short_description}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Fee</p>
                    <p className="text-2xl font-black text-primary">৳{course.price.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-muted group-hover:bg-primary rounded-2xl flex items-center justify-center transition-all">
                     <Clock className="w-5 h-5 text-slate-400 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black mb-2">No matching programs</h3>
          <p className="text-slate-500 font-medium">Try adjusting your filters or search keywords.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
