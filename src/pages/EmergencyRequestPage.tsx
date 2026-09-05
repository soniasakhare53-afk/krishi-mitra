import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { createEmergencyRequest } from '../services/storage';
import { EmergencyRequest } from '../types';
import {
  AlertTriangle,
  Radio,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export function EmergencyRequestPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [workRequired, setWorkRequired] = useState('Urgent Harvesting before Rain');
  const [location, setLocation] = useState(user.location || 'Nagpur, Maharashtra');
  const [farmAreaAcres, setFarmAreaAcres] = useState<number>(user.farmArea || 5);
  const [requiredTime, setRequiredTime] = useState('Immediate / Within 2 Hours');
  const [contactPhone, setContactPhone] = useState(user.phone || '+91 98230 45612');

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);
    setBroadcastDone(false);

    // Simulate real radar broadcast progression
    setTimeout(() => {
      const newReq = createEmergencyRequest({
        workRequired,
        location,
        farmAreaAcres,
        requiredTime,
        contactPhone,
      });
      setActiveRequest(newReq);
      setIsBroadcasting(false);
      setBroadcastDone(true);
      showToast(
        t('emergency.broadcastLive', 'Emergency Broadcast Live!'),
        t('emergency.broadcastLiveDesc', '3 nearby machinery owners in a 10 km cluster responded to your broadcast.'),
        'success',
        6000
      );
    }, 2200);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-10 text-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider border border-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>{t('emergency.priorityBadge', 'High-Priority Farm Dispatch')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {t('nav.emergencyRequest', 'Emergency Machinery Request')}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base">
            {t('emergency.pageSubtitle', 'Facing sudden rain forecasts, broken farm machinery, or critical sowing windows? Broadcast an urgent call to all machinery owners within a 15 km radius.')}
          </p>
        </div>

        {/* Main Request Form */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-stone-900 text-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
              <span>{t('emergency.paramsTitle', 'Broadcast Parameters')}</span>
            </h2>
            <p className="text-xs text-rose-200 mt-1">
              {t('emergency.paramsDesc', 'Your contact and farm coordinates will be beamed instantly to registered tractor & harvester owners.')}
            </p>
          </div>

          <form onSubmit={handleBroadcast} className="p-6 sm:p-8 space-y-5 text-stone-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Work Required */}
              <div>
                <label htmlFor="emergency-work-needed" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  {t('emergency.urgentWorkNeeded', 'Urgent Work Required')} *
                </label>
                <select
                  id="emergency-work-needed"
                  value={workRequired}
                  onChange={e => setWorkRequired(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-600 outline-none bg-white font-semibold"
                >
                  <option value="Urgent Harvesting before Rain">🌾 {t('emergency.optHarvest', 'Urgent Harvesting before Rain')}</option>
                  <option value="Breakdown Tractor Replacement">🚜 {t('emergency.optTractor', 'Breakdown Tractor Replacement')}</option>
                  <option value="Emergency Sowing Window">🌱 {t('emergency.optSowing', 'Emergency Sowing Window')}</option>
                  <option value="Urgent Paddy Puddling">💧 {t('emergency.optPuddling', 'Urgent Paddy Puddling')}</option>
                  <option value="Emergency Land Levelling">🛠️ {t('emergency.optLevelling', 'Emergency Land Levelling / Ditching')}</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="emergency-farm-location" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  {t('emergency.locationLabel', 'Farm Location / Tehsil')} *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    id="emergency-farm-location"
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-600 outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Farm Area */}
              <div>
                <label htmlFor="emergency-farm-area" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  {t('dash.totalFarmArea', 'Farm Area (Acres)')} *
                </label>
                <input
                  id="emergency-farm-area"
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={farmAreaAcres}
                  onChange={e => setFarmAreaAcres(Number(e.target.value))}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-600 outline-none font-bold"
                />
              </div>

              {/* Required Time */}
              <div>
                <label htmlFor="emergency-arrival-time" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  {t('emergency.arrivalTime', 'Required Arrival Time')} *
                </label>
                <select
                  id="emergency-arrival-time"
                  value={requiredTime}
                  onChange={e => setRequiredTime(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-600 outline-none bg-white font-medium"
                >
                  <option value="Immediate / Within 2 Hours">{t('emergency.immediate2h', 'Immediate (Within 2 Hours)')}</option>
                  <option value="Today Evening (Before 6 PM)">{t('emergency.todayEvening', 'Today Evening (Before 6 PM)')}</option>
                  <option value="Tomorrow Early Morning (6 AM)">{t('emergency.tomorrowMorning', 'Tomorrow Early Morning (6 AM)')}</option>
                </select>
              </div>

              {/* Contact Phone */}
              <div>
                <label htmlFor="emergency-contact-number" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  {t('emergency.phoneLabel', 'Emergency Phone Call')} *
                </label>
                <input
                  id="emergency-contact-number"
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-600 outline-none font-bold text-stone-900"
                />
              </div>
            </div>

            {/* Broadcast CTA */}
            <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('emergency.shieldNotice', 'Encrypted alert sent to registered local owners with sirens enabled.')}</span>
              </span>

              <button
                type="submit"
                disabled={isBroadcasting}
                className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-xl shadow-lg shadow-rose-950/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <Radio className={`w-4 h-4 text-amber-300 ${isBroadcasting ? 'animate-spin' : 'animate-pulse'}`} />
                <span>{isBroadcasting ? t('emergency.broadcastingStatus', 'Broadcasting to 15km...') : t('emergency.broadcastButton', 'Broadcast Emergency Request')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Broadcasting Live Radar Animation */}
        {isBroadcasting && (
          <div className="bg-stone-900 text-white rounded-3xl p-10 border border-stone-800 shadow-2xl text-center space-y-4 animate-in fade-in duration-300">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-rose-600/30 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center">
                <Radio className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-black text-white">
              "{t('emergency.radarTitle', 'Broadcasting request to nearby machinery owners...')}"
            </h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              {t('emergency.scanningNodes', 'Scanning 14 active GPS telemetry nodes within 15 km of')} {location}...
            </p>
          </div>
        )}

        {/* Simulated Response Cluster */}
        {broadcastDone && activeRequest && (
          <div className="bg-white rounded-3xl border border-emerald-300 shadow-2xl p-6 sm:p-8 space-y-6 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('emergency.broadcastDoneBadge', 'Broadcast Dispatched to 15 km Cluster')}</span>
                </div>
                <h3 className="text-2xl font-black text-stone-900">
                  {t('emergency.providersResponded', '3 Local Equipment Providers Responded')}
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-mono">
                {t('book.idLabel', 'Req ID')}: #{activeRequest.id}
              </span>
            </div>

            {/* Simulated Live Owner Cards */}
            <div className="space-y-3">
              {activeRequest.responses.map((resp, idx) => {
                const isAvail = resp.status === 'Available';
                return (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isAvail
                        ? 'border-emerald-300 bg-emerald-50/40'
                        : 'border-stone-200 bg-stone-50/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                          isAvail ? 'bg-emerald-500 shadow-sm shadow-emerald-400' : 'bg-rose-500'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-stone-900">{resp.providerName}</h4>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              isAvail ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isAvail ? `🟢 ${t('owner.available', 'Available')}` : `🔴 ${t('owner.busy', 'Busy')}`}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          {t('details.machinery', 'Machine')}: <strong>{resp.machine}</strong> • {t('card.proximity', 'Proximity')}: {resp.distance}
                        </p>
                        <div className="text-xs font-bold text-emerald-900 mt-1">
                          {t('emergency.standardRate', 'Standard Emergency Rate')}: {resp.rate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {isAvail ? (
                        <a
                          href={`tel:${resp.phone}`}
                          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-300" />
                          <span>{t('emergency.callDispatch', 'Call & Dispatch Now')}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-stone-400 font-semibold px-3 py-1 bg-stone-200 rounded-lg">
                          {t('emergency.occupiedInField', 'Occupied in Field')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
