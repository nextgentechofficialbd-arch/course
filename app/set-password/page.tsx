'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');
  const course = searchParams.get('course');

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
        router.push(`/course/${course}`);
      } else {
        setError(result.message || 'Failed to set password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-border">
        <h1 className="text-3xl font-black mb-6 text-center">Set Your Password</h1>
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center font-bold">{error}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500">New Password</label>
              <input {...register('password')} type="password" placeholder="Min 8 characters" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-6 text-sm" />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Confirm Password</label>
              <input {...register('confirmPassword')} type="password" placeholder="Repeat password" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-6 text-sm" />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-lg disabled:opacity-50">
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Secure Account'}
          </button>
        </form>
      </div>
    </div>
  );
}