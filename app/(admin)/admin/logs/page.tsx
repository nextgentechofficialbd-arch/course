
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Shield, Globe, Clock, Search, ShieldAlert } from 'lucide-react';

export default async function IpLogsPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: logs } = await supabase
    .from('ip_logs')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Security Logs</h1>
          <p className="text-slate-500">Monitor access attempts and suspicious IP activity.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search IP or Email..." 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">IP Address</th>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Page</th>
                <th className="px-8 py-4">Date / Time</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs?.map((log) => {
                const isBD = log.ip_address.startsWith('103.') || log.ip_address.startsWith('202.');
                return (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-5">
                      {isBD ? (
                        <span className="flex items-center gap-2 text-xs font-bold text-green-600">
                          <Globe className="w-3.5 h-3.5" /> BD
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <Shield className="w-3.5 h-3.5" /> Global
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-mono text-xs font-bold">{log.ip_address}</div>
                      <div className="text-[10px] text-slate-400 max-w-[200px] truncate">{log.user_agent}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold">{(log.profiles as any)?.full_name || 'Guest'}</div>
                      <div className="text-[10px] text-slate-400">{(log.profiles as any)?.email || 'Anonymous'}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg truncate inline-block max-w-[150px]">
                        {log.page_visited}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-medium">{new Date(log.created_at).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-xl transition-all" title="Block IP">
                        <ShieldAlert className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
