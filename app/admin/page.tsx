import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Users, DollarSign, Clock, BookOpen } from 'lucide-react';

export default async function AdminDashboard() {
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
    supabase.from('enrollments')
      .select('*, profiles(full_name, email), courses(title)')
      .order('enrolled_at', { ascending: false })
      .limit(10)
  ]);

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0) || 0;

  const stats = [
    { label: 'Total Students', value: studentCount || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
    { label: 'Pending Requests', value: pendingCount || 0, icon: Clock, color: 'text-orange-500' },
    { label: 'Active Programs', value: courseCount || 0, icon: BookOpen, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black">Admin Overview</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-muted`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border">
          <h3 className="text-xl font-black">Recent Enrollments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Course</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentEnrollments?.map((e: any) => (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-bold text-sm">{e.profiles?.full_name || 'Anonymous'}</div>
                    <div className="text-[10px] text-slate-400">{e.profiles?.email}</div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">{e.courses?.title}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-muted">
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
  );
}