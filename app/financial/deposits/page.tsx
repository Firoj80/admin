'use client';

import { useState } from 'react';
import FinancialApprovalCard, { FinancialItem } from '@/components/FinancialApprovalCard';
import { Wallet, Search, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';

const MOCK_DEPOSITS: FinancialItem[] = [
  {
    id: 'DEP-1001',
    type: 'deposit',
    userId: 'usr_8819',
    userName: 'Rahul Sharma',
    userPhone: '+91 9876543210',
    amount: 500,
    utrOrTxnId: '420918239102',
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'DEP-1002',
    type: 'deposit',
    userId: 'usr_9421',
    userName: 'Vikas Kumar',
    userPhone: '+91 9123456789',
    amount: 1000,
    utrOrTxnId: '420918991204',
    proofUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'DEP-1003',
    type: 'deposit',
    userId: 'usr_3102',
    userName: 'Amit Singh',
    userPhone: '+91 9988776655',
    amount: 250,
    utrOrTxnId: '420918772910',
    proofUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'PENDING_APPROVAL',
  },
];

export default function ManualDepositsPage() {
  const [deposits, setDeposits] = useState<FinancialItem[]>(MOCK_DEPOSITS);
  const [search, setSearch] = useState('');

  const handleApprove = async (id: string) => {
    // In production, calls Supabase admin client / RPC
    setDeposits((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReject = async (id: string, reason: string) => {
    // In production, calls Supabase admin client / RPC
    setDeposits((prev) => prev.filter((item) => item.id !== id));
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
            onClick={() => setDeposits(MOCK_DEPOSITS)}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Refresh Queue
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
