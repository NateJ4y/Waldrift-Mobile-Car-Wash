import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VehicleType, PaymentMethod, BookingType } from '../types';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { PayPalModal } from '../components/PayPalModal';
import {
  Calendar,
  Clock,
  Car,
  Check,
  ShieldCheck,
  Tag,
  AlertCircle,
  MapPin,
  Sparkles,
  CreditCard,
  Banknote,
  Gift,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookAppointmentPage: React.FC = () => {
  const {
    currentUser,
    packages,
    addons,
    vehicles,
    addVehicle,
    createBooking,
    setCurrentPage,
    pageParams,
    applyReferralCode,
  } = useApp();

  // Selected State
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [customPlate, setCustomPlate] = useState<string>('');
  const [customMakeModel, setCustomMakeModel] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(
    (pageParams.vehicleType as VehicleType) || 'sedan'
  );

  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    pageParams.packageId || 'pkg-full-wash'
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(
    pageParams.addon ? [pageParams.addon] : []
  );

  const [bookingType, setBookingType] = useState<BookingType>('scheduled');
  const [scheduledDate, setScheduledDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState<string>('10:00');
  const [serviceLocationType, setServiceLocationType] = useState<'bay' | 'callout'>('bay');
  const [calloutAddress, setCalloutAddress] = useState<string>('');

  const [customerName, setCustomerName] = useState<string>(currentUser?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser?.email || '');
  const [notes, setNotes] = useState<string>('');

  // Referral code
  const [referralInput, setReferralInput] = useState<string>('');
  const [referralDiscount, setReferralDiscount] = useState<number>(0);
  const [referralMessage, setReferralMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Payment
  const [paymentChoice, setPaymentChoice] = useState<'paypal' | 'arrival'>('arrival');
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState<boolean>(false);
  const [isBookingSubmitted, setIsBookingSubmitted] = useState<boolean>(false);
  const [createdBookingId, setCreatedBookingId] = useState<string>('');

  // Prepopulate if customer has vehicles
  useEffect(() => {
    if (currentUser && vehicles.length > 0 && !selectedVehicleId) {
      const userCars = vehicles.filter((v) => v.user_id === currentUser.id);
      if (userCars.length > 0) {
        setSelectedVehicleId(userCars[0].id);
        setVehicleType(userCars[0].vehicle_type);
      }
    }
  }, [currentUser, vehicles]);

  // Handle vehicle change
  const handleSelectSavedVehicle = (vehId: string) => {
    setSelectedVehicleId(vehId);
    const found = vehicles.find((v) => v.id === vehId);
    if (found) {
      setVehicleType(found.vehicle_type);
    }
  };

  // Toggle addon
  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Current package and price calculations
  const selectedPkg = packages.find((p) => p.id === selectedPackageId) || packages[2];
  let pkgBasePrice = selectedPkg.price_sedan;
  if (vehicleType === 'suv') pkgBasePrice = selectedPkg.price_suv;
  if (vehicleType === 'bakkie') pkgBasePrice = selectedPkg.price_bakkie;

  const addonsTotal = selectedAddonIds.reduce((sum, id) => {
    const item = addons.find((a) => a.id === id);
    return sum + (item ? item.price : 0), 0;
  }, 0);

  const subtotal = pkgBasePrice + addonsTotal;
  const finalTotal = Math.max(0, subtotal - referralDiscount);

  // Apply Referral Code Handler
  const handleCheckReferral = () => {
    if (!referralInput.trim()) return;
    const result = applyReferralCode(referralInput);
    if (result.valid) {
      setReferralDiscount(result.discountAmount);
      setReferralMessage({ text: result.message, isError: false });
    } else {
      setReferralDiscount(0);
      setReferralMessage({ text: result.message, isError: true });
    }
  };

  const handleCompleteBooking = (paymentStatus: 'paid_online' | 'pay_on_arrival') => {
    let vehicleName = customMakeModel || 'Custom Vehicle';
    let vehiclePlate = customPlate.toUpperCase().trim() || 'NOT-SPECIFIED';

    if (selectedVehicleId) {
      const v = vehicles.find((item) => item.id === selectedVehicleId);
      if (v) {
        vehicleName = `${v.make} ${v.model} (${v.color})`;
        vehiclePlate = v.plate_number;
      }
    } else if (currentUser && customPlate) {
      // Auto save newly entered vehicle to user's garage
      addVehicle({
        user_id: currentUser.id,
        make: customMakeModel.split(' ')[0] || 'Vehicle',
        model: customMakeModel.split(' ').slice(1).join(' ') || 'Standard',
        color: 'Clean',
        plate_number: vehiclePlate,
        vehicle_type: vehicleType,
      });
    }

    const addonNames = selectedAddonIds
      .map((id) => addons.find((a) => a.id === id)?.name)
      .filter(Boolean) as string[];

    const finalNotes = [
      notes,
      serviceLocationType === 'callout' ? `[MOBILE CALLOUT TO: ${calloutAddress}]` : '[BAY DRIVE-IN: 19 Andesite Ave]',
    ]
      .filter(Boolean)
      .join(' ');

    const newBooking = createBooking({
      user_id: currentUser?.id,
      customer_name: customerName.trim() || 'Driver',
      customer_phone: customerPhone.trim() || '0820000000',
      customer_email: customerEmail.trim() || 'driver@waldrift.co.za',
      vehicle_id: selectedVehicleId || undefined,
      vehicle_plate: vehiclePlate,
      vehicle_type: vehicleType,
      vehicle_name: vehicleName,
      service_package_id: selectedPkg.id,
      service_package_name: selectedPkg.name,
      addon_ids: selectedAddonIds,
      addon_names: addonNames,
      scheduled_date: bookingType === 'scheduled' ? scheduledDate : new Date().toISOString().split('T')[0],
      scheduled_time: bookingType === 'scheduled' ? scheduledTime : 'Immediate Walk-in',
      booking_type: bookingType,
      payment_status: paymentStatus,
      payment_method: paymentStatus === 'paid_online' ? 'paypal' : 'cash_on_arrival',
      amount_subtotal: subtotal,
      discount_amount: referralDiscount,
      referral_code_used: referralDiscount > 0 ? referralInput.toUpperCase() : undefined,
      amount_total: finalTotal,
      notes: finalNotes,
    });

    setCreatedBookingId(newBooking.id);
    setIsBookingSubmitted(true);

    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentChoice === 'paypal') {
      setIsPayPalModalOpen(true);
    } else {
      handleCompleteBooking('pay_on_arrival');
    }
  };

  const handlePayPalSuccess = () => {
    setIsPayPalModalOpen(false);
    handleCompleteBooking('paid_online');
  };

  if (isBookingSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-red-950/80 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-500 animate-bounce">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <div>
          <span className="text-xs font-700 uppercase tracking-widest text-red-500">
            Booking Confirmed &bull; Ref #{createdBookingId}
          </span>
          <h1 className="font-oswald font-700 text-3xl sm:text-4xl uppercase text-white mt-1">
            YOU&apos;RE READY FOR THE SHINE!
          </h1>
          <p className="text-sm text-neutral-300 mt-2 max-w-md mx-auto">
            We have reserved your wash slot. Our team has received your vehicle details and license plate.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-left space-y-3 shadow-xl">
          <div className="flex justify-between border-b border-neutral-800 pb-3">
            <div>
              <span className="text-xs text-neutral-400 block">Package</span>
              <span className="font-oswald font-700 text-lg uppercase text-white">
                {selectedPkg.name} ({vehicleType.toUpperCase()})
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400 block">Total</span>
              <span className="font-mono font-700 text-lg text-emerald-400">
                R{finalTotal}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div>
              <span className="text-neutral-500 block">Date &amp; Time</span>
              <span className="font-600 text-neutral-200">
                {bookingType === 'scheduled' ? `${scheduledDate} at ${scheduledTime}` : 'Walk-In Today (Immediate)'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Payment Method</span>
              <span className="font-600 text-neutral-200">
                {paymentChoice === 'paypal' ? 'Paid Online via PayPal' : 'Pay on Arrival (Cash/Card)'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Service Location</span>
              <span className="font-600 text-neutral-200">
                {serviceLocationType === 'callout' ? `Callout: ${calloutAddress}` : '19 Andesite Ave, Waldrif'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Loyalty Eligible</span>
              <span className="font-600 text-red-400">
                {selectedPkg.counts_for_loyalty ? '★ Yes (+1 Stamp on arrival)' : 'No (Standard Express)'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Button
            variant="primary"
            onClick={() => setCurrentPage('customer-dashboard')}
          >
            Go to My Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage('loyalty')}
          >
            View Loyalty Stamp Card
          </Button>
        </div>
      </div>
    );
  }

  const userVehicles = currentUser ? vehicles.filter((v) => v.user_id === currentUser.id) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-700 uppercase tracking-widest text-red-500">
          Book Wash Appointment
        </span>
        <h1 className="font-oswald font-700 text-3xl sm:text-5xl uppercase tracking-tight text-white">
          RESERVE YOUR CAR WASH
        </h1>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto">
          Book online in under 2 minutes. Choose to pay securely with PayPal or pay at our bay in cash/card.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Vehicle Information */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="font-oswald font-700 text-xl uppercase tracking-wider text-white">
                Vehicle Details
              </h2>
              <p className="text-xs text-neutral-400">
                Select a registered car or enter your license plate for visit tracking
              </p>
            </div>
          </div>

          {/* Saved vehicles if customer */}
          {userVehicles.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-600 text-neutral-300 uppercase tracking-wider block">
                Select From Your Garage
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userVehicles.map((veh) => {
                  const isSelected = selectedVehicleId === veh.id;
                  return (
                    <div
                      key={veh.id}
                      onClick={() => handleSelectSavedVehicle(veh.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-red-600 bg-red-950/20 shadow-md shadow-red-950/30'
                          : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Car className={`w-5 h-5 ${isSelected ? 'text-red-500' : 'text-neutral-400'}`} />
                        <div>
                          <span className="text-sm font-700 text-white block">
                            {veh.make} {veh.model}
                          </span>
                          <span className="text-xs font-mono text-amber-400">
                            {veh.plate_number} &bull; {veh.vehicle_type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {veh.visits_count} visits
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedVehicleId('')}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                >
                  Or enter another vehicle manually &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Manual Entry or New Vehicle */}
          {(!selectedVehicleId || userVehicles.length === 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Number Plate"
                placeholder="e.g. DB 44 ZN GP"
                value={customPlate}
                onChange={(e) => setCustomPlate(e.target.value.toUpperCase())}
                required={!selectedVehicleId}
                helperText="Required for tracking visits & stamps"
              />
              <Input
                label="Make & Model"
                placeholder="e.g. VW Polo / Toyota Hilux"
                value={customMakeModel}
                onChange={(e) => setCustomMakeModel(e.target.value)}
                required={!selectedVehicleId}
              />
              <div>
                <label className="block text-xs font-600 text-neutral-300 uppercase tracking-wider mb-1.5">
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-800 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                >
                  <option value="sedan">Sedan / Hatchback</option>
                  <option value="suv">SUV / Crossover</option>
                  <option value="bakkie">Bakkie / 4x4 / Minibus</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Wash Package & Add-ons */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="font-oswald font-700 text-xl uppercase tracking-wider text-white">
                Choose Wash Package &amp; Add-ons
              </h2>
              <p className="text-xs text-neutral-400">
                Prices automatically adjust for your vehicle category ({vehicleType.toUpperCase()})
              </p>
            </div>
          </div>

          {/* Package Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              let price = pkg.price_sedan;
              if (vehicleType === 'suv') price = pkg.price_suv;
              if (vehicleType === 'bakkie') price = pkg.price_bakkie;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-red-600 bg-red-950/20 shadow-lg shadow-red-950/40 ring-1 ring-red-600'
                      : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-oswald font-700 text-lg uppercase text-white">
                        {pkg.name}
                      </span>
                      {pkg.is_popular && (
                        <span className="text-[9px] font-700 bg-red-600 text-white px-2 py-0.5 rounded">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-700 text-white font-mono">
                      R{price}
                    </div>
                    <p className="text-xs text-neutral-400">
                      {pkg.tagline}
                    </p>
                    {pkg.counts_for_loyalty && (
                      <span className="text-[10px] text-red-400 font-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Earns Loyalty Stamp
                      </span>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-600">
                    <span className={isSelected ? 'text-red-400' : 'text-neutral-500'}>
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-red-600 bg-red-600' : 'border-neutral-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add-ons checkboxes */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <span className="text-xs font-600 text-neutral-300 uppercase tracking-wider block">
              Optional Add-on Services:
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
                        ? 'border-red-600/80 bg-neutral-900 shadow-sm'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'border-red-600 bg-red-600' : 'border-neutral-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <span className="text-xs font-600 text-white block">
                          {addon.name}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {addon.description}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-700 text-white ml-2 shrink-0">
                      +R{addon.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Date, Time & Service Mode */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="font-oswald font-700 text-xl uppercase tracking-wider text-white">
                Schedule &amp; Service Location
              </h2>
              <p className="text-xs text-neutral-400">
                Book a bay time or request free mobile callout within 10km
              </p>
            </div>
          </div>

          {/* Mode: Bay Drive-In vs Mobile Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setServiceLocationType('bay')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                serviceLocationType === 'bay'
                  ? 'border-red-600 bg-red-950/20'
                  : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-sm font-700 text-white uppercase">Drive-In to Wash Bay</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                19 Andesite Ave, Waldrif, Vereeniging. Customer lounge &amp; high pressure foam bays.
              </p>
            </div>

            <div
              onClick={() => setServiceLocationType('callout')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                serviceLocationType === 'callout'
                  ? 'border-red-600 bg-red-950/20'
                  : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-400" />
                <span className="text-sm font-700 text-white uppercase">Mobile Callout (We Come to You)</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                FREE callout within a 10km radius in Vereeniging. We bring all water &amp; equipment!
              </p>
            </div>
          </div>

          {serviceLocationType === 'callout' && (
            <Input
              label="Callout Physical Address"
              placeholder="e.g. 45 Beethoven St, SW 5, Vanderbijlpark / Vereeniging"
              value={calloutAddress}
              onChange={(e) => setCalloutAddress(e.target.value)}
              required
              helperText="Must be within 10km radius of Waldrift for free callout"
            />
          )}

          {/* Scheduled vs Walk-in */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-600 text-neutral-300 uppercase tracking-wider mb-1.5">
                Arrival Style
              </label>
              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value as BookingType)}
                className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-800 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
              >
                <option value="scheduled">Schedule Date &amp; Time</option>
                <option value="walk_in">Immediate Walk-in Today</option>
              </select>
            </div>

            {bookingType === 'scheduled' && (
              <>
                <Input
                  label="Appointment Date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-600 text-neutral-300 uppercase tracking-wider mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-800 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
                  >
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map(
                      (time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Step 4: Contact & Referral Discount */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 font-bold text-sm">
              4
            </div>
            <div>
              <h2 className="font-oswald font-700 text-xl uppercase tracking-wider text-white">
                Contact &amp; Referral Code
              </h2>
              <p className="text-xs text-neutral-400">
                Apply a referral code to get R20 off your wash!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Your Full Name"
              placeholder="e.g. Sipho Mthembu"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <Input
              label="Cell Phone / WhatsApp"
              placeholder="e.g. 082 555 1234"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. name@gmail.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>

          {/* Referral Code Field */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
            <label className="text-xs font-600 text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-red-400" />
              Have a Friend&apos;s Referral Code? (Get R20 Off)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. SIPHO-WASH or WALDRIFT20"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                className="flex-1 rounded-lg bg-neutral-900 border border-neutral-700 px-3 text-sm font-mono text-amber-400 uppercase tracking-wider focus:outline-none focus:border-red-600"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCheckReferral}
              >
                Apply Code
              </Button>
            </div>

            {referralMessage && (
              <p
                className={`text-xs flex items-center gap-1 ${
                  referralMessage.isError ? 'text-red-400' : 'text-emerald-400 font-600'
                }`}
              >
                {referralMessage.isError ? <AlertCircle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                {referralMessage.text}
              </p>
            )}
          </div>

          <Textarea
            label="Special Instructions or Notes"
            placeholder="e.g. Extra dirt on wheels, child car seat installed, or please call upon arrival"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Step 5: Payment Method & Review */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 font-bold text-sm">
              5
            </div>
            <div>
              <h2 className="font-oswald font-700 text-xl uppercase tracking-wider text-white">
                Payment Option &amp; Confirmation
              </h2>
              <p className="text-xs text-neutral-400">
                Choose between online PayPal pre-payment or pay on arrival
              </p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentChoice('arrival')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                paymentChoice === 'arrival'
                  ? 'border-red-600 bg-red-950/20'
                  : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
              }`}
            >
              <Banknote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-700 text-white uppercase block">
                  Pay on Arrival (Cash or Card)
                </span>
                <span className="text-xs text-neutral-400">
                  Pay directly at the bay counter at 19 Andesite Ave after your car is clean.
                </span>
              </div>
            </div>

            <div
              onClick={() => setPaymentChoice('paypal')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                paymentChoice === 'paypal'
                  ? 'border-yellow-500 bg-yellow-950/20 ring-1 ring-yellow-500/60'
                  : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
              }`}
            >
              <CreditCard className="w-5 h-5 text-[#0079c1] shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-700 text-white uppercase flex items-center gap-1.5">
                  <span>PayPal Online Pre-payment</span>
                  <span className="text-[10px] text-yellow-400 font-mono font-bold bg-yellow-950/60 px-1 rounded">
                    Instant
                  </span>
                </span>
                <span className="text-xs text-neutral-400">
                  Pay with PayPal account, Visa, or Mastercard. Fast track check-in upon arrival.
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary Receipt Box */}
          <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-2.5">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>{selectedPkg.name} ({vehicleType.toUpperCase()})</span>
              <span className="font-mono text-neutral-200">R{pkgBasePrice}</span>
            </div>

            {selectedAddonIds.map((id) => {
              const a = addons.find((item) => item.id === id);
              if (!a) return null;
              return (
                <div key={id} className="flex justify-between text-xs text-neutral-400">
                  <span>+ {a.name}</span>
                  <span className="font-mono text-neutral-200">R{a.price}</span>
                </div>
              );
            })}

            {referralDiscount > 0 && (
              <div className="flex justify-between text-xs text-emerald-400 font-600 border-t border-neutral-800/80 pt-2">
                <span>Referral Discount ({referralInput})</span>
                <span className="font-mono">-R{referralDiscount}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-700 text-white border-t border-neutral-800 pt-3">
              <span>Total Due:</span>
              <span className="font-mono text-xl text-emerald-400 font-700">
                R{finalTotal}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <Button
            type="submit"
            variant={paymentChoice === 'paypal' ? 'paypal' : 'primary'}
            size="lg"
            className="w-full text-base py-3.5"
          >
            {paymentChoice === 'paypal' ? (
              <span className="flex items-center gap-1.5">
                Proceed to PayPal Checkout &bull; R{finalTotal}
              </span>
            ) : (
              <span>Confirm Appointment (Pay R{finalTotal} on Arrival) &rarr;</span>
            )}
          </Button>
        </div>
      </form>

      {/* PayPal Modal */}
      <PayPalModal
        isOpen={isPayPalModalOpen}
        onClose={() => setIsPayPalModalOpen(false)}
        amountZAR={finalTotal}
        description={`${selectedPkg.name} (${vehicleType.toUpperCase()}) - ${customPlate || 'Vehicle'}`}
        onPaymentSuccess={handlePayPalSuccess}
      />
    </div>
  );
};

export default BookAppointmentPage;
