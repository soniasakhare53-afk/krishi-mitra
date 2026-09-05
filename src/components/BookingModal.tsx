import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Machine, Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { createBooking } from '../services/storage';
import {
  X,
  MapPin,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
} from 'lucide-react';

interface BookingModalProps {
  machine: Machine;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BookingModal({ machine, onClose, onSuccess }: BookingModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t, translateWorkType, translateMachineType } = useLanguage();
  const navigate = useNavigate();

  // Default dates: tomorrow
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [date, setDate] = useState(tomorrowStr);
  const [startTime, setStartTime] = useState('08:00 AM');
  const [durationHours, setDurationHours] = useState<number>(4);
  const [workType, setWorkType] = useState<string>(machine.suitableWork[0] || 'Ploughing');
  const [farmAreaAcres, setFarmAreaAcres] = useState<number>(user.farmArea || 5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Calculation
  const totalAmount = machine.hourlyRate * durationHours;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newBooking = createBooking({
        machine,
        farmer: user,
        date,
        startTime,
        durationHours,
        workType,
        farmAreaAcres,
        notes,
      });

      setConfirmedBooking(newBooking);

      showToast(
        t('book.successTitle', 'Booking Request Sent!'),
        `${t('book.idLabel', 'Booking ID')}: #${newBooking.id.toUpperCase()} - ${machine.name}`,
        'success',
        5000
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      showToast('Booking Failed', 'Could not process request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    onClose();
    navigate('/farmer-dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden max-h-[95vh] flex flex-col">
        {confirmedBooking ? (
          /* SUCCESS CONFIRMATION VIEW */
          <div className="p-6 overflow-y-auto space-y-5 text-stone-800">
            {/* Header / Success Icon */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {t('book.reservationDispatched', 'Reservation Dispatched')}
                </span>
                <h3 className="text-2xl font-black text-stone-900 mt-0.5">
                  {t('book.successTitle', 'Booking Request Sent!')}
                </h3>
                <div className="inline-block mt-2 bg-stone-100 border border-stone-300 rounded-lg px-3 py-1 text-xs font-mono font-bold text-stone-800">
                  {t('book.idLabel', 'Booking ID')}: <span className="text-emerald-800">#{confirmedBooking.id.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Detailed Confirmation Breakdown */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-3 text-xs">
              {/* Machine & Owner */}
              <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
                <img
                  src={machine.imageUrl}
                  alt={machine.name}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div className="truncate flex-1">
                  <h4 className="font-extrabold text-stone-900 text-sm truncate">{machine.name}</h4>
                  <p className="text-stone-500">{machine.model} • {translateMachineType(machine.type)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-stone-600">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('card.owner', 'Equipment Owner')}</span>
                  <strong className="text-stone-800 text-xs">{machine.ownerName}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('book.ownerContact', 'Owner Contact')}</span>
                  <a
                    href={`tel:${machine.ownerPhone}`}
                    className="text-emerald-800 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{machine.ownerPhone}</span>
                  </a>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('book.scheduledTime', 'Scheduled Date & Time')}</span>
                  <strong className="text-stone-800 text-xs">
                    {confirmedBooking.date} at {confirmedBooking.startTime}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('book.duration', 'Duration')}</span>
                  <strong className="text-stone-800 text-xs">{confirmedBooking.durationHours} {t('book.hoursWord', 'Hours')}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('book.workType', 'Agricultural Work')}</span>
                  <strong className="text-stone-800 text-xs">{translateWorkType(confirmedBooking.workType)}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('book.farmArea', 'Farm Area')}</span>
                  <strong className="text-stone-800 text-xs">{confirmedBooking.farmAreaAcres} {t('ai.acresWord', 'Acres')}</strong>
                </div>
              </div>

              {/* Rate and Total */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('card.rentalRate', 'Hourly Rate')}</span>
                  <span className="font-semibold text-stone-700">₹{confirmedBooking.hourlyRate}/{t('card.perHour', 'hour')}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('book.totalEst', 'Total Estimated Cost')}</span>
                  <span className="text-base font-black text-emerald-950">
                    ₹{confirmedBooking.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification message */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                {t('book.ownerNotified', 'Owner has been notified. You can track real-time confirmation and dispatch status directly on your Farmer Dashboard.')}
              </span>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{t('book.trackDashboard', 'Track on Farmer Dashboard')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-2.5 px-4 border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {t('book.done', 'Done')}
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM */
          <>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-5 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close booking modal"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold bg-white/10 px-2 py-0.5 rounded">
                {t('book.modalTitle', 'Farm Machinery Reservation')}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">{machine.name}</h3>
              <p className="text-xs text-emerald-100 flex items-center gap-2 mt-0.5">
                <span>{t('card.owner', 'Owner')}: <strong>{machine.ownerName}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-amber-300" /> {machine.location} ({machine.distanceKm} km {t('card.distanceAway', 'away')})
                </span>
              </p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-stone-800">
              {/* Rate Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="text-xs text-stone-500 font-medium">{t('card.rentalRate', 'Standard Rental Rate')}</span>
                  <div className="text-lg font-black text-emerald-900">
                    ₹{machine.hourlyRate.toLocaleString()} <span className="text-xs font-normal text-stone-600">/ {t('card.perHour', 'hour')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 font-medium">{t('card.dailyRate', 'Full Day Benchmark')}</span>
                  <div className="text-sm font-bold text-stone-700">₹{machine.dailyRate.toLocaleString()} / day</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Required Date */}
                <div>
                  <label htmlFor="booking-date" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('book.date', 'Required Date')} *
                  </label>
                  <div className="relative">
                    <input
                      id="booking-date"
                      type="date"
                      required
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setDate(e.target.value)}
                      className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none bg-white font-medium"
                    />
                  </div>
                </div>

                {/* Start Time */}
                <div>
                  <label htmlFor="start-time" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('book.time', 'Preferred Time')} *
                  </label>
                  <select
                    id="start-time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none bg-white font-medium"
                  >
                    <option value="06:00 AM">06:00 AM (Early Dawn)</option>
                    <option value="07:00 AM">07:00 AM</option>
                    <option value="08:00 AM">08:00 AM (Recommended)</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="04:00 PM">04:00 PM (Evening)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Duration */}
                <div>
                  <label htmlFor="duration-hours" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('book.duration', 'Duration (Hours)')} *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="duration-hours"
                      type="number"
                      min="1"
                      max="24"
                      required
                      value={durationHours}
                      onChange={e => setDurationHours(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none font-bold"
                    />
                    <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">hrs</span>
                  </div>
                </div>

                {/* Farm Area */}
                <div>
                  <label htmlFor="farm-acres" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('book.farmArea', 'Farm Area (Acres)')} *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="farm-acres"
                      type="number"
                      min="0.5"
                      step="0.5"
                      required
                      value={farmAreaAcres}
                      onChange={e => setFarmAreaAcres(parseFloat(e.target.value) || 1)}
                      className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none font-bold"
                    />
                    <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">{t('ai.acresWord', 'acres')}</span>
                  </div>
                </div>
              </div>

              {/* Work Type */}
              <div>
                <label htmlFor="work-type" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('book.workType', 'Type of Agricultural Work')} *
                </label>
                <select
                  id="work-type"
                  value={workType}
                  onChange={e => setWorkType(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none bg-white font-medium"
                >
                  {machine.suitableWork.map(w => (
                    <option key={w} value={w}>
                      {translateWorkType(w)}
                    </option>
                  ))}
                  <option value="Ploughing">{translateWorkType('Ploughing')}</option>
                  <option value="Tilling">{translateWorkType('Tilling')}</option>
                  <option value="Harvesting">{translateWorkType('Harvesting')}</option>
                  <option value="Sowing">{translateWorkType('Sowing')}</option>
                  <option value="Haulage">{translateWorkType('Haulage')}</option>
                </select>
              </div>

              {/* Optional Notes */}
              <div>
                <label htmlFor="booking-notes" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('book.notes', 'Special Instructions / Land Landmark')}
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={t('book.notesPlaceholder', 'e.g. Near village water canal gate, soil is black cotton...')}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none resize-none placeholder:text-stone-400"
                />
              </div>

              {/* Calculation Box */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span className="flex items-center gap-1">
                    <Calculator className="w-3.5 h-3.5 text-emerald-700" /> {t('card.rentalRate', 'Hourly Rate')} × {t('book.duration', 'Duration')}
                  </span>
                  <span className="font-mono">
                    ₹{machine.hourlyRate} × {durationHours} {durationHours === 1 ? 'hr' : 'hrs'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-emerald-950 pt-1 border-t border-emerald-200/80">
                  <span>{t('book.totalEst', 'Estimated Total Rental Cost')}:</span>
                  <span className="text-lg font-black text-emerald-800">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-emerald-700 flex items-center gap-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('book.payAfter', 'No advance required. Pay directly after machine arrives and work finishes.')}</span>
                </div>
              </div>

              {/* Farmer Contact Info Confirmation */}
              <div className="p-2.5 rounded-lg bg-stone-100/80 text-stone-600 text-xs flex items-center justify-between">
                <div>
                  {t('book.bookingAs', 'Booking as')}: <strong className="text-stone-800">{user.name}</strong> ({user.phone})
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold uppercase">{t('test.verifiedFarmer', 'Verified Farmer')}</span>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t('book.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-md transition-all flex items-center gap-2 hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  {isSubmitting ? t('book.submitting', 'Sending Request...') : t('book.submitBtn', 'Send Booking Request')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
