import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMachineById, isFavourite, toggleFavourite, getReviews } from '../services/storage';
import { calculateSmartMatch } from '../services/smartMatch';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { BookingModal } from '../components/BookingModal';
import { MatchBreakdownModal } from '../components/MatchBreakdownModal';
import {
  Star,
  MapPin,
  Sparkles,
  Heart,
  Layers,
  Phone,
  ShieldCheck,
  Wrench,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export function MachineDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const machine = getMachineById(id || '');
  const { showToast } = useToast();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { t, translateMachineType, translateWorkType } = useLanguage();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [favourited, setFavourited] = useState(() => (machine ? isFavourite(machine.id) : false));

  if (!machine) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-stone-200 text-center space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl mx-auto flex items-center justify-center font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold text-stone-900">{t('details.notFound', 'Machine Not Found')}</h2>
          <p className="text-sm text-stone-600">
            {t('details.notFoundDesc', 'The requested agricultural machinery listing might have been removed or deactivated.')}
          </p>
          <Link
            to="/find-machinery"
            className="inline-block px-5 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-xl"
          >
            {t('details.backMarketplace', 'Back to Marketplace')}
          </Link>
        </div>
      </div>
    );
  }

  const matchScore = calculateSmartMatch(machine);
  const inCompare = isInCompare(machine.id);
  const gallery = machine.gallery || [machine.imageUrl];
  const reviews = getReviews().filter(r => r.machineName?.includes(machine.name.split(' ')[0]) || r.isDemo);

  const handleToggleFav = () => {
    const next = toggleFavourite(machine.id);
    setFavourited(next);
    showToast(
      next ? t('details.favSaved', 'Saved to Favourites') : t('details.favRemoved', 'Removed from Favourites'),
      `${machine.name} updated in your favourites.`,
      'info'
    );
  };

  const handleToggleCompare = () => {
    if (inCompare) {
      removeFromCompare(machine.id);
      showToast(t('compare.removed', 'Removed from Compare'), `${machine.name} removed.`, 'info');
    } else {
      const ok = addToCompare(machine.id);
      if (ok) {
        showToast(t('compare.added', 'Added to Compare'), `${machine.name} added to comparison dock.`, 'success');
      } else {
        showToast(t('compare.limitTitle', 'Comparison Limit'), t('compare.limitDesc', 'Maximum 4 machines can be compared simultaneously.'), 'error');
      }
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumbs / Back button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors p-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('details.backToResults', 'Back to search results')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFav}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                favourited
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favourited ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{favourited ? t('details.savedFav', 'Saved in Favourites') : t('details.saveMachine', 'Save Machine')}</span>
            </button>

            <button
              onClick={handleToggleCompare}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                inCompare
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{inCompare ? t('details.inComparison', 'In Comparison') : t('compare.compare', 'Compare')}</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Images, Specs, Description, Reviews) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="relative h-72 sm:h-96 w-full bg-stone-100">
                <img
                  src={gallery[activeImageIndex] || machine.imageUrl}
                  alt={machine.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {translateMachineType(machine.type)} • {machine.model}
                </div>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="p-3 bg-stone-50 flex items-center gap-3 border-t border-stone-200 overflow-x-auto">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header info */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {translateMachineType(machine.type)}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                    machine.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${machine.isAvailable ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                  {machine.isAvailable ? t('card.available', 'Available for Immediate Booking') : t('card.booked', 'Currently Rented')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-stone-900">{machine.name}</h1>
              <p className="text-xs font-semibold text-stone-500 -mt-2">{t('details.model', 'Model')}: {machine.model}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-1 font-semibold text-stone-800">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{machine.rating} {t('details.rating', 'Rating')}</span>
                  <span className="text-stone-400">({machine.reviewCount} {t('nav.reviews', 'reviews')})</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>{machine.location} ({machine.distanceKm} km {t('card.distanceAway', 'away')})</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('card.verified', 'Verified Machine')}</span>
                </div>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed pt-2">{machine.description}</p>
            </div>

            {/* Technical Specifications */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-800" />
                <span>{t('compare.engineSpecs', 'Technical Specifications')}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {machine.specs.hp && (
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                      {t('details.power', 'Power / HP')}
                    </span>
                    <span className="text-sm font-black text-stone-900">{machine.specs.hp}</span>
                  </div>
                )}
                {machine.specs.fuelType && (
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                      {t('details.fuel', 'Fuel / Drive')}
                    </span>
                    <span className="text-sm font-black text-stone-900">{machine.specs.fuelType}</span>
                  </div>
                )}
                {machine.specs.year && (
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                      {t('details.year', 'Model Year')}
                    </span>
                    <span className="text-sm font-black text-stone-900">{machine.specs.year}</span>
                  </div>
                )}
                {machine.specs.capacity && (
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                      {t('details.capacity', 'Capacity')}
                    </span>
                    <span className="text-sm font-black text-stone-900">{machine.specs.capacity}</span>
                  </div>
                )}
                {machine.specs.workingWidth && (
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                      {t('details.workingWidth', 'Working Width')}
                    </span>
                    <span className="text-sm font-black text-stone-900">{machine.specs.workingWidth}</span>
                  </div>
                )}
                {machine.specs.condition && (
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                      {t('details.condition', 'Condition')}
                    </span>
                    <span className="text-sm font-black text-emerald-800">{machine.specs.condition}</span>
                  </div>
                )}
              </div>

              {/* Suitable Work */}
              <div className="pt-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                  {t('details.suitableTasks', 'Suitable Agricultural Tasks:')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {machine.suitableWork.map(work => (
                    <span
                      key={work}
                      className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200"
                    >
                      ✓ {translateWorkType(work)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Farm Size Suitability */}
              <div className="pt-2 text-xs text-stone-600 flex items-center gap-2">
                <span className="font-bold text-stone-800">{t('details.idealFarmSize', 'Ideal Farm Size:')}</span>
                <span>
                  {machine.suitableFarmSize.minAcres} to {machine.suitableFarmSize.maxAcres} {t('ai.acresWord', 'acres')}
                </span>
              </div>
            </div>

            {/* Owner Details Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-stone-900">{t('details.ownerInfo', 'Machinery Owner Information')}</h3>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-black text-lg flex items-center justify-center">
                    {machine.ownerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-stone-900">{machine.ownerName}</h4>
                    <p className="text-xs text-stone-500 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <strong>{machine.ownerRating}</strong> ({t('card.verifiedOwner', 'Verified Owner')})
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${machine.ownerPhone}`}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{machine.ownerPhone}</span>
                </a>
              </div>
            </div>

            {/* Farmer Reviews */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-stone-900">{t('nav.reviews', 'Farmer Reviews')}</h3>
                <span className="text-xs font-semibold text-emerald-800">⭐ {machine.rating} {t('details.average', 'Average')}</span>
              </div>

              <div className="space-y-4">
                {reviews.slice(0, 2).map(r => (
                  <div key={r.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{r.reviewerName}</span>
                      <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                    </div>
                    <p className="italic text-stone-700">"{r.comment}"</p>
                    <div className="text-[11px] text-stone-400">{r.role} • {r.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Pricing card, AI Match Box, Booking Trigger) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Sticky Pricing & Booking Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-lg space-y-5 sticky top-24">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  {t('card.rentalRate', 'Rental Pricing')}
                </span>
                <div className="text-3xl font-black text-emerald-950 mt-1">
                  ₹{machine.hourlyRate.toLocaleString()}
                  <span className="text-sm font-normal text-stone-500"> / {t('card.perHour', 'hour')}</span>
                </div>
                <div className="text-xs font-bold text-stone-600 mt-0.5">
                  {t('card.dailyRate', 'Full Day')}: ₹{machine.dailyRate.toLocaleString()} / day
                </div>
              </div>

              {/* AI Match Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 to-emerald-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t('ai.title', 'AI Smart Match')}</span>
                  </div>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    {matchScore.overallScore}%
                  </span>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  {matchScore.explanation}
                </p>
                <button
                  onClick={() => setShowMatchModal(true)}
                  className="w-full py-1.5 text-center text-xs font-bold text-emerald-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                >
                  {t('details.view5Factor', 'View 5-Factor Score Breakdown →')}
                </button>
              </div>

              {/* Availability dates teaser */}
              <div>
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                  {t('details.nextAvailable', 'Next Available Dates:')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {machine.availableDates.slice(0, 4).map(d => (
                    <span
                      key={d}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium font-mono"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book Now Main Button */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-sm rounded-xl shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{t('card.bookNow', 'Book Now')}</span>
                </button>

                <div className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('book.payAfter', 'Zero advance required. Pay on completion.')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking and AI Modals */}
      {showBookingModal && (
        <BookingModal
          machine={machine}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {showMatchModal && (
        <MatchBreakdownModal
          machine={machine}
          matchScore={matchScore}
          onClose={() => setShowMatchModal(false)}
          onBookNow={() => {
            setShowMatchModal(false);
            setShowBookingModal(true);
          }}
        />
      )}
    </div>
  );
}
