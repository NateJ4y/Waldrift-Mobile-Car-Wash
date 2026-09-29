import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WaldriftLogo } from './WaldriftLogo';
import {
  Car,
  Calendar,
  Sparkles,
  Search,
  Camera,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Gift,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
      setCurrentPage,
    currentPage,
    logout,
    messages,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const unreadMessagesCount = messages.filter(
    (m) => !m.read && (currentUser?.role === 'customer' ? m.receiver_id === currentUser.id : m.receiver_id === 'all_staff')
  ).length;

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
      {/* Top micro announcement bar */}
      <div className="bg-red-600 px-4 py-1 text-center text-[11px] font-700 tracking-wider text-white uppercase flex items-center justify-center gap-2">
        <span>WE COME TO YOU &mdash; FREE CALLOUT WITHIN A 10KM RADIUS</span>
        <span className="hidden sm:inline">&bull; 19 Andesite Ave &middot; 1 Doloriet Ave, Vereeniging</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Zone 1: Single element brand mark */}
          <button
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <WaldriftLogo size="sm" />
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-600 text-neutral-300">
            <button
              onClick={() => navigateTo('prices')}
              className={`hover:text-red-500 transition-colors cursor-pointer ${
                currentPage === 'prices' ? 'text-red-500 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Prices &amp; Services
            </button>
            <button
              onClick={() => navigateTo('book')}
              className={`hover:text-red-500 transition-colors cursor-pointer ${
                currentPage === 'book' ? 'text-red-500 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Book Wash
            </button>
            <button
              onClick={() => navigateTo('loyalty')}
              className={`hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1 ${
                currentPage === 'loyalty' ? 'text-red-500 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              Loyalty Card
            </button>
            <button
              onClick={() => navigateTo('referrals')}
              className={`hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1 ${
                currentPage === 'referrals' ? 'text-red-500 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-red-400" />
              Refer a Friend
            </button>

            {/* Staff / Admin Only Navigation */}
            {(currentUser?.role === 'staff' || currentUser?.role === 'admin') && (
              <>
                <button
                  onClick={() => navigateTo('staff-checkin')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-red-600 text-xs font-700 text-red-400 cursor-pointer ${
                    currentPage === 'staff-checkin' ? 'border-red-600 text-red-300 bg-red-950/40' : ''
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Staff Check-In
                </button>
                <button
                  onClick={() => navigateTo('plate-lookup')}
                  className={`flex items-center gap-1 text-xs font-600 hover:text-white cursor-pointer ${
                    currentPage === 'plate-lookup' ? 'text-white' : 'text-neutral-400'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  Plate Lookup
                </button>
              </>
            )}

            {/* Admin Hub */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => navigateTo('admin-dashboard')}
                className={`flex items-center gap-1 text-xs font-700 text-amber-400 hover:text-amber-300 cursor-pointer ${
                  currentPage === 'admin-dashboard' ? 'underline decoration-amber-400 underline-offset-8' : ''
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Hub
              </button>
            )}

            {/* Messages & QA */}
            <button
              onClick={() => navigateTo('messages')}
              className={`relative hover:text-red-500 transition-colors cursor-pointer ${
                currentPage === 'messages' ? 'text-red-500' : ''
              }`}
              title="Chat with staff"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo('questions')}
              className={`hover:text-red-500 transition-colors cursor-pointer ${
                currentPage === 'questions' ? 'text-red-500' : ''
              }`}
              title="Ask a Question"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Account / Dashboard */}
            {currentUser ? (
              <button
                onClick={() =>
                  navigateTo(
                    currentUser.role === 'admin'
                      ? 'admin-dashboard'
                      : currentUser.role === 'staff'
                      ? 'staff-checkin'
                      : 'customer-dashboard'
                  )
                }
                className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-700 uppercase tracking-wider transition-all shadow-md shadow-red-950/40 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-600 cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-600">
            <button
              onClick={() => navigateTo('prices')}
              className="p-2.5 rounded-lg bg-neutral-900 text-left text-neutral-200"
            >
              Prices &amp; Services
            </button>
            <button
              onClick={() => navigateTo('book')}
              className="p-2.5 rounded-lg bg-red-950/60 border border-red-800/80 text-left text-red-300 font-700"
            >
              Book a Wash
            </button>
            <button
              onClick={() => navigateTo('loyalty')}
              className="p-2.5 rounded-lg bg-neutral-900 text-left text-neutral-200"
            >
              Loyalty Card
            </button>
            <button
              onClick={() => navigateTo('referrals')}
              className="p-2.5 rounded-lg bg-neutral-900 text-left text-neutral-200"
            >
              Refer Friends
            </button>
            <button
              onClick={() => navigateTo('customer-dashboard')}
              className="p-2.5 rounded-lg bg-neutral-900 text-left text-neutral-200"
            >
              My Vehicles
            </button>
            <button
              onClick={() => navigateTo('history')}
              className="p-2.5 rounded-lg bg-neutral-900 text-left text-neutral-200"
            >
              Wash History
            </button>
            <button
              onClick={() => navigateTo('messages')}
              className="p-2.5 rounded-lg bg-neutral-900 text-left text-neutral-200 flex items-center justify-between"
            >
              <span>Messages</span>
              {unreadMessagesCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigateTo('questions')}
              className="p-2.5 rounded-lg bg-neutral-900 text-left text-neutral-200"
            >
              Q&amp;A Portal
            </button>
          </div>

          {(currentUser?.role === 'staff' || currentUser?.role === 'admin') && (
            <div className="pt-2 border-t border-neutral-800">
              <span className="text-[11px] font-700 uppercase tracking-wider text-red-500 block mb-2">
                Staff Operations
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigateTo('staff-checkin')}
                  className="p-2.5 rounded-lg bg-neutral-900 text-red-400 font-700 text-left border border-neutral-700"
                >
                  <Camera className="w-4 h-4 inline mr-1.5" /> Staff Check-In
                </button>
                <button
                  onClick={() => navigateTo('plate-lookup')}
                  className="p-2.5 rounded-lg bg-neutral-900 text-neutral-200 text-left border border-neutral-800"
                >
                  <Search className="w-4 h-4 inline mr-1.5" /> Plate Directory
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
