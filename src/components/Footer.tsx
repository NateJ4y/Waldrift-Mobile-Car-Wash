import React from 'react';
import { useApp } from '../context/AppContext';
import { WaldriftLogo } from './WaldriftLogo';
import { MapPin, CarFront } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();
  return (
    <footer className="border-t border-neutral-800 bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-2">
        <div>
          <WaldriftLogo size="sm" />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">Straightforward full car washes in the Waldrift / Vereeniging area. Visit us or ask about a mobile wash.</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-neutral-300 sm:items-end">
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-red-400" /> Waldrift / Vereeniging</span>
          <span className="inline-flex items-center gap-2"><CarFront className="h-4 w-4 text-red-400" /> Drive in or request mobile service</span>
          <div className="flex gap-4 pt-2">
            <button onClick={() => setCurrentPage('prices')} className="hover:text-red-400">Prices</button>
            <button onClick={() => setCurrentPage('book')} className="hover:text-red-400">Book a wash</button>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-900 py-4 text-center text-xs text-neutral-600">© {new Date().getFullYear()} Waldrift Car Wash</div>
    </footer>
  );
};
export default Footer;
