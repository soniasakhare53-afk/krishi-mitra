import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useLanguage } from '../context/LanguageContext';
import { Layers, X, ArrowRight } from 'lucide-react';

export function CompareDrawer() {
  const { comparedMachines, removeFromCompare, clearCompare } = useCompare();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (comparedMachines.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[94%] bg-stone-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-stone-700 p-3 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{t('compare.title', 'Compare Machinery')}</span>
              <span className="bg-emerald-800 text-emerald-100 text-[10px] px-1.5 py-0.2 rounded font-mono">
                {comparedMachines.length}/4
              </span>
            </div>
            <div className="text-[11px] text-stone-400 hidden sm:block">
              {comparedMachines.length === 1
                ? t('compare.selectMore', 'Select 1 more machine to compare specs')
                : t('compare.ready', 'Ready for side-by-side comparison')}
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-2 overflow-hidden py-1">
            {comparedMachines.map(m => (
              <div key={m.id} className="relative group shrink-0">
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-stone-800"
                  title={m.name}
                />
                <button
                  onClick={() => removeFromCompare(m.id)}
                  className="absolute -top-1 -right-1 bg-stone-800 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Remove from compare"
                  aria-label={`Remove ${m.name} from comparison`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={clearCompare}
            className="text-[11px] text-stone-400 hover:text-stone-200 px-2 py-1 rounded hover:bg-stone-800 transition-colors hidden sm:block cursor-pointer"
          >
            {t('compare.clear', 'Clear')}
          </button>

          <button
            onClick={() => navigate('/compare')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>{t('compare.compareNow', 'Compare Now')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
