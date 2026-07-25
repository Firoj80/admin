'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Wallet, ShieldAlert, Trophy, 
  Users, Dices, Send
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const mainNav: NavItem[] = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
];

const financialNav: NavItem[] = [
  { href: '/financial/deposits', label: 'Deposits', icon: Wallet },
  { href: '/financial/withdrawals', label: 'Withdrawals', icon: Wallet },
];

const operationsNav: NavItem[] = [
  { href: '/games', label: 'Games & Categories', icon: Dices },
  { href: '/disputes', label: 'Disputes', icon: ShieldAlert },
  { href: '/tournaments', label: 'Tournaments', icon: Trophy },
  { href: '/users', label: 'Users', icon: Users },
];

const configNav: NavItem[] = [
  { href: '/spin-wheel', label: 'Spin Wheel', icon: Dices },
  { href: '/push-studio', label: 'Push Studio', icon: Send },
];

export default function SidebarNav() {
  const pathname = usePathname();

  const renderNavGroup = (items: NavItem[]) => (
    items.map((item) => {
      const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
      const Icon = item.icon;

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
            isActive
              ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs border border-indigo-200/60'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
          }`}
        >
          <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
          <span>{item.label}</span>
          {isActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
          )}
        </Link>
      );
    })
  );

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <div className="text-[11px] font-semibold text-slate-400 px-3 mb-2 uppercase tracking-wider">Main</div>
      {renderNavGroup(mainNav)}

      <div className="text-[11px] font-semibold text-slate-400 px-3 mt-6 mb-2 uppercase tracking-wider">Financial Desk</div>
      {renderNavGroup(financialNav)}

      <div className="text-[11px] font-semibold text-slate-400 px-3 mt-6 mb-2 uppercase tracking-wider">Operations</div>
      {renderNavGroup(operationsNav)}

      <div className="text-[11px] font-semibold text-slate-400 px-3 mt-6 mb-2 uppercase tracking-wider">Config</div>
      {renderNavGroup(configNav)}
    </nav>
  );
}
