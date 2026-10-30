import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { MapPin, CarFront, Truck, BusFront, CheckCircle2, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const prices = [
    { label: 'Sedan / Hatchback', price: 'R80', icon: CarFront },
    { label: 'SUV / 4x4', price: 'R100', icon: Truck },
    { label: 'Bakkie', price: 'R100', icon: Truck },
    { label: 'Van / Minibus', price: 'R120', icon: BusFront },
  ];

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-neutral-800">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(220,38,38,0.22),transparent_55%),linear-gradient(135deg,#171717_0%,#090909_55%,#1c0b0b_100%)]">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-neutral-950/45 to-neutral-950" />
        </div>
        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:py-28">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-red-400">Waldrift Car Wash · Vereeniging</p>
          <h1 className="font-oswald text-4xl font-bold uppercase leading-tight text-white sm:text-6xl">
            A clean car.<br /><span className="text-red-500">No complications.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-300">
            Get your vehicle washed at our place, or let us come to you. One straightforward full wash. Clear prices. Easy booking.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="primary" size="lg" onClick={() => setCurrentPage('book')} className="px-8">
              Book a Wash <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => setCurrentPage('prices')} className="px-8">
              See Prices
            </Button>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-neutral-300 sm:flex-row sm:gap-8">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-red-400" /> Drive to us</span>
            <span className="text-neutral-600">or</span>
            <span className="inline-flex items-center gap-2"><CarFront className="h-4 w-4 text-red-400" /> We come to you</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400">Simple pricing</p>
          <h2 className="mt-2 font-oswald text-3xl font-bold uppercase text-white sm:text-4xl">Full wash prices</h2>
          <p className="mt-2 text-sm text-neutral-400">One full wash. The price depends on your vehicle.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {prices.map(({ label, price, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-neutral-800 p-3"><Icon className="h-5 w-5 text-red-400" /></div>
                <span className="font-medium text-white">{label}</span>
              </div>
              <span className="font-oswald text-2xl font-bold text-white">{price}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-neutral-500">Larger or specialised vehicles may need a quick price confirmation before booking.</p>
      </section>

      <section className="mx-auto max-w-5xl px-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-7">
            <MapPin className="h-7 w-7 text-red-400" />
            <h3 className="mt-4 font-oswald text-2xl font-bold uppercase text-white">Come to us</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">Bring your vehicle to our wash location in the Waldrift / Vereeniging area.</p>
          </div>
          <div className="rounded-2xl border border-red-900 bg-red-950/20 p-7">
            <CarFront className="h-7 w-7 text-red-400" />
            <h3 className="mt-4 font-oswald text-2xl font-bold uppercase text-white">We come to you</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">Choose mobile service when booking and tell us where your vehicle is. We’ll confirm availability and any travel fee before the appointment.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-12 text-center">
        <div className="rounded-2xl bg-red-600 px-6 py-10 sm:px-10">
          <CheckCircle2 className="mx-auto h-8 w-8 text-white" />
          <h2 className="mt-3 font-oswald text-3xl font-bold uppercase text-white">Ready for a clean?</h2>
          <p className="mt-2 text-sm text-red-100">Choose your vehicle, pick where you want the wash, and send your booking.</p>
          <Button variant="secondary" size="lg" onClick={() => setCurrentPage('book')} className="mt-6 bg-white px-8 text-neutral-950 hover:bg-neutral-100">
            Book your wash
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
