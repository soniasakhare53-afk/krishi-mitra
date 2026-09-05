import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getMachines,
  getBookings,
  updateBookingStatus,
  deleteMachine,
  toggleMachineStatus,
  toggleMachineAvailability,
} from '../services/storage';
import { Machine, Booking } from '../types';
import {
  Tractor,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  Power,
  Calendar,
  BarChart3,
  AlertCircle,
} from 'lucide-react';

export function OwnerDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t, translateMachineType, translateWorkType, translateStatus } = useLanguage();

  const [machines, setMachines] = useState<Machine[]>(() => getMachines());
  const [bookings, setBookings] = useState<Booking[]>(() => getBookings());
  const [activeTab, setActiveTab] = useState<'requests' | 'machines' | 'earnings'>('requests');

  const refreshData = () => {
    setMachines(getMachines());
    setBookings(getBookings());
  };

  useEffect(() => {
    const handleMachinesChange = () => refreshData();
    const handleBookingsChange = () => refreshData();

    window.addEventListener('krishimitra_machines_change', handleMachinesChange);
    window.addEventListener('krishimitra_bookings_change', handleBookingsChange);

    return () => {
      window.removeEventListener('krishimitra_machines_change', handleMachinesChange);
      window.removeEventListener('krishimitra_bookings_change', handleBookingsChange);
    };
  }, []);

  // Filter machines owned by this owner (or match name/all if demo)
  const myMachines = machines.filter(
    m => m.ownerId === user.id || m.ownerName.toLowerCase().includes(user.name.toLowerCase().split(' ')[0])
  );

  // Booking requests for this owner's equipment
  const myBookings = bookings.filter(
    b =>
      b.ownerId === user.id ||
      b.ownerName.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]) ||
      myMachines.some(m => m.id === b.machineId)
  );

  const pendingRequests = myBookings.filter(b => b.status === 'Pending');
  const acceptedBookings = myBookings.filter(b => b.status === 'Confirmed');
  const completedBookings = myBookings.filter(b => b.status === 'Completed');

  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0) + 14500; // includes demo base
  const thisMonthEarnings = 18900;

  // Handle Accept Booking
  const handleAccept = (bookingId: string) => {
    const updated = updateBookingStatus(bookingId, 'Confirmed');
    if (updated) {
      showToast(
        t('owner.acceptedToast', 'Booking Accepted!'),
        `${t('owner.acceptedToastDesc', 'Accepted booking for')} ${updated.farmerName}.`,
        'success'
      );
      refreshData();
    }
  };

  // Handle Reject Booking
  const handleReject = (bookingId: string) => {
    const updated = updateBookingStatus(bookingId, 'Cancelled');
    if (updated) {
      showToast(t('owner.rejectedToast', 'Booking Rejected'), t('owner.rejectedToastDesc', 'Reservation request was cancelled.'), 'info');
      refreshData();
    }
  };

  // Handle Machine Delete
  const handleDeleteMachine = (id: string, name: string) => {
    if (window.confirm(`${t('owner.deleteConfirm', 'Are you sure you want to delete')} ${name}?`)) {
      deleteMachine(id);
      showToast(t('owner.deletedToast', 'Machine Deleted'), `${name} ${t('owner.deletedToastDesc', 'has been removed from your fleet.')}`, 'info');
      refreshData();
    }
  };

  // Handle Toggle Active/Inactive
  const handleToggleActive = (id: string) => {
    toggleMachineStatus(id);
    showToast(t('owner.statusUpdatedToast', 'Status Updated'), t('owner.statusUpdatedDesc', 'Listing visibility updated in the marketplace.'), 'info');
    refreshData();
  };

  // Handle Toggle Availability
  const handleToggleAvailability = (id: string) => {
    toggleMachineAvailability(id);
    showToast(t('owner.availUpdatedToast', 'Availability Updated'), t('owner.availUpdatedDesc', 'Equipment availability calendar updated.'), 'info');
    refreshData();
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600">
              {t('owner.hubTitle', 'Machinery Owner Hub')}
            </div>
            <h1 className="text-3xl font-black text-stone-900 mt-0.5">{t('nav.ownerDashboard', 'Owner Dashboard')}</h1>
            <p className="text-xs text-stone-500 mt-1">
              {t('nav.signedInAs', 'Logged in as')} <strong>{user.name}</strong> • {t('owner.fleetManager', 'Equipment Fleet Manager')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/rent-machinery"
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('owner.listNew', 'List New Machine')}</span>
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Machines */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t('owner.totalFleet', 'Total Fleet')}</span>
              <Tractor className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-3xl font-black text-stone-900 mt-2">{myMachines.length}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">{t('owner.registeredVehicles', 'Registered machines')}</div>
          </div>

          {/* Active Listings */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t('owner.activeListings', 'Active Listings')}</span>
              <Power className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-800 mt-2">
              {myMachines.filter(m => m.active).length}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">{t('owner.liveMarketplace', 'Live on Marketplace')}</div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t('dash.pendingRequests', 'Pending Requests')}</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-600 mt-2">{pendingRequests.length}</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">{t('owner.actionNeeded', 'Action Needed')}</div>
          </div>

          {/* Accepted Bookings */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t('owner.acceptedBookings', 'Accepted Bookings')}</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-blue-700 mt-2">{acceptedBookings.length}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">{t('owner.scheduledInField', 'Scheduled / In-Field')}</div>
          </div>

          {/* Estimated Earnings */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t('owner.estimatedEarnings', 'Estimated Earnings')}</span>
              <DollarSign className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-black text-emerald-950 mt-2 font-mono">
              ₹{totalEarnings.toLocaleString()}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">{t('owner.demoBalance', 'Prototype Demo Balance')}</div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 mb-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'requests'
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{t('owner.bookingRequests', 'Booking Requests')} ({pendingRequests.length} {t('owner.pendingWord', 'pending')})</span>
          </button>

          <button
            onClick={() => setActiveTab('machines')}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'machines'
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Tractor className="w-4 h-4" />
            <span>{t('nav.myMachinery', 'My Machinery')} ({myMachines.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'earnings'
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t('owner.earningsAnalytics', 'Earnings & Analytics')}</span>
          </button>
        </div>

        {/* TAB 1: OWNER BOOKING REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {myBookings.length > 0 ? (
              <div className="space-y-3">
                {myBookings.map(bk => {
                  const isPending = bk.status === 'Pending';
                  return (
                    <div
                      key={bk.id}
                      className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isPending ? 'border-amber-300 ring-2 ring-amber-100/50' : 'border-stone-200'
                      }`}
                    >
                      {/* Left info */}
                      <div className="flex items-start gap-4">
                        <img
                          src={bk.machineImage}
                          alt={bk.machineName}
                          className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {isPending && (
                              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black px-2 py-0.5 rounded animate-pulse">
                                {t('owner.newRequest', 'NEW REQUEST')}
                              </span>
                            )}
                            <h4 className="font-black text-base text-stone-900">{bk.machineName}</h4>
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                bk.status === 'Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : bk.status === 'Completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : bk.status === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              ● {translateStatus(bk.status)}
                            </span>
                          </div>

                          <p className="text-xs text-stone-600">
                            {t('nav.roleFarmer', 'Farmer')}: <strong className="text-stone-900">{bk.farmerName}</strong> ({bk.farmerPhone}) •
                            {t('search.location', 'Location')}: {bk.farmerLocation}
                          </p>

                          <div className="text-xs text-stone-500 flex flex-wrap items-center gap-3 pt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-stone-400" />
                              {bk.date} at {bk.startTime}
                            </span>
                            <span>•</span>
                            <span>{t('book.duration', 'Duration')}: <strong>{bk.durationHours} {t('card.perHour', 'hours')}</strong></span>
                            <span>•</span>
                            <span>{t('book.workType', 'Work')}: {translateWorkType(bk.workType)} ({bk.farmAreaAcres} {t('ai.acresWord', 'Acres')})</span>
                          </div>

                          {bk.notes && (
                            <p className="text-xs text-amber-900 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 mt-1.5">
                              💬 {t('owner.farmerNote', "Farmer's note")}: "{bk.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right amount and accept/reject controls */}
                      <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">
                            {t('owner.estimatedPayout', 'Estimated Payout')}
                          </span>
                          <span className="text-xl font-black text-emerald-950 font-mono">
                            ₹{bk.totalAmount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            (₹{bk.hourlyRate}/{t('card.perHour', 'hr')} × {bk.durationHours}h)
                          </span>
                        </div>

                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAccept(bk.id)}
                              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                              <span>{t('owner.accept', 'Accept')}</span>
                            </button>
                            <button
                              onClick={() => handleReject(bk.id)}
                              className="px-4 py-2 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs font-bold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                            >
                              {t('owner.reject', 'Reject')}
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-xl">
                            {bk.status === 'Confirmed' ? `✓ ${t('owner.acceptedScheduled', 'Accepted & Scheduled')}` : translateStatus(bk.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
                <Clock className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-bold text-stone-800">{t('owner.noRequests', 'No Booking Requests')}</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {t('owner.noRequestsDesc', "When farmers request machinery rentals, you'll see instant reservation notices here to accept or reject.")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OWNER MY MACHINES */}
        {activeTab === 'machines' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500">
                {t('owner.manageFleet', 'Manage your machinery fleet')} ({myMachines.length} {t('owner.vehiclesRegistered', 'vehicles registered')})
              </span>
              <Link
                to="/rent-machinery"
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                + {t('owner.addAnother', 'Add Another Machine')}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myMachines.map(m => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {translateMachineType(m.type)}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            m.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {m.active ? t('owner.active', 'Active') : t('owner.inactive', 'Inactive')}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-base text-stone-900">{m.name}</h4>
                      <p className="text-xs text-stone-500">{m.location}</p>
                      <div className="text-sm font-bold text-emerald-950 font-mono">
                        ₹{m.hourlyRate}/{t('card.perHour', 'hr')} • ₹{m.dailyRate}/{t('card.perDay', 'day')}
                      </div>
                    </div>
                  </div>

                  {/* Machine Controls */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Availability toggle */}
                    <button
                      onClick={() => handleToggleAvailability(m.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        m.isAvailable
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-600 border border-stone-300'
                      }`}
                      title={t('owner.toggleAvailTitle', 'Toggle availability calendar status')}
                    >
                      <span className={`w-2 h-2 rounded-full ${m.isAvailable ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                      <span>{m.isAvailable ? t('owner.available', 'Available') : t('owner.markBusy', 'Mark Busy')}</span>
                    </button>

                    {/* Active/Inactive toggle */}
                    <button
                      onClick={() => handleToggleActive(m.id)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold cursor-pointer"
                    >
                      {m.active ? t('owner.deactivateListing', 'Deactivate Listing') : t('owner.activateListing', 'Activate Listing')}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteMachine(m.id, m.name)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title={t('btn.delete', 'Delete machine')}
                      aria-label="Delete machine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: OWNER EARNINGS */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{t('owner.demoDataNotice', 'Prototype Demo Data — Simulates real-time seasonal rental revenue payout')}</span>
              </div>
              <span className="font-bold text-[10px] uppercase tracking-wider bg-amber-200/80 px-2 py-0.5 rounded">
                {t('owner.simulatedLedger', 'Simulated Ledger')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {t('owner.seasonalEarnings', 'Total Seasonal Earnings')}
                </span>
                <div className="text-3xl font-black text-emerald-950 font-mono mt-2">
                  ₹{totalEarnings.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">
                  +18% {t('owner.fromLastSeason', 'from last harvest season')}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {t('owner.monthlyEarnings', 'August 2026 Earnings')}
                </span>
                <div className="text-3xl font-black text-emerald-950 font-mono mt-2">
                  ₹{thisMonthEarnings.toLocaleString()}
                </div>
                <div className="text-xs text-stone-500 mt-1">{t('owner.fromFulfilled', 'From 4 fulfilled bookings')}</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {t('dash.completedRentals', 'Completed Rentals')}
                </span>
                <div className="text-3xl font-black text-stone-900 mt-2">
                  {completedBookings.length + 8}
                </div>
                <div className="text-xs text-stone-500 mt-1">{t('owner.averagePerJob', 'Average ₹2,650 / job')}</div>
              </div>
            </div>

            {/* Monthly Chart Visualization */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-stone-900">{t('owner.monthlyTrend', 'Monthly Revenue Trend (₹)')}</h3>

              <div className="h-44 flex items-end justify-between gap-4 pt-8 px-2 border-b border-stone-200">
                {[
                  { month: 'Apr', amount: 8500, height: '40%' },
                  { month: 'May', amount: 12000, height: '55%' },
                  { month: 'Jun', amount: 24000, height: '95%' },
                  { month: 'Jul', amount: 15000, height: '65%' },
                  { month: 'Aug', amount: 18900, height: '80%' },
                  { month: 'Sep', amount: 28000, height: '100%' },
                ].map(bar => (
                  <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      ₹{(bar.amount / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full max-w-[48px] bg-emerald-800 hover:bg-emerald-600 rounded-t-lg transition-all"
                      style={{ height: bar.height }}
                    />
                    <span className="text-xs font-semibold text-stone-600">{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
