import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Machine, SearchCriteria } from '../types';
import { calculateSmartMatch } from '../services/smartMatch';
import { toggleFavourite, isFavourite } from '../services/storage';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { MatchBreakdownModal } from './MatchBreakdownModal';
import { BookingModal } from './BookingModal';
import {
  Star,
  MapPin,
  Sparkles,
  Heart,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

interface MachineryCardProps {
  key?: React.Key;
  machine: Machine;
  searchCriteria?: SearchCriteria;
  onBook?: (machine: Machine) => void;
}

export function MachineryCard({ machine, searchCriteria, onBook }: MachineryCardProps) {
  const { t, translateMachineType, translateWorkType } = useLanguage();
  const [favourited, setFavourited] = useState<boolean>(() => isFavourite(machine.id));
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { showToast } = useToast();

  const matchScore = calculateSmartMatch(machine, searchCriteria);
  const inCompare = isInCompare(machine.id);

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavourite(machine.id);
    setFavourited(newState);
    showToast(
      newState ? t('card.favSaved', 'Saved to Favourites') : t('card.favRemoved', 'Removed from Favourites'),
      `${machine.name}`,
      'info',
      2000
    );
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(machine.id);
      showToast(t('compare.removed', 'Removed from Comparison'), `${machine.name}`, 'info', 2000);
    } else {
      const added = addToCompare(machine.id);
      if (added) {
        showToast(t('compare.added', 'Added to Compare'), `${machine.name}`, 'success', 2000);
      } else {
        showToast(t('compare.limitReached', 'Comparison Limit'), t('compare.limitDesc', 'You can compare up to 4 machines at once.'), 'error', 2500);
      }
    }
  };

  const handleBookClick = () => {
    if (onBook) {
      onBook(machine);
    } else {
      setShowBookingModal(true);
    }
  };

  return (
    <>
      <div
        id={`machine-card-${machine.id}`}
        className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-xl hover:border-emerald-300/80 transition-all duration-300 flex flex-col overflow-hidden group"
      >
        {/* Top Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-stone-100">
          <img
            src={machine.imageUrl}
            alt={machine.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* 1. AI Match Badge (Top-Left) */}
          <button
            onClick={() => setShowMatchModal(true)}
            className="absolute top-3 left-3 bg-emerald-950/90 hover:bg-emerald-900 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-400/40 shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
            title={t('ai.whyRecommended', 'Click to view AI match breakdown')}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-black">{matchScore.overallScore}%</span>
            <span className="text-[11px] text-emerald-100 font-semibold">{t('ai.match', 'AI Match')}</span>
            <Info className="w-3 h-3 text-emerald-300/80 ml-0.5" />
          </button>

          {/* Action Icons (Top-Right) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {/* Favourite Button */}
            <button
              onClick={handleToggleFav}
              className={`p-2 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${
                favourited
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-white/90 text-stone-700 hover:bg-white hover:text-rose-600'
              }`}
              title={favourited ? t('card.favSaved', 'Saved in Favourites') : t('card.favSave', 'Save to Favourites')}
              aria-label="Save to Favourites"
            >
              <Heart className={`w-4 h-4 ${favourited ? 'fill-white' : ''}`} />
            </button>

            {/* Compare Button */}
            <button
              onClick={handleToggleCompare}
              className={`p-2 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${
                inCompare
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-white/90 text-stone-700 hover:bg-white hover:text-amber-600'
              }`}
              title={inCompare ? t('compare.remove', 'Remove from Compare') : t('compare.add', 'Add to Compare')}
              aria-label="Compare"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Machine Type Badge on Image Bottom Left */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-stone-900/80 text-white px-2.5 py-0.5 rounded-md font-bold text-[11px] backdrop-blur-xs">
              {translateMachineType(machine.type)}
            </span>
          </div>

          {/* Availability Status Badge on Image Bottom Right */}
          <div className="absolute bottom-3 right-3">
            <span
              className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1.5 backdrop-blur-xs shadow-xs ${
                machine.isAvailable
                  ? 'bg-emerald-700/90 text-white'
                  : 'bg-stone-800/90 text-stone-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${machine.isAvailable ? 'bg-emerald-300' : 'bg-stone-400'}`} />
              <span>{machine.isAvailable ? t('card.available', 'Available') : t('card.booked', 'Booked')}</span>
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* 2. Machine Name */}
            <Link to={`/machinery/${machine.id}`} className="group-hover:text-emerald-800 transition-colors block">
              <h3 className="font-black text-base text-stone-900 leading-snug line-clamp-1">
                {machine.name}
              </h3>
              <p className="text-xs text-stone-500 truncate mt-0.5">{machine.model}</p>
            </Link>

            {/* 3. Distance & Location */}
            <div className="flex items-center justify-between text-xs text-stone-600 mt-2.5 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-200/70">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate font-medium text-stone-700">{machine.location}</span>
              </div>
              <span className="font-extrabold text-emerald-800 shrink-0 text-xs">
                {machine.distanceKm} km {t('card.distanceAway', 'away')}
              </span>
            </div>

            {/* 4. Rating & Owner */}
            <div className="flex items-center justify-between text-xs mt-2.5 text-stone-600 px-0.5">
              <div className="flex items-center gap-1 shrink-0 font-bold text-stone-900">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{machine.rating}</span>
                <span className="text-[11px] text-stone-400 font-normal">({machine.reviewCount})</span>
              </div>
              <span className="text-xs text-stone-500 truncate max-w-[140px]" title={machine.ownerName}>
                {t('card.owner', 'Owner')}: <strong className="text-stone-800 font-semibold">{machine.ownerName}</strong>
              </span>
            </div>

            {/* Work tags */}
            <div className="flex flex-wrap gap-1 mt-2.5">
              {machine.suitableWork.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200/50"
                >
                  {translateWorkType(tag)}
                </span>
              ))}
              {machine.suitableWork.length > 2 && (
                <span className="text-[10px] text-stone-400 self-center">
                  +{machine.suitableWork.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* 5. Price and Action CTAs */}
          <div className="pt-3 border-t border-stone-100 space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                  {t('card.rentalRate', 'Rental Rate')}
                </span>
                <div className="text-emerald-950 font-black text-xl">
                  ₹{machine.hourlyRate.toLocaleString()}
                  <span className="text-xs font-normal text-stone-500"> / {t('card.perHour', 'hour')}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block font-medium">{t('card.dailyRate', 'Daily Rate')}</span>
                <span className="text-xs font-bold text-stone-700">₹{machine.dailyRate.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <Link
                to={`/machinery/${machine.id}`}
                className="py-2 px-3 text-center rounded-xl border border-stone-300 text-stone-700 hover:text-stone-950 hover:bg-stone-50 text-xs font-bold transition-colors"
              >
                {t('card.viewDetails', 'View Details')}
              </Link>
              <button
                onClick={handleBookClick}
                className="py-2 px-3 text-center rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{t('card.bookNow', 'Book Now')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showMatchModal && (
        <MatchBreakdownModal
          machine={machine}
          matchScore={matchScore}
          onClose={() => setShowMatchModal(false)}
          onBookNow={() => {
            setShowMatchModal(false);
            if (onBook) {
              onBook(machine);
            } else {
              setShowBookingModal(true);
            }
          }}
        />
      )}

      {showBookingModal && (
        <BookingModal
          machine={machine}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  );
}
