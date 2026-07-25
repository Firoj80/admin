'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Ban, CheckCircle2, Wallet, PlusCircle, MinusCircle, X, ShieldAlert, UserPlus, Check, RefreshCw } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUserForAdjust, setSelectedUserForAdjust] = useState<UserItem | null>(null);

  // Add User Form State
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('+91 ');
  const [newUsername, setNewUsername] = useState('');
  const [newInitialDeposit, setNewInitialDeposit] = useState(100);
  const [newInitialBonus, setNewInitialBonus] = useState(25);
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'FROZEN'>('ACTIVE');

  // Wallet Adjuster Form
  const [adjustAmount, setAdjustAmount] = useState(100);
  const [adjustType, setAdjustType] = useState<'mainBalance' | 'bonusBalance' | 'winningsBalance'>('mainBalance');
  const [adjustAction, setAdjustAction] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustReason, setAdjustReason] = useState('');

  // Fetch Users from Live Supabase Database
  const fetchLiveUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const json = await res.json();

      if (json.success && json.data && json.data.length > 0) {
        const mappedUsers: UserItem[] = json.data.map((u: any) => {
          const w = Array.isArray(u.user_wallets) ? u.user_wallets[0] : u.user_wallets;
          return {
            id: u.id,
            name: u.full_name || 'Gamer Profile',
            username: u.username || u.phone || 'gamer',
            mobile: u.phone || 'N/A',
            mainBalance: w ? Number(w.deposit_balance || 0) : 0,
            bonusBalance: w ? Number(w.bonus_balance || 0) : 0,
            winningsBalance: w ? Number(w.winnings_balance || 0) : 0,
            matchesPlayed: 0,
            status: u.account_status === 'FROZEN' ? 'FROZEN' : 'ACTIVE'
          };
        });
        setUsers(mappedUsers);
      }
    } catch (err) {
      console.warn('Failed to fetch live users from Supabase, using state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveUsers();
  }, []);

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim()) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_USER',
          userData: {
            fullName: newFullName,
            phone: newPhone,
            username: newUsername || newFullName.toLowerCase().replace(/\s+/g, ''),
            initialDeposit: newInitialDeposit,
            initialBonus: newInitialBonus,
            status: newStatus
          }
        })
      });

      const json = await res.json();
      if (json.success) {
        // Refresh live user list
        fetchLiveUsers();
        setShowAddUserModal(false);
        setNewFullName('');
        setNewPhone('+91 ');
        setNewUsername('');
        setNewInitialDeposit(100);
        setNewInitialBonus(25);
      } else {
        alert(json.error || 'Failed to create user');
      }
    } catch (err: any) {
      alert('Error creating user: ' + err.message);
    }
  };

  const toggleFreeze = async (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE' } : u));
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_FREEZE', userId: id })
      });
    } catch (err) {
      console.warn('Failed to update freeze status in Supabase:', err);
    }
  };

  const handleWalletAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForAdjust || !adjustReason.trim()) return;

    const targetUser = selectedUserForAdjust;

    setUsers(prev => prev.map(u => {
      if (u.id === targetUser.id) {
        const delta = adjustAction === 'CREDIT' ? adjustAmount : -adjustAmount;
        const currentVal = u[adjustType];
        return {
          ...u,
          [adjustType]: Math.max(0, currentVal + delta)
        };
      }
      return u;
    }));

    try {
      const bucketMap: Record<string, string> = {
        mainBalance: 'deposit_balance',
        bonusBalance: 'bonus_balance',
        winningsBalance: 'winnings_balance'
      };

      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADJUST_WALLET',
          userId: targetUser.id,
          targetBucket: bucketMap[adjustType],
          amount: adjustAmount,
          adjustAction: adjustAction,
          reason: adjustReason
        })
      });
    } catch (err) {
      console.warn('Failed to adjust wallet in Supabase:', err);
    }

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
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold border border-indigo-200/60">
              {users.length} Users Registered
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Create gamer accounts, inspect double-entry wallet balances, freeze suspect profiles, and perform manual balance adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLiveUsers}
            className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg shadow-2xs transition-colors"
            title="Refresh Live Users from Supabase"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-indigo-600' : ''} />
          </button>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <UserPlus size={16} /> Add New User
          </button>
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
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
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
          Showing {filteredUsers.length} of {users.length} registered accounts
        </div>
      </div>

      {/* User Profiles Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider font-semibold text-slate-500">
              <tr>
                <th className="p-4">Gamer Profile</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Deposit Cash</th>
                <th className="p-4">Winnings Cash</th>
                <th className="p-4">Bonus Cash</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200 uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{user.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">@{user.username} • {user.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-700">{user.mobile}</td>
                  <td className="p-4 font-mono font-bold text-slate-900">₹{user.mainBalance}</td>
                  <td className="p-4 font-mono font-bold text-emerald-600">₹{user.winningsBalance}</td>
                  <td className="p-4 font-mono font-bold text-indigo-600">₹{user.bonusBalance}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      user.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {user.status === 'ACTIVE' ? <CheckCircle2 size={11} /> : <Ban size={11} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUserForAdjust(user)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Wallet size={12} /> Adjust Wallet
                      </button>
                      <button
                        onClick={() => toggleFreeze(user.id)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors flex items-center gap-1 ${
                          user.status === 'ACTIVE'
                            ? 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100'
                            : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {user.status === 'ACTIVE' ? <Ban size={12} /> : <CheckCircle2 size={12} />}
                        {user.status === 'ACTIVE' ? 'Freeze' : 'Unfreeze'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus size={18} className="text-indigo-600" /> Add New Gamer Account
              </span>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input 
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g., Firoj Alam"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Phone Number</label>
                <input 
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 9988776655"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">In-Game Username (Optional)</label>
                <input 
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g., FirojPro"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Deposit Credit (₹)</label>
                  <input 
                    type="number"
                    value={newInitialDeposit}
                    onChange={(e) => setNewInitialDeposit(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Bonus Credit (₹)</label>
                  <input 
                    type="number"
                    value={newInitialBonus}
                    onChange={(e) => setNewInitialBonus(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check size={14} /> Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Wallet Adjuster Modal */}
      {selectedUserForAdjust && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Wallet size={18} className="text-indigo-600" /> Adjust Wallet — {selectedUserForAdjust.name}
              </span>
              <button 
                onClick={() => setSelectedUserForAdjust(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWalletAdjustSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Wallet Bucket</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                >
                  <option value="mainBalance">Main Deposit Cash (₹{selectedUserForAdjust.mainBalance})</option>
                  <option value="winningsBalance">Winnings Cash (₹{selectedUserForAdjust.winningsBalance})</option>
                  <option value="bonusBalance">Bonus Cash (₹{selectedUserForAdjust.bonusBalance})</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Action</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setAdjustAction('CREDIT')}
                      className={`py-1 rounded text-xs font-bold transition-all ${
                        adjustAction === 'CREDIT' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Credit
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustAction('DEBIT')}
                      className={`py-1 rounded text-xs font-bold transition-all ${
                        adjustAction === 'DEBIT' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Debit
                    </button>
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
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Audit Reason / Description</label>
                <input 
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g., Promotional Bonus or Manual UTR Correction"
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Execute Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
