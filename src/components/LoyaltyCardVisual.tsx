import React from 'react';
import { Sparkles, Check, Gift } from 'lucide-react';
import { LoyaltyCardData } from '../types';
import confetti from 'canvas-confetti';

interface LoyaltyCardVisualProps {
  cardData: LoyaltyCardData;
  onRedeem?: () => void;
  showRedeemButton?: boolean;
}

export const LoyaltyCardVisual: React.FC<LoyaltyCardVisualProps> = ({
  cardData,
  onRedeem,
  showRedeemButton = true,
}) => {
  const stamps = cardData.current_stamps;
  const isRewardReady = stamps === 3 || cardData.total_free_washes_earned > cardData.total_free_washes_redeemed;

  const handleRedeemClick = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
    if (onRedeem) onRedeem();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border border-neutral-800 p-6 md:p-8 shadow-2xl text-white">
      {/* Background ambient crimson glow */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-red-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header of Loyalty Card */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-700 tracking-wider text-xs uppercase">
              Official Digital Rewards Card
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
          </div>
          <h3 className="font-oswald font-700 text-2xl md:text-3xl tracking-wide uppercase text-white mt-1">
            COLLECT &amp; SAVE
          </h3>
          <p className="text-sm font-600 text-red-400 flex items-center gap-1.5 mt-0.5">
            <Sparkles className="w-4 h-4 text-red-500" />
            Every 4th Full Wash is 100% FREE
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-600 text-neutral-400 uppercase tracking-widest block">
            Vehicle Plate
          </span>
          <span className="inline-block mt-1 font-mono font-700 text-base md:text-lg bg-neutral-900/90 text-amber-400 border border-neutral-700 px-3 py-1 rounded tracking-widest shadow-inner">
            {cardData.plate_number || 'DB 44 ZN GP'}
          </span>
        </div>
      </div>

      {/* Stamp Slots (1, 2, 3, 4 FREE) */}
      <div className="relative z-10 my-8">
        <div className="grid grid-cols-4 gap-3 md:gap-6">
          {[1, 2, 3, 4].map((slotNumber) => {
            const isFilled = slotNumber <= stamps;
            const isFourthFreeSlot = slotNumber === 4;
            const isUnlocked = isRewardReady && isFourthFreeSlot;

            return (
              <div
                key={slotNumber}
                className="flex flex-col items-center justify-center text-center"
              >
                <div
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    isFourthFreeSlot
                      ? isUnlocked
                        ? 'border-red-500 bg-red-950/80 shadow-[0_0_25px_rgba(220,38,38,0.7)] animate-pulse'
                        : 'border-red-600/60 bg-neutral-950 text-red-500 border-dashed'
                      : isFilled
                      ? 'border-red-500 bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                      : 'border-neutral-800 bg-neutral-950/80 text-neutral-600'
                  }`}
                >
                  {isFilled ? (
                    <div className="flex flex-col items-center animate-scale-in">
                      <Check className="w-7 h-7 md:w-9 md:h-9 stroke-[3]" />
                      <span className="text-[9px] font-700 uppercase tracking-widest">
                        STAMP #{slotNumber}
                      </span>
                    </div>
                  ) : isFourthFreeSlot ? (
                    <div className="flex flex-col items-center">
                      <Gift
                        className={`w-6 h-6 md:w-8 md:h-8 ${
                          isUnlocked ? 'text-red-400 animate-bounce' : 'text-red-500/70'
                        }`}
                      />
                      <span className="font-oswald font-700 text-xs md:text-sm tracking-wider text-red-500">
                        FREE
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      {/* Crescent silhouette matching menu art */}
                      <svg
                        viewBox="0 0 40 40"
                        className="w-7 h-7 md:w-9 md:h-9 text-red-900/60"
                        fill="currentColor"
                      >
                        <path d="M20 5 C28 5 35 12 35 20 C35 28 28 35 20 35 C15 35 10 32 8 28 C13 29 18 27 21 23 C24 19 23 13 18 8 C19 7 20 5 20 5 Z" />
                      </svg>
                      <span className="text-[10px] font-mono text-neutral-500 mt-1">
                        #{slotNumber}
                      </span>
                    </div>
                  )}

                  {/* Stamp ring glow */}
                  {isFilled && (
                    <span className="absolute -inset-1 rounded-full border border-red-400/40 pointer-events-none" />
                  )}
                </div>

                <span className="text-[11px] font-600 text-neutral-400 mt-2 uppercase tracking-wider">
                  {slotNumber === 4 ? 'Free Reward' : `Wash ${slotNumber}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800/80">
        <div>
          <p className="text-xs text-neutral-400">
            ★ <strong className="text-neutral-200">Only Full Washes</strong> count toward your FREE 4th-wash reward.
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Total full washes recorded: {cardData.total_full_washes} &middot; Total free washes unlocked: {cardData.total_free_washes_earned}
          </p>
        </div>

        {showRedeemButton && (
          <div>
            {isRewardReady ? (
              <button
                onClick={handleRedeemClick}
                className="bg-red-600 hover:bg-red-700 text-white font-700 px-5 py-2.5 rounded-lg text-xs md:text-sm uppercase tracking-wider shadow-lg shadow-red-900/50 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Gift className="w-4 h-4" />
                Redeem Free Full Wash!
              </button>
            ) : (
              <span className="text-xs font-600 text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-lg">
                {3 - stamps} more full wash{3 - stamps === 1 ? '' : 'es'} until free wash!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyCardVisual;
