'use client';

import { useState } from 'react';
import { ShieldAlert, Trophy, XCircle, RotateCcw, Image as ImageIcon, AlertTriangle } from 'lucide-react';

interface DisputeItem {
  id: string;
  game: string;
  prizePool: number;
  entryFee: number;
  userA: { name: string; claim: 'WON' | 'LOSS' | 'ERROR'; screenshotUrl?: string };
  userB: { name: string; claim: 'WON' | 'LOSS' | 'ERROR'; screenshotUrl?: string };
  disputeReason: string;
  status: 'DISPUTED' | 'RESOLVED_USER_A' | 'RESOLVED_USER_B' | 'CANCELLED_REFUNDED';
}

const mockDisputes: DisputeItem[] = [
  {
    id: 'MCH-7701',
    game: 'Ludo King 1v1',
    prizePool: 100,
    entryFee: 50,
    userA: { name: 'Firoj (Host)', claim: 'WON', screenshotUrl: '/assets/screenshot_proof1.png' },
    userB: { name: 'Faizan (Guest)', claim: 'WON', screenshotUrl: '/assets/screenshot_proof2.png' },
    disputeReason: 'Both players claimed WON (Dual Victory Claim)',
    status: 'DISPUTED',
  },
  {
    id: 'MCH-7702',
    game: 'Carrom Clash 1v1',
    prizePool: 50,
    entryFee: 25,
    userA: { name: 'Aniket (Host)', claim: 'WON', screenshotUrl: '/assets/screenshot_proof3.png' },
    userB: { name: 'Rohit (Guest)', claim: 'ERROR', screenshotUrl: undefined },
    disputeReason: 'User A claimed WON, User B reported ERROR (Disconnect / App crash)',
    status: 'DISPUTED',
  },
];

export default function DisputeResolverPage() {
  const [disputes, setDisputes] = useState<DisputeItem[]>(mockDisputes);

  const handleDeclareUserA = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'RESOLVED_USER_A' } : d));
  };

  const handleDeclareUserB = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'RESOLVED_USER_B' } : d));
  };

  const handleCancelAndRefund = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'CANCELLED_REFUNDED' } : d));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">1v1 Match Dispute Resolver Desk</h1>
        <p className="text-sm text-slate-400">Review side-by-side player screenshot proof and resolve disputed match prize pools.</p>
      </div>

      <div className="space-y-6">
        {disputes.map((dispute) => (
          <div key={dispute.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-rose-400 font-bold">{dispute.id}</span>
                  <h3 className="font-bold text-slate-100 text-sm">{dispute.game}</h3>
                  <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-bold">
                    Prize Pool: ₹{dispute.prizePool}
                  </span>
                </div>
                <div className="text-xs text-slate-400 pt-1 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-400" />
                  <span>Reason: {dispute.disputeReason}</span>
                </div>
              </div>

              {dispute.status !== 'DISPUTED' && (
                <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {dispute.status === 'CANCELLED_REFUNDED' ? '✓ CANCELLED & 100% REFUNDED TO BUCKETS' : `✓ WINNER DECLARED (${dispute.status.replace('RESOLVED_', '')})`}
                </div>
              )}
            </div>

            {/* Side-by-side screenshot proof inspector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User A Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-200 text-xs">{dispute.userA.name}</h4>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                    Claimed: {dispute.userA.claim}
                  </span>
                </div>
                <div className="h-44 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-slate-500">
                  {dispute.userA.screenshotUrl ? (
                    <div className="text-center space-y-2">
                      <ImageIcon size={32} className="mx-auto text-amber-400" />
                      <span className="text-xs text-slate-300 font-mono block">Screenshot Proof Uploaded</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">No screenshot attached</span>
                  )}
                </div>
              </div>

              {/* User B Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-200 text-xs">{dispute.userB.name}</h4>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    dispute.userB.claim === 'WON' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'
                  }`}>
                    Claimed: {dispute.userB.claim}
                  </span>
                </div>
                <div className="h-44 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-slate-500">
                  {dispute.userB.screenshotUrl ? (
                    <div className="text-center space-y-2">
                      <ImageIcon size={32} className="mx-auto text-amber-400" />
                      <span className="text-xs text-slate-300 font-mono block">Screenshot Proof Uploaded</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">No screenshot attached</span>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Resolution Buttons */}
            {dispute.status === 'DISPUTED' && (
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleDeclareUserA(dispute.id)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10"
                >
                  <Trophy size={16} /> Declare User A Winner
                </button>
                <button
                  onClick={() => handleDeclareUserB(dispute.id)}
                  className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/10"
                >
                  <Trophy size={16} /> Declare User B Winner
                </button>
                <button
                  onClick={() => handleCancelAndRefund(dispute.id)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw size={16} /> Cancel & Refund Both (To Buckets)
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
