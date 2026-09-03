import React, { useState } from 'react';
import { Booking } from '../types';
import { advanceBookingTracking, addBookingRating } from '../services/storage';
import { useToast } from '../context/ToastContext';
import {
  X,
  CheckCircle2,
  Clock,
  Tractor,
  MapPin,
  Phone,
  Calendar,
  Star,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface BookingTrackingModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdate: () => void;
}

export function BookingTrackingModal({ booking, onClose, onUpdate }: BookingTrackingModalProps) {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [conditionFeedback, setConditionFeedback] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Excellent');
  const [timelinessFeedback, setTimelinessFeedback] = useState<'On Time' | 'Slight Delay' | 'Late'>('On Time');
  const [ownerBehaviorFeedback, setOwnerBehaviorFeedback] = useState<'Helpful & Courteous' | 'Professional' | 'Needs Improvement'>('Helpful & Courteous');
  const [ratingSubmitted, setRatingSubmitted] = useState(Boolean(booking.ratingGiven));

  const steps = [
    {
      id: 0,
      title: 'Booking Request Sent',
      subtitle: 'Sent directly to machinery owner',
      time: new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: Clock,
    },
    {
      id: 1,
      title: 'Owner Accepted & Confirmed',
      subtitle: `${booking.ownerName} locked in the machine schedule`,
      time: booking.trackingStep >= 1 ? 'Confirmed' : 'Awaiting owner approval',
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: 'Machine Assigned & Operator Dispatched',
      subtitle: 'Driver en-route to farm location with equipment',
      time: booking.trackingStep >= 2 ? 'Dispatched' : 'Pending dispatch',
      icon: Tractor,
    },
    {
      id: 3,
      title: 'Field Service Started',
      subtitle: `${booking.workType} underway on ${booking.farmAreaAcres} acres`,
      time: booking.trackingStep >= 3 ? 'In Progress' : 'Pending start',
      icon: MapPin,
    },
    {
      id: 4,
      title: 'Work Completed & Verified',
      subtitle: 'Field inspection completed, payment settled',
      time: booking.trackingStep >= 4 ? 'Completed' : 'Pending completion',
      icon: Award,
    },
  ];

  const handleAdvanceStep = () => {
    const updated = advanceBookingTracking(booking.id);
    if (updated) {
      showToast(
        'Tracking Advanced (Demo)',
        `Status updated to stage: ${steps[updated.trackingStep]?.title}`,
        'info'
      );
      onUpdate();
    }
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    const combinedFeedback = `${reviewText.trim()} [Condition: ${conditionFeedback} | Timeliness: ${timelinessFeedback} | Owner: ${ownerBehaviorFeedback}]`;
    addBookingRating(booking.id, rating, combinedFeedback);
    setRatingSubmitted(true);
    showToast('Feedback Recorded!', 'Thank you for rating your machinery service experience.', 'success');
    onUpdate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close tracking modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                booking.status === 'Confirmed'
                  ? 'bg-emerald-500 text-white'
                  : booking.status === 'Completed'
                  ? 'bg-blue-500 text-white'
                  : booking.status === 'Cancelled'
                  ? 'bg-rose-500 text-white'
                  : 'bg-amber-500 text-black'
              }`}
            >
              ● {booking.status}
            </span>
            <span className="text-xs text-stone-300">Booking #{booking.id}</span>
          </div>

          <h3 className="text-xl font-extrabold text-white">{booking.machineName}</h3>
          <p className="text-xs text-emerald-200 mt-0.5 flex items-center gap-3">
            <span>Owner: <strong>{booking.ownerName}</strong></span>
            <span>•</span>
            <span>{booking.date} at {booking.startTime}</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Quick Summary Card */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 font-medium">Work & Acreage:</span>
              <div className="font-bold text-stone-800">{booking.workType} ({booking.farmAreaAcres} Acres)</div>
            </div>
            <div>
              <span className="text-stone-500 font-medium">Duration & Total:</span>
              <div className="font-bold text-emerald-800">
                {booking.durationHours} hrs • ₹{booking.totalAmount.toLocaleString()}
              </div>
            </div>
            <div className="col-span-2 pt-2 border-t border-stone-200 flex items-center justify-between">
              <span className="text-stone-600 flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-700" /> Owner Contact:
              </span>
              <a
                href={`tel:${booking.ownerPhone}`}
                className="font-bold text-emerald-700 hover:underline"
              >
                {booking.ownerPhone}
              </a>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Live Rental Progress
              </h4>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Step {booking.trackingStep + 1} of 5
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {steps.map(step => {
                const isCompleted = booking.trackingStep >= step.id;
                const isCurrent = booking.trackingStep === step.id;

                return (
                  <div key={step.id} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[23px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-stone-100 text-stone-400 border border-stone-300'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.id + 1}
                    </div>

                    {/* Step Details */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-emerald-900 font-extrabold'
                              : isCompleted
                              ? 'text-stone-800'
                              : 'text-stone-400'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">{step.time}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{step.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hackathon Demo Stepper Control */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-amber-900 block">⚡ Hackathon Demo Control</span>
              <span className="text-amber-800 text-[11px]">
                Advance machine progress timeline to test full lifecycle
              </span>
            </div>
            {booking.trackingStep < 4 ? (
              <button
                onClick={handleAdvanceStep}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Advance Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
                ✓ Lifecycle Finished
              </span>
            )}
          </div>

          {/* Rating Section (Visible when completed) */}
          {booking.trackingStep === 4 && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Farmer Feedback & Service Rating
                </h5>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Verified Rental
                </span>
              </div>

              {ratingSubmitted || booking.ratingGiven ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-sm text-amber-600">
                      {'★'.repeat(booking.ratingGiven?.rating || rating)}
                      <span className="text-xs font-bold text-stone-700 ml-1.5">
                        ({booking.ratingGiven?.rating || rating} / 5 Stars)
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800">Feedback Recorded ✓</span>
                  </div>
                  <p className="italic text-stone-700 bg-white/60 p-2 rounded-lg border border-emerald-100">
                    "{booking.ratingGiven?.review || reviewText}"
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRatingSubmit} className="space-y-3 pt-1">
                  {/* 1. Star Rating */}
                  <div>
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                      1. Overall Rating (1–5 Stars) *
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 hover:scale-125 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= rating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-stone-700 ml-1">
                        {rating === 5 && '5/5 — Outstanding Service'}
                        {rating === 4 && '4/5 — Very Good Experience'}
                        {rating === 3 && '3/5 — Average / Met Expectations'}
                        {rating === 2 && '2/5 — Below Expectations'}
                        {rating === 1 && '1/5 — Poor Service'}
                      </span>
                    </div>
                  </div>

                  {/* 2. Machinery Condition Feedback */}
                  <div>
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                      2. Machinery Condition *
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {(['Excellent', 'Good', 'Fair', 'Poor'] as const).map(cond => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setConditionFeedback(cond)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                            conditionFeedback === cond
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Timeliness Feedback */}
                  <div>
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                      3. Arrival Timeliness *
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['On Time', 'Slight Delay', 'Late'] as const).map(timeOpt => (
                        <button
                          key={timeOpt}
                          type="button"
                          onClick={() => setTimelinessFeedback(timeOpt)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                            timelinessFeedback === timeOpt
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {timeOpt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Owner Behavior Feedback */}
                  <div>
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                      4. Owner / Operator Conduct *
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['Helpful & Courteous', 'Professional', 'Needs Improvement'] as const).map(behOpt => (
                        <button
                          key={behOpt}
                          type="button"
                          onClick={() => setOwnerBehaviorFeedback(behOpt)}
                          className={`py-1.5 px-1.5 rounded-lg text-[11px] font-semibold border transition-all truncate ${
                            ownerBehaviorFeedback === behOpt
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                          title={behOpt}
                        >
                          {behOpt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Comment Box */}
                  <div>
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                      5. Review Comments & Farm Experience *
                    </span>
                    <textarea
                      rows={2}
                      required
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      placeholder="Share details on machine performance, fuel consumption, driver skill..."
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    Submit Complete Feedback & Rating
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
