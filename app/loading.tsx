
import React from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { AGENCY_NAME } from '@/lib/constants';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">
            E
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-xl font-black tracking-tight text-foreground">{AGENCY_NAME}</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 animate-pulse">Syncing Classroom Data</p>
      </div>
    </div>
  );
}
