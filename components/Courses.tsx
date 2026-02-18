
import React, { useState } from 'react';
import { Route, Course } from '../types';
import { MOCK_COURSES } from '../constants';
import { Search, Filter, BookOpen, Star, Clock } from 'lucide-react';

interface CoursesProps {
  onNavigate: (route: Route, params?: any) => void;
}

const Courses: React.FC<CoursesProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Programming', 'Business', 'Design', 'Marketing'];

  const filteredCourses = MOCK_COURSES.filter(course => {
    // Changed description to short_description to fix TS error
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Explore Our Courses</h1>
        <p className="text-slate-600 dark:text-slate-400">Discover your next passion or skill today.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search for courses..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <div 
              key={course.id}
              onClick={() => onNavigate('course-view', { course })}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 group cursor-pointer hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col h-full"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={course.thumbnail_url} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {course.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-950/70 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>12h 45m</span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">{course.rating}</span>
                  <span className="text-slate-400 text-xs font-normal">(1.2k reviews)</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {course.title}
                </h3>
                {course.bengali_title && (
                  <p className="font-bengali text-sm text-slate-500 mb-2 font-medium">{course.bengali_title}</p>
                )}
                
                {/* Changed description to short_description to fix TS error */}
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6">
                  {course.short_description}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                    <span className="text-xs font-medium text-slate-500">By Admin</span>
                  </div>
                  <div className="text-xl font-black text-primary">
                    ${course.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No courses found</h3>
          <p className="text-slate-500">Try adjusting your search or category filters.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
