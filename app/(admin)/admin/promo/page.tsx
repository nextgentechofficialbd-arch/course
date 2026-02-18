
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Tag, Plus, Check, X, Calendar } from 'lucide-react';

export default async function PromoCodesPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: codes } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Promo Codes</h1>
          <p className="text-slate-500">Manage discounts and seasonal offers.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
          <Plus className="w-4 h-4" />
          Create New Code
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {codes?.map((promo) => (
          <div key={promo.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 ${promo.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black dark:text-white tracking-widest">{promo.code}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{promo.discount_percent}% OFF</p>
                </div>
              </div>
              <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${promo.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {promo.is_active ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Usage</span>
                <span className="font-black dark:text-white">{promo.used_count} / {promo.max_uses}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-primary transition-all" 
                   style={{ width: `${(promo.used_count / promo.max_uses) * 100}%` }}
                 />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                Expires: {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : 'Never'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
