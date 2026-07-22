import './globals.css';
import Link from 'next/link';
import { LayoutDashboard, Wallet, ShieldAlert, Trophy, Users, Dices, Send } from 'lucide-react';

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
      <body className="bg-brand-dark text-brand-text min-h-screen flex selection:bg-brand-gold/30 selection:text-brand-gold">
        
        {/* Sidebar Navigation */}
        <aside className="w-72 glass-panel m-4 rounded-3xl hidden md:flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/5">
          {/* Subtle gradient accent inside sidebar */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-gold/10 to-transparent pointer-events-none" />
          
          <div className="p-6 relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-gold to-amber-600 text-brand-darker font-black flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,215,0,0.4)] relative">
                KH
                <div className="absolute inset-0 rounded-2xl ring-2 ring-brand-gold/50 animate-pulse-slow"></div>
              </div>
              <div>
                <h1 className="font-extrabold text-brand-gold text-sm tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-brand-gold to-amber-400">KhiladiHub</h1>
                <p className="text-xs text-brand-muted font-medium mt-0.5 tracking-wide">Command Center</p>
              </div>
            </div>

            <nav className="space-y-2 text-sm font-semibold">
              <Link href="/" className="group flex items-center gap-3 px-4 py-3 rounded-xl text-brand-muted hover:bg-brand-gold/10 hover:text-brand-gold transition-all duration-300">
                <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform duration-300" /> Executive Dashboard
              </Link>
              <Link href="/financial/deposits" className="group flex items-center gap-3 px-4 py-3 rounded-xl text-brand-muted hover:bg-brand-emerald/10 hover:text-brand-emerald transition-all duration-300">
                <Wallet size={18} className="group-hover:scale-110 transition-transform duration-300" /> Manual Deposits
              </Link>
              <Link href="/financial/withdrawals" className="group flex items-center gap-3 px-4 py-3 rounded-xl text-brand-muted hover:bg-brand-emerald/10 hover:text-brand-emerald transition-all duration-300">
                <Wallet size={18} className="group-hover:scale-110 transition-transform duration-300" /> Manual Withdrawals
              </Link>
              <Link href="/disputes" className="group flex items-center gap-3 px-4 py-3 rounded-xl text-brand-muted hover:bg-brand-rose/10 hover:text-brand-rose transition-all duration-300">
                <ShieldAlert size={18} className="group-hover:scale-110 transition-transform duration-300" /> Match Disputes
              </Link>
              <Link href="/tournaments" className="group flex items-center gap-3 px-4 py-3 rounded-xl text-brand-muted hover:bg-brand-gold/10 hover:text-brand-gold transition-all duration-300">
                <Trophy size={18} className="group-hover:scale-110 transition-transform duration-300" /> Tournaments & Pools
              </Link>
              <Link href="/users" className="group flex items-center gap-3 px-4 py-3 rounded-xl text-brand-muted hover:bg-brand-cyan/10 hover:text-brand-cyan transition-all duration-300">
                <Users size={18} className="group-hover:scale-110 transition-transform duration-300" /> Users & Wallets
              </Link>
              <Link href="/spin-wheel" className="group flex items-center gap-3 px-4 py-3 rounded-xl text-brand-muted hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-300">
                <Dices size={18} className="group-hover:scale-110 transition-transform duration-300" /> Spin Wheel Config
              </Link>
              <Link href="/push-studio" className="group flex items-center gap-3 px-4 py-3 rounded-xl text-brand-muted hover:bg-sky-500/10 hover:text-sky-400 transition-all duration-300">
                <Send size={18} className="group-hover:scale-110 transition-transform duration-300" /> Push Studio
              </Link>
            </nav>
          </div>

          <div className="p-6 border-t border-white/5 relative z-10 bg-brand-darker/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">Version 2.0</span>
              <span className="inline-flex items-center gap-1.5 text-brand-emerald font-bold text-xs bg-brand-emerald/10 px-2.5 py-1 rounded-full border border-brand-emerald/20">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" /> Live
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Shell */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <header className="h-20 bg-brand-dark/80 backdrop-blur-xl border-b border-brand-border px-8 flex items-center justify-between sticky top-0 z-50 transition-all">
            <div className="text-xs text-brand-muted font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
              <span>Vercel Pipeline: <strong className="text-brand-text font-bold">Active (Edge)</strong></span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-gold/20 to-amber-500/10 text-brand-gold border border-brand-gold/30 text-xs font-bold tracking-wide shadow-[0_0_15px_rgba(255,215,0,0.15)]">
                Super Admin
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-card border border-brand-border flex items-center justify-center text-brand-text font-bold shadow-lg hover:border-brand-gold/50 transition-colors cursor-pointer relative group">
                A
                <div className="absolute inset-0 bg-brand-gold/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </header>

          <main className="p-8 flex-1 overflow-y-auto relative">
            {/* Background Glow effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-emerald/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
