'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Trophy, AlertTriangle, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import SideBySideProofViewer, { DisputeMatch } from '@/components/SideBySideProofViewer';

export default function MatchDisputeDetail({ params }: { params: { matchId: string } }) {
  const router = useRouter();
  const [matchData, setMatchData] = useState<any>(null);
  const [moves, setMoves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const res = await fetch(`/api/admin/disputes/${params.matchId}`);
        const json = await res.json();
        if (json.success) {
          setMatchData(json.data);
          setMoves(json.data.match_moves || []);
        }
      } catch (err) {
        console.warn('Failed to fetch match details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchDetails();
  }, [params.matchId]);

  const handleDeclareWinner = async (matchId: string, winnerUserId: string) => {
    try {
      await fetch('/api/admin/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DECLARE_WINNER', matchId, winnerUserId })
      });
      router.push('/disputes');
    } catch (err) {
      console.warn('Declare winner API error:', err);
    }
  };

  const handleCancelAndRefund = async (matchId: string) => {
    try {
      await fetch('/api/admin/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL_AND_REFUND', matchId })
      });
      router.push('/disputes');
    } catch (err) {
      console.warn('Cancel and refund API error:', err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading match details...</div>;
  }

  if (!matchData) {
    return (
      <div className="p-8 text-center text-rose-500">
        Match not found or error loading details.
        <br />
        <Link href="/disputes" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Disputes</Link>
      </div>
    );
  }

  const disputeObj: DisputeMatch = {
    matchId: matchData.id,
    gameType: matchData.game_type || 'Ludo King',
    roomCode: matchData.room_code || 'N/A',
    entryFee: Number(matchData.entry_fee),
    prizePool: Number(matchData.prize_pool),
    createdAt: matchData.created_at,
    playerA: {
      userId: matchData.player_a_id || 'usr_a',
      userName: matchData.player_a?.full_name || 'Player A',
      userPhone: matchData.player_a?.phone || 'N/A',
      claimedStatus: matchData.player_a_claim || 'WON',
      proofUrl: matchData.player_a_proof_url || 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&q=80',
      entryFeeBreakdown: { mainCash: Number(matchData.player_a_cash_paid || matchData.entry_fee), bonusCash: Number(matchData.player_a_bonus_paid || 0) }
    },
    playerB: {
      userId: matchData.player_b_id || 'usr_b',
      userName: matchData.player_b?.full_name || 'Player B',
      userPhone: matchData.player_b?.phone || 'N/A',
      claimedStatus: matchData.player_b_claim || 'WON',
      proofUrl: matchData.player_b_proof_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      entryFeeBreakdown: { mainCash: Number(matchData.player_b_cash_paid || matchData.entry_fee), bonusCash: Number(matchData.player_b_bonus_paid || 0) }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link href="/disputes" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dispute Details: {matchData.id}
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-indigo-600">{matchData.game_type}</span>
            <span>•</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Mode: {matchData.game_mode}</span>
          </p>
        </div>
      </div>

      <SideBySideProofViewer 
        dispute={disputeObj}
        onDeclareWinner={handleDeclareWinner}
        onCancelAndRefund={handleCancelAndRefund}
      />

      {/* Internal Ludo Log Viewer */}
      {matchData.game_mode === 'LUDO_INTERNAL' && (
        <div className="mt-8 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <PlayCircle size={18} className="text-indigo-600" />
              Internal Game Engine Logs
            </h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded-full">
              {moves.length} moves recorded
            </span>
          </div>
          <div className="p-0 max-h-96 overflow-y-auto">
            {moves.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 sticky top-0 shadow-sm">
                  <tr>
                    <th className="py-3 px-6 font-semibold">Time</th>
                    <th className="py-3 px-6 font-semibold">Player</th>
                    <th className="py-3 px-6 font-semibold">Action</th>
                    <th className="py-3 px-6 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {moves.map((move: any, idx: number) => {
                    const isA = move.player_id === matchData.player_a_id;
                    const playerName = isA ? matchData.player_a?.full_name : matchData.player_b?.full_name;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-6 text-slate-500 font-mono text-xs">
                          {new Date(move.created_at).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-6 font-medium text-slate-700">
                          {playerName} <span className="text-xs text-slate-400">({isA ? 'Player A' : 'Player B'})</span>
                        </td>
                        <td className="py-3 px-6">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            move.move_type === 'ROLL_DICE' ? 'bg-amber-100 text-amber-700' :
                            move.move_type === 'MOVE_TOKEN' ? 'bg-indigo-100 text-indigo-700' :
                            move.move_type === 'MISSED_TURN' ? 'bg-rose-100 text-rose-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {move.move_type}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-slate-600 font-mono text-xs">
                          {JSON.stringify(move.move_data)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <AlertTriangle size={24} className="mx-auto mb-2 text-slate-400" />
                No moves recorded for this match.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
