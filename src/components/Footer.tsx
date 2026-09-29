import React from 'react';
import { WaldriftLogo } from './WaldriftLogo';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-black border-t border-neutral-800 text-neutral-400 text-sm">
      {/* Red accent ribbon */}
      <div className="h-1 bg-gradient-to-r from-red-700 via-red-600 to-red-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="text-left">
              <WaldriftLogo size="sm" />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Vereeniging&apos;s premier hand car wash, detailing, and mobile wash service. High-pressure foam bays, scratch-free microfiber technique, and our famous 4th wash free loyalty program.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-red-500 font-700 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Free Callout Within 10km Radius</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-700 font-oswald uppercase tracking-widest text-white border-b border-neutral-800 pb-2">
              Customer Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentPage('prices')}
                  className="hover:text-red-500 transition-colors"
                >
                  Full Menu &amp; Price List (Sedan / SUV / Bakkie)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('book')}
                  className="hover:text-red-500 transition-colors text-white font-600"
                >
                  Book Wash (Online &amp; Walk-In)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('loyalty')}
                  className="hover:text-red-500 transition-colors"
                >
                  Digital Loyalty Card (4th Wash FREE)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('referrals')}
                  className="hover:text-red-500 transition-colors"
                >
                  Refer Friends (Get R20 Wash Credit)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('questions')}
                  className="hover:text-red-500 transition-colors"
                >
                  Frequently Asked Questions &amp; Support
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-700 font-oswald uppercase tracking-widest text-white border-b border-neutral-800 pb-2">
              Visit Us in Vereeniging
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Primary Bay:</strong> 19 Andesite Ave, Waldrif, Vereeniging, 1939<br />
                  <strong>Secondary Hub:</strong> 1 Doloriet Ave, Waldrif
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>082 555 1234 &middot; WhatsApp Available</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>info@waldriftwash.co.za</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Monday &ndash; Sunday: 07:30 &ndash; 17:30</span>
              </li>
            </ul>
          </div>

          {/* Payment & Staff Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-700 font-oswald uppercase tracking-widest text-white border-b border-neutral-800 pb-2">
              Payment &amp; Staff Access
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-neutral-400">
                We accept <strong className="text-white">PayPal Online Pre-payment</strong>, debit/credit cards, and cash on arrival.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setCurrentPage('staff-checkin')}
                  className="w-full text-left p-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-red-400 font-600 transition-colors"
                >
                  &rarr; Staff Vehicle Photo Check-in
                </button>
                <button
                  onClick={() => setCurrentPage('plate-lookup')}
                  className="w-full text-left p-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-600 transition-colors"
                >
                  &rarr; License Plate History Lookup
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} Waldrift Car Wash. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Vereeniging, Gauteng, South Africa</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              Built with precision for clean cars <Heart className="w-3 h-3 text-red-600 fill-red-600" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
