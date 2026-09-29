import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LoyaltyCardVisual } from '../components/LoyaltyCardVisual';
import { Button } from '../components/ui/button';
import { Sparkles, Check, Gift, HelpCircle, Shield, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoyaltyPage: React.FC = () => {
  const { currentUser, vehicles, loyaltyCards, getLoyaltyCardForPlate, redeemFreeWash, setCurrentPage } = useApp();

  const userVehicles = currentUser ? vehicles.filter((v) => v.user_id === currentUser.id) : [];
  const [selectedPlate, setSelectedPlate] = useState<string>(
    userVehicles[0]?.plate_number || 'DB 44 ZN GP'
  );

  const cardData = getLoyaltyCardForPlate(selectedPlate);

  const handleRedeem = () => {
    const success = redeemFreeWash(selectedPlate);
    if (success) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-700 uppercase tracking-widest text-red-500">
          Waldrift Rewards Club
        </span>
        <h1 className="font-oswald font-700 text-3xl sm:text-5xl uppercase tracking-tight text-white">
          DIGITAL LOYALTY CARD
        </h1>
        <p className="text-sm text-neutral-400">
          Our &quot;Collect &amp; Save&quot; program gives you every 4th Full Wash 100% free. No app to install, no paper cards to lose &mdash; stamped automatically by license plate!
        </p>
      </div>

      {/* Plate Switcher if multiple cars */}
      {userVehicles.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs font-600 text-neutral-400 uppercase tracking-wider">
            Viewing Card for:
          </span>
          <div className="flex gap-2">
            {userVehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedPlate(v.plate_number)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-700 uppercase tracking-wider transition-all cursor-pointer ${
                  selectedPlate === v.plate_number
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {v.plate_number} ({v.make})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Interactive Loyalty Card */}
      <div className="max-w-3xl mx-auto">
        <LoyaltyCardVisual
          cardData={cardData}
          onRedeem={handleRedeem}
          showRedeemButton={true}
        />
      </div>

      {/* How it Works Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-500 font-oswald text-xl font-700">
            01
          </div>
          <h3 className="font-oswald font-700 text-xl uppercase text-white">
            Drive In &amp; Wash
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Order a <strong>Full Wash</strong> for your Sedan (R80), SUV (R100), or Bakkie (R120). Full washes include exterior wash, interior vacuum, tyre shine, and glass polish.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-500 font-oswald text-xl font-700">
            02
          </div>
          <h3 className="font-oswald font-700 text-xl uppercase text-white">
            Automatic Camera Stamp
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Staff photographs your vehicle and logs your number plate during check-in. One digital stamp is immediately credited to your vehicle&apos;s loyalty record.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-500 font-oswald text-xl font-700">
            03
          </div>
          <h3 className="font-oswald font-700 text-xl uppercase text-white">
            4th Full Wash is 100% Free
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            When you complete 3 qualifying full washes, your 4th Full Wash reward automatically unlocks. Redeem it online or let staff apply it at the bay counter!
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-4 max-w-2xl mx-auto">
        <Sparkles className="w-8 h-8 text-red-500 mx-auto" />
        <h3 className="font-oswald font-700 text-2xl uppercase text-white">
          READY FOR YOUR NEXT STAMP?
        </h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          Book online ahead of time or request our mobile team within the 10km free callout radius in Vereeniging.
        </p>
        <Button
          variant="primary"
          onClick={() => setCurrentPage('book')}
          className="px-6"
        >
          Book Wash Now &rarr;
        </Button>
      </div>
    </div>
  );
};

export default LoyaltyPage;
