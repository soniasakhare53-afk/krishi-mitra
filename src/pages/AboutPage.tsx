import React from 'react';
import { ShieldCheck, CheckCircle2, Users, Award, MapPin, Sparkles, HeartHandshake, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function AboutPage() {
  const { t } = useLanguage();

  const trustPillars = [
    {
      icon: ShieldCheck,
      title: t('trust.verifiedOwners', 'Verified Owners'),
      desc: t(
        'trust.verifiedOwnersDesc',
        'Physical identity & RC document verification for all registered machinery operators.'
      ),
    },
    {
      icon: Award,
      title: t('trust.conditionInspected', 'Condition & Maintenance'),
      desc: t(
        'trust.conditionInspectedDesc',
        'Transparent service history and working condition logs inspected prior to seasonal listing.'
      ),
    },
    {
      icon: Users,
      title: t('trust.communityRatings', 'Community Ratings & Reviews'),
      desc: t(
        'trust.communityRatingsDesc',
        'Authentic post-job feedback from neighboring village farmers on punctuality and quality.'
      ),
    },
    {
      icon: DollarSign,
      title: t('trust.transparentPricing', 'Transparent Pricing'),
      desc: t(
        'trust.transparentPricingDesc',
        'Clear hourly (₹/hr) and daily rates without hidden middleman markups or sudden surges.'
      ),
    },
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-12 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>{t('nav.aboutUs', 'About KrishiMitra')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            {t('home.heroTitle', 'Empowering Indian Agriculture Through Shared Machinery')}
          </h1>
          <p className="text-stone-600 text-base leading-relaxed">
            {t(
              'about.mission',
              'Our mission is to bridge the agricultural mechanization gap for small and marginal farmers across India, democratizing modern equipment and boosting rural incomes.'
            )}
          </p>
        </div>

        {/* Why Mechanization Matters */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                {t('about.theChallenge', 'The Rural Challenge')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-snug">
                {t('about.challengeTitle', '85% of Indian Farmers Lack Affordable Access to Modern Machines')}
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Smallholder farmers often struggle with manual labor delays, untimely sowing, and harvest losses because heavy farm machinery requires millions in upfront capital.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Meanwhile, machinery owners let expensive tractors and implements sit idle in sheds for over 200 days a year. KrishiMitra connects these two communities with transparency, trust, and AI-powered matchmaking.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <div className="text-3xl font-black text-emerald-900">4,200+</div>
                <div className="text-xs text-stone-600 font-semibold mt-1">
                  {t('home.statsFarmers', 'Verified Farmers')}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="text-3xl font-black text-amber-900">850+</div>
                <div className="text-xs text-stone-600 font-semibold mt-1">
                  {t('home.statsMachinery', 'Active Machines')}
                </div>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5">
                <div className="text-3xl font-black text-sky-900">18,500+</div>
                <div className="text-xs text-stone-600 font-semibold mt-1">
                  {t('home.statsAcres', 'Acres Mechanized')}
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <div className="text-3xl font-black text-emerald-900">98.4%</div>
                <div className="text-xs text-stone-600 font-semibold mt-1">
                  {t('home.statsSatisfaction', 'Satisfaction Rate')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Safety Pillars */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              {t('about.trustSafety', 'Trust & Safety at KrishiMitra')}
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              {t(
                'trust.subtitle',
                'Every booking is protected by verified machine condition, secure operator communications, and real farmer ratings.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-stone-900 mb-2">{pillar.title}</h3>
                  <p className="text-stone-600 text-xs leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
