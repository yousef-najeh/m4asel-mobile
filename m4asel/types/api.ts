// Domain model for the m4asel backend (FastAPI).
// Types mirror the backend schemas 1:1 — see github.com/yousef-najeh/m4asel
// (schemas.py / models.py / constants.py). Keep in sync when the API changes.

import type { User as FirebaseUser } from 'firebase/auth';
import type { UserRole } from '@/src/constants/UserRole';

// --- Enums (constants.py) ---
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type ServiceSize = 'small' | 'large';

// --- Washer profiles ---
export interface WasherProfileRead {
  id: number;
  profile_id: number;
  display_name: string;
  address: string;
  latitude: number;
  longitude: number;
  opening_time: string;
  closing_time: string;
}

export interface WashProfileWithServicesRead extends WasherProfileRead {
  wash_services?: WashService[] | null;
}

export interface WasherProfileBasic {
  id: number;
  display_name: string;
  address: string;
}

// --- Wash services ---
export interface WashService {
  id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  washer_profile_id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  size: ServiceSize;
  is_active: boolean;
}

export interface WashServiceBasic {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  washer_profile?: WasherProfileBasic | null;
}

// --- User profiles ---
export interface UserProfileBasic {
  id: number;
  name: string;
  mobile_number: string;
}

export interface UserProfileRead {
  id: number;
  name: string;
  mobile_number: string;
  user_role: UserRole;
  washer_profile?: WashProfileWithServicesRead | null;
}

// --- Orders / bookings ---
export interface OrderResponse {
  id: number;
  wash_service_id: number;
  user_profile_id: number;
  scheduled_time: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  wash_service?: WashServiceBasic | null;
  user_profile?: UserProfileBasic | null;
}

// --- Map: nearby washers (GET /washers/) ---
export interface NearbyWasherResponse extends WasherProfileRead {
  order_start?: string | null;
  order_end?: string | null;
  next_available_time: string;
  arrival_time: string;
  distance_km: number;
  services: string[];
}

// --- Notifications ---
export interface NotificationRead {
  id: number;
  title: string;
  body: string;
  created_at: string | null;
}

// --- Request bodies ---
export interface BookingCreate {
  washer_id: number;
  wash_service_id: number;
  scheduled_start: string;
}

export interface BookingStatusUpdate {
  status: OrderStatus;
  cancel_reason?: string | null;
}

export interface CreateProfileSchema {
  name: string;
  mobile_number: string;
  email: string;
  password: string;
}

export interface WashServiceCreate {
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

export interface WashServiceUpdate {
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
}

export interface FcmTokenInfo {
  token: string;
}

// --- Convenience aliases (names the screens use) ---
export type Booking = OrderResponse;
export type Washer = NearbyWasherResponse;
export type UserProfile = UserProfileRead;
export type WasherProfile = WashProfileWithServicesRead;
export type BookingStatus = OrderStatus;

// --- Auth context ---
export interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfileRead | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  role?: UserRole;
  washerProfile?: WashProfileWithServicesRead | null;
}
