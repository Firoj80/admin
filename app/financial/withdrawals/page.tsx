'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Building2, Smartphone } from 'lucide-react';

interface WithdrawalItem {
  id: string;
  userName: string;
  mobileNumber: string;
  amount: number;
  payoutMode: 'UPI' | 'BANK_IMPS';
  destinationDetail: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const mockWithdrawals: WithdrawalItem[] = [
  { id: 'WTH-9001', userName: 'Md Alam', mobileNumber: '+919988776655', amount: 1250, payoutMode: 'UPI', destinationDetail: 'alamtech9@okaxis', requestedAt: '8 mins ago', status: 'PENDING' },
  { id: 'WTH-9002', userName: 'Rohit Kumar', mobileNumber: '+919876543210', amount: 500, payoutMode: 'BANK_IMPS', destinationDetail: 'HDFC Bank • A/C: ••••4892 (IFSC: HDFC0001293)', requestedAt: '18 mins ago', status: 'PENDING' },
];

export default function ManualWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>(mockWithdrawals);

  const handleApprove = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'APPROVED' } : w));
  };

  const handleReject = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'REJECTED' } : w));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Manual Withdrawal Approval Desk</h1>
        <p className="text-sm text-slate-400">Review user payout requests and approve IMPS / UPI cash transfers.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Clock size={16} className="text-emerald-400" /> Pending Payout Queue ({withdrawals.filter(w => w.status === 'PENDING').length})
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {withdrawals.map((item) => (
            <div key={item.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-emerald-400 font-bold">{item.id}</span>
                  <h3 className="font-bold text-slate-100 text-sm">{item.userName}</h3>
                  <span className="text-xs text-slate-400">{item.mobileNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 pt-1 font-mono">
                  {item.payoutMode === 'UPI' ? <Smartphone size={14} className="text-amber-400" /> : <Building2 size={14} className="text-cyan-400" />}
                  <span>{item.destinationDetail}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-xl font-black text-slate-100">₹{item.amount}</div>
                  <div className="text-[10px] text-slate-400">{item.requestedAt}</div>
                </div>

                {item.status === 'PENDING' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10"
                    >
                      <CheckCircle2 size={16} /> Approve & Release IMPS
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-4 py-2 bg-slate-800 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle size={16} /> Reject & Refund
                    </button>
                  </div>
                ) : (
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {item.status === 'APPROVED' ? '✓ IMPS RELEASED' : '✗ REJECTED & REFUNDED'}
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
