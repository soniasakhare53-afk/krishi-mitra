import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LANGUAGES, Language } from '../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'header' | 'mobile' | 'footer';
  className?: string;
}

export function LanguageSelector({ variant = 'header', className = '' }: LanguageSelectorProps) {
  const { language, setLanguage, t, currentLanguageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  // Mobile layout: Segmented buttons or compact selector
  if (variant === 'mobile') {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <label className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t('nav.selectLanguage', 'Select Language')}</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
          {LANGUAGES.map(lang => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-emerald-900 shadow-sm border border-emerald-300 ring-1 ring-emerald-600'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
                }`}
                aria-pressed={isSelected}
                aria-label={`Select ${lang.name} language`}
              >
                <span className="text-sm">{lang.flag}</span>
                <span className="truncate">{lang.nativeName}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop / Header Dropdown variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        id="language-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('nav.selectLanguage', 'Select Language')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-400 bg-white/90 hover:bg-emerald-50/50 text-stone-800 text-xs font-bold transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span className="text-xs">{currentLanguageOption.flag}</span>
        <span className="font-semibold text-stone-800">{currentLanguageOption.nativeName}</span>
        <ChevronDown
          className={`w-3 h-3 text-stone-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby="language-selector-button"
          className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
            {t('nav.selectLanguage', 'Select Language')}
          </div>
          {LANGUAGES.map(lang => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors text-left cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 font-bold'
                    : 'text-stone-700 hover:bg-stone-50 hover:text-emerald-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <div>
                    <span className="block text-stone-900">{lang.nativeName}</span>
                    <span className="text-[10px] text-stone-500 font-normal">{lang.name}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
