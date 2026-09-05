import React, { useState } from 'react';
import { Star, MessageSquare, Plus, CheckCircle2, User, Tractor } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getReviews, addReview } from '../services/storage';
import { Review } from '../types';
import { useToast } from '../context/ToastContext';

export function ReviewsPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(() => getReviews());
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Farmer' | 'Machinery Owner'>('Farmer');
  const [location, setLocation] = useState('');
  const [machineName, setMachineName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev = addReview({
      reviewerName: name.trim(),
      role: role === 'Farmer' ? `${t('reviews.roleFarmer', 'Farmer')} (${location || 'Maharashtra'})` : `${t('reviews.roleOwner', 'Machinery Owner')} (${location || 'Maharashtra'})`,
      location: location.trim() || 'Maharashtra',
      machineName: machineName.trim() || 'Mahindra Tractor',
      rating,
      comment: comment.trim(),
      isDemo: false,
    });

    setReviews(prev => [newRev, ...prev]);
    setName('');
    setComment('');
    setLocation('');
    setMachineName('');
    setShowForm(false);
    showToast(t('reviews.success', 'Thank you! Your review has been published.'), '', 'success');
  };

  return (
    <div className="bg-stone-50 min-h-screen py-10 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{t('test.super', 'Community Feedback')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {t('reviews.title', 'What Farmers Say About KrishiMitra')}
            </h1>
            <p className="text-stone-600 text-sm mt-1 max-w-xl">
              {t('reviews.subtitle', 'Real reviews from verified farmers and machinery owners across rural India.')}
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('reviews.writeReview', 'Write a Community Review')}</span>
          </button>
        </div>

        {/* Write Review Form */}
        {showForm && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-lg mb-10 animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-stone-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              <span>{t('reviews.writeReview', 'Write a Community Review')}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('reviews.name', 'Your Full Name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('reviews.role', 'Your Role')} *
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none bg-white font-medium"
                  >
                    <option value="Farmer">{t('reviews.roleFarmer', 'Farmer')}</option>
                    <option value="Machinery Owner">{t('reviews.roleOwner', 'Machinery Owner')}</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('reviews.rating', 'Rating')} (1–5) *
                  </label>
                  <div className="flex items-center gap-1 py-1">
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
                    <span className="text-xs font-bold text-stone-700 ml-2">
                      {rating} / 5
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('search.location', 'Location')}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Wardha, Maharashtra"
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Machine Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('rent.machineName', 'Machine Name / Title')}
                  </label>
                  <input
                    type="text"
                    value={machineName}
                    onChange={e => setMachineName(e.target.value)}
                    placeholder="e.g. Mahindra 575 DI / Shaktiman Rotavator"
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('reviews.comment', 'Your Review / Experience')} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your experience renting or operating equipment through KrishiMitra..."
                  className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  {t('btn.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  {t('reviews.submit', 'Submit Community Review')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{rev.date}</span>
                </div>

                <p className="text-stone-700 text-sm italic leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    {rev.reviewerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">{rev.reviewerName}</div>
                    <div className="text-[11px] text-stone-500">{rev.role}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {rev.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
