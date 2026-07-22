'use client';

import { useState } from 'react';
import { Users, Search, Shield, Ban, CheckCircle2, Wallet } from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  username: string;
  mobile: string;
  mainBalance: number;
  bonusBalance: number;
  matchesPlayed: number;
  status: 'ACTIVE' | 'FROZEN';
}

const mockUsers: UserItem[] = [
  { id: 'USR-101', name: 'Firoj Alam', username: 'Firoj', mobile: '+919988776655', mainBalance: 1250, bonusBalance: 140, matchesPlayed: 42, status: 'ACTIVE' },
  { id: 'USR-102', name: 'Faizan Ahmed', username: 'FaizanX', mobile: '+919876543210', mainBalance: 450, bonusBalance: 50, matchesPlayed: 18, status: 'ACTIVE' },
  { id: 'USR-103', name: 'Aniket Sharma', username: 'AniketPro', mobile: '+919123456789', mainBalance: 0, bonusBalance: 10, matchesPlayed: 5, status: 'FROZEN' },
];

export default function UsersModerationPage() {
  const [users, setUsers] = useState<UserItem[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFreeze = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE' } : u));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.mobile.includes(searchQuery)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">User Accounts & Wallet Moderation</h1>
        <p className="text-sm text-slate-400">Search gamer profiles, inspect double-entry balances, and freeze suspect wallets.</p>
      </div>

      <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 max-w-md">
        <Search size={18} className="text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Name, Username, or Mobile..."
          className="bg-transparent text-slate-100 text-sm focus:outline-none w-full placeholder:text-slate-500"
        />
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-cyan-400 font-bold">{user.id}</span>
                  <h3 className="font-bold text-slate-100 text-sm">{user.name}</h3>
                  <span className="text-xs text-amber-400 font-bold">@{user.username}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span>Mobile: <strong className="text-slate-200">{user.mobile}</strong></span>
                  <span>Matches: <strong className="text-slate-200">{user.matchesPlayed}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">Main: ₹{user.mainBalance}</div>
                  <div className="text-xs text-amber-400 font-medium">Bonus: ₹{user.bonusBalance}</div>
                </div>

                <button
                  onClick={() => toggleFreeze(user.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ${
                    user.status === 'ACTIVE'
                      ? 'bg-slate-800 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-slate-700'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {user.status === 'ACTIVE' ? <><Ban size={14} /> Freeze Wallet</> : <><CheckCircle2 size={14} /> Unfreeze Account</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
