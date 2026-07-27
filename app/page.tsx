'use client';

import { useState, useEffect } from 'react';
import { Wallet, ShieldAlert, Trophy, ArrowUpRight, Clock, MoreHorizontal, CheckCircle2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ExecutiveDashboardPage() {
  const [stats, setStats] = useState({
    totalDepositVolume: 0,
    platformRevenue: 0,
    totalProfit: 0,
    pendingDepositsCount: 0,
    pendingWithdrawalsCount: 0,
    openDisputesCount: 0,
    activeContestsCount: 0,
    actionRequiredItems: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  const fetchOverviewStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/overview');
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch overview stats from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  const totalPendingApprovals = stats.pendingDepositsCount + stats.pendingWithdrawalsCount;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Overview</h1>
          <p className="text-sm text-slate-500">
            Welcome back! Here's your live operational desk.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchOverviewStats}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-indigo-600' : ''} /> Refresh Stats
          </button>
          <Link href="/financial/deposits" className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
            Review Pending Queues
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Profit</span>
            <Wallet size={18} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">₹{stats.totalProfit.toLocaleString()}</div>
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            Net Platform Profit
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <ArrowUpRight size={18} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">₹{stats.platformRevenue.toLocaleString()}</div>
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            Gross match fees
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Deposits</span>
            <Wallet size={18} className="text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">₹{stats.totalDepositVolume.toLocaleString()}</div>
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            Total incoming cash
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Approvals</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">{totalPendingApprovals}</div>
          <div className="text-xs text-slate-500 font-medium flex gap-2">
            <span>{stats.pendingDepositsCount} Deposits</span> • <span>{stats.pendingWithdrawalsCount} Withdrawals</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Open Disputes</span>
            <ShieldAlert size={18} className="text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">{stats.openDisputesCount}</div>
          <div className="text-xs text-rose-600 font-semibold flex items-center gap-1">
            {stats.openDisputesCount > 0 ? 'Requires admin attention' : 'No active disputes'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Contests</span>
            <Trophy size={18} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">{stats.activeContestsCount}</div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
            Live pools published
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity Table (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="font-bold text-base text-slate-900">Action Required Desk</h2>
              <p className="text-xs text-slate-500">Live payment approvals queue from Supabase</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.actionRequiredItems.length > 0 ? (
              stats.actionRequiredItems.map((item: any, idx: number) => (
                <div key={item.id || idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 uppercase">
                      {item.users?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">Deposit Request #{item.id}</p>
                      <p className="text-xs text-slate-500">Requested ₹{item.amount} via UPI UTR: {item.utr_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-0.5 rounded-full">Pending Review</span>
                    <Link href="/financial/deposits" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">Review</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <CheckCircle2 size={24} className="text-emerald-500" />
                <span>All pending queues clear! No manual actions required right now.</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links / Status (Takes up 1 column) */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-base text-slate-900">Quick Operations</h2>
          
          <div className="space-y-3">
            <div className="group">
              <Link href="/disputes" className="flex flex-col p-4 border border-slate-200 rounded-lg hover:border-rose-300 hover:bg-rose-50/30 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-slate-900">Resolve Match Disputes</span>
                  <ShieldAlert size={16} className="text-slate-400 group-hover:text-rose-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-500">{stats.openDisputesCount} conflicting match disputes</p>
              </Link>
            </div>
            
            <div className="group">
              <Link href="/financial/withdrawals" className="flex flex-col p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-slate-900">Release Payouts</span>
                  <Wallet size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-500">{stats.pendingWithdrawalsCount} pending IMPS payouts</p>
              </Link>
            </div>
            
            <div className="group">
              <Link href="/tournaments" className="flex flex-col p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-slate-900">Manage Contests</span>
                  <Trophy size={16} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-500">{stats.activeContestsCount} active contest pools</p>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
