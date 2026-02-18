
'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  Tag, 
  Trash2, 
  Loader2, 
  X, 
  RefreshCw,
  Calendar,
  CheckCircle2,
  XCircle,
  Copy
} from 'lucide-react';

export default function PromoCodesPage() {
  const supabase = createClient();
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discount_percent: 10,
    max_uses: 100,
    expires_at: '',
    is_active: true
  });

  const fetchCodes = async () => {
    setLoading(true);
    const { data } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    setCodes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData(prev => ({ ...prev, code }));
  };

  const handleToggle = async (id: string, current: boolean) => {
    await supabase.from('promo_codes').update({ is_active: !current }).eq('id', id);
    fetchCodes();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('promo_codes').insert([
        { ...formData, code: formData.code.toUpperCase() }
      ]);
      if (error) throw error;
      setIsModalOpen(false);
      fetchCodes();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete code?")) return;
    await supabase.from('promo_codes').delete().eq('id', id);
    fetchCodes();
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Marketing & Promos</h1>
          <p className="text-slate-500 font-medium">Manage discount codes and conversion incentives.</p>
        </div>
        <button 
          onClick={() => { setIsModalOpen(true); generateRandomCode(); }}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={20} />
          Create Code
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && codes.length === 0 ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 h-64 rounded-[2.5rem] animate-pulse border border-border" />
          ))
        ) : (
          codes.map((promo) => (
            <div key={promo.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-6 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Tag size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black dark:text-white tracking-widest">{promo.code}</h3>
                    <p className="text-xs font-black text-primary uppercase tracking-widest">{promo.discount_percent}% Discount</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle(promo.id, promo.is_active)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${promo.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                >
                  {promo.is_active ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase tracking-widest">Usage</span>
                  <span className="dark:text-white">{promo.used_count} / {promo.max_uses}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-primary transition-all duration-1000" 
                     style={{ width: `${(promo.used_count / promo.max_uses) * 100}%` }}
                   />
                </div>
                <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Calendar size={14} /> {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : 'Never'}</div>
                  <button 
                    onClick={() => handleDelete(promo.id)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {codes.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-muted/20 border-2 border-dashed border-border rounded-[3rem]">
            <p className="text-xl font-black text-slate-400 italic">No Promos Active</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-primary transition-all">
              <X size={24} />
            </button>

            <h3 className="text-2xl font-black mb-8 dark:text-white">Create Promo Code</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Promo Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      required 
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="e.g. SAVE50" 
                      className="w-full bg-muted/30 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary text-sm font-black tracking-widest uppercase" 
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={generateRandomCode}
                    className="p-4 bg-muted border border-border rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1 ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Discount Percent</label>
                  <span className="text-xs font-black text-primary">{formData.discount_percent}%</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="100"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_percent: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Max Redemptions</label>
                  <input 
                    required 
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_uses: parseInt(e.target.value) }))}
                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-black" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Expires At</label>
                  <input 
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm font-bold" 
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Generate Code'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-2 border-border py-5 rounded-2xl font-black text-lg hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
