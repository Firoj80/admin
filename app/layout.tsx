import './globals.css';
import Link from 'next/link';
import { LayoutDashboard, Wallet, ShieldAlert, Trophy, Users, Dices, Send, LifeBuoy } from 'lucide-react';

export const metadata = {
  title: 'KhiladiHub / Gamer Zone — Admin Control Desk',
  description: 'Production Next.js Admin Panel deployed on Vercel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg shadow-amber-400/20">
                KH
              </div>
              <div>
                <h1 className="font-bold text-amber-400 text-sm tracking-wider uppercase">KhiladiHub</h1>
                <p className="text-xs text-slate-400 font-medium">Admin Control Desk</p>
              </div>
            </div>

            <nav className="space-y-1 text-sm font-medium">
              <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors">
                <LayoutDashboard size={18} /> Executive Dashboard
              </Link>
              <Link href="/financial/deposits" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                <Wallet size={18} /> Manual Deposits
              </Link>
              <Link href="/financial/withdrawals" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors">
                <Wallet size={18} /> Manual Withdrawals
              </Link>
              <Link href="/disputes" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-rose-400 transition-colors">
                <ShieldAlert size={18} /> Match Disputes
              </Link>
              <Link href="/tournaments" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors">
                <Trophy size={18} /> Tournaments & Pools
              </Link>
              <Link href="/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors">
                <Users size={18} /> Users & Wallets
              </Link>
              <Link href="/spin-wheel" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-purple-400 transition-colors">
                <Dices size={18} /> Spin Wheel Config
              </Link>
              <Link href="/push-studio" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition-colors">
                <Send size={18} /> Push Studio
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Production V2.0</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live
            </span>
          </div>
        </aside>

        {/* Main Content Shell */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="text-xs text-slate-400 font-mono">
              Vercel Deployment Pipeline: <span className="text-emerald-400 font-semibold">Active (Edge Regional)</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="px-3 py-1.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Role: Super Admin
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700 font-bold">
                A
              </div>
            </div>
          </header>

          <main className="p-8 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
