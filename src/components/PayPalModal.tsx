import React, { useState } from 'react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { CheckCircle2, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountZAR: number;
  description: string;
  onPaymentSuccess?: () => void;
}

export const PayPalModal: React.FC<PayPalModalProps> = ({
  isOpen,
  onClose,
  amountZAR,
  description,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [selectedMethod, setSelectedMethod] = useState<'paypal_balance' | 'credit_card'>('paypal_balance');

  // Convert ZAR to approximate USD for PayPal processing
  const rateZarToUsd = 0.054; // 1 ZAR ~ $0.054 USD
  const amountUSD = (amountZAR * rateZarToUsd).toFixed(2);

  const handleSimulatePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }, 1400);
    }, 1800);
  };

  const handleDone = () => {
    setStep('checkout');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={step === 'processing' ? () => {} : onClose}
      maxWidth="md"
      title="PayPal Secure Checkout"
      description="Waldrift Car Wash Online Payment Gateway"
    >
      <div className="space-y-5">
        {/* Step 1: Checkout Form */}
        {step === 'checkout' && (
          <>
            {/* Merchant Header */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block">Merchant</span>
                <span className="text-sm font-700 text-white">Waldrift Car Wash (Pty) Ltd</span>
                <span className="text-xs text-neutral-500 block">19 Andesite Ave, Vereeniging</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 block">Total Due</span>
                <span className="text-xl font-700 text-emerald-400 font-mono">
                  R{amountZAR}
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  &asymp; ${amountUSD} USD
                </span>
              </div>
            </div>

            {/* Order Note */}
            <div className="text-xs text-neutral-300 bg-neutral-800/40 p-3 rounded-lg border border-neutral-700/50">
              <strong className="text-neutral-100">Service:</strong> {description}
            </div>

            {/* PayPal Branding Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#003087]">Pay</span>
                <span className="font-extrabold text-xl tracking-tight text-[#0079c1]">Pal</span>
                <span className="text-[10px] text-neutral-400 ml-2 border border-neutral-700 px-1.5 py-0.5 rounded">
                  Sandbox Active
                </span>
              </div>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                256-bit TLS Encrypted
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-600 text-neutral-300 uppercase tracking-wider block">
                Choose PayPal Source
              </label>

              <div
                onClick={() => setSelectedMethod('paypal_balance')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedMethod === 'paypal_balance'
                    ? 'border-yellow-500 bg-yellow-950/20'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-yellow-500 flex items-center justify-center">
                    {selectedMethod === 'paypal_balance' && (
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-600 text-white block">
                      PayPal Balance (Instant)
                    </span>
                    <span className="text-xs text-neutral-400">
                      Connected account &bull;&bull;&bull;waldrift@user.com
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-600">
                  Ready
                </span>
              </div>

              <div
                onClick={() => setSelectedMethod('credit_card')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedMethod === 'credit_card'
                    ? 'border-yellow-500 bg-yellow-950/20'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-yellow-500 flex items-center justify-center">
                    {selectedMethod === 'credit_card' && (
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-600 text-white block">
                      Linked Card (Debit / Credit)
                    </span>
                    <span className="text-xs text-neutral-400">
                      Visa ending in 4242 &bull; No foreign exchange fees
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-neutral-400">
                  Verified
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 space-y-2">
              <Button
                variant="paypal"
                size="lg"
                onClick={handleSimulatePayment}
                className="w-full text-base py-3 flex items-center justify-center gap-2"
              >
                <span>Pay R{amountZAR} with</span>
                <span className="font-extrabold tracking-tight text-[#003087]">Pay</span>
                <span className="font-extrabold tracking-tight text-[#0079c1]">Pal</span>
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected by PayPal Buyer Protection &amp; Waldrift Service Guarantee</span>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Processing */}
        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-yellow-500/20 border-t-yellow-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-yellow-500">
                PP
              </div>
            </div>
            <div>
              <h4 className="text-lg font-700 text-white">Communicating with PayPal...</h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                Authorizing R{amountZAR} payment and generating confirmed wash reservation.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Success Receipt */}
        {step === 'success' && (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-700 text-white font-oswald uppercase tracking-wider">
                Payment Completed!
              </h4>
              <p className="text-xs text-neutral-300 mt-1">
                Your payment of <strong className="text-emerald-400">R{amountZAR}</strong> via PayPal was successful.
              </p>
            </div>

            <div className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Transaction ID:</span>
                <span className="font-mono text-neutral-200">PAYID-WCW{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Status:</span>
                <span className="text-emerald-400 font-600">CONFIRMED (PAID ONLINE)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Merchant:</span>
                <span className="text-neutral-200">Waldrift Car Wash</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Timestamp:</span>
                <span className="text-neutral-200">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleDone}
            >
              Continue to My Dashboard
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PayPalModal;
