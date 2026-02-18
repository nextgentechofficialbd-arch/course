
import React from 'react';

interface ProgressBarProps {
  completedCount: number;
  totalCount: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completedCount, totalCount }) => {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const getMessage = (p: number) => {
    if (p === 0) return "Let's get started! 🚀";
    if (p < 25) return "Great start! Keep going. 💪";
    if (p < 50) return "You're making solid progress! 📈";
    if (p < 75) return "Almost at the finish line! 🏁";
    if (p < 100) return "So close! Just a bit more. ✨";
    return "Course Completed! Well done! 🎉";
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Progress</p>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{completedCount} of {totalCount} Lessons</p>
        </div>
        <span className="text-xl font-black text-primary italic">{percent}%</span>
      </div>
      
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
          style={{ width: `${percent}%` }}
        />
      </div>
      
      <p className="text-[10px] font-bold text-primary/70 italic text-center">
        {getMessage(percent)}
      </p>
    </div>
  );
};

export default ProgressBar;
