
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Search, Filter, Eye, CheckCircle2, XCircle } from 'lucide-react';

export default async function EnrollmentsPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, profiles(full_name, email, phone), courses(title)')
    .order('enrolled_at', { ascending: false });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Payment Requests</h1>
          <p className="text-slate-500">Verify and confirm student enrollments here.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search TXID or Email..." 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
          <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-500 hover:text-primary transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Program</th>
                <th className="px-8 py-4">TXID</th>
                <th className="px-8 py-4">Method</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {enrollments?.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-bold text-sm">{(e.profiles as any)?.full_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{(e.profiles as any)?.phone}</div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">{(e.courses as any)?.title}</td>
                  <td className="px-8 py-5 text-sm font-mono text-slate-500 uppercase">{e.transaction_id}</td>
                  <td className="px-8 py-5 text-xs font-black uppercase text-primary">{e.payment_method}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      e.payment_status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      e.payment_status === 'pending' ? 'bg-orange-100 text-orange-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {e.payment_status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="View Proof">
                        <Eye className="w-5 h-5" />
                      </button>
                      {e.payment_status === 'pending' && (
                        <>
                          <button className="p-2 text-slate-400 hover:text-green-500 transition-colors" title="Confirm">
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Reject">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
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
