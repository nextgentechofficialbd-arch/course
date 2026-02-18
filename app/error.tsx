
'use client';

import React, { useEffect } from 'react';
import { RefreshCcw, Mail, MessageCircle } from 'lucide-react';
import { SOCIAL } from '@/lib/constants';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-foreground">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-8">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <RefreshCcw className="w-10 h-10 animate-spin-slow" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-black leading-tight">Something went wrong!</h1>
          <p className="text-slate-500 font-medium">Our platform encountered an unexpected glitch. Don't worry, your course progress is safely synced.</p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => reset()}
            className="bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            Try Refreshing
          </button>
          <div className="grid grid-cols-2 gap-4">
            <a 
              href={`https://wa.me/${SOCIAL.WHATSAPP}`}
              target="_blank"
              className="flex items-center justify-center gap-2 p-4 bg-green-500/10 text-green-600 rounded-2xl font-bold text-sm hover:bg-green-500 hover:text-white transition-all"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
            <a 
              href="mailto:support@eduagency.io" 
              className="flex items-center justify-center gap-2 p-4 bg-muted text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
            >
              <Mail size={18} />
              Email
            </a>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
           <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
             Ref: {error.digest || 'Unknown System Mismatch'}
           </p>
        </div>
      </div>
    </div>
  );
}
