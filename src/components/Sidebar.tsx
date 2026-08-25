'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'My Trips', icon: 'map', path: '/dashboard' },
    { name: 'Comparison', icon: 'compare_arrows', path: '/wizard/comparison' },
    { name: 'Cost Tracking', icon: 'payments', path: '/dashboard/analytics' },
    { name: 'Stays', icon: 'hotel', path: '/wizard/stays' },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-40 bg-surface flex flex-col p-6 gap-4 border-r border-outline-variant/20 hidden lg:flex">
      <div className="mb-8">
        <h1 className="font-serif text-xl text-primary font-bold">PlanYatri</h1>
        <p className="font-sans text-[10px] uppercase tracking-widest text-slate-500 mt-1">Premium Travel Planner</p>
      </div>
      
      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all scale-95 active:scale-100 font-sans text-sm font-medium tracking-wide ${
              pathname === item.path
                ? 'bg-white shadow-sm text-primary'
                : 'text-slate-500 hover:bg-slate-100 hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200/20">
        <button className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-medium mb-6 transition-all duration-300 shadow-md hover:shadow-lg">
          New Trip
        </button>
        <div className="space-y-2">
          <a className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-primary transition-colors font-sans text-xs uppercase tracking-widest" href="#">
            <span className="material-symbols-outlined text-sm">settings</span>
            Settings
          </a>
          <a className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-primary transition-colors font-sans text-xs uppercase tracking-widest" href="#">
            <span className="material-symbols-outlined text-sm">help</span>
            Support
          </a>
        </div>
      </div>
    </aside>
  );
}
