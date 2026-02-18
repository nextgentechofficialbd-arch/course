
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { 
  ShieldAlert, 
  Globe, 
  User, 
  Clock, 
  Search, 
  Ban,
  MoreVertical,
  Activity
} from 'lucide-react';

export default async function SecurityLogsPage() {
  const supabase = createClient();

  // Fetch recent logs with user profiles
  const { data: logs } = await supabase
    .from('ip_logs')
    .select('*, profiles(email, full_name)')
    .order('visited_at', { ascending: false })
    .limit(200);

  // Fetch blocked IPs
  const { data: blocked } = await supabase
    .from('blocked_ips')
    .select('*')
    .order('blocked_at', { ascending: false });

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white flex items-center gap-3">
            <ShieldAlert className="text-red-500" />
            Security & IP Intelligence
          </h1>
          <p className="text-slate-500 font-medium">Monitor traffic patterns and protect your platform from unauthorized access.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-border flex items-center justify-between">
               <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
                 <Activity size={20} className="text-primary" />
                 Recent Access Logs
               </h3>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Stream</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <th className="px-8 py-4">IP Address</th>
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Path</th>
                    <th className="px-8 py-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs?.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-foreground">{log.ip_address}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px] font-medium uppercase tracking-tight">{log.user_agent}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <User size={14} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{(log.profiles as any)?.full_name || 'Guest'}</p>
                            <p className="text-[10px] text-slate-500">{(log.profiles as any)?.email || 'Unauthenticated'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                          /{log.page_visited}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {new Date(log.visited_at).toLocaleTimeString()}
                        </div>
                        <div className="text-[9px] text-slate-500">
                           {new Date(log.visited_at).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 space-y-8">
          <div className="bg-red-500 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-red-500/20 relative overflow-hidden group">
            <Ban className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-black mb-2">Access Control</h4>
            <p className="text-red-100 text-xs font-medium leading-relaxed mb-6">
              Identified malicious activity or VPN usage? Block the specific IP address permanently to secure your content.
            </p>
            <div className="space-y-4">
              <input 
                placeholder="Enter IP (e.g. 103.114...)" 
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm font-bold placeholder:text-red-200 focus:bg-white/20 outline-none transition-all"
              />
              <button className="w-full bg-white text-red-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">
                Blacklist IP
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 flex flex-col">
             <h3 className="text-lg font-black dark:text-white mb-6 flex items-center gap-2">
               <Ban size={20} className="text-red-500" />
               Blocked Addresses
             </h3>
             <div className="space-y-3">
               {blocked?.map((b) => (
                 <div key={b.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border group">
                   <div className="flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-red-500" />
                     <div>
                       <p className="text-xs font-black font-mono tracking-widest">{b.ip_address}</p>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{new Date(b.blocked_at).toLocaleDateString()}</p>
                     </div>
                   </div>
                   <button className="text-slate-400 hover:text-primary p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <MoreVertical size={16} />
                   </button>
                 </div>
               ))}
               {(!blocked || blocked.length === 0) && (
                 <p className="text-center py-10 text-xs font-bold text-slate-400 italic uppercase tracking-widest">No blocked IPs</p>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
