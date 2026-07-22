'use client';

import { useState } from 'react';
import FinancialApprovalCard, { FinancialItem } from '@/components/FinancialApprovalCard';
import { Wallet, Search, RefreshCw, CheckCircle2, ArrowUpRight } from 'lucide-react';

const MOCK_WITHDRAWALS: FinancialItem[] = [
  {
    id: 'WTH-8001',
    type: 'withdrawal',
    userId: 'usr_5510',
    userName: 'Karan Patel',
    userPhone: '+91 9898989898',
    amount: 1200,
    payoutDetails: {
      upiId: 'karanpatel@okicici',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'WTH-8002',
    type: 'withdrawal',
    userId: 'usr_7721',
    userName: 'Priya Sharma',
    userPhone: '+91 9777766666',
    amount: 2500,
    payoutDetails: {
      accountNumber: '920198273645',
      ifsc: 'HDFC0001234',
      beneficiaryName: 'Priya Sharma',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'WTH-8003',
    type: 'withdrawal',
    userId: 'usr_1092',
    userName: 'Sanjay Gupta',
    userPhone: '+91 9555544444',
    amount: 800,
    payoutDetails: {
      upiId: 'sanjay@paytm',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'PENDING_APPROVAL',
  },
];

export default function ManualWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<FinancialItem[]>(MOCK_WITHDRAWALS);
  const [search, setSearch] = useState('');

  const handleApprove = async (id: string, utr?: string) => {
    // Production RPC: deduct locked balance, set COMPLETED, log payout UTR
    setWithdrawals((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReject = async (id: string, reason: string) => {
    // Production RPC: unlock & refund balance back to winnings_balance, set REJECTED
    setWithdrawals((prev) => prev.filter((item) => item.id !== id));
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
            onClick={() => setWithdrawals(MOCK_WITHDRAWALS)}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Refresh Queue
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
