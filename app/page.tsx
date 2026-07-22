import { Wallet, ShieldAlert, Trophy, ArrowUpRight, ArrowDownRight, Clock, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function ExecutiveDashboardPage() {
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
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            Download Report
          </button>
          <Link href="/financial/deposits" className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
            Review Pending Queues
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <Wallet size={18} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">₹42,850.00</div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight size={14} /> +18.4% from last month
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Approvals</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">14</div>
          <div className="text-xs text-slate-500 font-medium flex gap-2">
            <span>8 Deposits</span> • <span>6 Withdrawals</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Open Disputes</span>
            <ShieldAlert size={18} className="text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">3</div>
          <div className="text-xs text-rose-600 font-semibold flex items-center gap-1">
            <ArrowDownRight size={14} /> Requires admin attention
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Contests</span>
            <Trophy size={18} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">24</div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <ArrowUpRight size={14} className="text-emerald-600" /> +2 since yesterday
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
              <p className="text-xs text-slate-500">Manual payment approvals and match dispute queue</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                    U{i}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">Deposit Verification #{1000 + i}</p>
                    <p className="text-xs text-slate-500">User requested ₹500 via UPI UTR proof</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-0.5 rounded-full">Pending Review</span>
                  <Link href="/financial/deposits" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">Review</Link>
                </div>
              </div>
            ))}
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
                <p className="text-xs text-slate-500">Review 3 conflicting screenshot proofs</p>
              </Link>
            </div>
            
            <div className="group">
              <Link href="/financial/withdrawals" className="flex flex-col p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-slate-900">Release Payouts</span>
                  <Wallet size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-500">Approve 6 pending bank IMPS payouts</p>
              </Link>
            </div>
            
            <div className="group">
              <Link href="/tournaments" className="flex flex-col p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-slate-900">Manage Contests</span>
                  <Trophy size={16} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-500">Create or edit contest entry fees</p>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
