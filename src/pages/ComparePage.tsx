import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { getMachines } from '../services/storage';
import { calculateSmartMatch } from '../services/smartMatch';
import { Machine } from '../types';
import { BookingModal } from '../components/BookingModal';
import { MatchBreakdownModal } from '../components/MatchBreakdownModal';
import {
  Layers,
  ArrowLeft,
  Trash2,
  Check,
  X,
  Sparkles,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Fuel,
  ShieldCheck,
  Plus,
  ArrowRight,
  Award,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export function ComparePage() {
  const { comparedMachines, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const navigate = useNavigate();
  const allMachines = getMachines().filter(m => m.active);

  const [bookingMachine, setBookingMachine] = useState<Machine | null>(null);
  const [breakdownMachine, setBreakdownMachine] = useState<Machine | null>(null);

  // Calculate scores for all compared machines
  const scoredMachines = comparedMachines.map(m => ({
    machine: m,
    score: calculateSmartMatch(m),
  }));

  // Find top recommended machine (highest overall score)
  const topRecommendedId =
    scoredMachines.length > 0
      ? [...scoredMachines].sort((a, b) => b.score.overallScore - a.score.overallScore)[0].machine.id
      : null;

  // Find lowest price
  const lowestHourly =
    comparedMachines.length > 0
      ? Math.min(...comparedMachines.map(m => m.hourlyRate))
      : 0;

  // Find nearest
  const lowestDistance =
    comparedMachines.length > 0
      ? Math.min(...comparedMachines.map(m => m.distanceKm))
      : 0;

  // Unselected machines for quick addition
  const unselectedMachines = allMachines.filter(
    m => !comparedMachines.some(cm => cm.id === m.id)
  );

  return (
    <div className="bg-stone-50 min-h-screen py-8 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/find-machinery"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Find Machinery</span>
          </Link>

          {comparedMachines.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs font-semibold text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Comparison ({comparedMachines.length})</span>
            </button>
          )}
        </div>

        {/* Page Title */}
        <div className="mb-8 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-800">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Side-by-Side Equipment Evaluation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Compare Farm Machinery
          </h1>
          <p className="text-stone-600 text-sm max-w-2xl">
            Evaluate technical specifications, transparent AI match ratings, pricing, and availability side-by-side to choose the optimal implement for your farm.
          </p>
        </div>

        {/* Empty State */}
        {comparedMachines.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center max-w-2xl mx-auto my-6 space-y-5 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
              <Layers className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-stone-900">No Machinery Selected for Comparison</h3>
              <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                Select up to 4 machines from the fleet below or browse the marketplace to compare rates, distance, and AI compatibility.
              </p>
            </div>

            {/* Quick Add Suggestions */}
            <div className="pt-4 border-t border-stone-100 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 text-center">
                Quick-Add Popular Equipment to Compare:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {allMachines.slice(0, 4).map(m => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-stone-900 truncate">{m.name}</div>
                        <div className="text-[11px] text-stone-500">₹{m.hourlyRate}/hr • {m.distanceKm} km</div>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCompare(m.id)}
                      className="p-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 transition-colors shrink-0"
                      title="Add to comparison"
                      aria-label={`Add ${m.name} to comparison`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                to="/find-machinery"
                className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <span>Browse All Available Machinery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Warning if only 1 machine selected */}
            {comparedMachines.length === 1 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    You have selected <strong>1 machine</strong>. Pick 1 to 3 more machines to compare side-by-side.
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {unselectedMachines.slice(0, 3).map(m => (
                    <button
                      key={m.id}
                      onClick={() => addToCompare(m.id)}
                      className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 font-bold hover:bg-amber-100 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{m.name.split(' ')[0]} {m.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Side-by-Side Comparison Grid */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-x-auto">
              <div
                className="grid min-w-[760px] divide-x divide-stone-200"
                style={{
                  gridTemplateColumns: `200px repeat(${comparedMachines.length}, minmax(260px, 1fr))`,
                }}
              >
                {/* Column 0: Headers */}
                <div className="p-4 sm:p-5 bg-stone-50/70 space-y-6 text-xs font-bold text-stone-500 uppercase tracking-wider">
                  <div className="h-64 flex flex-col justify-end pb-3 border-b border-stone-200">
                    <span className="text-stone-800 font-extrabold text-sm">Machinery Profile</span>
                    <span className="text-[11px] text-stone-500 font-normal">Model, owner & category</span>
                  </div>

                  {/* Feature Rows Labels */}
                  <div className="space-y-8 pt-2">
                    <div className="h-28 flex flex-col justify-center border-b border-stone-100 pb-2">
                      <span className="text-emerald-900 font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        AI Smart Match
                      </span>
                      <span className="text-[10px] text-stone-500 font-normal">Transparent prototype score</span>
                    </div>

                    <div className="h-16 flex flex-col justify-center border-b border-stone-100 pb-2">
                      <span className="text-stone-800">Rental Rates</span>
                      <span className="text-[10px] text-stone-500 font-normal">Hourly & Daily Pricing</span>
                    </div>

                    <div className="h-16 flex flex-col justify-center border-b border-stone-100 pb-2">
                      <span className="text-stone-800">Distance & Transit</span>
                      <span className="text-[10px] text-stone-500 font-normal">Proximity to your field</span>
                    </div>

                    <div className="h-14 flex flex-col justify-center border-b border-stone-100 pb-2">
                      <span className="text-stone-800">Availability</span>
                      <span className="text-[10px] text-stone-500 font-normal">Operational booking slot</span>
                    </div>

                    <div className="h-14 flex flex-col justify-center border-b border-stone-100 pb-2">
                      <span className="text-stone-800">Reliability & Reviews</span>
                      <span className="text-[10px] text-stone-500 font-normal">Owner & equipment rating</span>
                    </div>

                    <div className="h-20 flex flex-col justify-center border-b border-stone-100 pb-2">
                      <span className="text-stone-800">Work Suitability</span>
                      <span className="text-[10px] text-stone-500 font-normal">Tested agricultural tasks</span>
                    </div>

                    <div className="h-14 flex flex-col justify-center border-b border-stone-100 pb-2">
                      <span className="text-stone-800">Farm Size Fit</span>
                      <span className="text-[10px] text-stone-500 font-normal">Acreage compatibility</span>
                    </div>

                    <div className="h-24 flex flex-col justify-center border-b border-stone-100 pb-2">
                      <span className="text-stone-800">Engine & Specs</span>
                      <span className="text-[10px] text-stone-500 font-normal">HP, capacity & year</span>
                    </div>

                    <div className="h-14 flex flex-col justify-center">
                      <span className="text-stone-800">Direct Booking</span>
                    </div>
                  </div>
                </div>

                {/* Machine Columns */}
                {scoredMachines.map(({ machine, score }) => {
                  const isRecommended = machine.id === topRecommendedId;
                  const isLowestPrice = machine.hourlyRate === lowestHourly;
                  const isNearest = machine.distanceKm === lowestDistance;

                  return (
                    <div
                      key={machine.id}
                      className={`p-4 sm:p-5 flex flex-col transition-colors relative ${
                        isRecommended ? 'bg-emerald-50/30' : 'bg-white'
                      }`}
                    >
                      {/* Top Recommendation Banner */}
                      {isRecommended && (
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white text-[11px] font-extrabold uppercase tracking-wider py-1 px-3 text-center flex items-center justify-center gap-1.5 shadow-xs">
                          <Award className="w-3.5 h-3.5 text-amber-300" />
                          <span>AI Top Recommendation</span>
                        </div>
                      )}

                      {/* Header Section (Machine Image, Name, Actions) */}
                      <div className={`h-64 flex flex-col justify-between border-b border-stone-200 pb-4 ${isRecommended ? 'pt-5' : ''}`}>
                        <div className="relative rounded-xl overflow-hidden h-32 bg-stone-100 border border-stone-200 group">
                          <img
                            src={machine.imageUrl}
                            alt={machine.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={() => removeFromCompare(machine.id)}
                            className="absolute top-2 right-2 bg-stone-900/80 hover:bg-rose-600 text-white p-1 rounded-full backdrop-blur-xs transition-colors"
                            title="Remove from comparison"
                            aria-label={`Remove ${machine.name}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute bottom-1.5 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                            {machine.type}
                          </div>
                        </div>

                        <div>
                          <Link
                            to={`/machinery/${machine.id}`}
                            className="text-sm font-black text-stone-900 hover:text-emerald-800 transition-colors line-clamp-1 block"
                            title={machine.name}
                          >
                            {machine.name}
                          </Link>
                          <p className="text-xs text-stone-500 truncate">{machine.model}</p>
                          <p className="text-xs text-stone-600 mt-1">
                            Owner: <strong>{machine.ownerName}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Attribute Rows */}
                      <div className="space-y-8 pt-2 text-xs">
                        {/* 1. AI Smart Match Score */}
                        <div className="h-28 flex flex-col justify-center border-b border-stone-100 pb-2">
                          <div className="flex items-center justify-between mb-1">
                            <button
                              onClick={() => setBreakdownMachine(machine)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-900 text-white font-extrabold hover:bg-emerald-800 transition-colors shadow-xs"
                            >
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>{score.overallScore}% Match</span>
                            </button>
                            <span className="text-[10px] text-emerald-800 font-bold underline cursor-pointer" onClick={() => setBreakdownMachine(machine)}>
                              View Breakdown
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-[10px] text-stone-600 mt-1.5 bg-stone-50 p-2 rounded-lg border border-stone-200">
                            <div>Avail: <strong className="text-stone-900">{score.availabilityScore}%</strong></div>
                            <div>Price: <strong className="text-stone-900">{score.priceScore}%</strong></div>
                            <div>Dist: <strong className="text-stone-900">{score.distanceScore}%</strong></div>
                            <div>Reliab: <strong className="text-stone-900">{score.reliabilityScore}%</strong></div>
                          </div>
                        </div>

                        {/* 2. Rental Rates */}
                        <div className="h-16 flex flex-col justify-center border-b border-stone-100 pb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-black text-emerald-950">
                              ₹{machine.hourlyRate.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-stone-500">/ hour</span>
                            {isLowestPrice && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                Lowest Rate
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-600 font-medium">
                            Full Day: ₹{machine.dailyRate.toLocaleString()}
                          </div>
                        </div>

                        {/* 3. Distance */}
                        <div className="h-16 flex flex-col justify-center border-b border-stone-100 pb-2">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span className="font-extrabold text-stone-900">{machine.distanceKm} km away</span>
                            {isNearest && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                                Nearest
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 truncate mt-0.5" title={machine.location}>
                            {machine.location}
                          </div>
                        </div>

                        {/* 4. Availability */}
                        <div className="h-14 flex flex-col justify-center border-b border-stone-100 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                machine.isAvailable ? 'bg-emerald-500' : 'bg-stone-400'
                              }`}
                            />
                            <span className={`font-bold ${machine.isAvailable ? 'text-emerald-800' : 'text-stone-600'}`}>
                              {machine.isAvailable ? 'Available Now' : 'Currently Booked'}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5">
                            {machine.availableDates.length} upcoming slots listed
                          </div>
                        </div>

                        {/* 5. Reliability */}
                        <div className="h-14 flex flex-col justify-center border-b border-stone-100 pb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="font-bold text-stone-900">{machine.rating}</span>
                            <span className="text-stone-500 text-[11px]">({machine.reviewCount} reviews)</span>
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5">
                            Owner score: <strong>{machine.ownerRating}★</strong> • Reliability: {score.reliabilityScore}%
                          </div>
                        </div>

                        {/* 6. Work Suitability */}
                        <div className="h-20 flex flex-col justify-center border-b border-stone-100 pb-2">
                          <div className="flex flex-wrap gap-1">
                            {machine.suitableWork.slice(0, 3).map(w => (
                              <span
                                key={w}
                                className="text-[10px] font-medium bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded border border-stone-200"
                              >
                                {w}
                              </span>
                            ))}
                            {machine.suitableWork.length > 3 && (
                              <span className="text-[10px] text-stone-400">+{machine.suitableWork.length - 3}</span>
                            )}
                          </div>
                        </div>

                        {/* 7. Farm Size Fit */}
                        <div className="h-14 flex flex-col justify-center border-b border-stone-100 pb-2">
                          <span className="font-bold text-stone-900">
                            {machine.suitableFarmSize.minAcres} – {machine.suitableFarmSize.maxAcres} Acres
                          </span>
                          <span className="text-[10px] text-stone-500">
                            Suitability Index: {score.farmSizeSuitabilityScore}%
                          </span>
                        </div>

                        {/* 8. Engine & Specs */}
                        <div className="h-24 flex flex-col justify-center border-b border-stone-100 pb-2 space-y-0.5 text-[11px]">
                          <div>Power: <strong>{machine.specs.hp || 'Standard'}</strong></div>
                          <div>Fuel: <strong>{machine.specs.fuelType || 'Diesel'}</strong></div>
                          <div>Year: <strong>{machine.specs.year || '2023'}</strong></div>
                          <div className="truncate text-stone-500" title={machine.specs.condition}>
                            Condition: {machine.specs.condition || 'Field Ready'}
                          </div>
                        </div>

                        {/* 9. Direct Booking CTA */}
                        <div className="h-14 flex items-center justify-center pt-2">
                          <button
                            onClick={() => setBookingMachine(machine)}
                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Book This Machine</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Breakdown Modal */}
        {breakdownMachine && (
          <MatchBreakdownModal
            machine={breakdownMachine}
            matchScore={calculateSmartMatch(breakdownMachine)}
            onClose={() => setBreakdownMachine(null)}
            onBookNow={() => {
              const target = breakdownMachine;
              setBreakdownMachine(null);
              setBookingMachine(target);
            }}
          />
        )}

        {/* Booking Modal */}
        {bookingMachine && (
          <BookingModal
            machine={bookingMachine}
            onClose={() => setBookingMachine(null)}
          />
        )}
      </div>
    </div>
  );
}
