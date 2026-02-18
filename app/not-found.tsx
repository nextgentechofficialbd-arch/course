
import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative inline-block">
          <span className="text-[12rem] font-black leading-none text-slate-100 dark:text-slate-900">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-white font-black text-4xl italic rotate-12 shadow-2xl shadow-primary/40">E</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black dark:text-white">Page Not Found</h1>
          <p className="text-slate-500 font-medium">The classroom you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            href="/" 
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="border-2 border-slate-200 dark:border-slate-800 px-8 py-4 rounded-2xl font-black dark:text-white flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
