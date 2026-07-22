'use client';

import { useState } from 'react';
import { Trophy, RefreshCw, Eye, ExternalLink, AlertTriangle, ShieldCheck, User } from 'lucide-react';

export interface DisputeMatch {
  matchId: string;
  gameType: 'Ludo King' | 'Carrom' | 'Chess';
  roomCode: string;
  entryFee: number;
  prizePool: number;
  createdAt: string;
  playerA: {
    userId: string;
    userName: string;
    userPhone: string;
    claimedStatus: 'WON' | 'LOSS' | 'ERROR';
    proofUrl?: string;
    entryFeeBreakdown: { mainCash: number; bonusCash: number };
  };
  playerB: {
    userId: string;
    userName: string;
    userPhone: string;
    claimedStatus: 'WON' | 'LOSS' | 'ERROR';
    proofUrl?: string;
    entryFeeBreakdown: { mainCash: number; bonusCash: number };
  };
}

interface SideBySideProofViewerProps {
  dispute: DisputeMatch;
  onDeclareWinner: (matchId: string, winnerUserId: string) => Promise<void>;
  onCancelAndRefund: (matchId: string) => Promise<void>;
}

export default function SideBySideProofViewer({ dispute, onDeclareWinner, onCancelAndRefund }: SideBySideProofViewerProps) {
  const [loading, setLoading] = useState(false);
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);

  const handleWinner = async (winnerUserId: string) => {
    setLoading(true);
    try {
      await onDeclareWinner(dispute.matchId, winnerUserId);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    setLoading(true);
    try {
      await onCancelAndRefund(dispute.matchId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-0">
      
      {/* Header Banner */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center font-bold text-sm">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">Match #{dispute.matchId}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {dispute.gameType}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Room Code: <strong className="font-mono text-slate-800">{dispute.roomCode}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-right">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Entry Fee</span>
            <span className="text-sm font-bold text-slate-700">₹{dispute.entryFee} / player</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Prize Pool</span>
            <span className="text-base font-extrabold text-emerald-600">₹{dispute.prizePool}</span>
          </div>
        </div>
      </div>

      {/* Dual Screenshot Comparison Area */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
        
        {/* Player A Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                  <User size={16} />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block leading-tight">{dispute.playerA.userName}</span>
                  <span className="text-xs text-slate-400">{dispute.playerA.userPhone}</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                dispute.playerA.claimedStatus === 'WON' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}>
                Claimed: {dispute.playerA.claimedStatus}
              </span>
            </div>

            {/* Proof Screenshot */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">Submitted Proof</span>
              {dispute.playerA.proofUrl ? (
                <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 h-48 flex items-center justify-center">
                  <img 
                    src={dispute.playerA.proofUrl} 
                    alt="Player A proof" 
                    className="max-h-full object-contain"
                  />
                  <button 
                    onClick={() => setActiveImageModal(dispute.playerA.proofUrl || null)}
                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-xs gap-1.5"
                  >
                    <Eye size={16} /> Zoom Screenshot
                  </button>
                </div>
              ) : (
                <div className="h-48 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400 font-medium">
                  No Screenshot Uploaded
                </div>
              )}
            </div>

            {/* Entry Fee Breakdown */}
            <div className="pt-3 text-xs text-slate-500 flex justify-between">
              <span>Paid: <strong className="text-slate-700">₹{dispute.playerA.entryFeeBreakdown.mainCash} Cash</strong> + <strong className="text-slate-700">₹{dispute.playerA.entryFeeBreakdown.bonusCash} Bonus</strong></span>
            </div>
          </div>

          <button 
            disabled={loading}
            onClick={() => handleWinner(dispute.playerA.userId)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Trophy size={14} /> Declare {dispute.playerA.userName} Winner (₹{dispute.prizePool})
          </button>
        </div>

        {/* Player B Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                  <User size={16} />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block leading-tight">{dispute.playerB.userName}</span>
                  <span className="text-xs text-slate-400">{dispute.playerB.userPhone}</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                dispute.playerB.claimedStatus === 'WON' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}>
                Claimed: {dispute.playerB.claimedStatus}
              </span>
            </div>

            {/* Proof Screenshot */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">Submitted Proof</span>
              {dispute.playerB.proofUrl ? (
                <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 h-48 flex items-center justify-center">
                  <img 
                    src={dispute.playerB.proofUrl} 
                    alt="Player B proof" 
                    className="max-h-full object-contain"
                  />
                  <button 
                    onClick={() => setActiveImageModal(dispute.playerB.proofUrl || null)}
                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-xs gap-1.5"
                  >
                    <Eye size={16} /> Zoom Screenshot
                  </button>
                </div>
              ) : (
                <div className="h-48 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400 font-medium">
                  No Screenshot Uploaded
                </div>
              )}
            </div>

            {/* Entry Fee Breakdown */}
            <div className="pt-3 text-xs text-slate-500 flex justify-between">
              <span>Paid: <strong className="text-slate-700">₹{dispute.playerB.entryFeeBreakdown.mainCash} Cash</strong> + <strong className="text-slate-700">₹{dispute.playerB.entryFeeBreakdown.bonusCash} Bonus</strong></span>
            </div>
          </div>

          <button 
            disabled={loading}
            onClick={() => handleWinner(dispute.playerB.userId)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Trophy size={14} /> Declare {dispute.playerB.userName} Winner (₹{dispute.prizePool})
          </button>
        </div>

      </div>

      {/* Bottom Equal Resolution Bar */}
      <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Refund Rule:</span> Entry fees return proportionally to original wallet buckets (Main Cash + Bonus).
        </div>
        <button 
          disabled={loading}
          onClick={handleRefund}
          className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors border border-slate-300/80 flex items-center justify-center gap-1.5"
        >
          <RefreshCw size={14} /> Cancel Match & Refund Both Players
        </button>
      </div>

      {/* Image Modal Lightbox */}
      {activeImageModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Screenshot Proof Inspector</span>
              <button 
                onClick={() => setActiveImageModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-center min-h-[400px]">
              <img 
                src={activeImageModal} 
                alt="Full proof screenshot" 
                className="max-h-[500px] object-contain rounded-md"
              />
            </div>
            <div className="p-3 bg-slate-50 text-right">
              <a 
                href={activeImageModal} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
              >
                Open Full Resolution <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
