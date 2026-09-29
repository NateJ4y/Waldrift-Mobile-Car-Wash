import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Gift, Copy, Check, Share2, Users, Banknote, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReferralsPage: React.FC = () => {
  const { currentUser, setCurrentPage } = useApp();
  const [copied, setCopied] = useState(false);

  const referralCode = currentUser?.referral_code || 'SIPHO-WASH';
  const discountBalance = currentUser?.discount_balance || 40;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Get R20 off your car wash at Waldrift Car Wash in Vereeniging using my code: ${referralCode}. Book online or drive in: ${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const MOCK_REFERRALS = [
    {
      id: 'ref-1',
      name: 'Mandla Zulu',
      date: '2026-09-18',
      vehicle: 'BMW 320d (Sedan)',
      reward: 'R20 Credit Earned',
      status: 'completed',
    },
    {
      id: 'ref-2',
      name: 'Katlego Dlamini',
      date: '2026-09-24',
      vehicle: 'Ford Ranger (Bakkie)',
      reward: 'R20 Credit Earned',
      status: 'completed',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-700 uppercase tracking-widest text-red-500">
          Waldrift Referral Program
        </span>
        <h1 className="font-oswald font-700 text-3xl sm:text-5xl uppercase tracking-tight text-white">
          REFER A FRIEND &amp; BOTH GET R20 OFF
        </h1>
        <p className="text-sm text-neutral-400">
          Share the clean car love with friends, family, and colleagues in Vereeniging. When they use your code, they get R20 off their wash and you earn R20 in wash credit!
        </p>
      </div>

      {/* Referral Card */}
      <div className="max-w-2xl mx-auto rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950/30 border border-neutral-800 p-8 shadow-2xl text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-red-950/80 border border-red-700 flex items-center justify-center text-red-500 mx-auto">
          <Gift className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs font-700 uppercase tracking-widest text-neutral-400">
            Your Unique Shareable Code
          </span>
          <div className="mt-2 inline-block bg-neutral-950 border-2 border-dashed border-red-600/70 px-6 py-3 rounded-xl shadow-inner">
            <span className="font-mono font-700 text-2xl sm:text-3xl text-amber-400 tracking-wider">
              {referralCode}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={handleCopyCode}
            className="flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Code Copied to Clipboard!' : 'Copy Code'}
          </Button>

          <Button
            variant="outline"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share via WhatsApp
          </Button>
        </div>

        {/* Credit balance badge */}
        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          <span className="text-neutral-400">Your Current Referral Credit Balance:</span>
          <span className="font-mono font-700 text-emerald-400 text-base">
            R{discountBalance} Available
          </span>
        </div>
      </div>

      {/* Friends Referred List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white">
            Friends You Have Referred
          </h2>
          <span className="text-xs font-mono text-neutral-400">
            {MOCK_REFERRALS.length} Completed Referrals
          </span>
        </div>

        <div className="space-y-3">
          {MOCK_REFERRALS.map((ref) => (
            <div
              key={ref.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <span className="font-700 text-white text-sm block">
                  {ref.name}
                </span>
                <span className="text-xs text-neutral-400">
                  {ref.vehicle} &bull; {ref.date}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-700 text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2.5 py-1 rounded">
                  {ref.reward}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
