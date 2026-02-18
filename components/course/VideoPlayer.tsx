
"use client";

import React, { useEffect, useState } from 'react';

interface VideoPlayerProps {
  fileId: string;
  lessonId: string;
  courseId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ fileId, lessonId, courseId }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => setIsReady(true), 500);
    
    // Logic for auto-progress tracking could go here
    // e.g. send update to /api/progress after a threshold
    
    return () => clearTimeout(timer);
  }, [fileId]);

  return (
    <div className="relative w-full h-full bg-black select-none" onContextMenu={(e) => e.preventDefault()}>
      {isReady ? (
        <>
          <iframe
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            className="w-full h-full border-0"
            allow="autoplay"
            loading="lazy"
          />
          {/* Transparent Overlay to prevent right-click and interaction with GD UI */}
          <div className="absolute inset-0 z-10 pointer-events-none" />
          
          {/* Anti-download floating overlay (Subtle) */}
          <div className="absolute top-4 right-4 z-20 opacity-30 pointer-events-none">
            <span className="text-[10px] text-white font-mono bg-black/50 px-2 py-1 rounded">Protected Content - EduAgency</span>
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
