import { Wallet, ShieldAlert, Trophy, ArrowUpRight, ArrowDownRight, Clock, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function ExecutiveDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-card border border-border text-sm font-medium rounded-md shadow-sm hover:bg-accent transition-colors">
            Download Report
          </button>
          <Link href="/financial/deposits" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm hover:opacity-90 transition-opacity">
            Review Pending Queues
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <span className="text-sm font-medium">Total Revenue</span>
            <Wallet size={16} />
          </div>
          <div className="text-2xl font-bold mb-1">₹42,850.00</div>
          <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <ArrowUpRight size={14} /> +18.4% from last month
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <span className="text-sm font-medium">Pending Approvals</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-bold mb-1">14</div>
          <div className="text-xs text-muted-foreground font-medium flex gap-2">
            <span>8 Deposits</span> • <span>6 Withdrawals</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <span className="text-sm font-medium">Open Disputes</span>
            <ShieldAlert size={16} />
          </div>
          <div className="text-2xl font-bold mb-1">3</div>
          <div className="text-xs text-rose-600 font-medium flex items-center gap-1">
            <ArrowDownRight size={14} /> Requires attention
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <span className="text-sm font-medium">Active Contests</span>
            <Trophy size={16} />
          </div>
          <div className="text-2xl font-bold mb-1">24</div>
          <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <ArrowUpRight size={14} className="text-emerald-600" /> +2 since yesterday
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity Table (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-lg">Action Required</h2>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                    U{i}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Deposit Verification</p>
                    <p className="text-xs text-muted-foreground">User requested ₹500 via UPI</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Pending</span>
                  <Link href="/financial/deposits" className="text-sm font-medium text-primary hover:underline">Review</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links / Status (Takes up 1 column) */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="font-semibold text-lg">Quick Actions</h2>
          
          <div className="space-y-4">
            <div className="group">
              <Link href="/disputes" className="flex flex-col p-4 border border-border rounded-lg hover:border-primary transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Resolve Disputes</span>
                  <ShieldAlert size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-muted-foreground">Review 3 conflicting match results</p>
              </Link>
            </div>
            
            <div className="group">
              <Link href="/financial/withdrawals" className="flex flex-col p-4 border border-border rounded-lg hover:border-primary transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Release Payouts</span>
                  <Wallet size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-muted-foreground">Approve 6 pending IMPS withdrawals</p>
              </Link>
            </div>
            
            <div className="group">
              <Link href="/tournaments" className="flex flex-col p-4 border border-border rounded-lg hover:border-primary transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Manage Tournaments</span>
                  <Trophy size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-muted-foreground">Create or edit prize pools</p>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
