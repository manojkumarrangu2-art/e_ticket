import { EventItem, Booking, UserProfile } from '../types';
import { INITIAL_EVENTS } from '../data/initialEvents';
import { INITIAL_BOOKINGS } from '../data/initialBookings';

const STORAGE_KEYS = {
  EVENTS: 'ticketease_events_v1',
  BOOKINGS: 'ticketease_bookings_v1',
  USER: 'ticketease_current_user_v1',
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr-attendee-01',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  phone: '+91 98765 43210',
  role: 'attendee',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const ADMIN_USER: UserProfile = {
  id: 'usr-admin-01',
  name: 'SuperAdmin (Manager)',
  email: 'admin@ticketease.io',
  phone: '+91 98000 11223',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
};

export function loadEventsFromStorage(): EventItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      saveEventsToStorage(INITIAL_EVENTS);
      return INITIAL_EVENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading events from storage:', e);
    return INITIAL_EVENTS;
  }
}

export function saveEventsToStorage(events: EventItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Error saving events to storage:', e);
  }
}

export function loadBookingsFromStorage(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      saveBookingsToStorage(INITIAL_BOOKINGS);
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading bookings from storage:', e);
    return INITIAL_BOOKINGS;
  }
}

export function saveBookingsToStorage(bookings: Booking[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error('Error saving bookings to storage:', e);
  }
}

export function loadUserFromStorage(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      saveUserToStorage(DEFAULT_USER);
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_USER;
  }
}

export function saveUserToStorage(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user to storage:', e);
  }
}

export function resetDemoData(): { events: EventItem[]; bookings: Booking[]; user: UserProfile } {
  saveEventsToStorage(INITIAL_EVENTS);
  saveBookingsToStorage(INITIAL_BOOKINGS);
  saveUserToStorage(DEFAULT_USER);
  return {
    events: INITIAL_EVENTS,
    bookings: INITIAL_BOOKINGS,
    user: DEFAULT_USER,
  };
}
