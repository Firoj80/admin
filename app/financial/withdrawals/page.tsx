'use client';

import { useState, useEffect } from 'react';
import FinancialApprovalCard, { FinancialItem } from '@/components/FinancialApprovalCard';
import { Wallet, Search, RefreshCw, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function ManualWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<FinancialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLiveWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/withdrawals');
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        const mapped: FinancialItem[] = json.data.map((w: any) => ({
          id: w.id,
          type: 'withdrawal',
          userId: w.user_id,
          userName: w.users?.full_name || 'Gamer Profile',
          userPhone: w.users?.phone || 'N/A',
          amount: Number(w.amount),
          payoutDetails: {
            upiId: w.upi_id || undefined,
            accountNumber: w.account_number || undefined,
            ifsc: w.ifsc || undefined,
            beneficiaryName: w.beneficiary_name || undefined
          },
          createdAt: w.created_at,
          status: 'PENDING_APPROVAL'
        }));
        setWithdrawals(mapped);
      } else {
        setWithdrawals([]);
      }
    } catch (err) {
      console.warn('Failed to fetch live withdrawals from Supabase:', err);
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWithdrawals();
  }, []);

  const handleApprove = async (id: string, utr?: string) => {
    const target = withdrawals.find(w => w.id === id);
    setWithdrawals((prev) => prev.filter((item) => item.id !== id));

    if (target) {
      try {
        await fetch('/api/admin/withdrawals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'APPROVE',
            withdrawalId: target.id,
            userId: target.userId,
            amount: target.amount,
            utr: utr || 'IMPS'
          })
        });
      } catch (err) {
        console.warn('Withdrawal approve API error:', err);
      }
    }
  };

  const handleReject = async (id: string, reason: string) => {
    const target = withdrawals.find(w => w.id === id);
    setWithdrawals((prev) => prev.filter((item) => item.id !== id));

    if (target) {
      try {
        await fetch('/api/admin/withdrawals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'REJECT',
            withdrawalId: target.id,
            userId: target.userId,
            amount: target.amount,
            reason
          })
        });
      } catch (err) {
        console.warn('Withdrawal reject API error:', err);
      }
    }
  };

  const filteredWithdrawals = withdrawals.filter((item) => 
    item.userName?.toLowerCase().includes(search.toLowerCase()) ||
    item.userPhone.includes(search) ||
    item.id.toLowerCase().includes(search.toLowerCase()) ||
    item.payoutDetails?.upiId?.toLowerCase().includes(search.toLowerCase()) ||
    item.payoutDetails?.accountNumber?.includes(search)
  );

  const totalValue = withdrawals.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Manual Withdrawal Payout Queue
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold border border-indigo-200/60">
              {withdrawals.length} Pending
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Review IMPS/UPI payout details, approve bank releases, or reject & refund locked winnings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchLiveWithdrawals}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-indigo-600' : ''} /> Refresh Queue
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Withdrawals</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{withdrawals.length} Requests</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Payout Volume</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">₹{totalValue.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security Audit</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">KYC Verified</div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by User Name, Phone, UPI ID, or Account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filteredWithdrawals.length} of {withdrawals.length} pending items
        </div>
      </div>

      {/* Queue List */}
      {filteredWithdrawals.length > 0 ? (
        <div className="space-y-4">
          {filteredWithdrawals.map((item) => (
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
          <h3 className="text-lg font-bold text-slate-900">All Payout Requests Processed!</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            There are currently no pending withdrawal releases requiring manual review.
          </p>
        </div>
      )}

    </div>
  );
}
