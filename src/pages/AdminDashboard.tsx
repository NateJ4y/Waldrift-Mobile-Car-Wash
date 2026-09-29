import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import {
  Banknote,
  Car,
  Calendar,
  Sparkles,
  Users,
  Settings,
  TrendingUp,
  Award,
  ShieldCheck,
  Camera,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    visitRecords,
    bookings,
    users,
    vehicles,
    packages,
    loyaltyCards,
    setCurrentPage,
  } = useApp();

  // Metrics
  const totalRevenue = visitRecords.reduce((sum, r) => sum + r.amount_paid, 0);
  const totalWashes = visitRecords.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const loyaltyCardsList = Object.values(loyaltyCards);
  const totalFreeWashesEarned = loyaltyCardsList.reduce((sum, c) => sum + c.total_free_washes_earned, 0);
  const totalFreeWashesRedeemed = loyaltyCardsList.reduce((sum, c) => sum + c.total_free_washes_redeemed, 0);

  // Package distribution
  const packageCounts: Record<string, number> = {};
  visitRecords.forEach((r) => {
    packageCounts[r.service_package_name] = (packageCounts[r.service_package_name] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-700 uppercase tracking-widest text-amber-400">
              Waldrift Executive Terminal
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="font-oswald font-700 text-3xl sm:text-5xl uppercase text-white mt-1">
            OPERATIONS &amp; REVENUE ADMIN
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Real-time analytics for 19 Andesite Ave &amp; mobile wash dispatches
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage('service-management')}
            className="text-xs flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            Manage Prices &amp; Menu
          </Button>
          <Button
            variant="primary"
            onClick={() => setCurrentPage('staff-checkin')}
            className="text-xs flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            Open Check-In Bay
          </Button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase font-600">Total Wash Revenue</span>
            <Banknote className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono font-700 text-3xl text-emerald-400">
            R{totalRevenue}
          </div>
          <div className="text-[11px] text-neutral-500">
            Across {totalWashes} completed bay &amp; callout washes
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase font-600">Tracked Vehicles</span>
            <Car className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono font-700 text-3xl text-white">
            {loyaltyCardsList.length}
          </div>
          <div className="text-[11px] text-neutral-500">
            {vehicles.length} customer cars registered in garage
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase font-600">Queue &amp; Bookings</span>
            <Calendar className="w-4 h-4 text-red-500" />
          </div>
          <div className="font-mono font-700 text-3xl text-red-400">
            {pendingBookings.length} Active
          </div>
          <div className="text-[11px] text-neutral-500">
            {completedBookings.length} completed appointments
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase font-600">4th Free Washes</span>
            <Sparkles className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-mono font-700 text-3xl text-white">
            {totalFreeWashesRedeemed} Redeemed
          </div>
          <div className="text-[11px] text-neutral-500">
            {totalFreeWashesEarned} total rewards unlocked
          </div>
        </div>
      </div>

      {/* Package Breakdown & Service Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="font-oswald font-700 text-xl uppercase tracking-wider text-white">
            Package Popularity Breakdown
          </h2>

          <div className="space-y-3">
            {packages.map((pkg) => {
              const count = packageCounts[pkg.name] || 0;
              const percentage = totalWashes > 0 ? Math.round((count / totalWashes) * 100) : 0;

              return (
                <div key={pkg.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-700 text-white uppercase font-oswald text-sm">
                      {pkg.name} {pkg.is_popular && '★'}
                    </span>
                    <span className="font-mono text-neutral-400">
                      {count} washes ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden">
                    <div
                      className={`h-full ${pkg.is_popular ? 'bg-red-600' : 'bg-neutral-700'}`}
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Bay Activity Stream */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-oswald font-700 text-xl uppercase tracking-wider text-white">
                Recent Bay Dispatches
              </h2>
              <button
                onClick={() => setCurrentPage('plate-lookup')}
                className="text-xs text-red-400 hover:text-red-300 font-600 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {visitRecords.slice(0, 4).map((rec) => (
                <div
                  key={rec.id}
                  className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-700 text-amber-400">
                      {rec.plate_number}
                    </span>
                    <div>
                      <span className="text-white font-600 block">{rec.vehicle_summary}</span>
                      <span className="text-[10px] text-neutral-400">{rec.service_package_name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-700 text-emerald-400 block">R{rec.amount_paid}</span>
                    <span className="text-[10px] text-neutral-500">{rec.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
            <span>Operating Bay: 19 Andesite Ave &middot; Free 10km Callout Active</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage('service-management')}
            >
              Update Pricing Table
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
