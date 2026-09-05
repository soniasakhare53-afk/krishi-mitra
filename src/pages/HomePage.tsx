import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Tractor,
  Search,
  Sparkles,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Star,
  Zap,
  ChevronRight,
  Wrench,
  Droplets,
  Sprout,
  Compass,
} from 'lucide-react';
import { MachineType } from '../types';
import { getMachines, getReviews } from '../services/storage';
import { MachineryCard } from '../components/MachineryCard';
import { useLanguage } from '../context/LanguageContext';

export function HomePage() {
  const { t, translateMachineType, translateWorkType } = useLanguage();
  const navigate = useNavigate();
  const machines = getMachines().filter(m => m.active);
  const reviews = getReviews().slice(0, 3);

  // Quick Search Form State
  const [quickLocation, setQuickLocation] = useState('Nagpur');
  const [quickFarmArea, setQuickFarmArea] = useState('5');
  const [quickWorkType, setQuickWorkType] = useState('Ploughing');
  const [quickMachineType, setQuickMachineType] = useState<MachineType | 'All'>('Tractor');
  const [quickDate, setQuickDate] = useState(() => {
    const d = new Date(Date.now() + 86400000);
    return d.toISOString().split('T')[0];
  });

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      location: quickLocation,
      farmArea: quickFarmArea,
      workType: quickWorkType,
      machineType: quickMachineType,
      date: quickDate,
    });
    navigate(`/find-machinery?${params.toString()}`);
  };

  const categories: Array<{ name: MachineType; label: string; icon: string; count: number; desc: string }> = [
    { name: 'Tractor', label: translateMachineType('Tractor'), icon: '🚜', count: 32, desc: t('cat.tractorDesc', '35 HP to 65 HP 2WD & 4WD tractors') },
    { name: 'Harvester', label: translateMachineType('Harvester'), icon: '🌾', count: 14, desc: t('cat.harvesterDesc', 'Multi-crop combine harvesters') },
    { name: 'Seed Drill', label: translateMachineType('Seed Drill'), icon: '🌱', count: 18, desc: t('cat.seedDrillDesc', 'Automatic zero-till seeders') },
    { name: 'Rotavator', label: translateMachineType('Rotavator'), icon: '🔄', count: 24, desc: t('cat.rotavatorDesc', 'Fine soil tilth seedbed preparation') },
    { name: 'Cultivator', label: translateMachineType('Cultivator'), icon: '🌿', count: 16, desc: t('cat.cultivatorDesc', '9 & 11-tyne spring tillers') },
    { name: 'Irrigation', label: translateMachineType('Irrigation'), icon: '💧', count: 9, desc: t('cat.irrigationDesc', 'Diesel pumps & sprinkler sets') },
    { name: 'Other', label: translateMachineType('Other'), icon: '🛠️', count: 11, desc: t('cat.otherDesc', 'JCBs, levellers & trailers') },
  ];

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white pt-14 pb-24 md:pt-20 md:pb-32">
        {/* Background Image with agricultural overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1920"
            alt="Indian farmland tractor"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-stone-950/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/70 border border-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('home.heroBadge', 'Smart Farm Machinery Rentals')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {t('home.heroTitle', 'Find the Right Farm Machinery,')}{' '}
              <span className="text-amber-400 underline decoration-emerald-500 decoration-wavy decoration-2">
                {t('home.heroHighlight', 'Right When You Need It.')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-stone-200 leading-relaxed font-normal max-w-2xl">
              {t('home.heroSubtitle', 'KrishiMitra connects farmers with nearby agricultural machinery owners for easy, affordable and reliable rentals.')}
            </p>

            {/* Core Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                to="/find-machinery"
                className="px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-base font-bold shadow-lg shadow-emerald-950/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <span>👨‍🌾 {t('home.heroFindBtn', 'I Need a Machine')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/rent-machinery"
                className="px-6 py-4 rounded-xl bg-stone-800/90 hover:bg-stone-800 border border-stone-600 text-stone-100 hover:text-white text-base font-bold shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>🚜 {t('home.heroRentBtn', 'Rent Out My Machine')}</span>
              </Link>
            </div>

            {/* Value Flow Strip */}
            <div className="pt-6 flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-bold text-emerald-200/90 uppercase tracking-wider">
              <span>{t('flow.find', 'FIND')}</span>
              <span className="text-amber-400">→</span>
              <span>{t('flow.compare', 'COMPARE')}</span>
              <span className="text-amber-400">→</span>
              <span className="text-amber-300">{t('flow.aiMatch', 'AI MATCH')}</span>
              <span className="text-amber-400">→</span>
              <span>{t('flow.book', 'BOOK')}</span>
              <span className="text-amber-400">→</span>
              <span>{t('flow.track', 'TRACK')}</span>
              <span className="text-amber-400">→</span>
              <span>{t('flow.rate', 'RATE')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK SEARCH PANEL (Overlapping Hero) */}
      <section className="relative z-20 -mt-14 sm:-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200/80 p-5 sm:p-7 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-700" />
              <h2 className="font-black text-lg text-stone-900">
                {t('search.instantTitle', 'Instant Machinery Match Search')}
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md hidden sm:inline-block">
              {t('home.searchBadge', 'Over 100+ Verified Machines Nearby')}
            </span>
          </div>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Location */}
            <div>
              <label htmlFor="quick-location" className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                {t('search.location', 'Location')}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  id="quick-location"
                  type="text"
                  value={quickLocation}
                  onChange={e => setQuickLocation(e.target.value)}
                  placeholder="e.g. Nagpur, Wardha"
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            {/* Farm Area */}
            <div>
              <label htmlFor="quick-farm-area" className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                {t('search.farmArea', 'Farm Area (Acres)')}
              </label>
              <input
                id="quick-farm-area"
                type="number"
                min="0.5"
                step="0.5"
                value={quickFarmArea}
                onChange={e => setQuickFarmArea(e.target.value)}
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none font-semibold"
              />
            </div>

            {/* Type of Work */}
            <div>
              <label htmlFor="quick-work-type" className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                {t('search.workType', 'Type of Work')}
              </label>
              <select
                id="quick-work-type"
                value={quickWorkType}
                onChange={e => setQuickWorkType(e.target.value)}
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none bg-white font-medium"
              >
                <option value="Ploughing">{translateWorkType('Ploughing')}</option>
                <option value="Tilling">{translateWorkType('Tilling')}</option>
                <option value="Harvesting">{translateWorkType('Harvesting')}</option>
                <option value="Sowing">{translateWorkType('Sowing')}</option>
                <option value="Haulage">{translateWorkType('Haulage')}</option>
                <option value="Land Levelling">{translateWorkType('Land Levelling')}</option>
              </select>
            </div>

            {/* Machine Required */}
            <div>
              <label htmlFor="quick-machine-type" className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                {t('search.machineType', 'Machine Required')}
              </label>
              <select
                id="quick-machine-type"
                value={quickMachineType}
                onChange={e => setQuickMachineType(e.target.value as MachineType | 'All')}
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none bg-white font-medium"
              >
                <option value="All">{t('cat.all', 'All Equipment')}</option>
                <option value="Tractor">🚜 {translateMachineType('Tractor')}</option>
                <option value="Harvester">🌾 {translateMachineType('Harvester')}</option>
                <option value="Seed Drill">🌱 {translateMachineType('Seed Drill')}</option>
                <option value="Rotavator">🔄 {translateMachineType('Rotavator')}</option>
                <option value="Cultivator">🌿 {translateMachineType('Cultivator')}</option>
                <option value="Irrigation">💧 {translateMachineType('Irrigation')}</option>
                <option value="Other">🛠️ {translateMachineType('Other')}</option>
              </select>
            </div>

            {/* Required Date & Submit */}
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>{t('search.findMatch', 'Find Best Match')}</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. POPULAR MACHINERY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              {t('home.catSuper', 'Machinery Directory')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              {t('home.catTitle', 'Browse by Agricultural Equipment Type')}
            </h2>
          </div>
          <Link
            to="/find-machinery"
            className="text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group"
          >
            <span>{t('home.catViewAll', 'View all machinery listings')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => navigate(`/find-machinery?machineType=${encodeURIComponent(cat.name)}`)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform w-fit">{cat.icon}</div>
                <h3 className="font-extrabold text-stone-900 text-base group-hover:text-emerald-800 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">{cat.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>{cat.count}+ {t('card.available', 'Available')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. AI SMART MATCHING SECTION (Differentiator Spotlight) */}
      <section className="bg-gradient-to-b from-emerald-900 via-emerald-950 to-stone-900 text-white py-16 sm:py-24 my-10 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text & weight matrix */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('home.aiSuper', 'AI Smart Match — Prototype')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {t('home.aiTitle', 'Smarter Machinery Matching')}
              </h2>

              <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
                {t('home.aiSubtitle', 'KrishiMitra analyzes your requirements and ranks nearby machinery based on suitability, price, distance, availability, and reliability.')}
              </p>

              {/* Core Weights Box */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <span>{t('home.aiMatrixTitle', 'Transparent Weighting Matrix')}</span>
                  <span>100% {t('ai.match', 'Calculated')}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-center">
                    <div className="text-2xl font-black text-amber-400">40%</div>
                    <div className="text-xs font-semibold text-stone-200 mt-0.5">{t('ai.availability', 'Availability')}</div>
                    <div className="text-[10px] text-stone-400">{t('home.weightAvailSub', 'Slot readiness')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-center">
                    <div className="text-2xl font-black text-emerald-400">25%</div>
                    <div className="text-xs font-semibold text-stone-200 mt-0.5">{t('ai.price', 'Price Fit')}</div>
                    <div className="text-[10px] text-stone-400">{t('home.weightPriceSub', 'Budget savings')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-center">
                    <div className="text-2xl font-black text-blue-400">20%</div>
                    <div className="text-xs font-semibold text-stone-200 mt-0.5">{t('ai.distance', 'Distance')}</div>
                    <div className="text-[10px] text-stone-400">{t('home.weightDistSub', 'Transit proximity')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-center">
                    <div className="text-2xl font-black text-purple-400">15%</div>
                    <div className="text-xs font-semibold text-stone-200 mt-0.5">{t('ai.reliability', 'Reliability')}</div>
                    <div className="text-[10px] text-stone-400">{t('home.weightRelSub', 'Rating & uptime')}</div>
                  </div>
                </div>

                <div className="text-xs text-stone-300 pt-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {t('home.aiExtraFactors', 'Additional real-time factors: Soil work suitability, farm acreage match, and localized weather urgency.')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/ai-match"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('home.aiTestBtn', 'Test AI Matching on Your Farm')}</span>
                </Link>
                <span className="text-xs text-stone-400 font-medium italic">
                  {t('ai.prototypeLabel', 'AI Smart Match — Prototype')}
                </span>
              </div>
            </div>

            {/* Right: Live Example Card */}
            <div className="lg:col-span-5">
              <div className="bg-stone-900/90 rounded-2xl border border-emerald-500/40 p-6 shadow-2xl backdrop-blur-xl relative">
                <div className="absolute -top-3.5 right-6 bg-amber-400 text-stone-950 text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  🏆 92% {t('ai.bestMatch', 'BEST MATCH')}
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  {t('home.aiExampleBadge', 'Example Match Result')}
                </div>
                <h3 className="text-2xl font-black text-white">Mahindra 575 DI</h3>
                <p className="text-xs text-stone-400">Rajesh Patil • 3.2 km • ₹900/{t('card.perHour', 'hour')}</p>

                {/* Score breakdown bars */}
                <div className="mt-5 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-300 mb-1">
                      <span>{t('ai.availability', 'Availability')}</span>
                      <span className="font-mono text-emerald-400">95%</span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[95%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-300 mb-1">
                      <span>{t('ai.price', 'Price Compatibility')}</span>
                      <span className="font-mono text-emerald-400">90%</span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[90%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-300 mb-1">
                      <span>{t('ai.distance', 'Distance Proximity')}</span>
                      <span className="font-mono text-emerald-400">94%</span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[94%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-300 mb-1">
                      <span>{t('ai.reliability', 'Owner Reliability')}</span>
                      <span className="font-mono text-emerald-400">92%</span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-300 mb-1">
                      <span>{t('ai.workSuitability', 'Work Suitability')}</span>
                      <span className="font-mono text-emerald-400">98%</span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[98%]" />
                    </div>
                  </div>
                </div>

                {/* Explanation text */}
                <div className="mt-5 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300 leading-relaxed">
                  <strong className="text-amber-300 block mb-1">{t('ai.whyRecommended', 'AI Recommendation Insight')}:</strong>
                  "{t('ai.defaultReason', 'Recommended because this machine is suitable for your work, within your budget and available near your location.')}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT KRISHIMITRA DOES - THE COMPLETE JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
            {t('home.journeySuper', 'End-to-End Farm Machinery Ecosystem')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 mt-1">
            {t('home.journeyTitle', 'Everything You Need for Effortless Equipment Rental')}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            {t('home.journeySubtitle', 'No middlemen, no hidden surcharges, no haggling. A transparent digital workflow tailored for Indian agriculture.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Find Machinery */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mb-4">
                🚜
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                {t('home.step1Tag', 'STEP 1 • DISCOVERY')}
              </span>
              <h3 className="text-lg font-black text-stone-900 mb-2">{t('nav.findMachinery', 'Find Machinery')}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t('home.step1Desc', 'Browse verified tractors, harvesters, rotavators, and seed drills with verified horsepower, attachments, operator availability, and distance.')}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 text-xs font-bold text-emerald-800 flex items-center justify-between">
              <span>{t('home.step1Action', 'Filter by Acreage & Work')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. Compare Options */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center mb-4">
                ⚖️
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 block mb-1">
                {t('home.step2Tag', 'STEP 2 • EVALUATION')}
              </span>
              <h3 className="text-lg font-black text-stone-900 mb-2">{t('home.step2Title', 'Compare Options')}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t('home.step2Desc', 'Add 2 to 4 machines side-by-side. Inspect hourly rates, proximity km, driver inclusion, implement compatibility, and AI scores.')}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 text-xs font-bold text-amber-800 flex items-center justify-between">
              <span>{t('home.step2Action', 'Interactive Compare Table')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 3. AI Smart Match */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-xs bg-emerald-50/20 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 font-black text-xl flex items-center justify-center mb-4">
                ✨
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                {t('home.step3Tag', 'STEP 3 • INTELLIGENCE')}
              </span>
              <h3 className="text-lg font-black text-stone-900 mb-2">{t('ai.title', 'AI Smart Match')}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t('home.step3Desc', '6-factor algorithmic score weighting Availability (40%), Price (25%), Distance (20%), Reliability (15%), plus Work & Acreage Suitability.')}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-200/60 text-xs font-bold text-emerald-800 flex items-center justify-between">
              <span>{t('home.step3Action', 'Transparent AI Rationale')}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>

          {/* 4. Transparent Booking */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mb-4">
                📋
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                {t('home.step4Tag', 'STEP 4 • RESERVATION')}
              </span>
              <h3 className="text-lg font-black text-stone-900 mb-2">{t('home.step4Title', 'Transparent Booking')}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t('home.step4Desc', 'Exact price breakdown with duration hours, base rate, platform fee, estimated fuel, and unique booking ID. No surprise billing.')}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 text-xs font-bold text-emerald-800 flex items-center justify-between">
              <span>{t('home.step4Action', 'Instant Confirmation Screen')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 5. Real-Time Tracking */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 font-black text-xl flex items-center justify-center mb-4">
                📍
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 block mb-1">
                {t('home.step5Tag', 'STEP 5 • PROGRESS')}
              </span>
              <h3 className="text-lg font-black text-stone-900 mb-2">{t('home.step5Title', 'Real-Time Tracking')}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t('home.step5Desc', 'Follow your machine across 5 distinct milestones: Requested → Confirmed → Dispatched → In Progress → Completed, with direct owner calling.')}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 text-xs font-bold text-blue-800 flex items-center justify-between">
              <span>{t('home.step5Action', 'Live Visual Timeline')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 6. Emergency Support */}
          <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-xs bg-rose-50/20 hover:border-rose-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 font-black text-xl flex items-center justify-center mb-4">
                🚨
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 block mb-1">
                {t('home.step6Tag', 'STEP 6 • URGENT PRIORITY')}
              </span>
              <h3 className="text-lg font-black text-stone-900 mb-2">{t('home.step6Title', 'Emergency Support')}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t('home.step6Desc', 'Facing impending unseasonal rains or broken tractors during harvest? Broadcast urgent requests to all owners in a 15 km cluster.')}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-rose-200/60 text-xs font-bold text-rose-800 flex items-center justify-between">
              <span>{t('home.step6Action', '2-Hour Priority Dispatch')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Visual Flow Banner */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-stone-900 text-white shadow-lg flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold tracking-wide">
          <span className="text-emerald-300">{t('flow.find', 'FIND')}</span>
          <span className="text-amber-400">→</span>
          <span className="text-emerald-300">{t('flow.compare', 'COMPARE')}</span>
          <span className="text-amber-400">→</span>
          <span className="text-amber-300">{t('flow.aiMatch', 'AI MATCH')}</span>
          <span className="text-amber-400">→</span>
          <span className="text-emerald-300">{t('flow.book', 'BOOK')}</span>
          <span className="text-amber-400">→</span>
          <span className="text-emerald-300">{t('flow.track', 'TRACK')}</span>
          <span className="text-amber-400">→</span>
          <span className="text-amber-300">{t('flow.rate', 'RATE')}</span>
        </div>
      </section>

      {/* 6. EMERGENCY MACHINERY BROADCAST CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="rounded-2xl bg-gradient-to-r from-rose-900 via-rose-950 to-stone-900 text-white p-6 sm:p-8 border border-rose-700/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>{t('home.emergencySuper', 'Sudden Breakdown or Urgent Rain Forecast?')}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              🚨 {t('home.emergencyHeading', 'Broadcast an Emergency Machinery Request')}
            </h3>
            <p className="text-stone-300 text-sm max-w-xl">
              {t('home.emergencyDesc', 'Do not lose your harvest window. Broadcast your urgent need to all machinery owners in a 15 km radius instantly with real-time response tracking.')}
            </p>
          </div>

          <Link
            to="/emergency"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-lg transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>{t('home.emergencyBtn', 'Broadcast Emergency Request')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. FEATURED AVAILABLE MACHINERY LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              {t('home.featuredSuper', 'Verified Machinery')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              {t('home.featuredTitle', 'Top Ranked Farm Machinery Near You')}
            </h2>
          </div>
          <Link
            to="/find-machinery"
            className="text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group"
          >
            <span>{t('home.featuredBrowseAll', 'Browse all')} {machines.length} {t('home.machinesWord', 'machines')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.slice(0, 3).map(machine => (
            <MachineryCard key={machine.id} machine={machine} />
          ))}
        </div>
      </section>

      {/* 8. PROBLEM & SOLUTION STORY */}
      <section className="bg-stone-100 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              {t('home.storySuper', 'The Visual Story')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              {t('home.storyTitle', 'Solving the Seasonal Farm Bottleneck')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Problem */}
            <div className="bg-white p-7 rounded-2xl border border-rose-200/80 shadow-xs space-y-4">
              <div className="inline-block p-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs uppercase tracking-wider">
                {t('home.problemTitle', 'The Problem')}
              </div>
              <h3 className="text-xl font-black text-stone-900">
                "{t('home.problemQuote', 'Finding farm machinery shouldn’t require endless phone calls.')}"
              </h3>
              <ul className="space-y-2.5 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{t('home.problemPoint1', 'Repeated calls to multiple machinery owners with no response')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{t('home.problemPoint2', 'Unclear and suddenly spiking rental prices during sowing rush')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{t('home.problemPoint3', 'Unknown machine availability leading to ruined crop schedules')}</span>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="bg-white p-7 rounded-2xl border border-emerald-300 shadow-xs space-y-4">
              <div className="inline-block p-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                {t('home.solutionTitle', 'The Solution')}
              </div>
              <h3 className="text-xl font-black text-stone-900">
                "{t('home.solutionQuote', 'KrishiMitra brings farmers and machinery owners together.')}"
              </h3>
              <ul className="space-y-2.5 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{t('home.solutionPoint1', 'AI Smart Match ranks nearby machinery transparently')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{t('home.solutionPoint2', 'Locked-in hourly and daily rental prices with zero hidden charges')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{t('home.solutionPoint3', 'Real-time booking status: PENDING → CONFIRMED with tracking')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-4">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            {t('home.statsSuper', 'Prototype Demo Statistics')}
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-800">500+</div>
            <div className="text-sm font-bold text-stone-800 mt-1">{t('home.statsFarmers', 'Farmers Connected')}</div>
            <div className="text-xs text-stone-500 mt-0.5">{t('home.statsRegion', 'Across Maharashtra & MP')}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-800">100+</div>
            <div className="text-sm font-bold text-stone-800 mt-1">{t('home.statsMachinery', 'Machines Listed')}</div>
            <div className="text-xs text-stone-500 mt-0.5">{t('home.statsMachineTypes', 'Tractors, rotavators, drills')}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-800">50+</div>
            <div className="text-sm font-bold text-stone-800 mt-1">{t('home.statsLocations', 'Locations Covered')}</div>
            <div className="text-xs text-stone-500 mt-0.5">{t('home.statsLocationsSub', 'Rural districts & tehsils')}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-amber-500">4.8 / 5</div>
            <div className="text-sm font-bold text-stone-800 mt-1">{t('home.statsRating', 'Average Rating')}</div>
            <div className="text-xs text-stone-500 mt-0.5">{t('home.statsRatingSub', 'From 180+ verified rentals')}</div>
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS (What Farmers Say) */}
      <section className="bg-stone-100 py-16 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                {t('test.super', 'Community Feedback')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                {t('test.title', 'What Farmers Say')}
              </h2>
            </div>
            <Link to="/reviews" className="text-sm font-bold text-emerald-800 hover:underline">
              {t('test.viewAll', 'Read all farmer reviews')} →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map(rev => (
              <div key={rev.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p className="text-sm text-stone-700 italic leading-relaxed">"{rev.comment}"</p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-stone-900">{rev.reviewerName}</div>
                    <div className="text-stone-500">{rev.role}</div>
                  </div>
                  <span className="text-[11px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                    {t('test.verifiedFarmer', 'Verified Farmer')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            {t('home.ctaTitle', 'Ready to Find or Rent Out Farm Machinery?')}
          </h2>
          <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto">
            {t('home.ctaSubtitle', 'Join hundreds of farmers and equipment owners modernizing rural agriculture with KrishiMitra today.')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/find-machinery"
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-base rounded-xl transition-all shadow-md"
            >
              {t('home.ctaFindBtn', 'Find Machinery Now')}
            </Link>
            <Link
              to="/rent-machinery"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base rounded-xl transition-all"
            >
              {t('home.ctaRentBtn', 'List Your Machine for Rent')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
