import React, { useState } from 'react';
import { Search, Sparkles, Calendar, CheckCircle2, Tractor, ShieldCheck, TrendingUp, Bell, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function HowItWorksPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'farmer' | 'owner'>('farmer');

  const farmerSteps = [
    {
      num: 1,
      icon: Search,
      title: t('how.step1', 'Search Machinery'),
      desc: t('how.step1Desc', 'Find available tractors, rotavators, seed drills, and harvesters within 5–35 km of your village.'),
    },
    {
      num: 2,
      icon: Sparkles,
      title: t('how.step2', 'Get AI Recommendation'),
      desc: t('how.step2Desc', 'Transparent AI match scores evaluate distance, budget, field size, and soil/work suitability in real-time.'),
    },
    {
      num: 3,
      icon: Calendar,
      title: t('how.step3', 'Book Confidently'),
      desc: t('how.step3Desc', 'Reserve directly with flexible hourly (₹/hr) or daily rates without middlemen commissions.'),
    },
    {
      num: 4,
      icon: CheckCircle2,
      title: t('how.step4', 'Use the Machine'),
      desc: t('how.step4Desc', 'Equipment arrives at your farm on schedule. Track operator dispatch and rate the service upon completion.'),
    },
  ];

  const ownerSteps = [
    {
      num: 1,
      icon: Tractor,
      title: t('how.ownerStep1', 'List Your Machinery'),
      desc: t('how.ownerStep1Desc', 'Upload machine photos, implement specifications, and hourly/daily rental prices in under 3 minutes.'),
    },
    {
      num: 2,
      icon: Bell,
      title: t('how.ownerStep2', 'Receive Booking Requests'),
      desc: t('how.ownerStep2Desc', 'Receive direct alerts with farmer requirements, acreage, crop type, and requested dates.'),
    },
    {
      num: 3,
      icon: ShieldCheck,
      title: t('how.ownerStep3', 'Accept or Reschedule'),
      desc: t('how.ownerStep3Desc', 'Maintain full control over your equipment schedule. Accept bookings when your own field work is done.'),
    },
    {
      num: 4,
      icon: TrendingUp,
      title: t('how.ownerStep4', 'Earn Extra Income'),
      desc: t('how.ownerStep4Desc', 'Earn ₹40,000–₹1,50,000 during peak seasons by monetizing idle machine hours safely.'),
    },
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-12 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>{t('how.badge', 'Simple 4-Step Process')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {t('how.title', 'How KrishiMitra Works')}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base">
            {t(
              'how.subtitle',
              'Connecting rural machinery owners with smallholder farmers for shared, affordable mechanization.'
            )}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="p-1.5 bg-stone-200/80 rounded-2xl inline-flex gap-1">
            <button
              onClick={() => setActiveTab('farmer')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'farmer'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('how.forFarmers', 'For Farmers (Rent Equipment)')}
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'owner'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('how.forOwners', 'For Machinery Owners (List Equipment)')}
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {(activeTab === 'farmer' ? farmerSteps : ownerSteps).map(step => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs relative flex flex-col justify-between hover:border-emerald-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-stone-300">0{step.num}</span>
                  </div>
                  <h3 className="text-lg font-black text-stone-900 mb-2">{step.title}</h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-stone-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black">
              {activeTab === 'farmer'
                ? t('home.heroTitle', 'Empowering Indian Agriculture Through Shared Machinery')
                : t('rent.subtitle', 'Monetize your idle tractors, rotavators, and implements safely.')}
            </h2>
            <p className="text-emerald-100 text-sm max-w-xl">
              {t('trust.demoNote', 'Zero upfront platform fees. Transparent verification and live operational assistance.')}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeTab === 'farmer' ? (
              <button
                onClick={() => navigate('/find-machinery')}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t('home.heroExplore', 'Find Machinery Near Me')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/rent-machinery')}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t('nav.rentMachinery', 'List Your Machinery')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
