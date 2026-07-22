'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Search, ShieldCheck } from 'lucide-react';

interface DepositItem {
  id: string;
  userName: string;
  mobileNumber: string;
  amount: number;
  promoCode: string;
  utrNumber: string;
  paymentMethod: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const mockDeposits: DepositItem[] = [
  { id: 'DEP-8901', userName: 'Firoj Alam', mobileNumber: '+919988776655', amount: 500, promoCode: 'GAMER100', utrNumber: '419208392101', paymentMethod: 'PhonePe', requestedAt: '5 mins ago', status: 'PENDING' },
  { id: 'DEP-8902', userName: 'Faizan Ahmed', mobileNumber: '+919876543210', amount: 1000, promoCode: 'NONE', utrNumber: '419208392102', paymentMethod: 'Google Pay', requestedAt: '12 mins ago', status: 'PENDING' },
  { id: 'DEP-8903', userName: 'Aniket Sharma', mobileNumber: '+919123456789', amount: 250, promoCode: 'NONE', utrNumber: '419208392103', paymentMethod: 'Paytm UPI', requestedAt: '25 mins ago', status: 'PENDING' },
];

export default function ManualDepositsPage() {
  const [deposits, setDeposits] = useState<DepositItem[]>(mockDeposits);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'APPROVED' } : d));
  };

  const handleReject = (id: string) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'REJECTED' } : d));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Manual Deposit Approval Desk</h1>
        <p className="text-sm text-slate-400">Verify user UPI payment UTR receipt codes and approve main wallet credits.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Clock size={16} className="text-amber-400" /> Pending Approval Queue ({deposits.filter(d => d.status === 'PENDING').length})
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {deposits.map((item) => (
            <div key={item.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-amber-400 font-bold">{item.id}</span>
                  <h3 className="font-bold text-slate-100 text-sm">{item.userName}</h3>
                  <span className="text-xs text-slate-400">{item.mobileNumber}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span>Method: <strong className="text-slate-200">{item.paymentMethod}</strong></span>
                  <span>UTR Reference: <strong className="text-slate-200 font-mono">{item.utrNumber}</strong></span>
                  <span>Coupon: <strong className="text-emerald-400 font-mono">{item.promoCode}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-xl font-black text-emerald-400">₹{item.amount}</div>
                  <div className="text-[10px] text-slate-400">{item.requestedAt}</div>
                </div>

                {item.status === 'PENDING' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10"
                    >
                      <CheckCircle2 size={16} /> Approve & Credit
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-4 py-2 bg-slate-800 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                ) : (
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {item.status === 'APPROVED' ? '✓ APPROVED' : '✗ REJECTED'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
