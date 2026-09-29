import React from 'react';
import { useApp } from '../context/AppContext';
import { LoyaltyCardVisual } from '../components/LoyaltyCardVisual';
import { Button } from '../components/ui/button';
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Camera,
  CheckCircle2,
  Users,
  Car,
  Gift,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, packages, loyaltyCards } = useApp();

  // Get sample loyalty card for visual demonstration
  const sampleCard = loyaltyCards['DB 44 ZN GP'] || {
    plate_number: 'DB 44 ZN GP',
    current_stamps: 3,
    total_full_washes: 3,
    total_free_washes_earned: 0,
    total_free_washes_redeemed: 0,
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden border-b border-neutral-800">
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_carwash_bay_1790713496421.jpg"
            alt="Waldrift Car Wash high-end wash bay in Vereeniging"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
          />
          {/* Measured contrast scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-neutral-950/60 to-neutral-950" />
        </div>

        {/* Ambient red glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-700 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Vereeniging&apos;s #1 Hand Car Wash &amp; Mobile Detailing
          </div>

          <h1 className="font-oswald font-700 text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-white leading-none">
            PRECISION WASH. <br />
            <span className="text-red-600">UNMATCHED SHINE.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
            From quick exterior rinses to full interior restorations and engine degreasing. Book online with PayPal or drive in today. Every 4th Full Wash is 100% free!
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setCurrentPage('book')}
              className="text-base px-8 py-3.5 shadow-2xl shadow-red-950/80 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Wash Online
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentPage('prices')}
              className="text-base px-6 py-3.5"
            >
              View Prices &amp; Services
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-neutral-800/80 mt-8">
            <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
              <span className="text-xs text-neutral-400 block">Starting From</span>
              <span className="text-lg font-700 text-white font-oswald">R40 &middot; SEDAN</span>
            </div>
            <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
              <span className="text-xs text-neutral-400 block">Mobile Service</span>
              <span className="text-lg font-700 text-red-400 font-oswald">FREE CALLOUT (10KM)</span>
            </div>
            <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
              <span className="text-xs text-neutral-400 block">Loyalty Reward</span>
              <span className="text-lg font-700 text-white font-oswald">4TH WASH FREE</span>
            </div>
            <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
              <span className="text-xs text-neutral-400 block">License Plate Tracking</span>
              <span className="text-lg font-700 text-white font-oswald">CAMERA CHECK-IN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Free Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-900 via-red-800 to-neutral-950 border border-red-700 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-block text-[11px] font-700 uppercase tracking-widest bg-black/40 px-3 py-1 rounded text-red-200">
              On-Demand Mobile Service
            </div>
            <h2 className="font-oswald font-700 text-2xl sm:text-3xl uppercase tracking-wide text-white">
              WE COME TO YOU &mdash; FREE CALLOUT WITHIN A 10KM RADIUS
            </h2>
            <p className="text-sm text-red-100 max-w-xl">
              Relax at home or work in Waldrif, Vereeniging, and surrounds while our mobile team washes and details your vehicle right in your driveway.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage('book')}
              className="bg-white text-neutral-950 hover:bg-neutral-100 font-700"
            >
              Book Mobile Callout
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentPage('questions')}
              className="text-white hover:bg-black/30 border border-white/20"
            >
              Check Callout Areas
            </Button>
          </div>
        </div>
      </section>

      {/* Real Pricing Preview matching Menu */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-700 uppercase tracking-widest text-red-500">
            Transparent Pricing
          </span>
          <h2 className="font-oswald font-700 text-3xl sm:text-4xl uppercase text-white tracking-wide">
            OUR WASH PACKAGES
          </h2>
          <p className="text-sm text-neutral-400">
            Real prices directly from our service board. Sedan, SUV, and Bakkie categories tailored to your vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl bg-neutral-900 border p-6 flex flex-col justify-between transition-all hover:border-red-600/70 shadow-xl ${
                pkg.is_popular
                  ? 'border-red-600 shadow-red-950/40'
                  : 'border-neutral-800'
              }`}
            >
              {pkg.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[11px] font-700 uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  ★ MOST POPULAR
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-oswald font-700 text-2xl text-white uppercase tracking-wider">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-red-400 font-600 mt-0.5">
                    {pkg.tagline}
                  </p>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Price Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 text-center">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-600 block">Sedan</span>
                    <span className="text-lg font-700 text-white font-mono">R{pkg.price_sedan}</span>
                  </div>
                  <div className="border-x border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase font-600 block">SUV</span>
                    <span className="text-lg font-700 text-white font-mono">R{pkg.price_suv}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-600 block">Bakkie</span>
                    <span className="text-lg font-700 text-white font-mono">R{pkg.price_bakkie}</span>
                  </div>
                </div>

                {/* Feature Checklist */}
                <ul className="space-y-2 text-xs text-neutral-300 pt-2">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-800">
                <Button
                  variant={pkg.is_popular ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={() => setCurrentPage('book', { packageId: pkg.id })}
                >
                  Book {pkg.name}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Engine Wash Callout */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-lg bg-red-950/80 border border-red-800 flex items-center justify-center text-red-500 font-oswald text-xl font-700">
              R70
            </div>
            <div>
              <h4 className="font-oswald font-700 text-lg uppercase text-white">
                ENGINE WASH &mdash; SPECIAL ADD-ON
              </h4>
              <p className="text-xs text-neutral-400">
                Degreased &amp; rinsed clean with specialized engine-safe solvents. Available for any vehicle.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage('book', { packageId: 'pkg-full-wash', addon: 'addon-engine-wash' })}
          >
            Add to Next Booking
          </Button>
        </div>
      </section>

      {/* Collect & Save Loyalty Feature */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-700 uppercase tracking-widest text-red-500">
            Customer Rewards
          </span>
          <h2 className="font-oswald font-700 text-3xl sm:text-4xl uppercase text-white tracking-wide">
            COLLECT &amp; SAVE LOYALTY CARD
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            No messy paper cards lost in your glovebox! Your visits are stamped automatically by license plate number. Every 4th Full Wash is 100% free.
          </p>
        </div>

        <LoyaltyCardVisual cardData={sampleCard} />
      </section>

      {/* Staff Vehicle Tracking & Camera Feature Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10">
          <div className="space-y-4">
            <span className="text-xs font-700 uppercase tracking-widest text-red-500 flex items-center gap-1.5">
              <Camera className="w-4 h-4" /> Smart Operations
            </span>
            <h2 className="font-oswald font-700 text-3xl sm:text-4xl uppercase text-white tracking-wide">
              LICENSE PLATE RECOGNITION &amp; PHOTO LOGGING
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              When you pull into our wash bays, our staff takes an intake photo of your vehicle and scans your number plate. The system instantly recalls:
            </p>

            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Exact number of times your car has visited Waldrift Car Wash</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Your accumulated loyalty stamps and free wash eligibility</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Previous wash packages, engine cleans, and preferred finishes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Before-and-after photo inspections stored securely for peace of mind</span>
              </li>
            </ul>

            <div className="pt-2 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentPage('staff-checkin')}
                className="text-xs"
              >
                Try Staff Check-In Demo
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage('plate-lookup')}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Search Plate History &rarr;
              </Button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-neutral-700 shadow-2xl">
            <img
              src="/src/assets/images/sample_vehicle_checkin_1790713519472.jpg"
              alt="Staff vehicle inspection photo"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono block">Plate Identified</span>
                  <span className="text-base font-mono font-700 text-amber-400">DB 44 ZN GP</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 font-mono block">Verified Visits</span>
                  <span className="text-base font-mono font-700 text-emerald-400">3 Visits &bull; Next FREE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referrals Callout */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-xs font-700 uppercase tracking-widest text-red-500 flex items-center justify-center md:justify-start gap-1.5">
              <Gift className="w-4 h-4" /> Share The Shine
            </span>
            <h3 className="font-oswald font-700 text-2xl sm:text-3xl uppercase text-white">
              REFER FRIENDS &amp; BOTH GET R20 OFF
            </h3>
            <p className="text-sm text-neutral-400 max-w-lg">
              Give your friends R20 off their first wash at Waldrift, and receive R20 credit added directly to your account when they visit!
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setCurrentPage('referrals')}
            className="shrink-0"
          >
            Get My Referral Code
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
