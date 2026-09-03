import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addMachine } from '../services/storage';
import { MachineType } from '../types';
import {
  Tractor,
  CheckCircle2,
  DollarSign,
  MapPin,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Fuel,
  Calendar,
} from 'lucide-react';

const PRESET_IMAGES: Record<MachineType, string> = {
  Tractor: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
  Harvester: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800',
  'Seed Drill': 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800',
  Rotavator: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
  Cultivator: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800',
  Irrigation: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=800',
  Other: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=800',
};

export function RentMachineryPage() {
  const { user, loginAsDemoOwner } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [ownerName, setOwnerName] = useState(user.name);
  const [ownerPhone, setOwnerPhone] = useState(user.phone);
  const [machineType, setMachineType] = useState<MachineType>('Tractor');
  const [machineName, setMachineName] = useState('Mahindra 475 DI XP Plus');
  const [machineModel, setMachineModel] = useState('2024 Model (44 HP)');
  const [description, setDescription] = useState(
    'Heavy-duty agricultural equipment with low fuel consumption, excellent hydraulic lift, and experienced driver support available.'
  );
  const [hourlyRate, setHourlyRate] = useState<number>(850);
  const [dailyRate, setDailyRate] = useState<number>(5500);
  const [location, setLocation] = useState(user.location || 'Nagpur, Maharashtra');
  const [distanceKm, setDistanceKm] = useState<number>(3.5);
  const [availableDates, setAvailableDates] = useState<string>('2026-09-05, 2026-09-06, 2026-09-07');
  const [imageUrl, setImageUrl] = useState<string>(PRESET_IMAGES['Tractor']);
  const [hp, setHp] = useState('44 HP');
  const [fuelType, setFuelType] = useState('Diesel');
  const [suitableWork, setSuitableWork] = useState('Ploughing, Tilling, Haulage');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (type: MachineType) => {
    setMachineType(type);
    setImageUrl(PRESET_IMAGES[type] || PRESET_IMAGES['Tractor']);
    if (type === 'Rotavator') {
      setMachineName('Shaktiman Semi Champion Rotavator 7ft');
      setHourlyRate(700);
      setDailyRate(4800);
      setSuitableWork('Soil Pulverization, Seedbed Prep, Tilling');
    } else if (type === 'Harvester') {
      setMachineName('Preet Multi-Crop Combine Harvester');
      setHourlyRate(2400);
      setDailyRate(17000);
      setSuitableWork('Paddy Harvesting, Wheat Harvesting, Grain Threshing');
    } else if (type === 'Seed Drill') {
      setMachineName('Automatic 9-Tyne Zero-Till Seed Drill');
      setHourlyRate(750);
      setDailyRate(5000);
      setSuitableWork('Sowing, Fertilizer Placement');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const datesArray = availableDates
        .split(',')
        .map(d => d.trim())
        .filter(Boolean);

      const workArray = suitableWork
        .split(',')
        .map(w => w.trim())
        .filter(Boolean);

      const newMachine = addMachine({
        name: machineName,
        model: machineModel,
        type: machineType,
        ownerId: user.id || 'user_owner_1',
        ownerName,
        ownerPhone,
        ownerRating: 4.9,
        location,
        distanceKm: Number(distanceKm) || 4.0,
        hourlyRate: Number(hourlyRate),
        dailyRate: Number(dailyRate),
        isAvailable: true,
        availableDates: datesArray.length > 0 ? datesArray : ['2026-09-05', '2026-09-06'],
        imageUrl,
        gallery: [imageUrl],
        specs: {
          hp,
          fuelType,
          year: 2024,
          capacity: 'Standard Fleet Grade',
          condition: 'Excellent / Ready for Field Work',
        },
        suitableWork: workArray.length > 0 ? workArray : ['Ploughing', 'Tilling'],
        suitableFarmSize: { minAcres: 1, maxAcres: 25 },
        description,
        active: true,
      });

      showToast(
        'Machine Listed Successfully!',
        'Your machine has been successfully listed on KrishiMitra and is now live.',
        'success',
        5000
      );

      // Auto-switch to owner mode if not already
      loginAsDemoOwner();

      // Navigate to Owner Dashboard
      navigate('/owner-dashboard');
    } catch (err) {
      console.error(err);
      showToast('Listing Failed', 'Please verify your inputs and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-10 text-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Tractor className="w-4 h-4 text-emerald-700" />
            <span>Earn Additional Seasonal Farm Income</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Rent Out Your Machinery
          </h1>
          <p className="text-stone-600 text-sm sm:text-base">
            "Turn your idle farm equipment into additional income." Connect with verified farmers in your cluster
            during idle tractor days.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">Machinery Registration Details</h2>
            <p className="text-xs text-emerald-200 mt-1">
              Your equipment will immediately appear on the Find Machinery marketplace and your Owner Dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-stone-800">
            {/* Owner Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-stone-200 pb-1">
                1. Owner & Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="owner-name" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Owner Name *
                  </label>
                  <input
                    id="owner-name"
                    type="text"
                    required
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
                  />
                </div>
                <div>
                  <label htmlFor="owner-phone" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="owner-phone"
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={e => setOwnerPhone(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Machine Classification */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-stone-200 pb-1">
                2. Machine Classification & Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="machine-type" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Machine Type *
                  </label>
                  <select
                    id="machine-type"
                    value={machineType}
                    onChange={e => handleTypeChange(e.target.value as MachineType)}
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none bg-white font-semibold"
                  >
                    <option value="Tractor">🚜 Tractor</option>
                    <option value="Harvester">🌾 Harvester</option>
                    <option value="Seed Drill">🌱 Seed Drill</option>
                    <option value="Rotavator">🔄 Rotavator</option>
                    <option value="Cultivator">🌿 Cultivator</option>
                    <option value="Irrigation">💧 Irrigation Equipment</option>
                    <option value="Other">🛠️ Other Farm Equipment</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="machine-name" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Machine Brand & Name *
                  </label>
                  <input
                    id="machine-name"
                    type="text"
                    required
                    value={machineName}
                    onChange={e => setMachineName(e.target.value)}
                    placeholder="e.g. Mahindra 575 DI Sarpanch"
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="machine-model" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Model / Sub-model
                  </label>
                  <input
                    id="machine-model"
                    type="text"
                    value={machineModel}
                    onChange={e => setMachineModel(e.target.value)}
                    placeholder="e.g. 45 HP Dual Clutch"
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="machine-hp" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Power / HP Spec
                  </label>
                  <input
                    id="machine-hp"
                    type="text"
                    value={hp}
                    onChange={e => setHp(e.target.value)}
                    placeholder="e.g. 45 HP"
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="machine-fuel" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Fuel / Drive Type
                  </label>
                  <input
                    id="machine-fuel"
                    type="text"
                    value={fuelType}
                    onChange={e => setFuelType(e.target.value)}
                    placeholder="Diesel / PTO"
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="machine-desc" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Machine Description *
                </label>
                <textarea
                  id="machine-desc"
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label htmlFor="machine-work" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Suitable Agricultural Tasks (comma separated)
                </label>
                <input
                  id="machine-work"
                  type="text"
                  value={suitableWork}
                  onChange={e => setSuitableWork(e.target.value)}
                  placeholder="e.g. Ploughing, Tilling, Haulage, Sowing"
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            {/* Rental Rates & Location */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-stone-200 pb-1">
                3. Rental Pricing & Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hourly-rate" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Rental Price / Hour (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-stone-400">₹</span>
                    <input
                      id="hourly-rate"
                      type="number"
                      required
                      min="100"
                      step="50"
                      value={hourlyRate}
                      onChange={e => setHourlyRate(Number(e.target.value))}
                      className="w-full text-sm pl-8 pr-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="daily-rate" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Rental Price / Full Day (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-stone-400">₹</span>
                    <input
                      id="daily-rate"
                      type="number"
                      required
                      min="500"
                      step="100"
                      value={dailyRate}
                      onChange={e => setDailyRate(Number(e.target.value))}
                      className="w-full text-sm pl-8 pr-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="machine-location" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Machinery Yard Location *
                  </label>
                  <input
                    id="machine-location"
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Nagpur, Maharashtra"
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="available-dates" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Available Dates (comma separated)
                  </label>
                  <input
                    id="available-dates"
                    type="text"
                    value={availableDates}
                    onChange={e => setAvailableDates(e.target.value)}
                    placeholder="e.g. 2026-09-05, 2026-09-06"
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Photo / Image */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-stone-200 pb-1">
                4. Machine Photo
              </h3>

              <div>
                <label htmlFor="machine-image-url" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Image URL (Pre-loaded with high-res preset)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="machine-image-url"
                    type="url"
                    required
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-mono"
                  />
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Zero commission prototype listing. Immediate marketplace visibility.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-sm rounded-xl shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>{isSubmitting ? 'Publishing Listing...' : 'List My Machine'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
