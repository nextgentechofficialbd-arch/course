
'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (authError) throw authError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-2xl mb-6">
              <Mail size={28} />
            </div>
            <h1 className="text-3xl font-black text-foreground mb-3">Forgot Password</h1>
            <p className="text-slate-500 font-medium">No worries! Enter your student email and we'll send you a link to reset your password.</p>
          </div>

          {success ? (
            <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
              <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-3xl border border-green-100 dark:border-green-900 mb-8">
                <p className="text-green-600 font-bold text-sm">Check your inbox! We've sent a password reset link to <span className="underline">{email}</span>.</p>
              </div>
              <Link href="/login" className="text-primary font-black flex items-center justify-center gap-2 hover:underline">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-2xl text-red-600 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Student Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Send Reset Link <Send size={18} /></>}
              </button>

              <div className="text-center">
                <Link href="/login" className="text-slate-400 font-bold text-sm hover:text-foreground transition-colors flex items-center justify-center gap-2">
                   <ArrowLeft size={16} /> Nevermind, I remember
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
