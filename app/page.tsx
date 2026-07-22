import Link from 'next/link';
import { Wallet, ShieldAlert, Trophy, Users, ArrowUpRight, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

export default function ExecutiveDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      <div className="relative">
        <h1 className="text-3xl font-black text-brand-text tracking-tight flex items-center gap-3">
          Executive Dashboard Overview
          <div className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
        </h1>
        <p className="text-sm text-brand-muted mt-2 max-w-2xl">
          Live platform revenue metrics, pending approval queues, and match activity.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel glass-panel-hover rounded-3xl p-6 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-xs font-bold tracking-wider uppercase text-brand-gold">Net Revenue</span>
            <Wallet className="text-brand-gold opacity-80" size={20} />
          </div>
          <div className="text-4xl font-black text-brand-text tracking-tight">₹42,850</div>
          <div className="text-xs text-brand-emerald font-bold flex items-center gap-1 bg-brand-emerald/10 w-fit px-2 py-1 rounded-md">
            <ArrowUpRight size={14} /> +18.4% vs last week
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-3xl p-6 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-emerald/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-xs font-bold tracking-wider uppercase text-brand-emerald">Approvals</span>
            <Clock className="text-brand-emerald opacity-80" size={20} />
          </div>
          <div className="text-4xl font-black text-brand-text tracking-tight">14</div>
          <div className="text-xs text-brand-muted font-semibold flex gap-2">
            <span className="bg-white/5 px-2 py-1 rounded-md">8 Deposits</span>
            <span className="bg-white/5 px-2 py-1 rounded-md">6 Withdrawals</span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-3xl p-6 space-y-4 relative overflow-hidden group border-brand-rose/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-xs font-bold tracking-wider uppercase text-brand-rose">Disputes</span>
            <ShieldAlert className="text-brand-rose opacity-80 animate-pulse-slow" size={20} />
          </div>
          <div className="text-4xl font-black text-brand-rose tracking-tight drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">3</div>
          <div className="text-xs text-brand-rose/80 font-semibold bg-brand-rose/10 w-fit px-2 py-1 rounded-md">
            Manual review required
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-3xl p-6 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-xs font-bold tracking-wider uppercase text-brand-cyan">Active Contests</span>
            <Trophy className="text-brand-cyan opacity-80" size={20} />
          </div>
          <div className="text-4xl font-black text-brand-text tracking-tight">24</div>
          <div className="text-xs text-brand-muted font-semibold flex gap-2">
             <span className="bg-white/5 px-2 py-1 rounded-md">14 Ludo</span>
             <span className="bg-white/5 px-2 py-1 rounded-md">10 Carrom</span>
          </div>
        </div>
      </div>

      {/* Quick Desk Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Finance Desk */}
        <div className="glass-panel rounded-3xl p-6 space-y-5 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-lg text-brand-text">Financial Desk</h3>
              <span className="text-xs bg-brand-emerald/10 text-brand-emerald px-2.5 py-1 rounded-lg font-bold border border-brand-emerald/20">14 Pending</span>
            </div>
            <p className="text-sm text-brand-muted font-medium">Verify user UPI payment receipts and approve bank IMPS payouts.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/financial/deposits" className="flex items-center justify-between py-3 px-5 bg-brand-emerald text-brand-darker font-bold rounded-xl text-sm hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Deposits Queue <ChevronRight size={16} />
            </Link>
            <Link href="/financial/withdrawals" className="flex items-center justify-between py-3 px-5 bg-brand-darker border border-brand-border hover:border-brand-emerald/50 text-brand-text font-bold rounded-xl text-sm hover:bg-brand-emerald/5 transition-all">
              Withdrawals Queue <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Dispute Desk */}
        <div className="glass-panel rounded-3xl p-6 space-y-5 flex flex-col justify-between group border-brand-rose/20">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-lg text-brand-text">Dispute Desk</h3>
              <span className="text-xs bg-brand-rose/10 text-brand-rose px-2.5 py-1 rounded-lg font-bold border border-brand-rose/20">3 Disputed</span>
            </div>
            <p className="text-sm text-brand-muted font-medium">Review side-by-side screenshot proofs when players have conflicting match results.</p>
          </div>
          <div className="pt-2 mt-auto">
            <Link href="/disputes" className="flex items-center justify-between py-3 px-5 bg-brand-rose text-white font-bold rounded-xl text-sm hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              Resolve Disputes <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Tournament Desk */}
        <div className="glass-panel rounded-3xl p-6 space-y-5 flex flex-col justify-between group border-brand-gold/20">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-lg text-brand-text">Pool Manager</h3>
              <span className="text-xs bg-brand-gold/10 text-brand-gold px-2.5 py-1 rounded-lg font-bold border border-brand-gold/20">Live</span>
            </div>
            <p className="text-sm text-brand-muted font-medium">Create pools, edit entry fees, adjust commission rake %, or pin featured items.</p>
          </div>
          <div className="pt-2 mt-auto">
            <Link href="/tournaments" className="flex items-center justify-between py-3 px-5 bg-gradient-to-r from-brand-gold to-amber-500 text-brand-darker font-bold rounded-xl text-sm hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              Manage Contests <ChevronRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
