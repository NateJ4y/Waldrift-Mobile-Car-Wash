export type UserRole = 'customer' | 'staff' | 'admin';

export type VehicleType = 'sedan' | 'suv' | 'bakkie';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  referral_code: string;
  referred_by?: string;
  discount_balance: number; // in Rands
}

export interface Vehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year?: string;
  color: string;
  plate_number: string;
  vehicle_type: VehicleType;
  notes?: string;
  photo_url?: string;
  created_at: string;
  visits_count: number;
  last_visit_date?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  price_sedan: number;
  price_suv: number;
  price_bakkie: number;
  duration_minutes: number;
  is_popular?: boolean;
  counts_for_loyalty: boolean;
  features: string[];
}

export interface AddonService {
  id: string;
  name: string;
  description: string;
  price: number; // in Rands
  duration_minutes: number;
  icon: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price_monthly: number; // in Rands
  vehicle_type: VehicleType | 'all';
  description: string;
  perks: string[];
  is_popular?: boolean;
}

export type BookingStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid_online' | 'pay_on_arrival' | 'refunded';
export type PaymentMethod = 'paypal' | 'cash_on_arrival' | 'card_on_arrival';
export type BookingType = 'scheduled' | 'walk_in';

export interface AppointmentBooking {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  vehicle_id?: string;
  vehicle_plate: string;
  vehicle_type: VehicleType;
  vehicle_name: string; // e.g. "VW Polo (White)"
  service_package_id: string;
  service_package_name: string;
  addon_ids: string[];
  addon_names: string[];
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:mm
  booking_type: BookingType;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  amount_subtotal: number;
  discount_amount: number;
  referral_code_used?: string;
  amount_total: number;
  notes?: string;
  photo_url?: string;
  created_at: string;
  completed_at?: string;
  assigned_staff?: string;
}

export interface VehicleVisitRecord {
  id: string;
  plate_number: string;
  vehicle_id?: string;
  vehicle_type: VehicleType;
  vehicle_summary: string;
  customer_name?: string;
  customer_phone?: string;
  photo_url?: string;
  service_package_name: string;
  addon_names: string[];
  date: string;
  amount_paid: number;
  payment_method: PaymentMethod;
  staff_name: string;
  notes?: string;
  loyalty_stamp_awarded: boolean;
  is_free_reward_applied: boolean;
  timestamp: string;
}

export interface LoyaltyCardData {
  plate_number: string;
  customer_id?: string;
  customer_name?: string;
  current_stamps: number; // 0 to 3. 4th wash is FREE
  total_full_washes: number;
  total_free_washes_earned: number;
  total_free_washes_redeemed: number;
  last_stamped_at?: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  receiver_id?: string; // or 'all_staff'
  text: string;
  timestamp: string;
  read: boolean;
  plate_number?: string;
}

export interface Question {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  category: 'general' | 'pricing' | 'callout' | 'detailing' | 'loyalty';
  message: string;
  status: 'open' | 'answered';
  answer?: string;
  answered_by?: string;
  created_at: string;
  answered_at?: string;
}

export interface ReferralRecord {
  id: string;
  referrer_id: string;
  referrer_code: string;
  referred_name: string;
  referred_email: string;
  status: 'pending' | 'completed';
  reward_amount: number; // R20
  created_at: string;
}
