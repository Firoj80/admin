import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { 
  LayoutDashboard, Wallet, ShieldAlert, Trophy, 
  Users, Dices, Send, Search, Bell, Menu
} from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KhiladiHub Admin — Modern Control Center",
  description: "Modern Admin Control Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 flex h-screen overflow-hidden antialiased`}>
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 bg-white flex flex-col hidden md:flex shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center mr-3 text-sm shadow-sm">
              KH
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight block text-base leading-none">KhiladiHub</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Admin Portal</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 px-3 mb-2 uppercase tracking-wider">Main</div>
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-sm">
              <LayoutDashboard size={18} />
              Overview
            </Link>

            <div className="text-[11px] font-semibold text-slate-400 px-3 mt-6 mb-2 uppercase tracking-wider">Financial Desk</div>
            <Link href="/financial/deposits" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors">
              <Wallet size={18} />
              Deposits
            </Link>
            <Link href="/financial/withdrawals" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors">
              <Wallet size={18} />
              Withdrawals
            </Link>

            <div className="text-[11px] font-semibold text-slate-400 px-3 mt-6 mb-2 uppercase tracking-wider">Operations</div>
            <Link href="/games" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors">
              <Dices size={18} />
              Games & Categories
            </Link>
            <Link href="/disputes" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors">
              <ShieldAlert size={18} />
              Disputes
            </Link>
            <Link href="/tournaments" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors">
              <Trophy size={18} />
              Tournaments
            </Link>
            <Link href="/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors">
              <Users size={18} />
              Users
            </Link>

            <div className="text-[11px] font-semibold text-slate-400 px-3 mt-6 mb-2 uppercase tracking-wider">Config</div>
            <Link href="/spin-wheel" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors">
              <Dices size={18} />
              Spin Wheel
            </Link>
            <Link href="/push-studio" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors">
              <Send size={18} />
              Push Studio
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
              <button className="md:hidden text-slate-500 hover:text-slate-900">
                <Menu size={20} />
              </button>
              <div className="relative hidden sm:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search users, TXNs..." 
                  className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-slate-600 relative p-1">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-200">
                  AD
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-semibold text-slate-800 block leading-tight">Admin User</span>
                  <span className="text-[10px] text-slate-400 block leading-tight">Super Admin</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
