import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Settings, Save, Check, RefreshCw, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ServiceManagementPage: React.FC = () => {
  const { packages, updatePackage, addons, updateAddon, setCurrentPage } = useApp();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local state for packages
  const [editedPackages, setEditedPackages] = useState(packages);
  const [editedAddons, setEditedAddons] = useState(addons);

  const handlePackageChange = (id: string, field: string, val: any) => {
    setEditedPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleAddonChange = (id: string, field: string, val: any) => {
    setEditedAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: val } : a))
    );
  };

  const handleSaveAll = () => {
    editedPackages.forEach((p) => updatePackage(p.id, p));
    editedAddons.forEach((a) => updateAddon(a.id, a));
    setSavedSuccess(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <span className="text-xs font-700 uppercase tracking-widest text-red-500">
            Menu Administration
          </span>
          <h1 className="font-oswald font-700 text-3xl sm:text-4xl uppercase text-white mt-1">
            SERVICE &amp; PRICING MANAGEMENT
          </h1>
          <p className="text-xs text-neutral-400">
            Edit vehicle category prices, add-on costs, and loyalty eligibility in real time
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleSaveAll}
            className="flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {savedSuccess ? 'Saved to System!' : 'Save Pricing Changes'}
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-600 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          Pricing updated successfully! All booking forms and staff check-in stations now reflect these rates.
        </div>
      )}

      {/* Primary Wash Packages */}
      <div className="space-y-4">
        <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white">
          Primary Wash Packages (Menu Table)
        </h2>

        <div className="space-y-4">
          {editedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-oswald font-700 text-xl uppercase text-white">
                    {pkg.name}
                  </h3>
                  <span className="text-xs text-neutral-400">{pkg.tagline}</span>
                </div>
                {pkg.counts_for_loyalty && (
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                    Counts Toward Free 4th Wash
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Sedan Price (ZAR)"
                  type="number"
                  value={pkg.price_sedan}
                  onChange={(e) => handlePackageChange(pkg.id, 'price_sedan', Number(e.target.value))}
                />
                <Input
                  label="SUV Price (ZAR)"
                  type="number"
                  value={pkg.price_suv}
                  onChange={(e) => handlePackageChange(pkg.id, 'price_suv', Number(e.target.value))}
                />
                <Input
                  label="Bakkie Price (ZAR)"
                  type="number"
                  value={pkg.price_bakkie}
                  onChange={(e) => handlePackageChange(pkg.id, 'price_bakkie', Number(e.target.value))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-on Services */}
      <div className="space-y-4">
        <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white">
          Add-On Services (Engine Wash &amp; Detailing)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editedAddons.map((addon) => (
            <div
              key={addon.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-oswald font-700 text-lg uppercase text-white">
                  {addon.name}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {addon.duration_minutes} min
                </span>
              </div>

              <p className="text-xs text-neutral-400">{addon.description}</p>

              <Input
                label="Price (ZAR)"
                type="number"
                value={addon.price}
                onChange={(e) => handleAddonChange(addon.id, 'price', Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagementPage;
