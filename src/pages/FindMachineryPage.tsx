import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Machine, MachineType, SearchCriteria } from '../types';
import { getMachines } from '../services/storage';
import { calculateSmartMatch } from '../services/smartMatch';
import { MachineryCard } from '../components/MachineryCard';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  MapPin,
  Calendar,
  X,
  Filter,
  CheckCircle2,
  Tractor,
  Layers,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';

export function FindMachineryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [machines, setMachines] = useState<Machine[]>(() => getMachines());

  // Search parameters from URL or defaults
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [farmArea, setFarmArea] = useState<number>(Number(searchParams.get('farmArea')) || 5);
  const [workType, setWorkType] = useState(searchParams.get('workType') || 'All');
  const [machineType, setMachineType] = useState<MachineType | 'All'>(
    (searchParams.get('machineType') as MachineType) || 'All'
  );
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [duration, setDuration] = useState<number>(4);
  const [budget, setBudget] = useState<number>(1200);

  // Filter Bar state
  const [maxDistance, setMaxDistance] = useState<number>(30);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'bestMatch' | 'nearest' | 'lowestPrice' | 'highestRated'>('bestMatch');

  // Mobile filters drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync when storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setMachines(getMachines());
    };
    window.addEventListener('krishimitra_machines_change', handleStorageChange);
    return () => window.removeEventListener('krishimitra_machines_change', handleStorageChange);
  }, []);

  // Update form if URL params change
  useEffect(() => {
    const loc = searchParams.get('location');
    if (loc !== null) setLocation(loc);
    const mType = searchParams.get('machineType');
    if (mType) setMachineType(mType as MachineType | 'All');
    const wType = searchParams.get('workType');
    if (wType) setWorkType(wType);
  }, [searchParams]);

  // Current criteria bundle
  const currentCriteria: SearchCriteria = useMemo(
    () => ({
      location,
      farmArea,
      workType,
      machineType,
      date,
      duration,
      budget,
      maxDistance,
      minRating,
      onlyAvailable,
      sortBy,
    }),
    [location, farmArea, workType, machineType, date, duration, budget, maxDistance, minRating, onlyAvailable, sortBy]
  );

  // Filter & Rank Machines
  const filteredAndSortedMachines = useMemo(() => {
    return machines
      .filter(m => {
        // Active listing check
        if (!m.active) return false;

        // Machine Type
        if (machineType !== 'All' && m.type !== machineType) return false;

        // Location text filter
        if (location.trim()) {
          const locQuery = location.toLowerCase();
          const matchLoc =
            m.location.toLowerCase().includes(locQuery) ||
            m.name.toLowerCase().includes(locQuery);
          if (!matchLoc) return false;
        }

        // Distance filter
        if (m.distanceKm > maxDistance) return false;

        // Rating filter
        if (minRating > 0 && m.rating < minRating) return false;

        // Only Available filter
        if (onlyAvailable && !m.isAvailable) return false;

        return true;
      })
      .map(m => ({
        machine: m,
        matchScore: calculateSmartMatch(m, currentCriteria),
      }))
      .sort((a, b) => {
        if (sortBy === 'bestMatch') {
          return b.matchScore.overallScore - a.matchScore.overallScore;
        }
        if (sortBy === 'nearest') {
          return a.machine.distanceKm - b.machine.distanceKm;
        }
        if (sortBy === 'lowestPrice') {
          return a.machine.hourlyRate - b.machine.hourlyRate;
        }
        if (sortBy === 'highestRated') {
          return b.machine.rating - a.machine.rating;
        }
        return 0;
      });
  }, [machines, machineType, location, maxDistance, minRating, onlyAvailable, sortBy, currentCriteria]);

  const handleResetFilters = () => {
    setLocation('');
    setMachineType('All');
    setWorkType('All');
    setMaxDistance(30);
    setMinRating(0);
    setOnlyAvailable(false);
    setBudget(1200);
    setSortBy('bestMatch');
    setSearchParams({});
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI-Powered Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Find the Right Machinery for Your Farm
          </h1>
          <p className="text-stone-600 text-sm max-w-2xl">
            Compare rental rates, check machine availability, and review transparent AI compatibility scores before
            booking.
          </p>
        </div>

        {/* Top Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location */}
            <div>
              <label htmlFor="search-location" className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Farm Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  id="search-location"
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Nagpur, Wardha"
                  className="w-full text-sm pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            {/* Machine Type */}
            <div>
              <label htmlFor="search-machine-type" className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Machine Type
              </label>
              <select
                id="search-machine-type"
                value={machineType}
                onChange={e => setMachineType(e.target.value as MachineType | 'All')}
                className="w-full text-sm px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none bg-white font-medium"
              >
                <option value="All">All Categories</option>
                <option value="Tractor">🚜 Tractor</option>
                <option value="Harvester">🌾 Harvester</option>
                <option value="Seed Drill">🌱 Seed Drill</option>
                <option value="Rotavator">🔄 Rotavator</option>
                <option value="Cultivator">🌿 Cultivator</option>
                <option value="Irrigation">💧 Irrigation</option>
                <option value="Other">🛠️ Other Equipment</option>
              </select>
            </div>

            {/* Agricultural Work */}
            <div>
              <label htmlFor="search-work-type" className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Work Required
              </label>
              <select
                id="search-work-type"
                value={workType}
                onChange={e => setWorkType(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none bg-white font-medium"
              >
                <option value="All">Any Work</option>
                <option value="Ploughing">Ploughing</option>
                <option value="Tilling">Tilling / Rotavation</option>
                <option value="Harvesting">Harvesting</option>
                <option value="Sowing">Sowing</option>
                <option value="Haulage">Haulage</option>
                <option value="Land Levelling">Land Levelling</option>
              </select>
            </div>

            {/* Farm Area & Date */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="search-acres" className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Acres
                </label>
                <input
                  id="search-acres"
                  type="number"
                  min="1"
                  value={farmArea}
                  onChange={e => setFarmArea(Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                />
              </div>
              <div>
                <label htmlFor="search-date" className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  id="search-date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full text-xs px-2 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick budget slider & Sort */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">Hourly Budget:</span>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-28 sm:w-36 accent-emerald-700 cursor-pointer"
                />
                <span className="text-xs font-bold text-emerald-800 font-mono">₹{budget}/hr</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={e => setOnlyAvailable(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Available Now Only</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleResetFilters}
                className="text-xs text-stone-500 hover:text-stone-800 underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                <label htmlFor="search-sort-by" className="text-xs font-semibold text-stone-600">Sort by:</label>
                <select
                  id="search-sort-by"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="text-xs font-bold text-stone-800 bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="bestMatch">🏆 Best AI Match</option>
                  <option value="nearest">📍 Nearest First</option>
                  <option value="lowestPrice">💰 Lowest Price</option>
                  <option value="highestRated">⭐ Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter and Tags */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold text-stone-600">
            Showing <strong className="text-stone-900">{filteredAndSortedMachines.length}</strong> matching machines
            {location && <span> near <strong className="text-emerald-800">"{location}"</strong></span>}
            {machineType !== 'All' && <span> in <strong>{machineType}s</strong></span>}
          </div>
          <div className="text-xs text-stone-500 hidden sm:block">
            Scores dynamically updated using KrishiMitra's AI prototype formula
          </div>
        </div>

        {/* Machine Cards Grid */}
        {filteredAndSortedMachines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedMachines.map(({ machine }) => (
              <MachineryCard
                key={machine.id}
                machine={machine}
                searchCriteria={currentCriteria}
              />
            ))}
          </div>
        ) : (
          /* Empty State as requested in Section 39 */
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-xl mx-auto my-12 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <Tractor className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">No Machinery Found</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              No machinery found matching this location or filter criteria. Try increasing your search distance or
              changing your machine category to see available equipment in neighboring clusters.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
