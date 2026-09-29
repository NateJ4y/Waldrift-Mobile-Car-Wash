import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Car, Calendar, Sparkles, Camera, Phone, User, Clock, CheckCircle2 } from 'lucide-react';

export const PlateLookupPage: React.FC = () => {
  const { visitRecords, vehicles, loyaltyCards, getLoyaltyCardForPlate, setCurrentPage } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPlate, setSelectedPlate] = useState<string>('DB 44 ZN GP');

  // Group visits by plate number
  const plateMap = new Map<string, {
    plate: string;
    totalVisits: number;
    totalSpent: number;
    lastVisit: string;
    photos: string[];
    records: typeof visitRecords;
    vehicle?: typeof vehicles[0];
  }>();

  visitRecords.forEach((rec) => {
    const cleanPlate = rec.plate_number.toUpperCase().trim();
    if (!plateMap.has(cleanPlate)) {
      plateMap.set(cleanPlate, {
        plate: cleanPlate,
        totalVisits: 0,
        totalSpent: 0,
        lastVisit: rec.date,
        photos: [],
        records: [],
        vehicle: vehicles.find((v) => v.plate_number.toUpperCase().trim() === cleanPlate),
      });
    }
    const item = plateMap.get(cleanPlate)!;
    item.totalVisits += 1;
    item.totalSpent += rec.amount_paid;
    if (rec.photo_url && !item.photos.includes(rec.photo_url)) {
      item.photos.push(rec.photo_url);
    }
    item.records.push(rec);
  });

  const allPlates = Array.from(plateMap.values()).sort((a, b) => b.totalVisits - a.totalVisits);

  const filteredPlates = allPlates.filter((item) =>
    item.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.vehicle && `${item.vehicle.make} ${item.vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activePlateData = plateMap.get(selectedPlate) || allPlates[0];
  const activeLoyalty = activePlateData ? getLoyaltyCardForPlate(activePlateData.plate) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <span className="text-xs font-700 uppercase tracking-widest text-red-500">
            Automotive Tracking System
          </span>
          <h1 className="font-oswald font-700 text-3xl sm:text-4xl uppercase text-white mt-1">
            LICENSE PLATE RECOGNITION &amp; VISIT DIRECTORY
          </h1>
          <p className="text-xs text-neutral-400">
            Real-time database tracking every vehicle that passes through Waldrift Car Wash bays
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setCurrentPage('staff-checkin')}
          className="shrink-0 flex items-center gap-1.5"
        >
          <Camera className="w-4 h-4" />
          New Vehicle Check-In
        </Button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plates Search & List */}
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search plate or vehicle model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full font-mono uppercase"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredPlates.map((item) => {
              const isSelected = selectedPlate === item.plate;
              return (
                <div
                  key={item.plate}
                  onClick={() => setSelectedPlate(item.plate)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-red-600 bg-red-950/20 shadow-md ring-1 ring-red-600/50'
                      : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-700 text-base text-amber-400 tracking-wider">
                      {item.plate}
                    </span>
                    <span className="text-xs font-mono font-700 bg-neutral-950 text-red-400 px-2 py-0.5 rounded border border-neutral-800">
                      {item.totalVisits} visits
                    </span>
                  </div>

                  <div className="text-xs text-neutral-300 mt-1 truncate">
                    {item.vehicle
                      ? `${item.vehicle.make} ${item.vehicle.model}`
                      : item.records[0]?.vehicle_summary || 'Arrived Vehicle'}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 pt-2 border-t border-neutral-800/80">
                    <span>Last: {item.lastVisit}</span>
                    <span className="text-emerald-400 font-mono font-600">R{item.totalSpent} total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Plate Profile */}
        <div className="lg:col-span-2 space-y-6">
          {activePlateData ? (
            <>
              {/* Profile Card Header */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                      South African License Plate
                    </span>
                    <h2 className="font-mono font-700 text-3xl sm:text-4xl text-amber-400 tracking-widest mt-1">
                      {activePlateData.plate}
                    </h2>
                    <span className="text-xs text-neutral-300 font-semibold block mt-1">
                      {activePlateData.vehicle
                        ? `${activePlateData.vehicle.make} ${activePlateData.vehicle.model} (${activePlateData.vehicle.color}) &bull; ${activePlateData.vehicle.vehicle_type.toUpperCase()}`
                        : activePlateData.records[0]?.vehicle_summary || 'Vehicle Profile'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 uppercase font-600 block">
                      Lifetime Spend
                    </span>
                    <span className="text-2xl font-700 font-mono text-emerald-400">
                      R{activePlateData.totalSpent}
                    </span>
                    <span className="text-[11px] text-neutral-500 block">
                      Across {activePlateData.totalVisits} washes
                    </span>
                  </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 block">Total Washes</span>
                    <span className="font-mono font-700 text-base text-white">
                      {activePlateData.totalVisits} visits
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 block">Loyalty Stamps</span>
                    <span className="font-mono font-700 text-base text-red-400">
                      {activeLoyalty?.current_stamps || 0} / 4
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 block">Free Washes Won</span>
                    <span className="font-mono font-700 text-base text-emerald-400">
                      {activeLoyalty?.total_free_washes_earned || 0}
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 block">Last Bay Visit</span>
                    <span className="font-mono text-neutral-300">
                      {activePlateData.lastVisit}
                    </span>
                  </div>
                </div>

                {/* Photo Gallery for this plate */}
                {activePlateData.photos.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-600 text-neutral-300 uppercase tracking-wider block">
                      Inspection Photos Logged ({activePlateData.photos.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activePlateData.photos.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-xl overflow-hidden border border-neutral-800 group"
                        >
                          <img
                            src={url}
                            alt={`Plate ${activePlateData.plate} inspection photo`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 text-[10px] text-neutral-300 font-mono">
                            Inspection #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Visit Timeline */}
              <div className="space-y-4">
                <h3 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white">
                  Historical Wash Ledger
                </h3>

                <div className="space-y-3">
                  {activePlateData.records.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-oswald font-700 text-lg uppercase text-white">
                            {rec.service_package_name}
                          </span>
                          {rec.loyalty_stamp_awarded && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded">
                              +1 Stamp
                            </span>
                          )}
                          {rec.is_free_reward_applied && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                              FREE REWARD
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-neutral-400">
                          Date: <strong className="text-neutral-200">{rec.date}</strong> &bull; Bay Operator: {rec.staff_name}
                        </div>

                        {rec.addon_names.length > 0 && (
                          <div className="text-xs text-neutral-300">
                            Add-ons: <span className="text-red-400">{rec.addon_names.join(', ')}</span>
                          </div>
                        )}

                        {rec.notes && (
                          <p className="text-xs text-neutral-400 italic">
                            &quot;{rec.notes}&quot;
                          </p>
                        )}
                      </div>

                      <div className="text-right sm:border-l sm:border-neutral-800 sm:pl-4 flex sm:flex-col justify-between items-center sm:items-end">
                        <span className="font-mono font-700 text-lg text-emerald-400">
                          R{rec.amount_paid}
                        </span>
                        <span className="text-[11px] text-neutral-400 capitalize">
                          {rec.payment_method.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-500">
              Select a license plate from the directory on the left.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlateLookupPage;
