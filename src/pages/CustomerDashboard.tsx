import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LoyaltyCardVisual } from '../components/LoyaltyCardVisual';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { Vehicle, VehicleType } from '../types';
import {
  Car,
  Calendar,
  Sparkles,
  Gift,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  HelpCircle,
  Share2,
  Copy,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    vehicles,
    addVehicle,
    deleteVehicle,
    bookings,
    updateBookingStatus,
    loyaltyCards,
    getLoyaltyCardForPlate,
    redeemFreeWash,
    setCurrentPage,
  } = useApp();

  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // New vehicle form
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newType, setNewType] = useState<VehicleType>('sedan');

  const userVehicles = currentUser
    ? vehicles.filter((v) => v.user_id === currentUser.id)
    : [];

  const userBookings = currentUser
    ? bookings.filter((b) => b.user_id === currentUser.id || b.customer_email === currentUser.email)
    : [];

  // Primary vehicle plate for loyalty card display
  const primaryPlate = userVehicles[0]?.plate_number;
  const loyaltyData = primaryPlate ? getLoyaltyCardForPlate(primaryPlate) : null;

  const handleCopyReferral = () => {
    if (currentUser?.referral_code) {
      navigator.clipboard.writeText(currentUser.referral_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newPlate.trim()) return;

    addVehicle({
      user_id: currentUser.id,
      make: newMake.trim(),
      model: newModel.trim(),
      color: newColor.trim(),
      plate_number: newPlate.toUpperCase().trim(),
      vehicle_type: newType,
    });

    setNewMake('');
    setNewModel('');
    setNewColor('');
    setNewPlate('');
    setIsAddVehicleOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-red-950/40 border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-700 uppercase tracking-widest text-red-500">
              Customer Garage &amp; Account
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <h1 className="font-oswald font-700 text-3xl sm:text-4xl uppercase text-white tracking-wide">
            WELCOME BACK, {currentUser?.full_name?.toUpperCase() || 'DRIVER'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            {currentUser?.phone || 'Phone not provided'} &bull; {currentUser?.email || 'Email not provided'}
          </p>
        </div>

        {/* Quick Referral Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
          <div className="text-left">
            <span className="text-[10px] text-neutral-400 uppercase font-600 block">
              Your Referral Code
            </span>
            <span className="font-mono font-700 text-amber-400 text-sm tracking-wider">
              {currentUser?.referral_code || 'Not available'}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyReferral}
            className="text-xs shrink-0"
          >
            <Copy className="w-3.5 h-3.5 mr-1" />
            {copiedCode ? 'Copied!' : 'Copy Code'}
          </Button>

          <div className="border-l border-neutral-800 pl-3">
            <span className="text-[10px] text-neutral-400 uppercase font-600 block">
              Reward Credit
            </span>
            <span className="font-mono font-700 text-emerald-400 text-sm">
              R{currentUser?.discount_balance || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Loyalty Card & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Active Loyalty Card Visual */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" />
              Your Active Loyalty Card
            </h2>
            <button
              onClick={() => setCurrentPage('loyalty')}
              className="text-xs text-red-400 hover:text-red-300 font-600 flex items-center gap-1"
            >
              Loyalty Details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loyaltyData ? (
            <LoyaltyCardVisual
              cardData={loyaltyData}
              onRedeem={() => primaryPlate && redeemFreeWash(primaryPlate)}
            />
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-neutral-600 mx-auto" />
              <h3 className="font-oswald font-700 text-xl uppercase text-white">No Loyalty Activity Yet</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Your loyalty card will appear after a vehicle is registered and a qualifying wash is recorded.
              </p>
            </div>
          )}
        </div>

        {/* Right: Quick Action Shortcuts */}
        <div className="space-y-4">
          <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <button
              onClick={() => setCurrentPage('book')}
              className="p-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-700 text-left transition-all shadow-lg shadow-red-950/50 flex items-center justify-between cursor-pointer"
            >
              <div>
                <div className="font-oswald text-lg uppercase tracking-wide">
                  Book A Wash
                </div>
                <div className="text-xs text-red-100 font-normal">
                  Reserve a bay or mobile callout
                </div>
              </div>
              <Calendar className="w-6 h-6 text-red-200" />
            </button>

            <button
              onClick={() => setCurrentPage('messages')}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <div className="font-oswald font-700 text-lg uppercase text-white tracking-wide">
                  Chat With Staff
                </div>
                <div className="text-xs text-neutral-400">
                  Ask bay operator about queue or callout
                </div>
              </div>
              <MessageSquare className="w-6 h-6 text-neutral-400" />
            </button>

            <button
              onClick={() => setCurrentPage('referrals')}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <div className="font-oswald font-700 text-lg uppercase text-white tracking-wide">
                  Refer Friends (R20 Off)
                </div>
                <div className="text-xs text-neutral-400">
                  Share your code to earn free washes
                </div>
              </div>
              <Gift className="w-6 h-6 text-red-400" />
            </button>

            <button
              onClick={() => setCurrentPage('questions')}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <div className="font-oswald font-700 text-lg uppercase text-white tracking-wide">
                  Q&amp;A Support Portal
                </div>
                <div className="text-xs text-neutral-400">
                  Inquire about engine degreasing, pricing
                </div>
              </div>
              <HelpCircle className="w-6 h-6 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Registered Vehicles Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white">
              My Registered Vehicles ({userVehicles.length})
            </h2>
            <p className="text-xs text-neutral-400">
              Each vehicle tracks its own visits, photos, and loyalty stamp cycle
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddVehicleOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Vehicle
          </Button>
        </div>

        {userVehicles.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-3">
            <Car className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-base font-700 text-white uppercase font-oswald">
              No Vehicles Registered Yet
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Add your car to track how many times it has been washed at Waldrift and monitor loyalty stamps!
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddVehicleOpen(true)}
            >
              Register First Vehicle
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userVehicles.map((veh) => (
              <div
                key={veh.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
              >
                {/* Vehicle photo preview */}
                <div className="relative h-44 bg-neutral-950 overflow-hidden">
                  <img
                    src={veh.photo_url || '/'}
                    alt={`${veh.make} ${veh.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="font-mono font-700 text-base bg-neutral-950/90 text-amber-400 px-2.5 py-0.5 rounded border border-neutral-700 tracking-wider">
                      {veh.plate_number}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-oswald font-700 text-xl uppercase text-white">
                      {veh.make} {veh.model}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span>{veh.color}</span>
                      <span>&bull;</span>
                      <span className="uppercase font-600 text-red-400">{veh.vehicle_type}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                    <div>
                      <span className="text-neutral-500 block">Total Visits</span>
                      <span className="font-mono font-700 text-white">{veh.visits_count} washes</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Last Wash</span>
                      <span className="font-mono text-neutral-300">{veh.last_visit_date || 'Recent'}</span>
                    </div>
                  </div>

                  {veh.notes && (
                    <p className="text-[11px] text-neutral-400 italic">
                      &quot;{veh.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="p-4 bg-neutral-950/60 border-t border-neutral-800/80 flex items-center justify-between">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCurrentPage('book', { vehicleType: veh.vehicle_type })}
                    className="text-xs"
                  >
                    Book Wash
                  </Button>
                  <button
                    onClick={() => deleteVehicle(veh.id)}
                    className="text-xs text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookings & Wash History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white">
              Appointments &amp; Recent Washes
            </h2>
            <p className="text-xs text-neutral-400">
              Track status of upcoming wash appointments or review completed service history
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('history')}
            className="text-xs text-red-400 hover:text-red-300 font-600"
          >
            Full Wash History &rarr;
          </button>
        </div>

        {userBookings.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center text-xs text-neutral-400">
            No active appointments found. Click &quot;Book a Wash&quot; above to schedule your next slot!
          </div>
        ) : (
          <div className="space-y-3">
            {userBookings.map((b) => (
              <div
                key={b.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-oswald font-700 text-lg uppercase text-white">
                      {b.service_package_name}
                    </span>
                    <span
                      className={`text-[10px] font-700 uppercase px-2 py-0.5 rounded ${
                        b.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : b.status === 'in_progress'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span
                      className={`text-[10px] font-600 uppercase px-2 py-0.5 rounded ${
                        b.payment_status === 'paid_online'
                          ? 'bg-yellow-950/70 text-yellow-300 border border-yellow-800'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {b.payment_status === 'paid_online' ? 'PayPal Paid' : 'Pay on Arrival'}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-400 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-amber-400 font-bold">{b.vehicle_plate}</span>
                    <span>&bull;</span>
                    <span>{b.vehicle_name}</span>
                    <span>&bull;</span>
                    <span>
                      {b.scheduled_date} at {b.scheduled_time}
                    </span>
                  </div>

                  {b.addon_names.length > 0 && (
                    <div className="text-[11px] text-neutral-400">
                      Add-ons: <span className="text-neutral-200">{b.addon_names.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-800">
                  <span className="font-mono font-700 text-lg text-emerald-400">
                    R{b.amount_total}
                  </span>
                  {b.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}
                      className="text-xs text-neutral-400 hover:text-red-400"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        title="Add Vehicle to Garage"
        description="Register your car to track visit counts and automatic loyalty stamp rewards"
      >
        <form onSubmit={handleAddVehicleSubmit} className="space-y-4">
          <Input
            label="License Plate Number"
            placeholder="e.g. DB 44 ZN GP"
            value={newPlate}
            onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
            required
            helperText="Matches historical washes automatically"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Make"
              placeholder="e.g. Volkswagen"
              value={newMake}
              onChange={(e) => setNewMake(e.target.value)}
              required
            />
            <Input
              label="Model"
              placeholder="e.g. Polo TSI"
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Color"
              placeholder="e.g. Pure White"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-600 text-neutral-300 uppercase tracking-wider mb-1.5">
                Vehicle Category
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as VehicleType)}
                className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-800 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
              >
                <option value="sedan">Sedan / Hatchback</option>
                <option value="suv">SUV / Crossover</option>
                <option value="bakkie">Bakkie / 4x4 / Minibus</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddVehicleOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Vehicle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
