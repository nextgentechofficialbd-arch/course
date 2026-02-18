
"use client";

import Auth from '@/components/Auth';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      <Auth onAuthSuccess={() => router.push('/')} />
    </div>
  );
}
