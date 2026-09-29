import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { VehicleType } from '../types';
import { Check, Sparkles, Flame, Shield, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

export const PricesPage: React.FC = () => {
  const { packages, addons, memberships, setCurrentPage } = useApp();
  const [selectedType, setSelectedType] = useState<VehicleType>('sedan');

  const vehicleLabels: Record<VehicleType, { label: string; example: string }> = {
    sedan: { label: 'Sedan / Hatch', example: 'VW Polo, Corolla, Golf, BMW 3' },
    suv: { label: 'SUV / Crossover', example: 'T-Cross, Fortuner, Rav4, X5' },
    bakkie: { label: 'Bakkie / 4x4 / Minibus', example: 'Hilux, Ranger, D-Max, Quantum' },
  };

  const getPackagePrice = (pkg: (typeof packages)[0], type: VehicleType) => {
    if (type === 'sedan') return pkg.price_sedan;
    if (type === 'suv') return pkg.price_suv;
    return pkg.price_bakkie;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-700 uppercase tracking-widest text-red-500">
          Official Waldrift Price List
        </span>
        <h1 className="font-oswald font-700 text-4xl sm:text-5xl uppercase tracking-tight text-white">
          WASH PACKAGES &amp; DETAILED SERVICES
        </h1>
        <p className="text-sm sm:text-base text-neutral-400">
          Simple, honest pricing with zero hidden surcharges. Choose your vehicle category below to see accurate pricing for your ride.
        </p>

        {/* Free Callout Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/70 border border-red-800 text-red-300 text-xs font-700 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span>We come to you &mdash; Free callout within a 10km radius in Vereeniging</span>
        </div>
      </div>

      {/* Vehicle Type Interactive Filter Tabs */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <span className="text-xs font-600 uppercase tracking-wider text-neutral-400">
          Select Your Vehicle Category:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl w-full">
          {(['sedan', 'suv', 'bakkie'] as VehicleType[]).map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg text-xs font-700 transition-all cursor-pointer text-center uppercase tracking-wider ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <div>{vehicleLabels[type].label}</div>
                <div className={`text-[10px] lowercase tracking-normal font-normal mt-0.5 truncate ${isSelected ? 'text-red-100' : 'text-neutral-500'}`}>
                  {vehicleLabels[type].example}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wash Packages Matrix */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white">
            Primary Wash Packages
          </h2>
          <span className="text-xs font-mono text-neutral-400">
            Selected: <strong className="text-red-400 uppercase font-bold">{selectedType}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const currentPrice = getPackagePrice(pkg, selectedType);

            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl bg-neutral-900 border p-6 flex flex-col justify-between transition-all shadow-xl ${
                  pkg.is_popular
                    ? 'border-red-600 shadow-red-950/40 ring-1 ring-red-600/50'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-700 uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    ★ MOST POPULAR
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-oswald font-700 text-2xl uppercase text-white tracking-wide">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-red-400 font-600 mt-0.5">
                        {pkg.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Big Price Display */}
                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-neutral-400 uppercase font-600 block">
                        {selectedType} price
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-4xl font-700 text-white font-mono">
                          R{currentPrice}
                        </span>
                        <span className="text-xs text-neutral-500">/ wash</span>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-neutral-400">
                      <div>Sedan: R{pkg.price_sedan}</div>
                      <div>SUV: R{pkg.price_suv}</div>
                      <div>Bakkie: R{pkg.price_bakkie}</div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Loyalty Eligibility Note */}
                  {pkg.counts_for_loyalty ? (
                    <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Earns 1 digital stamp toward your <strong>FREE 4th Full Wash</strong></span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-500">
                      Standard express wash (Full Washes earn loyalty stamps)
                    </div>
                  )}

                  {/* Feature List */}
                  <ul className="space-y-2 text-xs text-neutral-300 pt-2 border-t border-neutral-800/80">
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
                    className="w-full text-xs uppercase tracking-wider"
                    onClick={() => setCurrentPage('book', { packageId: pkg.id, vehicleType: selectedType })}
                  >
                    Select &amp; Book {pkg.name} &rarr;
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add-on Services & Engine Wash */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white">
              Add-On Services &amp; Detailing
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Available as upgrades for any wash package or on-demand drive-in
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons.map((addon) => {
            const isEngineWash = addon.id === 'addon-engine-wash';

            return (
              <div
                key={addon.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isEngineWash
                    ? 'bg-neutral-900 border-red-600/80 shadow-lg shadow-red-950/20'
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-oswald font-700 text-lg uppercase text-white flex items-center gap-1.5">
                        {isEngineWash && <Flame className="w-4 h-4 text-red-500" />}
                        {addon.name}
                      </h3>
                      {isEngineWash && (
                        <span className="text-[10px] font-700 text-red-400 uppercase tracking-widest">
                          Menu Highlight
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-700 text-xl text-white bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800">
                      R{addon.price}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {addon.description}
                  </p>

                  <div className="text-[11px] text-neutral-500 font-mono">
                    Estimated duration: ~{addon.duration_minutes} mins
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setCurrentPage('book', { addon: addon.id, vehicleType: selectedType })}
                  >
                    Add to Wash Appointment
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Membership & Subscriptions */}
      <div className="space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="text-xs font-700 text-red-500 uppercase tracking-widest">
            Regular Driver Value
          </span>
          <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white">
            Subscription &amp; Membership Passes
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Unlimited care for fleet owners, business professionals, and car enthusiasts in the Vaal Triangle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memberships.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl bg-neutral-900 border flex flex-col justify-between ${
                plan.is_popular
                  ? 'border-red-600 shadow-xl shadow-red-950/30 ring-1 ring-red-600/40'
                  : 'border-neutral-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-oswald font-700 text-2xl uppercase text-white">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">{plan.description}</p>
                  </div>
                  {plan.is_popular && (
                    <span className="bg-red-600 text-white text-[10px] font-700 uppercase tracking-widest px-2.5 py-1 rounded">
                      Best Value
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <span className="text-3xl font-700 text-white font-mono">
                    R{plan.price_monthly}
                  </span>
                  <span className="text-xs text-neutral-400">/ month per vehicle</span>
                </div>

                <ul className="space-y-2 text-xs text-neutral-300">
                  {plan.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-800">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setCurrentPage('book', { membership: plan.id })}
                >
                  Join {plan.name}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricesPage;
