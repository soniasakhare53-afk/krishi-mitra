import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LANGUAGES, LanguageOption, translations } from '../translations/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  currentLanguageOption: LanguageOption;
  languages: LanguageOption[];
  translateMachineType: (type: string) => string;
  translateWorkType: (work: string) => string;
  translateStatus: (status: string) => string;
}

const STORAGE_KEY = 'krishimitra_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'hi' || saved === 'mr') {
        return saved;
      }
    } catch {
      // ignore storage error
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage error
    }
    // Dispatch custom event if external listeners exist
    window.dispatchEvent(new CustomEvent('krishimitra_language_change', { detail: lang }));
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language] || translations.en;
    if (langDict && key in langDict) {
      return langDict[key];
    }
    const enDict = translations.en;
    if (enDict && key in enDict) {
      return enDict[key];
    }
    return fallback || key;
  };

  const translateMachineType = (type: string): string => {
    const map: Record<string, string> = {
      Tractor: t('cat.tractor', 'Tractor'),
      Harvester: t('cat.harvester', 'Harvester'),
      'Seed Drill': t('cat.seedDrill', 'Seed Drill'),
      Rotavator: t('cat.rotavator', 'Rotavator'),
      Cultivator: t('cat.cultivator', 'Cultivator'),
      Irrigation: t('cat.irrigation', 'Irrigation Equipment'),
      Sprayer: t('cat.sprayer', 'Sprayer'),
      Thresher: t('cat.thresher', 'Thresher'),
      Other: t('cat.other', 'Other Equipment'),
      All: t('cat.all', 'All Categories'),
    };
    return map[type] || type;
  };

  const translateWorkType = (work: string): string => {
    const map: Record<string, string> = {
      Ploughing: t('work.ploughing', 'Ploughing'),
      Tilling: t('work.tilling', 'Tilling / Rotavation'),
      'Tilling / Rotavation': t('work.tilling', 'Tilling / Rotavation'),
      Harvesting: t('work.harvesting', 'Harvesting'),
      Sowing: t('work.sowing', 'Seed Sowing'),
      'Seed Sowing': t('work.sowing', 'Seed Sowing'),
      Haulage: t('work.haulage', 'Haulage / Transport'),
      'Haulage / Transport': t('work.haulage', 'Haulage / Transport'),
      'Land Levelling': t('work.landLevelling', 'Land Levelling'),
      Spraying: t('work.spraying', 'Crop Spraying'),
      Threshing: t('work.threshing', 'Threshing'),
      All: t('cat.all', 'All Categories'),
    };
    return map[work] || work;
  };

  const translateStatus = (status: string): string => {
    const map: Record<string, string> = {
      Pending: t('farmer.pending', 'Pending Approval'),
      Confirmed: t('farmer.upcoming', 'Confirmed'),
      Completed: t('farmer.completed', 'Completed'),
      Cancelled: t('farmer.cancelled', 'Cancelled'),
    };
    return map[status] || status;
  };

  const currentLanguageOption =
    LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguageOption,
        languages: LANGUAGES,
        translateMachineType,
        translateWorkType,
        translateStatus,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
export { LANGUAGES };
export type { Language };
