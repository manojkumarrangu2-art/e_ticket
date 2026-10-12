import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  EventItem, 
  Booking, 
  UserProfile, 
  ActivePage, 
  EventCategory,
  BookingStatus 
} from '../types';
import { 
  loadEventsFromStorage, 
  saveEventsToStorage, 
  loadBookingsFromStorage, 
  saveBookingsToStorage, 
  loadUserFromStorage, 
  saveUserToStorage,
  DEFAULT_USER,
  ADMIN_USER,
  resetDemoData
} from '../utils/storage';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  events: EventItem[];
  bookings: Booking[];
  currentUser: UserProfile;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedEvent: EventItem | null;
  setSelectedEvent: (event: EventItem | null) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  viewingTicket: Booking | null;
  setViewingTicket: (ticket: Booking | null) => void;
  isQRScannerModalOpen: boolean;
  setIsQRScannerModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string; // 'All' or EventCategory
  setSelectedCategory: (cat: string) => void;
  selectedCity: string; // 'All' or city name
  setSelectedCity: (city: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Actions
  createBooking: (newBooking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  checkInBooking: (bookingId: string) => boolean;
  addEvent: (event: EventItem) => void;
  updateEvent: (event: EventItem) => void;
  deleteEvent: (eventId: string) => void;
  switchUserRole: (role: 'attendee' | 'admin') => void;
  loginAs: (user: UserProfile) => void;
  resetAllDemoData: () => void;
  openBookingForEvent: (event: EventItem) => void;
  openEventDetail: (event: EventItem) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(loadEventsFromStorage);
  const [bookings, setBookings] = useState<Booking[]>(loadBookingsFromStorage);
  const [currentUser, setCurrentUser] = useState<UserProfile>(loadUserFromStorage);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  
  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [viewingTicket, setViewingTicket] = useState<Booking | null>(null);
  const [isQRScannerModalOpen, setIsQRScannerModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('popular');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    saveEventsToStorage(events);
  }, [events]);

  useEffect(() => {
    saveBookingsToStorage(bookings);
  }, [bookings]);

  useEffect(() => {
    saveUserToStorage(currentUser);
  }, [currentUser]);

  // Actions
  const createBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    
    // Decrement available seats in event
    setEvents(prev => prev.map(ev => {
      if (ev.id === newBooking.eventId) {
        return {
          ...ev,
          tiers: ev.tiers.map(t => {
            if (t.id === newBooking.tierId) {
              return {
                ...t,
                availableSeats: Math.max(0, t.availableSeats - newBooking.ticketQuantity),
              };
            }
            return t;
          }),
        };
      }
      return ev;
    }));

    showToast('Booking Confirmed!', `Ticket pass ${newBooking.id} has been generated.`, 'success');
  };

  const cancelBooking = (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'Cancelled' as BookingStatus };
      }
      return b;
    }));

    // Restore seats
    setEvents(prev => prev.map(ev => {
      if (ev.id === target.eventId) {
        return {
          ...ev,
          tiers: ev.tiers.map(t => {
            if (t.id === target.tierId) {
              return {
                ...t,
                availableSeats: t.availableSeats + target.ticketQuantity,
              };
            }
            return t;
          }),
        };
      }
      return ev;
    }));

    showToast('Booking Cancelled', `Booking reference ${bookingId} has been marked cancelled.`, 'warning');
  };

  const checkInBooking = (bookingId: string): boolean => {
    const target = bookings.find(b => b.id.toLowerCase() === bookingId.trim().toLowerCase());
    if (!target) {
      showToast('Check-in Failed', 'Ticket reference not found in the booking registry.', 'error');
      return false;
    }

    if (target.status === 'Cancelled') {
      showToast('Access Denied', 'This ticket has been cancelled and refunded.', 'error');
      return false;
    }

    if (target.status === 'Checked-in') {
      showToast('Already Checked-in', `Attendee already scanned in for ${target.eventTitle}.`, 'warning');
      return true;
    }

    setBookings(prev => prev.map(b => {
      if (b.id.toLowerCase() === bookingId.trim().toLowerCase()) {
        return { ...b, status: 'Checked-in' as BookingStatus };
      }
      return b;
    }));

    showToast('Check-in Verified!', `Welcome ${target.attendee.fullName}! Gate verified for ${target.tierName}.`, 'success');
    return true;
  };

  const addEvent = (event: EventItem) => {
    setEvents(prev => [event, ...prev]);
    showToast('Event Created', `"${event.title}" is now published and bookable.`, 'success');
  };

  const updateEvent = (updated: EventItem) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    showToast('Event Updated', `Changes to "${updated.title}" have been saved.`, 'success');
  };

  const deleteEvent = (eventId: string) => {
    const ev = events.find(e => e.id === eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
    showToast('Event Deleted', `"${ev?.title || eventId}" has been removed.`, 'info');
  };

  const switchUserRole = (role: 'attendee' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(ADMIN_USER);
      setActivePage('admin');
      showToast('Switched to Admin Role', 'You now have full event management & analytics control.', 'info');
    } else {
      setCurrentUser(DEFAULT_USER);
      setActivePage('home');
      showToast('Switched to Attendee Role', 'Browsing TicketEase as customer Alex Rivera.', 'info');
    }
  };

  const loginAs = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast('Welcome!', `Logged in as ${user.name}`, 'success');
  };

  const resetAllDemoData = () => {
    const data = resetDemoData();
    setEvents(data.events);
    setBookings(data.bookings);
    setCurrentUser(data.user);
    showToast('Demo Reset', 'Sample events, bookings, and demo states restored to default.', 'info');
  };

  const openBookingForEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(false);
    setIsBookingModalOpen(true);
  };

  const openEventDetail = (event: EventItem) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        events,
        bookings,
        currentUser,
        activePage,
        setActivePage,
        selectedEvent,
        setSelectedEvent,
        isDetailModalOpen,
        setIsDetailModalOpen,
        isBookingModalOpen,
        setIsBookingModalOpen,
        viewingTicket,
        setViewingTicket,
        isQRScannerModalOpen,
        setIsQRScannerModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        toasts,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedCity,
        setSelectedCity,
        sortBy,
        setSortBy,
        createBooking,
        cancelBooking,
        checkInBooking,
        addEvent,
        updateEvent,
        deleteEvent,
        switchUserRole,
        loginAs,
        resetAllDemoData,
        openBookingForEvent,
        openEventDetail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
