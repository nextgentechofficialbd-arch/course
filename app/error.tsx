
"use client";

import React from 'react';
import { RefreshCcw, Mail } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-8">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <RefreshCcw className="w-10 h-10 animate-spin-slow" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-black dark:text-white">Something went wrong!</h1>
          <p className="text-slate-500 font-medium">Our platform encountered an unexpected error. Don't worry, your progress is safe.</p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => reset()}
            className="bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            Try Refreshing
          </button>
          <a 
            href="mailto:support@eduagency.io" 
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-primary font-bold transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Technical Support
          </a>
        </div>
        
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
           <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Error Digest: {error.digest || 'Internal System Error'}</p>
        </div>
      </div>
    </div>
  );
}
