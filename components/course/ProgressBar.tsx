
'use client';

import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const getStatus = (p: number) => {
    if (p === 0) return { en: "Let's Go! 🚀", bn: "শুরু করুন!" };
    if (p < 25) return { en: "Great start! 💪", bn: "দারুণ চলছে!" };
    if (p < 50) return { en: "Making progress 🔥", bn: "এগিয়ে চলেছেন!" };
    if (p < 75) return { en: "Almost there! ⚡", bn: "প্রায় শেষ!" };
    if (p < 100) return { en: "So close! ✨", bn: "আর সামান্য!" };
    return { en: "Congratulations! 🎉", bn: "অভিনন্দন!" };
  };

  const status = getStatus(percent);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Your Progress</p>
          <div className="flex items-baseline gap-2">
             <span className="text-3xl font-black text-foreground">{percent}%</span>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{completed}/{total} Complete</span>
          </div>
        </div>
        <div className="text-right pb-1">
          <p className="text-xs font-black text-primary uppercase tracking-widest mb-1 animate-pulse">{status.en}</p>
          <p className="font-bengali text-[10px] text-slate-400 font-bold">{status.bn}</p>
        </div>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
