'use client';

import { useState } from 'react';
import { Trophy, Plus, Star, Edit3, Trash2, X, Check, Percent, Search } from 'lucide-react';

interface TournamentItem {
  id: string;
  game: 'Ludo King' | 'Carrom' | 'Chess';
  type: string;
  entryFee: number;
  prizePool: number;
  rakePercent: number;
  joined: number;
  maxSlots: number;
  isFeatured: boolean;
  isActive: boolean;
}

const mockTournaments: TournamentItem[] = [
  { id: 'TNT-101', game: 'Ludo King', type: '1v1 Quick Match', entryFee: 50, prizePool: 85, rakePercent: 15, joined: 1, maxSlots: 2, isFeatured: true, isActive: true },
  { id: 'TNT-102', game: 'Carrom', type: '1v1 Pro Clash', entryFee: 100, prizePool: 180, rakePercent: 10, joined: 2, maxSlots: 2, isFeatured: false, isActive: true },
  { id: 'TNT-103', game: 'Chess', type: '1v1 Blitz Battle', entryFee: 200, prizePool: 360, rakePercent: 10, joined: 0, maxSlots: 2, isFeatured: true, isActive: true },
  { id: 'TNT-104', game: 'Ludo King', type: '1v1 High Stakes', entryFee: 500, prizePool: 900, rakePercent: 10, joined: 1, maxSlots: 2, isFeatured: false, isActive: true },
];

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<TournamentItem[]>(mockTournaments);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TournamentItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Create Form State
  const [newGame, setNewGame] = useState<'Ludo King' | 'Carrom' | 'Chess'>('Ludo King');
  const [newType, setNewType] = useState('1v1 Standard');
  const [newEntryFee, setNewEntryFee] = useState(100);
  const [newRakePercent, setNewRakePercent] = useState(10);
  const [newMaxSlots, setNewMaxSlots] = useState(2);
  const [newIsFeatured, setNewIsFeatured] = useState(false);

  // Edit Form State
  const [editGame, setEditGame] = useState<'Ludo King' | 'Carrom' | 'Chess'>('Ludo King');
  const [editType, setEditType] = useState('');
  const [editEntryFee, setEditEntryFee] = useState(100);
  const [editRakePercent, setEditRakePercent] = useState(10);
  const [editMaxSlots, setEditMaxSlots] = useState(2);
  const [editIsFeatured, setEditIsFeatured] = useState(false);

  const calculatedCreatePrizePool = Math.floor((newEntryFee * newMaxSlots) * (1 - newRakePercent / 100));
  const calculatedEditPrizePool = Math.floor((editEntryFee * editMaxSlots) * (1 - editRakePercent / 100));

  const openEditModal = (item: TournamentItem) => {
    setEditingItem(item);
    setEditGame(item.game);
    setEditType(item.type);
    setEditEntryFee(item.entryFee);
    setEditRakePercent(item.rakePercent);
    setEditMaxSlots(item.maxSlots);
    setEditIsFeatured(item.isFeatured);
  };

  const toggleFeatured = (id: string) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, isFeatured: !t.isFeatured } : t));
  };

  const toggleActive = (id: string) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  const handleCreateContest = (e: React.FormEvent) => {
    e.preventDefault();
    const newContest: TournamentItem = {
      id: `TNT-${Math.floor(100 + Math.random() * 900)}`,
      game: newGame,
      type: newType,
      entryFee: Number(newEntryFee),
      prizePool: calculatedCreatePrizePool,
      rakePercent: Number(newRakePercent),
      joined: 0,
      maxSlots: Number(newMaxSlots),
      isFeatured: newIsFeatured,
      isActive: true,
    };
    setTournaments([newContest, ...tournaments]);
    setShowCreateModal(false);
  };

  const handleUpdateContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setTournaments(prev => prev.map(t => {
      if (t.id === editingItem.id) {
        return {
          ...t,
          game: editGame,
          type: editType,
          entryFee: Number(editEntryFee),
          prizePool: calculatedEditPrizePool,
          rakePercent: Number(editRakePercent),
          maxSlots: Number(editMaxSlots),
          isFeatured: editIsFeatured,
        };
      }
      return t;
    }));

    setEditingItem(null);
  };

  const handleDeleteContest = (id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    setDeletingId(null);
  };

  const filteredTournaments = tournaments.filter(t => 
    t.game.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Tournament & Contest Pool Manager
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold border border-indigo-200/60">
              {tournaments.length} Pools Configured
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Create, edit, delete, and configure rake commissions for Ludo, Carrom & Chess contest pools.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={16} /> Create Contest Pool
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Pools</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {tournaments.filter(t => t.isActive).length} Live Pools
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Featured Pools</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            {tournaments.filter(t => t.isFeatured).length} Pinned
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Platform Rake</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {tournaments.length > 0 ? (tournaments.reduce((acc, t) => acc + t.rakePercent, 0) / tournaments.length).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by Game Name, Type, or Pool ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filteredTournaments.length} of {tournaments.length} pools
        </div>
      </div>

      {/* Grid of Contest Pools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">{item.id}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                    title="Edit Contest Pool"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors"
                    title="Delete Contest Pool"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => toggleFeatured(item.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      item.isFeatured 
                        ? 'bg-amber-50 text-amber-600 border-amber-200' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                    }`}
                    title="Toggle Featured Carousel Pin"
                  >
                    <Star size={14} fill={item.isFeatured ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => toggleActive(item.id)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      item.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {item.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{item.game}</h3>
                <p className="text-xs text-slate-500 font-medium">{item.type}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Entry Fee</span>
                  <span className="text-base font-extrabold text-slate-900">₹{item.entryFee}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Prize Pool</span>
                  <span className="text-base font-extrabold text-emerald-600">₹{item.prizePool}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Joined: <strong className="text-slate-800">{item.joined}/{item.maxSlots} Slots</strong></span>
              <span className="text-indigo-600 font-semibold flex items-center gap-1">
                <Percent size={14} /> Rake: {item.rakePercent}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Contest Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Trophy size={18} className="text-indigo-600" /> Create New Contest Pool
              </span>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateContest} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Game Type</label>
                <select
                  value={newGame}
                  onChange={(e) => setNewGame(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                >
                  <option value="Ludo King">Ludo King</option>
                  <option value="Carrom">Carrom</option>
                  <option value="Chess">Chess</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Match Format / Title</label>
                <input 
                  type="text"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  placeholder="e.g., 1v1 High Rollers"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Entry Fee (₹)</label>
                  <input 
                    type="number"
                    value={newEntryFee}
                    onChange={(e) => setNewEntryFee(Number(e.target.value))}
                    min={10}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Commission Rake (%)</label>
                  <input 
                    type="number"
                    value={newRakePercent}
                    onChange={(e) => setNewRakePercent(Number(e.target.value))}
                    min={0}
                    max={50}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
              </div>

              {/* Calculated Prize Pool Preview */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Calculated Winner Prize Pool:</span>
                <span className="text-base font-extrabold text-emerald-600">₹{calculatedCreatePrizePool}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="create-featured"
                  checked={newIsFeatured}
                  onChange={(e) => setNewIsFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="create-featured" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Pin to Home Screen Featured Carousel
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Publish Contest Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contest Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 size={18} className="text-indigo-600" /> Edit Contest Pool ({editingItem.id})
              </span>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateContest} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Game Type</label>
                <select
                  value={editGame}
                  onChange={(e) => setEditGame(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                >
                  <option value="Ludo King">Ludo King</option>
                  <option value="Carrom">Carrom</option>
                  <option value="Chess">Chess</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Match Format / Title</label>
                <input 
                  type="text"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  placeholder="e.g., 1v1 High Rollers"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Entry Fee (₹)</label>
                  <input 
                    type="number"
                    value={editEntryFee}
                    onChange={(e) => setEditEntryFee(Number(e.target.value))}
                    min={10}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Commission Rake (%)</label>
                  <input 
                    type="number"
                    value={editRakePercent}
                    onChange={(e) => setEditRakePercent(Number(e.target.value))}
                    min={0}
                    max={50}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
              </div>

              {/* Calculated Prize Pool Preview */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Updated Winner Prize Pool:</span>
                <span className="text-base font-extrabold text-emerald-600">₹{calculatedEditPrizePool}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="edit-featured"
                  checked={editIsFeatured}
                  onChange={(e) => setEditIsFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="edit-featured" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Pin to Home Screen Featured Carousel
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check size={14} /> Save Pool Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Delete Contest Pool?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove pool <strong className="text-slate-800">{deletingId}</strong>? This action will remove it from the mobile app match selection list.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteContest(deletingId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
