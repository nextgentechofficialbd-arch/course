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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-border shadow-sm">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-bold text-lg">Recent Enrollments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentEnrollments?.map((e: any) => (
                <tr key={e.id} className="text-sm">
                  <td className="px-6 py-4">
                    <div className="font-bold">{e.profiles?.full_name}</div>
                    <div className="text-xs text-slate-400">{e.profiles?.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{e.courses?.title}</td>
                  <td className="px-6 py-4 uppercase text-[10px] font-black">{e.payment_status}</td>
                  <td className="px-6 py-4 text-slate-400">
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