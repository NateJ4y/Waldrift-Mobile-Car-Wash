import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WaldriftLogo } from './WaldriftLogo';
import { Menu, X, User, ShieldCheck, Camera } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, setCurrentPage, currentPage, signOut } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const go = (page: string) => { setCurrentPage(page); setMobileOpen(false); };
  const links = [
    { label: 'Home', page: 'landing' },
    { label: 'Prices', page: 'prices' },
    { label: 'Book a Wash', page: 'book' },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => go('landing')} aria-label="Waldrift home"><WaldriftLogo size="sm" /></button>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(link => <button key={link.page} onClick={() => go(link.page)} className={`text-sm font-semibold transition-colors hover:text-red-400 ${currentPage === link.page ? 'text-red-400' : 'text-neutral-300'}`}>{link.label}</button>)}
          {(currentUser?.role === 'staff' || currentUser?.role === 'admin') && <button onClick={() => go('staff-checkin')} className="text-sm font-semibold text-neutral-300 hover:text-red-400"><Camera className="mr-1 inline h-4 w-4" /> Check-in</button>}
          {currentUser?.role === 'admin' && <button onClick={() => go('admin-dashboard')} className="text-sm font-semibold text-amber-400"><ShieldCheck className="mr-1 inline h-4 w-4" /> Admin</button>}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {currentUser ? <>
            <button onClick={() => go(currentUser.role === 'admin' ? 'admin-dashboard' : currentUser.role === 'staff' ? 'staff-checkin' : 'customer-dashboard')} className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-2 text-xs font-semibold text-white"><User className="h-4 w-4" /> My account</button>
            <button onClick={() => void signOut()} className="text-xs text-neutral-400 hover:text-white">Sign out</button>
          </> : <button onClick={() => go('login')} className="text-sm text-neutral-300 hover:text-white">Sign in</button>}
          <button onClick={() => go('book')} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">Book now</button>
        </div>
        <button className="p-2 text-neutral-300 md:hidden" aria-label="Toggle menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
      </div>
      {mobileOpen && <div className="space-y-2 border-t border-neutral-800 px-4 py-4 md:hidden">
        {links.map(link => <button key={link.page} onClick={() => go(link.page)} className="block w-full rounded-lg bg-neutral-900 px-4 py-3 text-left text-sm text-white">{link.label}</button>)}
        {currentUser ? <><button onClick={() => go(currentUser.role === 'admin' ? 'admin-dashboard' : currentUser.role === 'staff' ? 'staff-checkin' : 'customer-dashboard')} className="block w-full rounded-lg bg-neutral-900 px-4 py-3 text-left text-sm text-white">My account</button><button onClick={() => void signOut()} className="block w-full px-4 py-2 text-left text-sm text-neutral-400">Sign out</button></> : <button onClick={() => go('login')} className="block w-full px-4 py-2 text-left text-sm text-neutral-300">Sign in</button>}
        <button onClick={() => go('book')} className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white">Book now</button>
      </div>}
    </header>
  );
};
export default Navbar;
