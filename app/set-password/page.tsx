'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';

const setupSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SetupFormValues = z.infer<typeof setupSchema>;

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const token = searchParams.get('token');
  const course = searchParams.get('course');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema)
  });

  const onSubmit = async (data: SetupFormValues) => {
    if (!token) {
      setServerError("Invalid or missing access token.");
      return;
    }

    setServerError(null);
    try {
      const res = await fetch('/api/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password })
      });

      const result = await res.json();
      if (res.ok) {
        router.push(`/course/${course}`);
      } else {
        setServerError(result.message || 'Failed to set password');
      }
    } catch (err) {
      setServerError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-border">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
             <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black mb-2">Secure Your Account</h1>
          <p className="text-slate-500 text-sm">Set a password to access your curriculum</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100">
            {serverError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">New Password</label>
              <input 
                {...register('password')} 
                type="password" 
                placeholder="Min 8 characters" 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-primary" 
              />
              {errors.password && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.password.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Confirm Password</label>
              <input 
                {...register('confirmPassword')} 
                type="password" 
                placeholder="Repeat your password" 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-primary" 
              />
              {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm & Access Course'}
          </button>
        </form>
      </div>
    </div>
  );
}