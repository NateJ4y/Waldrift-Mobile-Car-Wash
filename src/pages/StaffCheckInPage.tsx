import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VehicleType, PaymentMethod } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import {
  Camera,
  Car,
  Search,
  Sparkles,
  Gift,
  Check,
  ShieldCheck,
  Receipt,
  AlertCircle,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StaffCheckInPage: React.FC = () => {
  const {
    currentUser,
    packages,
    addons,
    lookupPlate,
    recordStaffCheckIn,
    setCurrentPage,
  } = useApp();

  // Intake State
  const [plateInput, setPlateInput] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('sedan');
  const [vehicleSummary, setVehicleSummary] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-full-wash');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(['addon-engine-wash']);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_arrival');
  const [staffNotes, setStaffNotes] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [redeemFreeWash, setRedeemFreeWash] = useState<boolean>(false);

  // Modals & Confirmation
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [completedRecord, setCompletedRecord] = useState<any>(null);

  // Real-time lookup info
  const plateLookupResult = lookupPlate(plateInput);
  const visitsCount = plateLookupResult.totalVisits;
  const currentStamps = plateLookupResult.loyaltyCard?.current_stamps || (visitsCount % 4);
  const isEligibleForFreeReward = currentStamps === 3;

  // Auto-fill details if known plate is typed
  useEffect(() => {
    if (plateLookupResult.registeredVehicle) {
      setVehicleSummary(
        `${plateLookupResult.registeredVehicle.make} ${plateLookupResult.registeredVehicle.model} (${plateLookupResult.registeredVehicle.color})`
      );
      setVehicleType(plateLookupResult.registeredVehicle.vehicle_type);
    }
  }, [plateInput]);

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePhotoCaptured = (capturedUrl: string, detectedPlate?: string) => {
    setPhotoUrl(capturedUrl);
    if (detectedPlate) {
      setPlateInput(detectedPlate.toUpperCase().trim());
    }
  };

  // Pricing calculations
  const selectedPkg = packages.find((p) => p.id === selectedPackageId) || packages[0];
  let pkgPrice = selectedPkg?.price_sedan || 0;
  if (vehicleType === 'suv') pkgPrice = selectedPkg?.price_suv || 0;
  if (vehicleType === 'bakkie') pkgPrice = selectedPkg?.price_bakkie || 0;

  const addonsTotal = selectedAddonIds.reduce((sum, id) => {
    const a = addons.find((item) => item.id === id);
    return sum + (a ? a.price : 0), 0;
  }, 0);

  let finalAmount = pkgPrice + addonsTotal;
  if (redeemFreeWash) {
    finalAmount = Math.max(0, finalAmount - pkgPrice);
  }

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateInput.trim()) return;

    const result = recordStaffCheckIn({
      plate_number: plateInput,
      vehicle_type: vehicleType,
      vehicle_summary: vehicleSummary || 'Vehicle',
      service_package_id: selectedPackageId,
      addon_ids: selectedAddonIds,
      photo_url: photoUrl,
      customer_name: customerName,
      customer_phone: customerPhone,
      notes: staffNotes,
      payment_method: paymentMethod,
      redeem_free_wash: redeemFreeWash,
    });

    setCompletedRecord(result.record);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-700 uppercase tracking-widest text-red-500">
              Operational Service Station
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
              Active Operator: {currentUser?.full_name} ({currentUser?.role})
            </span>
          </div>
          <h1 className="font-oswald font-700 text-3xl sm:text-4xl uppercase text-white mt-1">
            STAFF VEHICLE CHECK-IN &amp; STAMPING
          </h1>
          <p className="text-xs text-neutral-400">
            Photograph arriving car, look up visit history, award loyalty stamp, and dispatch to bay
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setCurrentPage('plate-lookup')}
          className="shrink-0 text-xs"
        >
          <Search className="w-3.5 h-3.5 mr-1" />
          Lookup All Plates
        </Button>
      </div>

      {completedRecord ? (
        /* Completion Voucher Screen */
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-red-950/80 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-500 animate-bounce">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <span className="text-xs font-700 uppercase tracking-widest text-red-500">
              Check-In Logged &bull; Receipt #{completedRecord.id}
            </span>
            <h2 className="font-oswald font-700 text-3xl uppercase text-white mt-1">
              VEHICLE DISPATCHED TO WASH BAY
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Loyalty stamps updated &bull; Total visits now: <strong>{visitsCount + 1}</strong>
            </p>
          </div>

          <div className="max-w-md mx-auto bg-neutral-950 border border-neutral-800 rounded-xl p-5 text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-400">Number Plate:</span>
              <span className="font-mono font-700 text-amber-400 text-sm">{completedRecord.plate_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Vehicle:</span>
              <span className="text-neutral-200">{completedRecord.vehicle_summary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Service:</span>
              <span className="text-white font-600 uppercase font-oswald">{completedRecord.service_package_name}</span>
            </div>
            {completedRecord.addon_names.length > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Add-ons:</span>
                <span className="text-red-400">{completedRecord.addon_names.join(', ')}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-neutral-800 pt-2 text-sm font-700">
              <span className="text-neutral-300">Total Charged:</span>
              <span className="font-mono text-emerald-400">R{completedRecord.amount_paid}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => {
                setCompletedRecord(null);
                setPlateInput('');
                setStaffNotes('');
                setRedeemFreeWash(false);
              }}
            >
              Check-In Next Vehicle &rarr;
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage('plate-lookup')}
            >
              View Plate History
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCheckInSubmit} className="space-y-6">
          {/* Section 1: Number Plate & Camera Capture */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-oswald font-700 text-xl uppercase tracking-wider text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-red-500" />
                1. Vehicle Intake &amp; Plate Recognition
              </h2>
              <span className="text-xs font-mono text-neutral-400">Step 1 of 3</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plate input & quick lookup banner */}
              <div className="space-y-4">
                <Input
                  label="Number Plate (Lookup / Scan)"
                  placeholder="e.g. ABC 123 GP"
                  value={plateInput}
                  onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                  required
                  helperText="Instant lookup displays how many times this vehicle has visited"
                />

                {/* Live Real-Time Plate Visit Tracker Badge */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400 uppercase font-600">
                      Vehicle Visit History:
                    </span>
                    <span className="text-xs font-mono font-700 bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800">
                      {visitsCount} PREVIOUS VISITS
                    </span>
                  </div>

                  <div className="text-xs text-neutral-300">
                    {visitsCount > 0 ? (
                      <p>
                        This vehicle has been here <strong className="text-white">{visitsCount} times</strong> before.
                        Current stamp count: <strong className="text-amber-400">{currentStamps} of 4 stamps</strong>.
                      </p>
                    ) : (
                      <p className="text-neutral-500">
                        First-time visitor! Checking in will create a fresh vehicle profile and digital loyalty card.
                      </p>
                    )}
                  </div>

                  {isEligibleForFreeReward && (
                    <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-600 text-xs text-red-200 flex items-center gap-2 animate-pulse">
                      <Gift className="w-4 h-4 text-red-400 shrink-0" />
                      <span>
                        <strong>4TH WASH REWARD READY!</strong> This customer is eligible for a 100% FREE Full Wash today.
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Vehicle Description"
                    placeholder="e.g. VW Polo White"
                    value={vehicleSummary}
                    onChange={(e) => setVehicleSummary(e.target.value)}
                    required
                  />
                  <div>
                    <label className="block text-xs font-600 text-neutral-300 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                      className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-800 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                    >
                      <option value="sedan">Sedan / Hatch</option>
                      <option value="suv">SUV / Crossover</option>
                      <option value="bakkie">Bakkie / 4x4</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Photo Box */}
              <div className="space-y-3">
                <label className="block text-xs font-600 text-neutral-300 uppercase tracking-wider">
                  Vehicle Intake Photo
                </label>
                <div className="relative aspect-video rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Vehicle photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-neutral-500">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                      <span className="text-xs">No photo taken yet</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => setIsCameraOpen(true)}
                      className="shadow-lg text-xs"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1" />
                      {photoUrl ? 'Retake / Change Photo' : 'Take Picture'}
                    </Button>
                  </div>
                </div>
                <span className="text-[11px] text-neutral-400 block">
                  Takes snapshot using device camera or file upload for plate verification and paint condition.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Services & Add-ons */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-oswald font-700 text-xl uppercase tracking-wider text-white">
                2. Select Wash Package &amp; Stamping
              </h2>
              <span className="text-xs font-mono text-neutral-400">Step 2 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {packages.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                let price = pkg.price_sedan;
                if (vehicleType === 'suv') price = pkg.price_suv;
                if (vehicleType === 'bakkie') price = pkg.price_bakkie;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-950/20 ring-1 ring-red-600'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-oswald font-700 text-lg uppercase text-white">
                        {pkg.name}
                      </span>
                      <span className="font-mono font-700 text-base text-white">
                        R{price}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">{pkg.tagline}</p>
                    {pkg.counts_for_loyalty && (
                      <span className="text-[10px] text-red-400 font-600 mt-2 block">
                        ★ Automatically adds +1 loyalty stamp
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Addons */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-600 text-neutral-300 uppercase tracking-wider block">
                Add-on Services:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addons.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-red-600 bg-neutral-900'
                          : 'border-neutral-800 bg-neutral-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked ? 'border-red-600 bg-red-600' : 'border-neutral-700'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-xs font-600 text-white">{addon.name}</span>
                      </div>
                      <span className="text-xs font-mono text-neutral-300">+R{addon.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Free Wash Voucher Redemption Checkbox */}
            {isEligibleForFreeReward && (
              <div
                onClick={() => setRedeemFreeWash(!redeemFreeWash)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  redeemFreeWash
                    ? 'border-emerald-500 bg-emerald-950/30'
                    : 'border-red-800 bg-red-950/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      redeemFreeWash ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-red-600'
                    }`}
                  >
                    {redeemFreeWash && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-sm font-700 text-white block uppercase">
                      Redeem 4th Full Wash (FREE REWARD)
                    </span>
                    <span className="text-xs text-neutral-300">
                      Discounts Full Wash to R0 and resets 4-stamp card cycle.
                    </span>
                  </div>
                </div>
                <span className="font-mono font-700 text-emerald-400 text-base">
                  -R{pkgPrice}
                </span>
              </div>
            )}
          </div>

          {/* Section 3: Payment & Dispatch */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="font-oswald font-700 text-xl uppercase tracking-wider text-white">
                3. Payment Collection &amp; Staff Notes
              </h2>
              <span className="text-xs font-mono text-neutral-400">Step 3 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-600 text-neutral-300 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-800 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                >
                  <option value="cash_on_arrival">Cash (Bay Counter)</option>
                  <option value="card_on_arrival">Speedpoint Card Machine</option>
                  <option value="paypal">Pre-Paid Online (PayPal)</option>
                </select>
              </div>

              <Input
                label="Customer Name (Optional)"
                placeholder="e.g. Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <Input
                label="Customer Phone (Optional)"
                placeholder="e.g. 082 000 0000"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>

            <Textarea
              label="Staff Bay Notes"
              placeholder="e.g. Muddy wheel arches, clean exhaust tips, scratch on left rear door noted"
              value={staffNotes}
              onChange={(e) => setStaffNotes(e.target.value)}
            />

            {/* Total and Submit */}
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-neutral-400 uppercase font-600 block">
                  Amount to Collect
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-700 font-mono text-emerald-400">
                    R{finalAmount}
                  </span>
                  {redeemFreeWash && (
                    <span className="text-xs text-neutral-400 line-through">
                      R{pkgPrice + addonsTotal}
                    </span>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8"
              >
                Complete Check-In &amp; Award Stamp &rarr;
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handlePhotoCaptured}
        defaultPlate={plateInput}
      />
    </div>
  );
};

export default StaffCheckInPage;
