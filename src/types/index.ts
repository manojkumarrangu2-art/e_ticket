export type EventCategory = 
  | 'Music Concerts'
  | 'Movies'
  | 'Sports'
  | 'College Events'
  | 'Cultural Programs'
  | 'Technology Conferences'
  | 'Bus Travel'
  | 'Train Travel';

export interface TicketTier {
  id: string;
  name: 'Standard' | 'Premium' | 'VIP';
  price: number; // in INR (₹)
  description: string;
  perks: string[];
  totalSeats: number;
  availableSeats: number;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  longDescription: string;
  imageUrl: string;
  date: string; // e.g. "2026-11-15"
  time: string; // e.g. "07:30 PM"
  venue: string;
  city: string;
  state: string;
  startingPrice: number;
  featured?: boolean;
  status: 'Available' | 'Selling Fast' | 'Limited Seats' | 'Sold Out';
  rating: number;
  reviewCount: number;
  organizer: string;
  tiers: TicketTier[];
  tags: string[];
}

export interface BookingAttendee {
  fullName: string;
  email: string;
  phone: string;
  idProofType?: string;
  idProofNumber?: string;
  specialRequests?: string;
}

export type BookingStatus = 'Confirmed' | 'Checked-in' | 'Cancelled';

export interface Booking {
  id: string; // e.g. "TE-2026-X892"
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  imageUrl: string;
  tierId: string;
  tierName: string;
  ticketQuantity: number;
  ticketPrice: number;
  subtotal: number;
  bookingFee: number;
  gstAmount: number;
  discountAmount: number;
  couponCodeApplied?: string;
  totalAmount: number;
  attendee: BookingAttendee;
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Digital Wallet';
  paymentId: string;
  bookingDate: string; // ISO string
  status: BookingStatus;
  qrPayload: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number; // e.g. 20 for 20% or 100 for ₹100
  maxDiscount?: number;
  description: string;
  minBookingValue: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'attendee' | 'admin';
  avatarUrl?: string;
}

export type ActivePage = 'home' | 'events' | 'my-tickets' | 'admin' | 'about' | 'contact';
