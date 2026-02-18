
import React, { useState } from 'react';
import { Course } from '../types';
import { ChevronLeft, PlayCircle, CheckCircle, Lock, BookOpen, Share2, Heart } from 'lucide-react';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ course, onBack }) => {
  const [activeLesson, setActiveLesson] = useState(0);

  const lessons = [
    { title: 'Introduction to the Course', duration: '05:20', completed: true },
    { title: 'Setting Up Your Environment', duration: '12:45', completed: true },
    { title: 'Foundational Principles', duration: '22:10', completed: false },
    { title: 'Practical Project: Phase 1', duration: '45:30', completed: false },
    { title: 'Advanced Techniques', duration: '33:15', completed: false },
    { title: 'Course Conclusion', duration: '10:00', completed: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-primary font-medium mb-8 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group">
            <img 
              src={`https://picsum.photos/seed/${course.id}/1200/800`} 
              className="w-full h-full object-cover opacity-60" 
              alt="Course Video Placeholder" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                <PlayCircle className="w-10 h-10 ml-1" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <div className="flex gap-2">
                <button className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6 overflow-x-auto scrollbar-hide">
              <button className="text-primary font-bold border-b-2 border-primary pb-2 whitespace-nowrap">Overview</button>
              <button className="text-slate-500 font-medium hover:text-slate-900 dark:hover:text-slate-100 pb-2 whitespace-nowrap">Curriculum</button>
              <button className="text-slate-500 font-medium hover:text-slate-900 dark:hover:text-slate-100 pb-2 whitespace-nowrap">Reviews</button>
              <button className="text-slate-500 font-medium hover:text-slate-900 dark:hover:text-slate-100 pb-2 whitespace-nowrap">Resources</button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Course Resource Bundle Available</h4>
                  <p className="text-xs text-slate-500">Download lesson notes, assets, and project files below.</p>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {course.description} This course is designed to take you from a complete beginner to an expert in the field. 
                  We cover everything you need to know, from basic concepts to advanced practical applications.
                </p>
                <h3 className="text-xl font-bold mt-8 mb-4">What you'll learn:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Core principles and theory',
                    'Hands-on practical projects',
                    'Best practices and common pitfalls',
                    'Advanced optimization techniques',
                    'Industry standard tools',
                    'Real-world case studies'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Checklist */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Course Progress</h3>
              <span className="text-primary font-bold">33%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-8">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '33%' }}></div>
            </div>

            <div className="space-y-2">
              {lessons.map((lesson, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveLesson(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                    activeLesson === idx 
                    ? 'bg-white dark:bg-slate-800 shadow-md ring-1 ring-slate-100 dark:ring-slate-700' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    lesson.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {lesson.completed ? <CheckCircle className="w-5 h-5" /> : (idx > 2 ? <Lock className="w-4 h-4" /> : idx + 1)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className={`text-sm font-bold truncate ${activeLesson === idx ? 'text-primary' : ''}`}>
                      {lesson.title}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">{lesson.duration}</span>
                  </div>
                  {activeLesson === idx && (
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20">
            <h4 className="font-bold mb-2">Need help?</h4>
            <p className="text-sm text-primary-foreground/80 mb-6">Our instructors are available 24/7 for premium support.</p>
            <button className="w-full bg-white text-primary font-bold py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors">
              Join Discord Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
