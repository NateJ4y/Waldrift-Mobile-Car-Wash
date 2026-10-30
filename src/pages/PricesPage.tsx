import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { CarFront, Truck, BusFront, MapPin, ArrowRight } from 'lucide-react';

const priceRows = [
  { label: 'Sedan / Hatchback', examples: 'Polo, Corolla, Golf', price: 'R80', icon: CarFront },
  { label: 'SUV / 4x4', examples: 'Fortuner, RAV4, X5', price: 'R100', icon: Truck },
  { label: 'Bakkie', examples: 'Hilux, Ranger, D-Max', price: 'R100', icon: Truck },
  { label: 'Van / Minibus', examples: 'Quantum and similar', price: 'R120', icon: BusFront },
];

export const PricesPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">Waldrift Car Wash</p>
        <h1 className="mt-3 font-oswald text-4xl font-bold uppercase text-white sm:text-5xl">Simple. Full. Clean.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">One full wash with straightforward pricing based on your vehicle size.</p>
      </div>
      <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
        {priceRows.map(({ label, examples, price, icon: Icon }, index) => (
          <div key={label} className={`flex items-center justify-between gap-4 p-5 sm:p-6 ${index ? 'border-t border-neutral-800' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-neutral-800 p-3"><Icon className="h-5 w-5 text-red-400" /></div>
              <div><h2 className="font-semibold text-white">{label}</h2><p className="mt-1 text-xs text-neutral-500">{examples}</p></div>
            </div>
            <span className="shrink-0 font-oswald text-2xl font-bold text-white sm:text-3xl">{price}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <MapPin className="h-6 w-6 text-red-400" />
          <h3 className="mt-3 font-oswald text-xl font-bold uppercase text-white">Drive in</h3>
          <p className="mt-1 text-sm text-neutral-400">Bring your vehicle to our wash location in the Waldrift / Vereeniging area.</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <CarFront className="h-6 w-6 text-red-400" />
          <h3 className="mt-3 font-oswald text-xl font-bold uppercase text-white">Mobile wash</h3>
          <p className="mt-1 text-sm text-neutral-400">We can come to your home or workplace. We’ll confirm availability and any travel fee before the booking is final.</p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Button variant="primary" size="lg" onClick={() => setCurrentPage('book')} className="px-8">Book a wash <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </div>
    </main>
  );
};

export default PricesPage;
