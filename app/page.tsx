import Link from 'next/link';
import { Wallet, ShieldAlert, Trophy, Users, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

export default function ExecutiveDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Executive Dashboard Overview</h1>
        <p className="text-sm text-slate-400">Live platform revenue metrics, pending approval queues, and match activity.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase">Net Gaming Revenue (NGR)</span>
            <Wallet className="text-amber-400" size={20} />
          </div>
          <div className="text-3xl font-black text-slate-100">₹42,850</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <ArrowUpRight size={14} /> +18.4% this week
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase">Pending Approvals</span>
            <Clock className="text-emerald-400" size={20} />
          </div>
          <div className="text-3xl font-black text-slate-100">14</div>
          <div className="text-xs text-slate-400 font-medium">
            8 Deposits • 6 Withdrawals
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase">Disputed Matches</span>
            <ShieldAlert className="text-rose-400" size={20} />
          </div>
          <div className="text-3xl font-black text-rose-400">3</div>
          <div className="text-xs text-rose-400/80 font-medium">
            Requires manual screenshot review
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold tracking-wider uppercase">Active Contests</span>
            <Trophy className="text-cyan-400" size={20} />
          </div>
          <div className="text-3xl font-black text-slate-100">24</div>
          <div className="text-xs text-slate-400 font-medium">
            Ludo King (14) • Carrom (10)
          </div>
        </div>
      </div>

      {/* Quick Desk Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Manual Financial Desk</h3>
            <span className="text-xs bg-emerald-400/10 text-emerald-400 px-2.5 py-1 rounded-full font-bold">14 Pending</span>
          </div>
          <p className="text-xs text-slate-400">Verify user UPI payment receipts and approve bank IMPS cash payouts manually.</p>
          <div className="flex gap-3 pt-2">
            <Link href="/financial/deposits" className="flex-1 text-center py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors">
              Deposits Queue
            </Link>
            <Link href="/financial/withdrawals" className="flex-1 text-center py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors">
              Withdrawals Queue
            </Link>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Dispute Resolver Desk</h3>
            <span className="text-xs bg-rose-400/10 text-rose-400 px-2.5 py-1 rounded-full font-bold">3 Disputed</span>
          </div>
          <p className="text-xs text-slate-400">Review side-by-side screenshot proofs when both players claim WON or WON/ERROR.</p>
          <div className="pt-2">
            <Link href="/disputes" className="w-full block text-center py-2.5 px-4 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-xl text-xs transition-colors">
              Resolve 1v1 Disputes
            </Link>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Tournament Pool Manager</h3>
            <span className="text-xs bg-amber-400/10 text-amber-400 px-2.5 py-1 rounded-full font-bold">Featured On</span>
          </div>
          <p className="text-xs text-slate-400">Create new pools, edit entry fees, adjust commission rake %, or pin featured items.</p>
          <div className="pt-2">
            <Link href="/tournaments" className="w-full block text-center py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors">
              Manage Contests & Pools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
