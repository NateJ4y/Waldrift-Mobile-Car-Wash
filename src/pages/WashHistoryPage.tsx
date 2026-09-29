import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Car, Calendar, Receipt, Sparkles, Camera, CheckCircle2, Search } from 'lucide-react';

export const WashHistoryPage: React.FC = () => {
  const { currentUser, visitRecords, setCurrentPage } = useApp();
  const [filterPlate, setFilterPlate] = useState<string>('');

  const records = visitRecords.filter((rec) => {
    if (!filterPlate) return true;
    return rec.plate_number.toLowerCase().includes(filterPlate.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-700 uppercase tracking-widest text-red-500">
            Automotive Service Ledger
          </span>
          <h1 className="font-oswald font-700 text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
            WASH &amp; INSPECTION HISTORY
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Verified visits, bay inspection photos, and service receipts for all your vehicles
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setCurrentPage('book')}
          className="shrink-0"
        >
          Book Next Wash
        </Button>
      </div>

      {/* Filter by Plate */}
      <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 p-3 rounded-xl max-w-md">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Filter by license plate..."
          value={filterPlate}
          onChange={(e) => setFilterPlate(e.target.value)}
          className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
        />
        {filterPlate && (
          <button
            onClick={() => setFilterPlate('')}
            className="text-xs text-neutral-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* History Feed */}
      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400 space-y-3">
            <Car className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="font-oswald font-700 text-lg uppercase text-white">
              No Wash Records Found
            </h3>
            <p className="text-xs text-neutral-400">
              When your vehicle is checked in at Waldrift, staff captures its photo and logs the visit here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
              >
                {/* Photo Header */}
                <div className="relative h-48 bg-neutral-950">
                  <img
                    src={rec.photo_url || '/src/assets/images/sample_vehicle_checkin_1790713519472.jpg'}
                    alt={`Inspection photo for ${rec.plate_number}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-700 text-sm bg-neutral-950/90 text-amber-400 px-2.5 py-1 rounded border border-neutral-700 tracking-wider">
                        {rec.plate_number}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-300 bg-black/60 px-2 py-0.5 rounded">
                        {rec.date}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-oswald font-700 text-lg uppercase text-white">
                        {rec.vehicle_summary}
                      </span>
                      <span className="font-mono font-700 text-base text-emerald-400">
                        R{rec.amount_paid}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-700 text-white uppercase font-oswald text-base">
                      {rec.service_package_name}
                    </span>
                    <span className="text-neutral-400 capitalize">
                      {rec.payment_method.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {rec.addon_names.length > 0 && (
                    <div className="text-xs text-neutral-300 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                      <strong className="text-red-400">Add-ons:</strong> {rec.addon_names.join(', ')}
                    </div>
                  )}

                  {rec.notes && (
                    <p className="text-xs text-neutral-400 italic">
                      &quot;{rec.notes}&quot;
                    </p>
                  )}

                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Handled by: <strong className="text-neutral-200">{rec.staff_name}</strong></span>
                    {rec.loyalty_stamp_awarded && (
                      <span className="text-red-400 font-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> +1 Loyalty Stamp
                      </span>
                    )}
                    {rec.is_free_reward_applied && (
                      <span className="text-emerald-400 font-700 uppercase">
                        ★ Free Wash Redeemed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WashHistoryPage;
