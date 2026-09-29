import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { WaldriftLogo } from '../components/WaldriftLogo';
import { Lock, Mail, ArrowRight, UserCheck, ShieldCheck, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginUser, setCurrentUser, users, setCurrentPage } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = loginUser(email);
    if (success) {
      setCurrentPage('customer-dashboard');
    } else {
      setError('No user found with that email. Try one of the quick test accounts below or register.');
    }
  };

  const handleQuickLogin = (targetEmail: string, destinationPage: string) => {
    const success = loginUser(targetEmail);
    if (success) {
      setCurrentPage(destinationPage);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <WaldriftLogo size="md" />
          <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white mt-4">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-neutral-400">
            Access your garage, loyalty stamp card, and wash appointments
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. sipho@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="w-4 h-4" />}
          />

          <Button type="submit" variant="primary" size="md" className="w-full">
            Sign In with Email &rarr;
          </Button>
        </form>

        {/* Quick Test Persona Logins */}
        <div className="border-t border-neutral-800 pt-6 space-y-3">
          <span className="text-[11px] font-700 uppercase tracking-wider text-neutral-400 block text-center">
            Instant 1-Click Sandbox Test Personas:
          </span>

          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('sipho@gmail.com', 'customer-dashboard')}
              className="w-full p-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left flex items-center justify-between text-xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-400" />
                <div>
                  <span className="text-white font-600 block">Sipho Mthembu</span>
                  <span className="text-[10px] text-neutral-500">Customer &bull; 2 Cars &bull; 3 Stamps</span>
                </div>
              </div>
              <span className="text-red-400 font-bold uppercase text-[10px]">Customer &rarr;</span>
            </button>

            <button
              onClick={() => handleQuickLogin('thabo@waldriftwash.co.za', 'staff-checkin')}
              className="w-full p-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left flex items-center justify-between text-xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-red-500" />
                <div>
                  <span className="text-white font-600 block">Thabo Ndlovu</span>
                  <span className="text-[10px] text-neutral-500">Staff &bull; Camera Check-In &bull; Wash Bays</span>
                </div>
              </div>
              <span className="text-red-400 font-bold uppercase text-[10px]">Staff Bay &rarr;</span>
            </button>

            <button
              onClick={() => handleQuickLogin('admin@waldriftwash.co.za', 'admin-dashboard')}
              className="w-full p-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left flex items-center justify-between text-xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-white font-600 block">Lerato Khumalo</span>
                  <span className="text-[10px] text-neutral-500">Admin &bull; Revenue Analytics &bull; Price List</span>
                </div>
              </div>
              <span className="text-amber-400 font-bold uppercase text-[10px]">Admin Hub &rarr;</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
          Don&apos;t have an account yet?{' '}
          <button
            onClick={() => setCurrentPage('register')}
            className="text-red-400 hover:text-red-300 font-600 underline"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
