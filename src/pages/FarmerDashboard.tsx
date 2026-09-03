import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getBookings,
  getFavourites,
  getMachineById,
  updateBookingStatus,
} from '../services/storage';
import { Booking, Machine } from '../types';
import { BookingTrackingModal } from '../components/BookingTrackingModal';
import { BookingModal } from '../components/BookingModal';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tractor,
  Heart,
  User,
  MapPin,
  Phone,
  Layers,
  ArrowRight,
  TrendingUp,
  XCircle,
  Eye,
  Save,
} from 'lucide-react';

export function FarmerDashboard() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'bookings' | 'saved' | 'profile'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<'All' | 'Upcoming' | 'Pending' | 'Completed' | 'Cancelled'>('All');
  const [bookings, setBookings] = useState<Booking[]>(() => getBookings());
  const [favouriteIds, setFavouriteIds] = useState<string[]>(() => getFavourites());

  // Tracking modal
  const [selectedBookingForTracking, setSelectedBookingForTracking] = useState<Booking | null>(null);
  const [rebookMachine, setRebookMachine] = useState<Machine | null>(null);

  // Profile Edit State
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editLocation, setEditLocation] = useState(user.location);
  const [editFarmArea, setEditFarmArea] = useState(user.farmArea || 5);

  const refreshData = () => {
    setBookings(getBookings());
    setFavouriteIds(getFavourites());
  };

  useEffect(() => {
    const handleBookingsChange = () => refreshData();
    const handleFavsChange = () => setFavouriteIds(getFavourites());

    window.addEventListener('krishimitra_bookings_change', handleBookingsChange);
    window.addEventListener('krishimitra_favs_change', handleFavsChange);

    return () => {
      window.removeEventListener('krishimitra_bookings_change', handleBookingsChange);
      window.removeEventListener('krishimitra_favs_change', handleFavsChange);
    };
  }, []);

  // Filter bookings for current farmer
  const farmerBookings = bookings.filter(
    b => b.farmerId === user.id || b.farmerName.toLowerCase() === user.name.toLowerCase()
  );

  const upcomingCount = farmerBookings.filter(b => b.status === 'Confirmed').length;
  const pendingCount = farmerBookings.filter(b => b.status === 'Pending').length;
  const completedCount = farmerBookings.filter(b => b.status === 'Completed').length;
  const cancelledCount = farmerBookings.filter(b => b.status === 'Cancelled').length;

  const filteredBookings = farmerBookings.filter(b => {
    if (bookingFilter === 'Upcoming') return b.status === 'Confirmed';
    if (bookingFilter === 'Pending') return b.status === 'Pending';
    if (bookingFilter === 'Completed') return b.status === 'Completed';
    if (bookingFilter === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  const savedMachines = favouriteIds
    .map(id => getMachineById(id))
    .filter((m): m is Machine => Boolean(m));

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking request?')) {
      updateBookingStatus(bookingId, 'Cancelled');
      showToast('Booking Cancelled', 'Your reservation request was cancelled.', 'info');
      refreshData();
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      location: editLocation,
      farmArea: Number(editFarmArea),
    });
    showToast('Profile Updated', 'Farmer profile details saved in local storage.', 'success');
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Farmer Control Center
            </div>
            <h1 className="text-3xl font-black text-stone-900 mt-0.5">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
              <span>📍 {user.location}</span>
              <span>•</span>
              <span>Farm Land: {user.farmArea || 6} Acres</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/find-machinery"
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Tractor className="w-4 h-4 text-amber-400" />
              <span>Book New Machinery</span>
            </Link>
            <Link
              to="/emergency"
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors"
            >
              🚨 Emergency Request
            </Link>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Confirmed / Upcoming */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Upcoming Bookings
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-stone-900 mt-2">{upcomingCount}</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">🟢 Owner Confirmed</div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Pending Requests
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-600 mt-2">{pendingCount}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">🟡 Awaiting Owner Action</div>
          </div>

          {/* Completed Bookings */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Completed Rentals
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-stone-900 mt-2">{completedCount}</div>
            <div className="text-[11px] text-blue-700 font-semibold mt-0.5">🔵 Service Finished</div>
          </div>

          {/* Saved Machinery */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Saved Machinery
              </span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
                <Heart className="w-4 h-4 fill-rose-100" />
              </div>
            </div>
            <div className="text-3xl font-black text-stone-900 mt-2">{savedMachines.length}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Favorited Equipment</div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Bookings ({farmerBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Machinery ({savedMachines.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Farmer Profile</span>
          </button>
        </div>

        {/* TAB 1: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <button
                onClick={() => setBookingFilter('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  bookingFilter === 'All'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                All Bookings ({farmerBookings.length})
              </button>

              <button
                onClick={() => setBookingFilter('Upcoming')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  bookingFilter === 'Upcoming'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Upcoming / Confirmed ({upcomingCount})
              </button>

              <button
                onClick={() => setBookingFilter('Pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  bookingFilter === 'Pending'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Pending Approval ({pendingCount})
              </button>

              <button
                onClick={() => setBookingFilter('Completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  bookingFilter === 'Completed'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Completed ({completedCount})
              </button>

              <button
                onClick={() => setBookingFilter('Cancelled')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  bookingFilter === 'Cancelled'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Cancelled ({cancelledCount})
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-stone-600 border border-stone-200 hover:bg-stone-100 transition-colors flex items-center gap-1 ml-auto"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Saved Equipment ({savedMachines.length})</span>
              </button>
            </div>

            {filteredBookings.length > 0 ? (
              <div className="space-y-3">
                {filteredBookings.map(bk => {
                  const stageLabels = [
                    'Request Dispatched',
                    'Confirmed by Owner',
                    'Machine In-Transit',
                    'Field Work In-Progress',
                    'Completed & Verified',
                  ];
                  const currentStageText = stageLabels[bk.trackingStep] || 'Requested';

                  return (
                    <div
                      key={bk.id}
                      className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      {/* Left: Machine, ID & Owner */}
                      <div className="flex items-start gap-4">
                        <img
                          src={bk.machineImage}
                          alt={bk.machineName}
                          className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-mono font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                              #BK-{bk.id.toUpperCase()}
                            </span>
                            <h4 className="font-extrabold text-base text-stone-900">{bk.machineName}</h4>
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                bk.status === 'Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : bk.status === 'Completed'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : bk.status === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              }`}
                            >
                              ● {bk.status}
                            </span>
                          </div>

                          <p className="text-xs text-stone-600 flex flex-wrap items-center gap-2">
                            <span>
                              Owner: <strong>{bk.ownerName}</strong>
                            </span>
                            <a
                              href={`tel:${bk.ownerPhone}`}
                              className="text-emerald-800 font-bold hover:underline flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{bk.ownerPhone}</span>
                            </a>
                            <span>•</span>
                            <span>{bk.workType}</span>
                            <span>•</span>
                            <span>{bk.farmAreaAcres} Acres</span>
                          </p>

                          <div className="text-xs text-stone-500 flex flex-wrap items-center gap-3 pt-0.5">
                            <span className="flex items-center gap-1 text-stone-700 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-stone-400" />
                              {bk.date} at {bk.startTime}
                            </span>
                            <span>•</span>
                            <span className="font-bold text-stone-800">
                              {bk.durationHours} hrs @ ₹{bk.hourlyRate}/hr
                            </span>
                            <span>•</span>
                            <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50/70 px-2 py-0.5 rounded">
                              Current Stage: {currentStageText} (Step {bk.trackingStep + 1}/5)
                            </span>
                          </div>

                          {bk.notes && (
                            <p className="text-xs text-amber-900 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 mt-1">
                              💬 Landmark / Instructions: "{bk.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Amount & Actions */}
                      <div className="flex items-center justify-between md:justify-end gap-3 md:text-right pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 shrink-0">
                        <div className="mr-2">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Amount</span>
                          <span className="text-xl font-black text-emerald-950 font-mono">
                            ₹{bk.totalAmount.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedBookingForTracking(bk)}
                            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Track & Details</span>
                          </button>

                          {bk.status === 'Pending' && (
                            <button
                              onClick={() => handleCancelBooking(bk.id)}
                              className="px-3 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-xl transition-colors"
                              title="Cancel reservation request"
                            >
                              Cancel
                            </button>
                          )}

                          {(bk.status === 'Completed' || bk.status === 'Cancelled') && (
                            <button
                              onClick={() => {
                                const m = getMachineById(bk.machineId);
                                if (m) setRebookMachine(m);
                              }}
                              className="px-3 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 text-xs font-bold rounded-xl transition-colors"
                            >
                              Re-Book
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
                <Tractor className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-bold text-stone-800">No {bookingFilter !== 'All' ? bookingFilter : ''} Bookings</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {bookingFilter === 'All'
                    ? "You haven't requested any farm machinery rentals yet. Browse nearby equipment and send your first booking request!"
                    : `There are currently no bookings with status "${bookingFilter}".`}
                </p>
                <Link
                  to="/find-machinery"
                  className="inline-block px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-900 transition-colors"
                >
                  Browse Available Machinery
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED MACHINERY */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedMachines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedMachines.map(m => (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-40 w-full bg-stone-100">
                        <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                          {m.type}
                        </span>
                      </div>
                      <div className="p-4 space-y-1.5">
                        <h4 className="font-extrabold text-sm text-stone-900">{m.name}</h4>
                        <p className="text-xs text-stone-500">{m.location} ({m.distanceKm} km away)</p>
                        <div className="text-sm font-bold text-emerald-900">
                          ₹{m.hourlyRate} <span className="text-xs font-normal text-stone-500">/ hr</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0 flex items-center gap-2">
                      <Link
                        to={`/machinery/${m.id}`}
                        className="flex-1 text-center py-2 border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-50"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => setRebookMachine(m)}
                        className="flex-1 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
                <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-bold text-stone-800">No Saved Machinery</h3>
                <p className="text-xs text-stone-500">
                  Tap the heart icon on any machinery card in the marketplace to bookmark equipment here.
                </p>
                <Link
                  to="/find-machinery"
                  className="inline-block px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl"
                >
                  Explore Equipment
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FARMER PROFILE (Editable and persisted!) */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-black text-stone-900 mb-1">Edit Farmer Profile</h3>
            <p className="text-xs text-stone-500 mb-6">
              These details pre-fill your machinery booking requests and help calculate accurate tractor power matches.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-stone-800">
              <div>
                <label htmlFor="farmer-profile-name" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Farmer Full Name
                </label>
                <input
                  id="farmer-profile-name"
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
                />
              </div>

              <div>
                <label htmlFor="farmer-profile-phone" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Primary Mobile Number
                </label>
                <input
                  id="farmer-profile-phone"
                  type="text"
                  required
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
                />
              </div>

              <div>
                <label htmlFor="farmer-profile-location" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Village / District Location
                </label>
                <input
                  id="farmer-profile-location"
                  type="text"
                  required
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
                />
              </div>

              <div>
                <label htmlFor="farmer-profile-farm-area" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Total Farm Area (Acres)
                </label>
                <input
                  id="farmer-profile-farm-area"
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={editFarmArea}
                  onChange={e => setEditFarmArea(Number(e.target.value))}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {selectedBookingForTracking && (
        <BookingTrackingModal
          booking={selectedBookingForTracking}
          onClose={() => setSelectedBookingForTracking(null)}
          onUpdate={() => {
            refreshData();
            // refresh active booking object in modal
            const fresh = getBookings().find(b => b.id === selectedBookingForTracking.id);
            if (fresh) setSelectedBookingForTracking(fresh);
          }}
        />
      )}

      {/* Re-book Modal */}
      {rebookMachine && (
        <BookingModal
          machine={rebookMachine}
          onClose={() => setRebookMachine(null)}
          onSuccess={() => refreshData()}
        />
      )}
    </div>
  );
}
