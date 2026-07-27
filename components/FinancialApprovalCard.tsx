'use client';

import { useState } from 'react';
import { Check, X, ExternalLink, Eye, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export interface FinancialItem {
  id: string;
  type: 'deposit' | 'withdrawal';
  userId: string;
  userPhone: string;
  userName?: string;
  amount: number;
  utrOrTxnId?: string;
  proofUrl?: string | null;
  paymentMethod?: string;
  servedAddress?: string;
  payoutDetails?: {
    upiId?: string;
    accountNumber?: string;
    ifsc?: string;
    beneficiaryName?: string;
  };
  createdAt: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
}

interface FinancialApprovalCardProps {
  item: FinancialItem;
  onApprove: (id: string, utr?: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

export default function FinancialApprovalCard({ item, onApprove, onReject }: FinancialApprovalCardProps) {
  const [loading, setLoading] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [approvalUtr, setApprovalUtr] = useState('');

  const isDeposit = item.type === 'deposit';

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(item.id, approvalUtr);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setLoading(true);
    try {
      await onReject(item.id, rejectReason);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDeposit ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            {isDeposit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {isDeposit ? `DEPOSIT (${item.paymentMethod || 'UPI'})` : 'WITHDRAWAL'}
            </span>
            <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
              ₹{item.amount.toLocaleString()}
              <span className="text-xs font-normal text-slate-400">· {item.userPhone}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">{new Date(item.createdAt).toLocaleString()}</span>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/50 mt-1">
            Pending Manual Review
          </span>
        </div>
      </div>

      {/* Details Section */}
      <div className="py-4 space-y-3">
        {isDeposit ? (
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                {item.paymentMethod ? `${item.paymentMethod.toUpperCase()} / UTR NUMBER` : 'UPI / TRANSACTION UTR'}
              </span>
              <span className="text-sm font-mono font-bold text-slate-800">{item.utrOrTxnId || 'N/A'}</span>
              {item.servedAddress && (
                <div className="mt-1 text-[11px] font-medium text-slate-600">
                  Received at: <span className="font-mono text-indigo-600 font-bold">{item.servedAddress}</span>
                </div>
              )}
            </div>
            {item.proofUrl && (
              <button 
                onClick={() => setShowProofModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-xs"
              >
                <Eye size={14} /> View Receipt Screenshot
              </button>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Target Payout Details</span>
            {item.payoutDetails?.upiId ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">UPI ID:</span>
                <span className="font-mono font-bold text-slate-900">{item.payoutDetails.upiId}</span>
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Account No:</span>
                  <span className="font-mono font-bold text-slate-900">{item.payoutDetails?.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">IFSC Code:</span>
                  <span className="font-mono font-bold text-slate-900">{item.payoutDetails?.ifsc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Holder Name:</span>
                  <span className="font-bold text-slate-900">{item.payoutDetails?.beneficiaryName}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Optional Payout / Reference Entry for Withdrawals */}
        {!isDeposit && (
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Bank IMPS / Payout Transaction UTR (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. 420918239102"
              value={approvalUtr}
              onChange={(e) => setApprovalUtr(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        )}

        {/* Reject Reason Drawer */}
        {showRejectInput && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-rose-600 block">Reason for Rejection</label>
            <input 
              type="text" 
              placeholder="e.g., UTR not matching / Invalid payment proof"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-200 bg-rose-50/30 text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
        {showRejectInput ? (
          <>
            <button 
              onClick={() => setShowRejectInput(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={loading || !rejectReason.trim()}
              onClick={handleReject}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm inline-flex items-center gap-1"
            >
              Confirm Rejection
            </button>
          </>
        ) : (
          <>
            <button 
              disabled={loading}
              onClick={() => setShowRejectInput(true)}
              className="px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <X size={14} /> Reject Request
            </button>
            <button 
              disabled={loading}
              onClick={handleApprove}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm inline-flex items-center gap-1.5 ${
                isDeposit ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Check size={14} /> {isDeposit ? 'Approve & Credit Wallet' : 'Approve & Release Payout'}
            </button>
          </>
        )}
      </div>

      {/* Proof Lightbox Modal */}
      {showProofModal && item.proofUrl && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Payment Proof Screenshot</span>
              <button 
                onClick={() => setShowProofModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 bg-slate-100 flex items-center justify-center min-h-[300px]">
              <img 
                src={item.proofUrl} 
                alt="Payment proof" 
                className="max-h-[400px] object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="text-xs font-mono text-slate-500">UTR: {item.utrOrTxnId || 'N/A'}</span>
              <a 
                href={item.proofUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                Open Full Image <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
