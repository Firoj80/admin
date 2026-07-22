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
  title: "KhiladiHub Admin",
  description: "Modern Admin Control Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground flex h-screen overflow-hidden`}>
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
          <div className="h-16 flex items-center px-6 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center mr-3">
              KH
            </div>
            <span className="font-semibold text-lg tracking-tight">KhiladiHub</span>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <div className="text-xs font-semibold text-muted-foreground px-3 mb-2 uppercase tracking-wider">Main</div>
            <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md bg-secondary text-secondary-foreground font-medium">
              <LayoutDashboard size={18} />
              Overview
            </Link>

            <div className="text-xs font-semibold text-muted-foreground px-3 mt-6 mb-2 uppercase tracking-wider">Financial</div>
            <Link href="/financial/deposits" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
              <Wallet size={18} />
              Deposits
            </Link>
            <Link href="/financial/withdrawals" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
              <Wallet size={18} />
              Withdrawals
            </Link>

            <div className="text-xs font-semibold text-muted-foreground px-3 mt-6 mb-2 uppercase tracking-wider">Operations</div>
            <Link href="/disputes" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
              <ShieldAlert size={18} />
              Disputes
            </Link>
            <Link href="/tournaments" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
              <Trophy size={18} />
              Tournaments
            </Link>
            <Link href="/users" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
              <Users size={18} />
              Users
            </Link>

            <div className="text-xs font-semibold text-muted-foreground px-3 mt-6 mb-2 uppercase tracking-wider">Config</div>
            <Link href="/spin-wheel" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
              <Dices size={18} />
              Spin Wheel
            </Link>
            <Link href="/push-studio" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
              <Send size={18} />
              Push Studio
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button className="md:hidden text-muted-foreground hover:text-foreground">
                <Menu size={20} />
              </button>
              <div className="relative hidden sm:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search users, TXNs..." 
                  className="pl-9 pr-4 py-1.5 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-muted-foreground hover:text-foreground relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">
                AD
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
