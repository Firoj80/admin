'use client';

import { useState, useEffect } from 'react';
import FinancialApprovalCard, { FinancialItem } from '@/components/FinancialApprovalCard';
import { Wallet, Search, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ManualDepositsPage() {
  const [deposits, setDeposits] = useState<FinancialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLiveDeposits = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/deposits');
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        const mapped: FinancialItem[] = json.data.map((d: any) => ({
          id: d.id,
          type: 'deposit',
          userId: d.user_id,
          userName: d.users?.full_name || 'Gamer Profile',
          userPhone: d.users?.phone || 'N/A',
          amount: Number(d.amount),
          utrOrTxnId: d.utr_number || 'N/A',
          proofUrl: d.proof_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
          createdAt: d.created_at,
          status: 'PENDING_APPROVAL'
        }));
        setDeposits(mapped);
      } else {
        setDeposits([]);
      }
    } catch (err) {
      console.warn('Failed to fetch live deposits from Supabase:', err);
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveDeposits();
  }, []);

  const handleApprove = async (id: string) => {
    const target = deposits.find(d => d.id === id);
    setDeposits((prev) => prev.filter((item) => item.id !== id));

    if (target) {
      try {
        await fetch('/api/admin/deposits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'APPROVE',
            depositId: target.id,
            userId: target.userId,
            amount: target.amount,
            utr: target.utrOrTxnId
          })
        });
      } catch (err) {
        console.warn('Deposit approve API error:', err);
      }
    }
  };

  const handleReject = async (id: string, reason: string) => {
    const target = deposits.find(d => d.id === id);
    setDeposits((prev) => prev.filter((item) => item.id !== id));

    if (target) {
      try {
        await fetch('/api/admin/deposits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'REJECT',
            depositId: target.id,
            userId: target.userId,
            reason
          })
        });
      } catch (err) {
        console.warn('Deposit reject API error:', err);
      }
    }
  };

  const filteredDeposits = deposits.filter((item) => 
    item.userName?.toLowerCase().includes(search.toLowerCase()) ||
    item.userPhone.includes(search) ||
    item.utrOrTxnId?.includes(search) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = deposits.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Manual Deposit Approval Queue
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200/60">
              {deposits.length} Pending
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Verify user UPI payment receipts and UTR reference numbers to credit main wallet balances.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchLiveDeposits}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-indigo-600' : ''} /> Refresh Queue
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Count</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{deposits.length} Requests</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Pending Value</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">₹{totalValue.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Verification Speed</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">&lt; 5 mins avg</div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by User Name, Phone, or UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filteredDeposits.length} of {deposits.length} pending items
        </div>
      </div>

      {/* Queue List */}
      {filteredDeposits.length > 0 ? (
        <div className="space-y-4">
          {filteredDeposits.map((item) => (
            <FinancialApprovalCard 
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">All Deposit Requests Processed!</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            There are currently no pending deposits requiring manual review. New requests will appear here automatically.
          </p>
        </div>
      )}

    </div>
  );
}
