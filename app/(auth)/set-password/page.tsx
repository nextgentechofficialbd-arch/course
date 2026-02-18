
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordData = z.infer<typeof passwordSchema>;

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const email = searchParams.get('email');
  const course = searchParams.get('course');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordData) => {
    try {
      // In a real flow, you'd use supabase.auth.updateUser or a custom invite flow
      const { error } = await supabase.auth.updateUser({ password: data.password });
      if (error) throw error;
      router.push(`/course/${course}`);
    } catch (err: any) {
      alert(err.message || "Failed to set password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-primary/5">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black mb-2 dark:text-white">Secure Your Account</h1>
          <p className="text-slate-500 font-medium">Set a password for <span className="text-primary font-bold">{email}</span> to access your course.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Password</label>
              <input 
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 px-5 outline-none focus:border-primary transition-all text-sm"
              />
              {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm Password</label>
              <input 
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 px-5 outline-none focus:border-primary transition-all text-sm"
              />
              {errors.confirmPassword && <p className="text-[10px] text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Set Password & Start Learning'}
            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
