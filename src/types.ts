export type MachineType =
  | 'Tractor'
  | 'Harvester'
  | 'Seed Drill'
  | 'Rotavator'
  | 'Cultivator'
  | 'Irrigation'
  | 'Other';

export type UserRole = 'farmer' | 'owner';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  location: string;
  farmArea?: number; // acres (for farmer)
  avatar?: string;
}

export interface MachineSpecs {
  hp?: string;
  fuelType?: string;
  year?: number;
  capacity?: string;
  workingWidth?: string;
  condition?: string;
}

export interface Machine {
  id: string;
  name: string;
  model: string;
  type: MachineType;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerRating: number;
  location: string;
  distanceKm: number;
  hourlyRate: number;
  dailyRate: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  availableDates: string[];
  imageUrl: string;
  gallery?: string[];
  specs: MachineSpecs;
  suitableWork: string[];
  suitableFarmSize: { minAcres: number; maxAcres: number };
  description: string;
  active: boolean;
  createdAt: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  machineId: string;
  machineName: string;
  machineType: MachineType;
  machineImage: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  date: string;
  startTime: string;
  durationHours: number;
  hourlyRate: number;
  totalAmount: number;
  workType: string;
  farmAreaAcres: number;
  status: BookingStatus;
  trackingStep: number; // 0: Request Sent, 1: Owner Accepted, 2: Machine Assigned, 3: Service Started, 4: Completed
  createdAt: string;
  notes?: string;
  ratingGiven?: { rating: number; review: string };
}

export interface Review {
  id: string;
  machineId?: string;
  machineName?: string;
  reviewerName: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  isDemo: boolean;
}

export interface EmergencyProviderResponse {
  providerName: string;
  ownerName: string;
  machine: string;
  distance: string;
  status: 'Available' | 'Busy';
  phone: string;
  rate: string;
}

export interface EmergencyRequest {
  id: string;
  workRequired: string;
  location: string;
  farmAreaAcres: number;
  requiredTime: string;
  contactPhone: string;
  status: 'Broadcasting' | 'Responded';
  responses: EmergencyProviderResponse[];
  createdAt: string;
}

export interface SearchCriteria {
  location?: string;
  farmArea?: number;
  workType?: string;
  machineType?: MachineType | 'All';
  date?: string;
  duration?: number;
  budget?: number;
  maxDistance?: number;
  minRating?: number;
  onlyAvailable?: boolean;
  sortBy?: 'bestMatch' | 'nearest' | 'lowestPrice' | 'highestRated';
}

export interface SmartMatchScore {
  overallScore: number; // 0-100
  availabilityScore: number; // 0-100 (weight 40%)
  priceScore: number;        // 0-100 (weight 25%)
  distanceScore: number;     // 0-100 (weight 20%)
  reliabilityScore: number;  // 0-100 (weight 15%)
  workSuitabilityScore: number;
  farmSizeSuitabilityScore: number;
  explanation: string;
}
