import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, CheckCircle2, ChevronRight, Info, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getMachines } from '../services/storage';
import { Machine, MachineType, SearchCriteria } from '../types';
import { calculateSmartMatch } from '../services/smartMatch';
import { MachineryCard } from '../components/MachineryCard';
import { MatchBreakdownModal } from '../components/MatchBreakdownModal';
import { BookingModal } from '../components/BookingModal';

export function AIMatchPage() {
  const { t, translateWorkType, translateMachineType } = useLanguage();
  const navigate = useNavigate();
  const machines = getMachines().filter(m => m.active);

  // Form State
  const [crop, setCrop] = useState('Wheat / Gram');
  const [workType, setWorkType] = useState('Ploughing');
  const [location, setLocation] = useState('Nagpur');
  const [farmArea, setFarmArea] = useState<number>(5);
  const [budget, setBudget] = useState<number>(1000);
  const [requiredDate, setRequiredDate] = useState(() => {
    const d = new Date(Date.now() + 86400000);
    return d.toISOString().split('T')[0];
  });
  const [machineCategory, setMachineCategory] = useState<MachineType | 'All'>('All');

  // Modal states
  const [breakdownMachine, setBreakdownMachine] = useState<Machine | null>(null);
  const [bookingMachine, setBookingMachine] = useState<Machine | null>(null);

  // Criteria
  const criteria: SearchCriteria = useMemo(
    () => ({
      location,
      farmArea,
      workType,
      machineType: machineCategory,
      date: requiredDate,
      duration: 4,
      budget,
      maxDistance: 35,
      minRating: 0,
      onlyAvailable: false,
      sortBy: 'bestMatch',
    }),
    [location, farmArea, workType, machineCategory, requiredDate, budget]
  );

  // Match ranking
  const scoredMachines = useMemo(() => {
    return machines
      .map(m => ({
        machine: m,
        matchScore: calculateSmartMatch(m, criteria),
      }))
      .sort((a, b) => b.matchScore.overallScore - a.matchScore.overallScore);
  }, [machines, criteria]);

  const bestMatch = scoredMachines[0];
  const alternativeMatches = scoredMachines.slice(1, 4);

  return (
    <div className="bg-stone-50 min-h-screen py-8 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t('ai.title', 'AI Smart Machinery Match')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {t('ai.title', 'AI Smart Machinery Match')}
          </h1>
          <p className="text-stone-600 text-sm max-w-2xl">
            {t(
              'find.subtitle',
              'Compare rental rates, check machine availability, and review transparent AI compatibility scores before booking.'
            )}
          </p>
        </div>

        {/* Input Questionnaire Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 mb-10">
          <h2 className="text-lg font-black text-stone-900 mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <span>{t('search.instantTitle', 'Instant Machinery Match Search')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Crop */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {t('ai.cropQuestion', 'What crop are you growing?')}
              </label>
              <select
                value={crop}
                onChange={e => setCrop(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none bg-white font-medium"
              >
                <option value="Wheat / Gram">Wheat / Gram (गेहूं / चना / गहू / हरभरा)</option>
                <option value="Cotton">Cotton (कपास / कापूस)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Paddy / Rice">Paddy / Rice (धान / भात)</option>
                <option value="Sugarcane">Sugarcane (गन्ना / ऊस)</option>
                <option value="Pulses / Vegetables">Pulses / Vegetables (दलहन / भाजीपाला)</option>
              </select>
            </div>

            {/* 2. Operation / Work */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {t('ai.workQuestion', 'What work do you need to perform?')}
              </label>
              <select
                value={workType}
                onChange={e => setWorkType(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none bg-white font-medium"
              >
                <option value="Ploughing">{translateWorkType('Ploughing')}</option>
                <option value="Tilling">{translateWorkType('Tilling')}</option>
                <option value="Sowing">{translateWorkType('Sowing')}</option>
                <option value="Harvesting">{translateWorkType('Harvesting')}</option>
                <option value="Haulage">{translateWorkType('Haulage')}</option>
                <option value="Land Levelling">{translateWorkType('Land Levelling')}</option>
              </select>
            </div>

            {/* 3. Location */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {t('search.location', 'Location')}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Nagpur, Wardha"
                  className="w-full text-sm pl-10 pr-3 p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            {/* 4. Farm Size */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {t('search.farmArea', 'Farm Area (Acres)')}
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={farmArea}
                onChange={e => setFarmArea(Number(e.target.value))}
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-semibold"
              />
            </div>

            {/* 5. Budget */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {t('find.budgetPerHour', 'Max Budget (₹/hr)')}
              </label>
              <input
                type="number"
                step="50"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-semibold"
              />
            </div>

            {/* 6. Required Date */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {t('search.requiredDate', 'Required Date')}
              </label>
              <input
                type="date"
                value={requiredDate}
                onChange={e => setRequiredDate(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Top Recommendation Showcase */}
        {bestMatch && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <Sparkles className="w-5 h-5 fill-amber-500 text-amber-600" />
                </span>
                <h2 className="text-2xl font-black text-stone-900">
                  {t('ai.bestMatch', 'Best Match')} — {bestMatch.matchScore.overallScore}%{' '}
                  {t('ai.match', 'Match')}
                </h2>
              </div>
              <button
                onClick={() => setBreakdownMachine(bestMatch.machine)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
              >
                <Info className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('ai.whyRecommended', 'Why this machine is recommended')}</span>
              </button>
            </div>

            {/* Best Match Hero Card */}
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-white/10">
                  <img
                    src={bestMatch.machine.imageUrl}
                    alt={bestMatch.machine.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider">
                      ★ {bestMatch.matchScore.overallScore}% {t('ai.bestMatch', 'Best Match')}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold">
                      {translateMachineType(bestMatch.machine.type)}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-800/80 text-white text-xs font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                      {t('card.verifiedOwner', 'Verified Owner')}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {bestMatch.machine.name}
                  </h3>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    {bestMatch.machine.description}
                  </p>

                  {/* Factor Breakdown Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2">
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                      <div className="text-[10px] text-stone-300 font-bold uppercase">
                        {t('ai.availability', 'Availability')} (40%)
                      </div>
                      <div className="text-base font-black text-emerald-400">
                        {bestMatch.matchScore.availabilityScore}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                      <div className="text-[10px] text-stone-300 font-bold uppercase">
                        {t('ai.price', 'Price')} (25%)
                      </div>
                      <div className="text-base font-black text-amber-400">
                        {bestMatch.matchScore.priceScore}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                      <div className="text-[10px] text-stone-300 font-bold uppercase">
                        {t('ai.distance', 'Distance')} (20%)
                      </div>
                      <div className="text-base font-black text-sky-400">
                        {bestMatch.matchScore.distanceScore}% ({bestMatch.machine.distanceKm} km)
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                      <div className="text-[10px] text-stone-300 font-bold uppercase">
                        {t('ai.reliability', 'Reliability')} (15%)
                      </div>
                      <div className="text-base font-black text-emerald-300">
                        {bestMatch.matchScore.reliabilityScore}% (★ {bestMatch.machine.rating})
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => setBookingMachine(bestMatch.machine)}
                      className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t('card.bookNow', 'Book Machinery')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/machinery/${bestMatch.machine.id}`)}
                      className="px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-xl transition-all cursor-pointer text-center"
                    >
                      {t('card.viewDetails', 'View Details')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              {t('ai.alternativeRecs', 'Alternative Recommendations')}
            </h2>
            <button
              onClick={() => navigate('/find-machinery')}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <span>{t('home.featuredBrowseAll', 'Browse all machines')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternativeMatches.map(item => (
              <MachineryCard
                key={item.machine.id}
                machine={item.machine}
                onBook={mach => setBookingMachine(mach)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI Breakdown Modal */}
      {breakdownMachine && (
        <MatchBreakdownModal
          machine={breakdownMachine}
          matchScore={calculateSmartMatch(breakdownMachine, criteria)}
          onClose={() => setBreakdownMachine(null)}
          onBookNow={() => {
            const mach = breakdownMachine;
            setBreakdownMachine(null);
            setBookingMachine(mach);
          }}
        />
      )}

      {/* Booking Modal */}
      {bookingMachine && (
        <BookingModal
          machine={bookingMachine}
          onClose={() => setBookingMachine(null)}
          onSuccess={() => {
            setBookingMachine(null);
            navigate('/farmer-dashboard');
          }}
        />
      )}
    </div>
  );
}
