
'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { AGENCY_NAME } from '@/lib/constants';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');
  const course = searchParams.get('course');
  const email = searchParams.get('email');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const res = await fetch('/api/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password })
      });

      const result = await res.json();
      if (res.ok) {
        router.push(result.redirect || `/course/${course}`);
      } else {
        setError(result.message || 'Failed to set password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl text-white font-black italic text-3xl mb-6 shadow-xl shadow-primary/20">
            E
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-3">Welcome to {AGENCY_NAME}!</h1>
          <p className="text-slate-500 font-medium">Set a password for <span className="text-primary font-bold">{email}</span> to secure your account and access your curriculum.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-2xl text-red-600 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 characters" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm Password</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat password" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                  />
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Secure Account & Start Learning
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-slate-500 text-xs font-medium">
          Protected by AES-256 encryption. <br />
          By setting a password, you agree to our <span className="text-primary font-bold hover:underline cursor-pointer">Terms of Service</span>.
        </p>
      </div>
    </div>
  );
}
