import { Machine, Booking, User, Review, EmergencyRequest } from '../types';

const STORAGE_KEYS = {
  MACHINES: 'krishimitra_machines',
  BOOKINGS: 'krishimitra_bookings',
  CURRENT_USER: 'krishimitra_current_user',
  AUTH_SESSION: 'krishimitra_auth_session',
  FAVOURITES: 'krishimitra_favourites',
  REVIEWS: 'krishimitra_reviews',
  EMERGENCY_REQUESTS: 'krishimitra_emergency_requests',
  INITIALIZED: 'krishimitra_initialized_v2',
};

// Seed Users
export const DEMO_FARMER: User = {
  id: 'user_farmer_1',
  name: 'Sonia Sakhare',
  role: 'farmer',
  email: 'sonia.farmer@krishimitra.in',
  phone: '+91 98230 45612',
  location: 'Nagpur, Maharashtra',
  farmArea: 6, // 6 acres
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
};

export const DEMO_OWNER: User = {
  id: 'user_owner_1',
  name: 'Rajesh Patil',
  role: 'owner',
  email: 'rajesh.patil@krishimitra.in',
  phone: '+91 98901 23456',
  location: 'Nagpur, Maharashtra',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
};

// Initial Seed Machines
const INITIAL_MACHINES: Machine[] = [
  {
    id: 'mach_1',
    name: 'Mahindra 575 DI Tractor',
    model: '575 DI Sarpanch (45 HP)',
    type: 'Tractor',
    ownerId: 'user_owner_1',
    ownerName: 'Rajesh Patil',
    ownerPhone: '+91 98901 23456',
    ownerRating: 4.9,
    location: 'Nagpur, Maharashtra',
    distanceKm: 3.2,
    hourlyRate: 900,
    dailyRate: 6000,
    rating: 4.8,
    reviewCount: 38,
    isAvailable: true,
    availableDates: ['2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07', '2026-09-08'],
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      hp: '45 HP',
      fuelType: 'Diesel',
      year: 2023,
      capacity: '1600 kg Hydraulic Lift',
      workingWidth: 'Standard 2WD',
      condition: 'Excellent / Freshly Serviced',
    },
    suitableWork: ['Ploughing', 'Tilling', 'Haulage', 'Paddy Prep', 'Land Levelling'],
    suitableFarmSize: { minAcres: 1, maxAcres: 15 },
    description:
      'High-performance 45 HP Mahindra tractor with fuel-efficient 4-cylinder engine. Fully equipped for heavy field ploughing, puddling, and haulage. Skilled operator available if required.',
    active: true,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'mach_2',
    name: 'John Deere 5310 Tractor',
    model: '5310 GearPro 4WD (55 HP)',
    type: 'Tractor',
    ownerId: 'user_owner_2',
    ownerName: 'Amit Deshmukh',
    ownerPhone: '+91 97654 32109',
    ownerRating: 4.7,
    location: 'Wardha, Maharashtra',
    distanceKm: 6.8,
    hourlyRate: 1100,
    dailyRate: 7500,
    rating: 4.9,
    reviewCount: 42,
    isAvailable: true,
    availableDates: ['2026-09-04', '2026-09-05', '2026-09-06'],
    imageUrl: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      hp: '55 HP Turbocharged',
      fuelType: 'Diesel',
      year: 2024,
      capacity: '2000 kg Hydraulic Lift',
      workingWidth: '4WD Heavy Duty',
      condition: 'Brand New (2024 Model)',
    },
    suitableWork: ['Deep Ploughing', 'Laser Levelling', 'Heavy Rotavation', 'Haulage'],
    suitableFarmSize: { minAcres: 3, maxAcres: 40 },
    description:
      'Heavy duty 55 HP 4WD John Deere tractor with power steering and dual clutch. Ideal for deep subsoiling, large acreage tilling, and heavy rotavator attachment.',
    active: true,
    createdAt: '2026-02-15T12:00:00Z',
  },
  {
    id: 'mach_3',
    name: 'Shaktiman Semi Champion Rotavator',
    model: 'Regular Light Plus 6 Feet',
    type: 'Rotavator',
    ownerId: 'user_owner_1',
    ownerName: 'Rajesh Patil',
    ownerPhone: '+91 98901 23456',
    ownerRating: 4.9,
    location: 'Nagpur, Maharashtra',
    distanceKm: 3.2,
    hourlyRate: 700,
    dailyRate: 4800,
    rating: 4.8,
    reviewCount: 29,
    isAvailable: true,
    availableDates: ['2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07'],
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      hp: 'Compatible with 40-55 HP',
      fuelType: 'PTO Driven',
      year: 2023,
      capacity: '48 L-Type Boron Steel Blades',
      workingWidth: '6 Feet (1.8m)',
      condition: 'Sharp blades, greased gearbox',
    },
    suitableWork: ['Soil Pulverization', 'Stubble Mixing', 'Seedbed Prep', 'Tilling'],
    suitableFarmSize: { minAcres: 1, maxAcres: 25 },
    description:
      'High-grade Shaktiman rotavator for fine tilth seedbed preparation. Incorporates residue and stubble directly into the soil to retain organic carbon and moisture.',
    active: true,
    createdAt: '2026-01-20T09:30:00Z',
  },
  {
    id: 'mach_4',
    name: 'Preet 987 Combine Harvester',
    model: 'Track Type Self-Propelled Multi-Crop',
    type: 'Harvester',
    ownerId: 'user_owner_3',
    ownerName: 'Gurpreet Singh',
    ownerPhone: '+91 98140 87654',
    ownerRating: 4.9,
    location: 'Karnal, Haryana',
    distanceKm: 8.5,
    hourlyRate: 2500,
    dailyRate: 18000,
    rating: 4.9,
    reviewCount: 64,
    isAvailable: true,
    availableDates: ['2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07'],
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      hp: '101 HP Ashok Leyland Engine',
      fuelType: 'Diesel',
      year: 2023,
      capacity: 'Grain Tank 2.4 m³',
      workingWidth: '14 Feet Cutter Bar',
      condition: 'Fully Calibrated, Clean Separation',
    },
    suitableWork: ['Wheat Harvesting', 'Paddy Harvesting', 'Soybean Harvesting', 'Grain Threshing'],
    suitableFarmSize: { minAcres: 4, maxAcres: 100 },
    description:
      'High-efficiency multi-crop combine harvester with minimal grain loss (<1%). Capable of harvesting 1.5 to 2 acres per hour. Comes with experienced 2-person crew.',
    active: true,
    createdAt: '2026-02-01T11:00:00Z',
  },
  {
    id: 'mach_5',
    name: 'Sonalika Multi-Crop Seed Drill',
    model: 'Automatic 9-Tyne Zero-Till Drill',
    type: 'Seed Drill',
    ownerId: 'user_owner_4',
    ownerName: 'Vikram Sharma',
    ownerPhone: '+91 94250 11223',
    ownerRating: 4.6,
    location: 'Indore, Madhya Pradesh',
    distanceKm: 5.1,
    hourlyRate: 800,
    dailyRate: 5200,
    rating: 4.7,
    reviewCount: 21,
    isAvailable: true,
    availableDates: ['2026-09-04', '2026-09-05', '2026-09-06'],
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      hp: '35 HP Tractor Hitch',
      fuelType: 'Mechanical Ground Wheel Driven',
      year: 2024,
      capacity: 'Dual Box: 60kg Seed + 60kg Fertilizer',
      workingWidth: '9 Tyne (6.5 Feet)',
      condition: 'Accurate Metering Fluted Rollers',
    },
    suitableWork: ['Sowing', 'Fertilizer Placement', 'Zero-Tillage Planting', 'Gram & Wheat Seeding'],
    suitableFarmSize: { minAcres: 1, maxAcres: 20 },
    description:
      'Precision automatic seed-cum-fertilizer drill. Guarantees uniform depth and seed spacing, reducing seed wastage by 20% and maximizing germination rates.',
    active: true,
    createdAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'mach_6',
    name: 'Swaraj 855 FE Tractor',
    model: '855 FE 52 HP Dual Clutch',
    type: 'Tractor',
    ownerId: 'user_owner_5',
    ownerName: 'Balasaheb Jadhav',
    ownerPhone: '+91 98220 99887',
    ownerRating: 4.8,
    location: 'Nashik, Maharashtra',
    distanceKm: 4.5,
    hourlyRate: 950,
    dailyRate: 6400,
    rating: 4.8,
    reviewCount: 31,
    isAvailable: true,
    availableDates: ['2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07'],
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      hp: '52 HP 3-Cylinder Engine',
      fuelType: 'Diesel',
      year: 2023,
      capacity: '1700 kg Lift',
      workingWidth: '2WD with OIB Brakes',
      condition: 'Great Condition',
    },
    suitableWork: ['Ploughing', 'Tilling', 'Laser Levelling', 'Haulage'],
    suitableFarmSize: { minAcres: 2, maxAcres: 30 },
    description:
      'Legendary Swaraj 855 with solid torque for black cotton soil. Operates smoothly with 9-tyne cultivator, MB plough, and trolley haulage.',
    active: true,
    createdAt: '2026-01-18T08:00:00Z',
  },
  {
    id: 'mach_7',
    name: 'Falcon Heavy-Duty Cultivator',
    model: '9-Tyne Rigid Cultivator with Roller',
    type: 'Cultivator',
    ownerId: 'user_owner_1',
    ownerName: 'Rajesh Patil',
    ownerPhone: '+91 98901 23456',
    ownerRating: 4.9,
    location: 'Nagpur, Maharashtra',
    distanceKm: 3.2,
    hourlyRate: 650,
    dailyRate: 4200,
    rating: 4.7,
    reviewCount: 19,
    isAvailable: true,
    availableDates: ['2026-09-04', '2026-09-05', '2026-09-06'],
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      hp: 'Compatible with 35-50 HP',
      fuelType: 'Three-point linkage',
      year: 2024,
      capacity: 'Forged EN-45 Spring Steel Shovels',
      workingWidth: '7.5 Feet',
      condition: 'Heavy-duty channel frame',
    },
    suitableWork: ['Secondary Tillage', 'Weed Eradication', 'Aeration', 'Ploughing'],
    suitableFarmSize: { minAcres: 1, maxAcres: 20 },
    description:
      'Robust spring-loaded 9-tyne tiller cultivator designed to break hard crusts, eliminate root clumps, and level soil bed without clogging.',
    active: true,
    createdAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'mach_8',
    name: 'Kirloskar High-Pressure Sprinkler System',
    model: 'Portable 5 HP Diesel Pump + 30 Pipe Set',
    type: 'Irrigation',
    ownerId: 'user_owner_6',
    ownerName: 'Sunil Thakre',
    ownerPhone: '+91 99700 66554',
    ownerRating: 4.6,
    location: 'Amravati, Maharashtra',
    distanceKm: 12.0,
    hourlyRate: 500,
    dailyRate: 3200,
    rating: 4.6,
    reviewCount: 15,
    isAvailable: true,
    availableDates: ['2026-09-04', '2026-09-05', '2026-09-06'],
    imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=800',
    ],
    specs: {
      hp: '5 HP Diesel Engine with Brass Nozzles',
      fuelType: 'Diesel',
      year: 2023,
      capacity: 'Covers 2 acres per set',
      workingWidth: '63mm Quick-Coupler Pipes',
      condition: 'No leaks, tested pressure',
    },
    suitableWork: ['Drought Relief', 'Vegetable Watering', 'Wheat Sprinkling', 'Foliar Spray'],
    suitableFarmSize: { minAcres: 1, maxAcres: 10 },
    description:
      'Mobile high-pressure sprinkler irrigation unit. Comes with 30 HDPE pipes, brass rotating heads, and self-priming centrifugal diesel pump. Saves 45% water.',
    active: true,
    createdAt: '2026-01-25T11:00:00Z',
  },
];

// Initial Seed Bookings
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk_101',
    machineId: 'mach_1',
    machineName: 'Mahindra 575 DI Tractor',
    machineType: 'Tractor',
    machineImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    ownerId: 'user_owner_1',
    ownerName: 'Rajesh Patil',
    ownerPhone: '+91 98901 23456',
    farmerId: 'user_farmer_1',
    farmerName: 'Sonia Sakhare',
    farmerPhone: '+91 98230 45612',
    farmerLocation: 'Nagpur, Maharashtra',
    date: '2026-09-04',
    startTime: '08:00 AM',
    durationHours: 5,
    hourlyRate: 900,
    totalAmount: 4500,
    workType: 'Ploughing',
    farmAreaAcres: 5,
    status: 'Pending',
    trackingStep: 0,
    createdAt: '2026-09-03T09:15:00Z',
    notes: 'Need machine early morning for wheat field ploughing before rains.',
  },
  {
    id: 'bk_102',
    machineId: 'mach_3',
    machineName: 'Shaktiman Semi Champion Rotavator',
    machineType: 'Rotavator',
    machineImage: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
    ownerId: 'user_owner_1',
    ownerName: 'Rajesh Patil',
    ownerPhone: '+91 98901 23456',
    farmerId: 'user_farmer_1',
    farmerName: 'Sonia Sakhare',
    farmerPhone: '+91 98230 45612',
    farmerLocation: 'Nagpur, Maharashtra',
    date: '2026-08-28',
    startTime: '09:00 AM',
    durationHours: 4,
    hourlyRate: 700,
    totalAmount: 2800,
    workType: 'Soil Pulverization',
    farmAreaAcres: 4,
    status: 'Completed',
    trackingStep: 4,
    createdAt: '2026-08-27T10:00:00Z',
    ratingGiven: {
      rating: 5,
      review: 'Machine was in prime condition! Rajesh ji sent the operator on time and work finished smoothly.',
    },
  },
];

// Initial Seed Reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    machineName: 'Mahindra 575 DI Tractor',
    reviewerName: 'Rameshwar Pawar',
    role: 'Cotton Farmer (8 Acres)',
    location: 'Nagpur, Maharashtra',
    rating: 5,
    date: 'August 28, 2026',
    comment:
      'I found a tractor near my farm within minutes. The matching feature made it very easy to compare rental rates and book right before the sowing window.',
    isDemo: true,
  },
  {
    id: 'rev_2',
    machineName: 'Shaktiman Semi Champion Rotavator',
    reviewerName: 'Santosh Ingle',
    role: 'Soybean & Gram Farmer (12 Acres)',
    location: 'Wardha, Maharashtra',
    rating: 5,
    date: 'August 22, 2026',
    comment:
      'Earlier I had to make 10 phone calls and negotiate uncertain rates. With KrishiMitra, I booked a rotavator at ₹700/hour with transparent owner confirmation.',
    isDemo: true,
  },
  {
    id: 'rev_3',
    machineName: 'Preet 987 Combine Harvester',
    reviewerName: 'Harbhajan Singh',
    role: 'Wheat Farmer (25 Acres)',
    location: 'Karnal, Haryana',
    rating: 5,
    date: 'August 15, 2026',
    comment:
      'As an owner, listing my harvester brought me 4 confirmed bookings during off-days, generating an extra ₹45,000 in rental revenue this season!',
    isDemo: true,
  },
  {
    id: 'rev_4',
    machineName: 'Sonalika Multi-Crop Seed Drill',
    reviewerName: 'Devendra Meena',
    role: 'Pulse & Mustard Farmer (5 Acres)',
    location: 'Dewas, MP',
    rating: 4,
    date: 'August 10, 2026',
    comment:
      'Emergency broadcast feature saved our crop when our regular local tractor broke down. Got an available seed drill dispatched in under 30 minutes.',
    isDemo: true,
  },
];

// Initialize LocalStorage with default seeds if empty
export function initializeStorage() {
  if (typeof window === 'undefined') return;

  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(INITIAL_MACHINES));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_FARMER));
    localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(['mach_1', 'mach_3']));
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_REQUESTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// User Management
export function getCurrentUser(): User {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEMO_FARMER;
}

export function isSessionActive(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true';
}

export function setSessionActive(active: boolean): void {
  if (typeof window === 'undefined') return;
  if (active) {
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }
  window.dispatchEvent(new Event('krishimitra_auth_change'));
}

export function loginUser(role: 'farmer' | 'owner', customUser?: Partial<User>): User {
  const base = role === 'farmer' ? DEMO_FARMER : DEMO_OWNER;
  const user: User = {
    ...base,
    ...customUser,
    role,
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  setSessionActive(true);
  window.dispatchEvent(new Event('krishimitra_user_change'));
  return user;
}

export function logoutUser(): void {
  setSessionActive(false);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_FARMER));
  window.dispatchEvent(new Event('krishimitra_user_change'));
}

export function updateUserProfile(updates: Partial<User>): User {
  const current = getCurrentUser();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
  window.dispatchEvent(new Event('krishimitra_user_change'));
  return updated;
}

// Machine Operations
export function getMachines(): Machine[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MACHINES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_MACHINES;
}

export function getMachineById(id: string): Machine | undefined {
  const machines = getMachines();
  return machines.find(m => m.id === id);
}

export function addMachine(machineData: Omit<Machine, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Machine {
  const machines = getMachines();
  const newMachine: Machine = {
    ...machineData,
    id: `mach_${Date.now()}`,
    rating: 5.0,
    reviewCount: 1,
    createdAt: new Date().toISOString(),
  };

  machines.unshift(newMachine);
  localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(machines));
  window.dispatchEvent(new Event('krishimitra_machines_change'));
  return newMachine;
}

export function updateMachine(id: string, updates: Partial<Machine>): Machine | undefined {
  const machines = getMachines();
  const index = machines.findIndex(m => m.id === id);
  if (index === -1) return undefined;

  machines[index] = { ...machines[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(machines));
  window.dispatchEvent(new Event('krishimitra_machines_change'));
  return machines[index];
}

export function deleteMachine(id: string): boolean {
  const machines = getMachines();
  const filtered = machines.filter(m => m.id !== id);
  if (filtered.length !== machines.length) {
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(filtered));
    window.dispatchEvent(new Event('krishimitra_machines_change'));
    return true;
  }
  return false;
}

export function toggleMachineStatus(id: string): boolean {
  const machine = getMachineById(id);
  if (machine) {
    updateMachine(id, { active: !machine.active });
    return !machine.active;
  }
  return false;
}

export function toggleMachineAvailability(id: string): boolean {
  const machine = getMachineById(id);
  if (machine) {
    updateMachine(id, { isAvailable: !machine.isAvailable });
    return !machine.isAvailable;
  }
  return false;
}

// Bookings Operations
export function getBookings(): Booking[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_BOOKINGS;
}

export function getBookingById(id: string): Booking | undefined {
  const bookings = getBookings();
  return bookings.find(b => b.id === id);
}

export function createBooking(params: {
  machine: Machine;
  farmer: User;
  date: string;
  startTime: string;
  durationHours: number;
  workType: string;
  farmAreaAcres: number;
  notes?: string;
}): Booking {
  const bookings = getBookings();
  const totalAmount = params.machine.hourlyRate * params.durationHours;

  const newBooking: Booking = {
    id: `bk_${Date.now().toString().slice(-6)}`,
    machineId: params.machine.id,
    machineName: params.machine.name,
    machineType: params.machine.type,
    machineImage: params.machine.imageUrl,
    ownerId: params.machine.ownerId,
    ownerName: params.machine.ownerName,
    ownerPhone: params.machine.ownerPhone,
    farmerId: params.farmer.id,
    farmerName: params.farmer.name,
    farmerPhone: params.farmer.phone,
    farmerLocation: params.farmer.location,
    date: params.date,
    startTime: params.startTime,
    durationHours: params.durationHours,
    hourlyRate: params.machine.hourlyRate,
    totalAmount,
    workType: params.workType,
    farmAreaAcres: params.farmAreaAcres,
    status: 'Pending',
    trackingStep: 0,
    createdAt: new Date().toISOString(),
    notes: params.notes,
  };

  bookings.unshift(newBooking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  window.dispatchEvent(new Event('krishimitra_bookings_change'));
  return newBooking;
}

export function updateBookingStatus(
  id: string,
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
): Booking | undefined {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) return undefined;

  let trackingStep = bookings[index].trackingStep;
  if (status === 'Confirmed') trackingStep = Math.max(1, trackingStep);
  if (status === 'Completed') trackingStep = 4;
  if (status === 'Cancelled') trackingStep = 0;

  bookings[index] = {
    ...bookings[index],
    status,
    trackingStep,
  };

  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  window.dispatchEvent(new Event('krishimitra_bookings_change'));
  return bookings[index];
}

export function advanceBookingTracking(id: string): Booking | undefined {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) return undefined;

  const currentStep = bookings[index].trackingStep;
  const nextStep = Math.min(4, currentStep + 1);
  let status = bookings[index].status;
  if (nextStep >= 1 && status === 'Pending') status = 'Confirmed';
  if (nextStep === 4) status = 'Completed';

  bookings[index] = {
    ...bookings[index],
    trackingStep: nextStep,
    status,
  };

  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  window.dispatchEvent(new Event('krishimitra_bookings_change'));
  return bookings[index];
}

export function addBookingRating(id: string, rating: number, review: string): Booking | undefined {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) return undefined;

  bookings[index] = {
    ...bookings[index],
    ratingGiven: { rating, review },
  };

  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

  // Also add to global reviews
  addReview({
    machineName: bookings[index].machineName,
    reviewerName: bookings[index].farmerName,
    role: `Farmer (${bookings[index].farmAreaAcres} Acres)`,
    location: bookings[index].farmerLocation,
    rating,
    comment: review,
    isDemo: false,
  });

  window.dispatchEvent(new Event('krishimitra_bookings_change'));
  return bookings[index];
}

// Favourites Operations
export function getFavourites(): string[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function toggleFavourite(machineId: string): boolean {
  const favs = getFavourites();
  const exists = favs.includes(machineId);
  const updated = exists ? favs.filter(id => id !== machineId) : [...favs, machineId];
  localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(updated));
  window.dispatchEvent(new Event('krishimitra_favs_change'));
  return !exists;
}

export function isFavourite(machineId: string): boolean {
  return getFavourites().includes(machineId);
}

// Reviews Operations
export function getReviews(): Review[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_REVIEWS;
}

export function addReview(reviewData: Omit<Review, 'id' | 'date'>): Review {
  const reviews = getReviews();
  const newRev: Review = {
    ...reviewData,
    id: `rev_${Date.now()}`,
    date: 'Just now',
  };
  reviews.unshift(newRev);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  window.dispatchEvent(new Event('krishimitra_reviews_change'));
  return newRev;
}

// Emergency Requests
export function getEmergencyRequests(): EmergencyRequest[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMERGENCY_REQUESTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function createEmergencyRequest(params: {
  workRequired: string;
  location: string;
  farmAreaAcres: number;
  requiredTime: string;
  contactPhone: string;
}): EmergencyRequest {
  const requests = getEmergencyRequests();

  // Simulated live nearby owners in the cluster
  const responses = [
    {
      providerName: 'Rajesh Tractor Services',
      ownerName: 'Rajesh Patil',
      machine: 'Mahindra 575 DI (45 HP)',
      distance: '3.2 km away',
      status: 'Available' as const,
      phone: '+91 98901 23456',
      rate: '₹900/hr',
    },
    {
      providerName: 'Patil Farm Machinery',
      ownerName: 'Ganesh Patil',
      machine: 'Swaraj 855 FE + Rotavator',
      distance: '4.8 km away',
      status: 'Available' as const,
      phone: '+91 98224 88712',
      rate: '₹950/hr',
    },
    {
      providerName: 'Shinde Machinery & JCB',
      ownerName: 'Kishore Shinde',
      machine: 'JCB 3DX Leveller',
      distance: '6.1 km away',
      status: 'Busy' as const,
      phone: '+91 94221 00987',
      rate: '₹1400/hr',
    },
  ];

  const newReq: EmergencyRequest = {
    id: `emg_${Date.now()}`,
    ...params,
    status: 'Responded',
    responses,
    createdAt: new Date().toISOString(),
  };

  requests.unshift(newReq);
  localStorage.setItem(STORAGE_KEYS.EMERGENCY_REQUESTS, JSON.stringify(requests));
  window.dispatchEvent(new Event('krishimitra_emergency_change'));
  return newReq;
}
