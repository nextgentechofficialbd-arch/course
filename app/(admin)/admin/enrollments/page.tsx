
'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CreditCard,
  User,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Loader2
} from 'lucide-react';

type Tab = 'all' | 'pending' | 'confirmed' | 'rejected';

export default function EnrollmentsPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Modal states
  const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(null);
  const [rejectingEnrollment, setRejectingEnrollment] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchEnrollments = async () => {
    setLoading(true);
    let query = supabase
      .from('enrollments')
      .select('*, profiles(full_name, email, phone), courses(title)')
      .order('enrolled_at', { ascending: false });

    if (activeTab !== 'all') {
      query = query.eq('payment_status', activeTab);
    }

    if (search) {
      // Very basic search by TXID since RLS/Supabase joins make complex searching harder in one query
      query = query.or(`transaction_id.ilike.%${search}%,payment_number.ilike.%${search}%`);
    }

    const { data } = await query;
    setEnrollments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnrollments();
  }, [activeTab]);

  const handleConfirm = async (id: string) => {
    if (!confirm("Are you sure you want to confirm this payment?")) return;
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollment_id: id })
      });
      if (res.ok) {
        setEnrollments(prev => prev.map(e => e.id === id ? { ...e, payment_status: 'confirmed' } : e));
        alert("Payment confirmed and access email sent!");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to confirm payment");
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingEnrollment || !rejectionReason) return;
    const id = rejectingEnrollment.id;
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/reject-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollment_id: id, reason: rejectionReason })
      });
      if (res.ok) {
        setEnrollments(prev => prev.map(e => e.id === id ? { ...e, payment_status: 'rejected' } : e));
        setRejectingEnrollment(null);
        setRejectionReason('');
        alert("Payment rejected and email sent.");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to reject payment");
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setProcessingId(null);
    }
  };

  const TabButton = ({ type, label }: { type: Tab, label: string }) => {
    const isActive = activeTab === type;
    return (
      <button 
        onClick={() => setActiveTab(type)}
        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
          isActive 
            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Enrollment Requests</h1>
          <p className="text-slate-500 font-medium">Verify payments and manage student access.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-grow min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search TXID or Phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchEnrollments()}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm font-medium" 
            />
          </div>
          <button 
            onClick={fetchEnrollments}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:text-primary"
          >
            <Filter size={18} />
          </button>
        </div>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <TabButton type="all" label="All" />
        <TabButton type="pending" label="Pending" />
        <TabButton type="confirmed" label="Confirmed" />
        <TabButton type="rejected" label="Rejected" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">Loading requests...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-4">Student</th>
                  <th className="px-8 py-4">Program</th>
                  <th className="px-8 py-4">Transaction Details</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {enrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-slate-400">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{(e.profiles as any)?.full_name || 'Anonymous'}</div>
                          <div className="text-[10px] text-slate-400">{(e.profiles as any)?.email}</div>
                          <div className="text-[10px] font-bold text-primary">{(e.profiles as any)?.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-foreground">{(e.courses as any)?.title}</div>
                      <div className="text-[10px] text-slate-500">৳{e.amount_paid.toLocaleString()} • {new Date(e.enrolled_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${e.payment_method === 'bkash' ? 'bg-pink-100 text-pink-600' : 'bg-orange-100 text-orange-600'}`}>
                            {e.payment_method}
                          </span>
                          <span className="text-[11px] font-black tracking-widest uppercase">{e.transaction_id}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">From: {e.payment_number}</div>
                      </div>
                    </td>
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
                        <button 
                          onClick={() => setSelectedEnrollment(e)}
                          className="p-2 text-slate-400 hover:text-primary transition-all" 
                          title="View Proof"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {e.payment_status === 'pending' && (
                          <>
                            <button 
                              disabled={processingId === e.id}
                              onClick={() => handleConfirm(e.id)}
                              className="p-2 text-slate-400 hover:text-green-500 disabled:opacity-30 transition-all" 
                              title="Confirm Payment"
                            >
                              {processingId === e.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                            </button>
                            <button 
                              disabled={processingId === e.id}
                              onClick={() => setRejectingEnrollment(e)}
                              className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-all" 
                              title="Reject Payment"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}

                        <a 
                          href={`https://wa.me/${(e.profiles as any)?.phone}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-green-600"
                          title="WhatsApp Student"
                        >
                          <MessageCircle size={18} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                {enrollments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Proof Modal */}
      {selectedEnrollment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setSelectedEnrollment(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
            >
              <XCircle size={24} />
            </button>
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 bg-black flex items-center justify-center p-4">
                <img 
                  src={selectedEnrollment.payment_screenshot_url} 
                  alt="Proof" 
                  className="max-h-[70vh] w-auto rounded-2xl object-contain shadow-2xl"
                />
              </div>
              <div className="md:w-1/2 p-10 space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Student Details</h4>
                  <p className="text-xl font-black text-foreground">{(selectedEnrollment.profiles as any)?.full_name}</p>
                  <p className="text-sm font-bold text-primary">{(selectedEnrollment.profiles as any)?.email}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Transaction</h4>
                  <div className="bg-muted/50 p-4 rounded-2xl border border-border">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Method: {selectedEnrollment.payment_method}</p>
                    <p className="text-lg font-black tracking-widest uppercase mb-1">{selectedEnrollment.transaction_id}</p>
                    <p className="text-sm font-medium">From: {selectedEnrollment.payment_number}</p>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  {selectedEnrollment.payment_status === 'pending' && (
                    <button 
                      onClick={() => { handleConfirm(selectedEnrollment.id); setSelectedEnrollment(null); }}
                      className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                    >
                      Confirm Now
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedEnrollment(null)}
                    className="flex-1 border-2 border-border py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingEnrollment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl space-y-6 border border-border">
            <h3 className="text-2xl font-black dark:text-white">Reject Request</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Please provide a clear reason for rejecting the enrollment. This will be sent to the student via email.
            </p>
            <div className="space-y-4">
              {[
                "Transaction ID not found in our records.",
                "Payment amount mismatch. Please pay the full amount.",
                "The uploaded screenshot is unclear. Please re-upload.",
                "Incorrect payment method selected."
              ].map((r, i) => (
                <button 
                  key={i}
                  onClick={() => setRejectionReason(r)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs font-bold transition-all ${rejectionReason === r ? 'bg-primary/10 border-primary text-primary shadow-lg' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                >
                  {r}
                </button>
              ))}
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Custom reason..."
                className="w-full bg-muted/30 border border-border rounded-2xl p-4 outline-none focus:border-primary text-sm min-h-[100px]"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleReject}
                disabled={!rejectionReason || processingId === rejectingEnrollment.id}
                className="flex-1 bg-destructive text-destructive-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {processingId === rejectingEnrollment.id ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Rejection'}
              </button>
              <button 
                onClick={() => setRejectingEnrollment(null)}
                className="flex-1 border-2 border-border py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
