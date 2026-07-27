'use client';

import { useState, useEffect } from 'react';
import SideBySideProofViewer, { DisputeMatch } from '@/components/SideBySideProofViewer';
import { ShieldAlert, RefreshCw, CheckCircle2, Search } from 'lucide-react';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<DisputeMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLiveDisputes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/disputes');
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        const mapped: DisputeMatch[] = json.data.map((m: any) => ({
          matchId: m.id,
          gameType: m.game_type || 'Ludo King',
          gameMode: m.game_mode || 'EXTERNAL',
          roomCode: m.room_code || 'N/A',
          entryFee: Number(m.entry_fee),
          prizePool: Number(m.prize_pool),
          createdAt: m.created_at,
          playerA: {
            userId: m.player_a_id || 'usr_a',
            userName: m.player_a?.full_name || 'Player A',
            userPhone: m.player_a?.phone || 'N/A',
            claimedStatus: m.player_a_claim || 'WON',
            proofUrl: m.player_a_proof_url || 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&q=80',
            entryFeeBreakdown: { mainCash: Number(m.player_a_cash_paid || m.entry_fee), bonusCash: Number(m.player_a_bonus_paid || 0) }
          },
          playerB: {
            userId: m.player_b_id || 'usr_b',
            userName: m.player_b?.full_name || 'Player B',
            userPhone: m.player_b?.phone || 'N/A',
            claimedStatus: m.player_b_claim || 'WON',
            proofUrl: m.player_b_proof_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
            entryFeeBreakdown: { mainCash: Number(m.player_b_cash_paid || m.entry_fee), bonusCash: Number(m.player_b_bonus_paid || 0) }
          }
        }));
        setDisputes(mapped);
      } else {
        setDisputes([]);
      }
    } catch (err) {
      console.warn('Failed to fetch live disputes from Supabase:', err);
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveDisputes();
  }, []);

  const handleDeclareWinner = async (matchId: string, winnerUserId: string) => {
    setDisputes((prev) => prev.filter((item) => item.matchId !== matchId));
    try {
      await fetch('/api/admin/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DECLARE_WINNER', matchId, winnerUserId })
      });
    } catch (err) {
      console.warn('Declare winner API error:', err);
    }
  };

  const handleCancelAndRefund = async (matchId: string) => {
    setDisputes((prev) => prev.filter((item) => item.matchId !== matchId));
    try {
      await fetch('/api/admin/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL_AND_REFUND', matchId })
      });
    } catch (err) {
      console.warn('Cancel and refund API error:', err);
    }
  };

  const filteredDisputes = disputes.filter((item) => 
    item.matchId.toLowerCase().includes(search.toLowerCase()) ||
    item.roomCode.includes(search) ||
    item.playerA.userName.toLowerCase().includes(search.toLowerCase()) ||
    item.playerB.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            1v1 Match Dispute Resolver Desk
            <span className="text-xs bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full font-semibold border border-rose-200/60">
              {disputes.length} Disputed Matches
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Inspect side-by-side screenshot proofs when players submit conflicting match results (WON vs WON or WON vs ERROR).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchLiveDisputes}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-indigo-600' : ''} /> Refresh Queue
          </button>
        </div>
      </div>

      {/* Rules Information Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-sm border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-indigo-300">
          <ShieldAlert size={18} /> Automatic Settlement Logic Rules
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
            <span className="font-semibold text-emerald-400 block mb-0.5">WON vs LOSS</span>
            <span>Auto-declared winner, credited automatically.</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
            <span className="font-semibold text-rose-400 block mb-0.5">WON vs WON / ERROR</span>
            <span>Flagged for Admin manual screenshot inspection.</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
            <span className="font-semibold text-amber-400 block mb-0.5">ERROR vs ERROR</span>
            <span>Auto-cancelled with 100% proportional wallet refund.</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by Match ID, Room Code, or Player Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filteredDisputes.length} of {disputes.length} active disputes
        </div>
      </div>

      {/* Disputes List */}
      {filteredDisputes.length > 0 ? (
        <div className="space-y-6">
          {filteredDisputes.map((dispute) => (
            <SideBySideProofViewer 
              key={dispute.matchId}
              dispute={dispute}
              onDeclareWinner={handleDeclareWinner}
              onCancelAndRefund={handleCancelAndRefund}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">All Match Disputes Resolved!</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            There are currently no disputed matches requiring admin screenshot review.
          </p>
        </div>
      )}

    </div>
  );
}
