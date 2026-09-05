import React from 'react';
import { SmartMatchScore, Machine } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { X, Sparkles, CheckCircle2, Award, Zap, Fuel, DollarSign, MapPin, Shield } from 'lucide-react';

interface MatchBreakdownModalProps {
  machine: Machine;
  matchScore: SmartMatchScore;
  onClose: () => void;
  onBookNow: () => void;
}

export function MatchBreakdownModal({
  machine,
  matchScore,
  onClose,
  onBookNow,
}: MatchBreakdownModalProps) {
  const { t, translateWorkType } = useLanguage();

  const metrics = [
    {
      label: t('ai.availabilityScore', 'Availability Score'),
      weight: '40% ' + t('ai.calcWeight', 'Conceptual Weight'),
      score: matchScore.availabilityScore,
      icon: Zap,
      color: 'text-amber-600 bg-amber-50',
      barColor: 'bg-amber-500',
      description: t('ai.availExpl', 'Machine active status and requested calendar slot open'),
    },
    {
      label: t('ai.priceScore', 'Price & Budget Fit Score'),
      weight: '25% ' + t('ai.calcWeight', 'Conceptual Weight'),
      score: matchScore.priceScore,
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50',
      barColor: 'bg-emerald-500',
      description: t('ai.priceExpl', 'Comparison with local benchmark rates and farmer budget'),
    },
    {
      label: t('ai.locationScore', 'Location & Distance Score'),
      weight: '20% ' + t('ai.calcWeight', 'Conceptual Weight'),
      score: matchScore.distanceScore,
      icon: MapPin,
      color: 'text-blue-600 bg-blue-50',
      barColor: 'bg-blue-500',
      description: `${machine.distanceKm} km — ${t('ai.distExpl', 'minimizes transit delay & road haulage')}`,
    },
    {
      label: t('ai.reliabilityScore', 'Reliability Score'),
      weight: '15% ' + t('ai.calcWeight', 'Conceptual Weight'),
      score: matchScore.reliabilityScore,
      icon: Shield,
      color: 'text-purple-600 bg-purple-50',
      barColor: 'bg-purple-500',
      description: `${t('ai.basedOnRating', 'Based on owner rating')} (${machine.ownerRating}★) ${t('ai.andHistory', 'and maintenance history')}`,
    },
    {
      label: t('ai.workSuitabilityScore', 'Work Suitability Score'),
      weight: t('ai.suitabilityFactor', 'Suitability Factor'),
      score: matchScore.workSuitabilityScore,
      icon: Fuel,
      color: 'text-teal-600 bg-teal-50',
      barColor: 'bg-teal-500',
      description: `${t('ai.workTestedFor', 'Equipment suitable for')}: ${machine.suitableWork.slice(0, 3).map(w => translateWorkType(w)).join(', ')}`,
    },
    {
      label: t('ai.farmSizeScore', 'Farm Size Suitability Score'),
      weight: t('ai.acreageCapacityFactor', 'Acreage Capacity Factor'),
      score: matchScore.farmSizeSuitabilityScore,
      icon: Award,
      color: 'text-indigo-600 bg-indigo-50',
      barColor: 'bg-indigo-500',
      description: `${t('ai.optimalAcreage', 'Optimal for')} ${machine.suitableFarmSize.minAcres} - ${machine.suitableFarmSize.maxAcres} ${t('ai.acresWord', 'acres')}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{t('ai.prototypeLabel', 'AI Smart Match — Prototype')}</span>
          </div>

          <h3 className="text-xl font-extrabold text-white">{machine.name}</h3>
          <p className="text-xs text-emerald-100 mt-0.5">
            {t('card.owner', 'Owner')}: {machine.ownerName} • {machine.location} ({machine.distanceKm} km)
          </p>

          {/* Big Score Callout */}
          <div className="mt-4 flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-emerald-200 font-semibold">
                {t('ai.overallCompatibility', 'Overall Compatibility Score')}
              </div>
              <div className="text-xs text-white/90 max-w-xs mt-0.5">{matchScore.explanation}</div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-amber-400">{matchScore.overallScore}%</span>
              <div className="text-[10px] text-emerald-200 font-medium">{t('ai.rankedHigh', 'Ranked High')}</div>
            </div>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            {t('ai.scoringMatrix', 'Scoring Matrix Weights & Breakdown')}:
          </div>

          <div className="space-y-3">
            {metrics.map(m => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${m.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-stone-800">{m.label}</div>
                        <div className="text-[11px] text-stone-500">{m.weight}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-stone-900">{m.score}%</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden my-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${m.barColor}`}
                      style={{ width: `${m.score}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] text-stone-600 mt-1">{m.description}</div>
                </div>
              );
            })}
          </div>

          {/* Why this is your best match Explanation Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t('ai.whyBestMatch', 'Why this is your best match')}</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              {matchScore.explanation}
            </p>
            <div className="text-[11px] text-emerald-800 pt-1 border-t border-emerald-200/60 flex items-center gap-2">
              <span>● {t('ai.distance', 'Distance')}: {machine.distanceKm} km</span>
              <span>•</span>
              <span>● {t('card.owner', 'Owner')}: {machine.ownerRating}★</span>
              <span>•</span>
              <span>● {t('card.rentalRate', 'Rate')}: ₹{machine.hourlyRate}/{t('card.perHour', 'hour')}</span>
            </div>
          </div>

          {/* Prototype Disclosure */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
            <Award className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>{t('ai.prototypeLabel', 'AI Smart Match — Prototype')}:</strong>{' '}
              {t('ai.formulaSummary', 'Availability (40%) + Price (25%) + Distance (20%) + Reliability (15%), adjusted by farm acreage and soil tillage needs.')}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
          >
            {t('common.close', 'Close')}
          </button>
          <button
            onClick={() => {
              onClose();
              onBookNow();
            }}
            className="px-5 py-2 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            {t('book.proceedToBook', 'Proceed to Book Machine')}
          </button>
        </div>
      </div>
    </div>
  );
}
