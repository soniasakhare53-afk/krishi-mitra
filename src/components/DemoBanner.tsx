import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRightLeft, UserCheck, LayoutDashboard } from 'lucide-react';

export function DemoBanner() {
  const { user, isFarmer, isOwner, loginAsDemoFarmer, loginAsDemoOwner } = useAuth();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 left-4 z-40 bg-emerald-900 text-emerald-100 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-emerald-700 flex items-center gap-1.5 hover:bg-emerald-800 transition-all cursor-pointer"
        title="Open Demo Switcher"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Demo ({isFarmer ? `👨‍🌾 ${t('reviews.roleFarmer', 'Farmer')}` : `🚜 ${t('reviews.roleOwner', 'Owner')}`})</span>
      </button>
    );
  }

  return (
    <aside aria-label="Demo Controls" className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white text-xs border-b border-emerald-800/80 px-4 py-2 sticky top-0 z-50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Demo
          </span>
          <span className="text-stone-300 hidden sm:inline">
            {t('nav.profile', 'Account')}: <strong className="text-white font-semibold">{user.name}</strong> ({isFarmer ? `👨‍🌾 ${t('reviews.roleFarmer', 'Farmer')}` : `🚜 ${t('reviews.roleOwner', 'Machinery Owner')}`})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              loginAsDemoFarmer();
              navigate('/farmer-dashboard');
            }}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 cursor-pointer ${
              isFarmer
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>🌾 Sonia ({t('reviews.roleFarmer', 'Farmer')})</span>
          </button>

          <button
            onClick={() => {
              loginAsDemoOwner();
              navigate('/owner-dashboard');
            }}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 cursor-pointer ${
              isOwner
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>🚜 Rajesh ({t('reviews.roleOwner', 'Owner')})</span>
          </button>

          <button
            onClick={() => navigate(isFarmer ? '/farmer-dashboard' : '/owner-dashboard')}
            className="text-emerald-400 hover:text-emerald-300 underline font-medium ml-1 flex items-center gap-1 cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{isFarmer ? t('nav.farmerDashboard', 'Farmer Dashboard') : t('nav.ownerDashboard', 'Owner Dashboard')}</span>
          </button>

          <button
            onClick={() => setCollapsed(true)}
            className="text-stone-400 hover:text-stone-200 ml-2 px-1 text-[11px] cursor-pointer"
            title="Minimize"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
