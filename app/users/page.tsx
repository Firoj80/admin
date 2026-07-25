'use client';

import { useState } from 'react';
import { Users, Search, Ban, CheckCircle2, Wallet, PlusCircle, MinusCircle, X, ShieldAlert } from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  username: string;
  mobile: string;
  mainBalance: number;
  bonusBalance: number;
  winningsBalance: number;
  matchesPlayed: number;
  status: 'ACTIVE' | 'FROZEN';
}

const mockUsers: UserItem[] = [
  { id: 'USR-101', name: 'Firoj Alam', username: 'Firoj', mobile: '+91 9988776655', mainBalance: 1250, bonusBalance: 140, winningsBalance: 850, matchesPlayed: 42, status: 'ACTIVE' },
  { id: 'USR-102', name: 'Faizan Ahmed', username: 'FaizanX', mobile: '+91 9876543210', mainBalance: 450, bonusBalance: 50, winningsBalance: 120, matchesPlayed: 18, status: 'ACTIVE' },
  { id: 'USR-103', name: 'Aniket Sharma', username: 'AniketPro', mobile: '+91 9123456789', mainBalance: 0, bonusBalance: 10, winningsBalance: 0, matchesPlayed: 5, status: 'FROZEN' },
  { id: 'USR-104', name: 'Rahul Roy', username: 'RahulGamer', mobile: '+91 9555544444', mainBalance: 3100, bonusBalance: 200, winningsBalance: 1950, matchesPlayed: 64, status: 'ACTIVE' },
];

export default function UsersModerationPage() {
  const [users, setUsers] = useState<UserItem[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForAdjust, setSelectedUserForAdjust] = useState<UserItem | null>(null);
  
  // Wallet Adjuster Form
  const [adjustAmount, setAdjustAmount] = useState(100);
  const [adjustType, setAdjustType] = useState<'mainBalance' | 'bonusBalance' | 'winningsBalance'>('mainBalance');
  const [adjustAction, setAdjustAction] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustReason, setAdjustReason] = useState('');

  const toggleFreeze = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE' } : u));
  };

  const handleWalletAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForAdjust || !adjustReason.trim()) return;

    setUsers(prev => prev.map(u => {
      if (u.id === selectedUserForAdjust.id) {
        const delta = adjustAction === 'CREDIT' ? adjustAmount : -adjustAmount;
        const currentVal = u[adjustType];
        return {
          ...u,
          [adjustType]: Math.max(0, currentVal + delta)
        };
      }
      return u;
    }));

    setSelectedUserForAdjust(null);
    setAdjustReason('');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.mobile.includes(searchQuery) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            User Accounts & Wallet Moderation
            <span className="text-xs bg-cyan-50 text-cyan-700 px-2.5 py-0.5 rounded-full font-semibold border border-cyan-200/60">
              {users.length} Users Registered
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Inspect double-entry wallet balances, freeze suspect accounts, and perform manual ledger adjustments.
          </p>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Active Players</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {users.filter(u => u.status === 'ACTIVE').length} Players
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Frozen Accounts</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">
            {users.filter(u => u.status === 'FROZEN').length} Suspended
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">System Liquidity</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            ₹{users.reduce((acc, u) => acc + u.mainBalance + u.winningsBalance, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by Name, Username, Phone, or User ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filteredUsers.length} of {users.length} profiles
        </div>
      </div>

      {/* User Accounts List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">{user.id}</span>
                  <h3 className="font-bold text-slate-900 text-base">{user.name}</h3>
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">@{user.username}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-0.5">
                  <span>Mobile: <strong className="text-slate-800">{user.mobile}</strong></span>
                  <span>Matches Played: <strong className="text-slate-800">{user.matchesPlayed}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                {/* Wallet Balance Breakdown */}
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">
                    Main: <span className="text-slate-900">₹{user.mainBalance}</span> | Win: <span className="text-emerald-600">₹{user.winningsBalance}</span>
                  </div>
                  <div className="text-[11px] text-amber-600 font-semibold">Bonus Cash: ₹{user.bonusBalance}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedUserForAdjust(user)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-lg transition-colors inline-flex items-center gap-1"
                  >
                    <Wallet size={14} /> Adjust Wallet
                  </button>
                  <button
                    onClick={() => toggleFreeze(user.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border inline-flex items-center gap-1 ${
                      user.status === 'ACTIVE'
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200/60'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200/60'
                    }`}
                  >
                    {user.status === 'ACTIVE' ? <><Ban size={14} /> Freeze Account</> : <><CheckCircle2 size={14} /> Unfreeze</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Wallet Adjustment Modal */}
      {selectedUserForAdjust && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Wallet size={18} className="text-indigo-600" /> Adjust Wallet Ledger
              </span>
              <button 
                onClick={() => setSelectedUserForAdjust(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWalletAdjustSubmit} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1 text-xs">
                <span className="text-slate-400 font-semibold block uppercase">Target User</span>
                <span className="font-bold text-slate-900 text-sm block">{selectedUserForAdjust.name} ({selectedUserForAdjust.mobile})</span>
                <div className="text-slate-500 pt-1">
                  Current Balances: Main: ₹{selectedUserForAdjust.mainBalance} | Win: ₹{selectedUserForAdjust.winningsBalance} | Bonus: ₹{selectedUserForAdjust.bonusBalance}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Adjustment Action</label>
                  <select
                    value={adjustAction}
                    onChange={(e) => setAdjustAction(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  >
                    <option value="CREDIT">+ Credit Wallet</option>
                    <option value="DEBIT">- Debit Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Wallet Bucket</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  >
                    <option value="mainBalance">Main Deposit Cash</option>
                    <option value="winningsBalance">Winnings Balance</option>
                    <option value="bonusBalance">Bonus Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Amount (₹)</label>
                <input 
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  min={1}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Audit Log Reason</label>
                <input 
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g., Manual refund for disputed match #7701"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectedUserForAdjust(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!adjustReason.trim()}
                  className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm transition-colors disabled:opacity-50 ${
                    adjustAction === 'CREDIT' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {adjustAction} of ₹{adjustAmount}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
