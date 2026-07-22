'use client';

import { useState } from 'react';
import { Trophy, Plus, Star, Edit3, Trash2 } from 'lucide-react';

interface TournamentItem {
  id: string;
  game: string;
  type: string;
  entryFee: number;
  prizePool: number;
  joined: number;
  maxSlots: number;
  isFeatured: boolean;
  isActive: boolean;
}

const mockTournaments: TournamentItem[] = [
  { id: 'TNT-101', game: 'Ludo King', type: '1v1 Quick', entryFee: 50, prizePool: 85, joined: 1, maxSlots: 2, isFeatured: true, isActive: true },
  { id: 'TNT-102', game: 'Carrom Clash', type: '1v1 Pro', entryFee: 100, prizePool: 180, joined: 2, maxSlots: 2, isFeatured: false, isActive: true },
  { id: 'TNT-103', game: 'Chess Masters', type: '1v1 Blitz', entryFee: 200, prizePool: 360, joined: 0, maxSlots: 2, isFeatured: true, isActive: true },
];

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<TournamentItem[]>(mockTournaments);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleFeatured = (id: string) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, isFeatured: !t.isFeatured } : t));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Tournament & Pool Management</h1>
          <p className="text-sm text-slate-400">Create, edit, pin featured contests, and configure platform rake commissions.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-amber-400/20"
        >
          <Plus size={16} /> Create Contest Pool
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tournaments.map((item) => (
          <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-amber-400 font-bold">{item.id}</span>
                <button
                  onClick={() => toggleFeatured(item.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    item.isFeatured ? 'bg-amber-400/10 text-amber-400 border-amber-400/30' : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                  title="Toggle Featured Carousel"
                >
                  <Star size={16} fill={item.isFeatured ? 'currentColor' : 'none'} />
                </button>
              </div>
              <h3 className="font-bold text-slate-100 text-lg">{item.game}</h3>
              <p className="text-xs text-slate-400">Format: {item.type}</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Entry Fee</span>
                  <span className="text-base font-black text-slate-100">₹{item.entryFee}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Prize Pool</span>
                  <span className="text-base font-black text-emerald-400">₹{item.prizePool}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Slots: <strong>{item.joined}/{item.maxSlots}</strong></span>
              <span className="text-emerald-400 font-bold">Active Rake: 15%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
