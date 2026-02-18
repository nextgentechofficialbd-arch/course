
"use client";

import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

interface VideoPlayerProps {
  fileId: string;
  lessonId: string;
  courseId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ fileId, lessonId, courseId }) => {
  const [isReady, setIsReady] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => setIsReady(true), 500);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I, PrintScreen
      if (
        e.key === 'F12' || 
        (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'i')) ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fileId]);

  return (
    <div 
      className="relative w-full h-full bg-black select-none overflow-hidden" 
      onContextMenu={(e) => {
        e.preventDefault();
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }}
    >
      {isReady ? (
        <>
          <iframe
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            className="w-full h-full border-0 pointer-events-auto"
            allow="autoplay"
            loading="lazy"
          />
          {/* Transparent Overlay to absorb mouse clicks near UI elements */}
          <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'rgba(0,0,0,0.01)' }} />
          
          {/* Content Protection Toast */}
          {showWarning && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-slate-900/90 text-white px-6 py-4 rounded-2xl flex items-center gap-3 border border-primary/30 backdrop-blur-md animate-in fade-in zoom-in duration-300">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold">Content is protected. Recording/Saving is disabled.</span>
            </div>
          )}

          <div className="absolute top-4 left-4 z-20 opacity-40 pointer-events-none flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-white font-black uppercase tracking-widest bg-black/50 px-2 py-1 rounded">Secure Stream</span>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
