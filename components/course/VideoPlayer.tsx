
'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Loader2, Lock } from 'lucide-react';

interface VideoPlayerProps {
  fileId: string;
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function VideoPlayer({ fileId, lessonId, courseId, isCompleted, onComplete }: VideoPlayerProps) {
  const [marking, setMarking] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleMarkComplete = async () => {
    setMarking(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: lessonId, course_id: courseId })
      });
      if (res.ok) {
        onComplete();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col group/player">
      <div 
        className="relative flex-1 bg-black overflow-hidden select-none"
        onContextMenu={(e) => {
          e.preventDefault();
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }}
      >
        <iframe
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          className="w-full h-full border-0"
          allow="autoplay"
          title="Video Player"
        />
        
        {/* Transparent UI Shield */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Security Warning */}
        {showToast && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-slate-900/95 text-white px-8 py-4 rounded-3xl flex items-center gap-4 border border-primary/40 backdrop-blur-xl animate-in fade-in zoom-in duration-300 shadow-2xl">
            <Lock className="w-6 h-6 text-primary" />
            <span className="text-sm font-black uppercase tracking-widest">Protected Content</span>
          </div>
        )}

        {/* Branding Overlay */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 opacity-30 pointer-events-none group-hover/player:opacity-60 transition-opacity">
           <ShieldCheck className="w-4 h-4 text-primary" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Secure Encrypted Stream</span>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 z-20">
        {isCompleted ? (
          <div className="bg-green-500 text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-green-500/20">
            <CheckCircle2 size={20} />
            Completed
          </div>
        ) : (
          <button 
            onClick={handleMarkComplete}
            disabled={marking}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.05] transition-all disabled:opacity-50"
          >
            {marking ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            Mark as Complete
          </button>
        )}
      </div>
    </div>
  );
}
