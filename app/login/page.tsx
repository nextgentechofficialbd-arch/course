'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFields) => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      router.push(redirectPath);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-border">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black mb-2">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Sign in to your student account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-2xl text-red-600 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  {...register('email')}
                  type="email" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary text-sm" 
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  {...register('password')}
                  type="password" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary text-sm" 
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20}/></>}
          </button>
        </form>
      </div>
    </div>
  );
}