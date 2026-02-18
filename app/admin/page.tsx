import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { 
  Users, 
  DollarSign, 
  Clock, 
  BookOpen, 
  TrendingUp,
  Tag,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [
    { count: studentCount },
    { data: revenueData },
    { count: pendingCount },
    { count: courseCount },
    { data: recentEnrollments }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('enrollments').select('amount_paid').eq('payment_status', 'confirmed'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('payment_status', 'pending'),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('enrollments').select('*, profiles(full_name, email), courses(title)').order('enrolled_at', { ascending: false }).limit(6)
  ]);

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0) || 0;

  const stats = [
    { label: 'Total Students', value: studentCount?.toLocaleString() || '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pending Requests', value: pendingCount?.toString() || '0', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Active Programs', value: courseCount?.toString() || '0', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 font-medium">Platform overview and performance metrics.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black dark:text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-black dark:text-white">Recent Activity</h3>
              <Link href="/admin/enrollments" className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Manage All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <th className="px-8 py-4">Student</th>
                    <th className="px-8 py-4">Course</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentEnrollments?.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-sm">{(e.profiles as any)?.full_name || 'Student'}</div>
                        <div className="text-[10px] text-slate-400">{(e.profiles as any)?.email}</div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium">{(e.courses as any)?.title}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          e.payment_status === 'confirmed' ? 'bg-green-100 text-green-600' :
                          e.payment_status === 'pending' ? 'bg-orange-100 text-orange-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {e.payment_status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-xs text-slate-400 font-medium">
                        {new Date(e.enrolled_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
            <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
            <h4 className="text-xl font-black mb-4">Quick Insights</h4>
            <p className="text-white/80 text-sm font-medium mb-8 leading-relaxed">
              Verify pending requests promptly to maintain high student satisfaction scores.
            </p>
            <Link href="/admin/enrollments" className="inline-block bg-white text-primary px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest">
              Review Pending
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}