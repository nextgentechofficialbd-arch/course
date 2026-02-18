
"use client";

import React from 'react';
import LessonSidebar from './LessonSidebar';
import VideoPlayer from './VideoPlayer';
import ProgressBar from './ProgressBar';
import { Course } from '@/types';

interface CoursePlayerLayoutProps {
  course: any;
  lessons: any[];
  completedLessonIds: string[];
  activeLesson: any;
}

const CoursePlayerLayout: React.FC<CoursePlayerLayoutProps> = ({ 
  course, 
  lessons, 
  completedLessonIds, 
  activeLesson 
}) => {
  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black italic">E</div>
            <span className="font-black dark:text-white truncate">{course.title}</span>
          </div>
          <ProgressBar 
            completedCount={completedLessonIds.length} 
            totalCount={lessons.length} 
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <LessonSidebar 
            lessons={lessons} 
            completedLessonIds={completedLessonIds} 
            activeLessonId={activeLesson?.id}
            courseSlug={course.slug}
          />
        </div>
      </aside>

      {/* Main Player Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="bg-slate-950 aspect-video lg:aspect-auto lg:h-[70vh] relative group">
          {activeLesson ? (
            <VideoPlayer 
              fileId={activeLesson.google_drive_file_id} 
              lessonId={activeLesson.id}
              courseId={course.id}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Select a lesson to start learning
            </div>
          )}
        </div>

        <div className="p-8 lg:p-12 max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-black mb-2 dark:text-white">
                {activeLesson?.title || "Lesson Title"}
              </h1>
              <p className="text-slate-500 font-medium">Module 0{activeLesson?.order_index || 1} • {activeLesson?.duration_minutes} Minutes</p>
            </div>
            <button className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-black hover:bg-primary hover:text-white transition-all">
              Mark as Complete
            </button>
          </div>
          
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
            <p>Ready to level up? Follow along with the video and use the resources provided in the module description.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePlayerLayout;
