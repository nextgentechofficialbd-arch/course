
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { 
  Users, 
  DollarSign, 
  Clock, 
  BookOpen, 
  ArrowUpRight 
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies });

  // Mock stats - in real app fetch from DB
  const stats = [
    { label: 'Total Students', value: '1,248', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Revenue', value: '৳4,52,000', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pending Payments', value: '12', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Active Courses', value: '8', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const { data: recentEnrollments } = await supabase
    .from('enrollments')
    .select('*, profiles(full_name, email), courses(title)')
    .order('enrolled_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black dark:text-white">System Overview</h1>
        <p className="text-slate-500">Real-time performance of your EdTech agency.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black dark:text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-black dark:text-white">Recent Enrollments</h3>
          <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Program</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentEnrollments?.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-bold text-sm">{(enrollment.profiles as any)?.full_name}</div>
                    <div className="text-xs text-slate-400">{(enrollment.profiles as any)?.email}</div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">{(enrollment.courses as any)?.title}</td>
                  <td className="px-8 py-5 text-sm font-black">৳{enrollment.amount_paid}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      enrollment.payment_status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      enrollment.payment_status === 'pending' ? 'bg-orange-100 text-orange-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {enrollment.payment_status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
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
