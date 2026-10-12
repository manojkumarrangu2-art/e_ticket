import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem, Booking, BookingStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { EventFormModal } from './EventFormModal';
import { 
  ShieldCheck, 
  Calendar, 
  Ticket, 
  DollarSign, 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Download, 
  BarChart3, 
  TrendingUp, 
  RotateCcw, 
  QrCode,
  UserCheck,
  AlertTriangle,
  Eye
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { 
    events, 
    bookings, 
    deleteEvent, 
    addEvent, 
    updateEvent, 
    checkInBooking, 
    cancelBooking,
    resetAllDemoData,
    switchUserRole,
    setViewingTicket,
    openEventDetail
  } = useApp();

  const [activeTab, setActiveTab] = useState<'events' | 'bookings' | 'analytics'>('events');
  const [eventSearch, setEventSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  // Form modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Metrics
  const totalEvents = events.length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCapacity = events.reduce(
    (sum, e) => sum + e.tiers.reduce((tsum, t) => tsum + t.totalSeats, 0),
    0
  );
  const totalSeatsAvailable = events.reduce(
    (sum, e) => sum + e.tiers.reduce((tsum, t) => tsum + t.availableSeats, 0),
    0
  );

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (!eventSearch.trim()) return true;
      const q = eventSearch.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
    });
  }, [events, eventSearch]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (bookingStatusFilter !== 'all' && b.status !== bookingStatusFilter) {
        return false;
      }
      if (!bookingSearch.trim()) return true;
      const q = bookingSearch.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.attendee.fullName.toLowerCase().includes(q) ||
        b.eventTitle.toLowerCase().includes(q)
      );
    });
  }, [bookings, bookingSearch, bookingStatusFilter]);

  // Category Distribution for Chart
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return Object.entries(counts).map(([cat, count]) => ({ cat, count }));
  }, [events]);

  // CSV Export for Bookings
  const handleExportCSV = () => {
    const headers = ['Booking ID,Event,Category,Date,Attendee,Phone,Tier,Quantity,Total (INR),Status,Payment Mode'];
    const rows = bookings.map(b => 
      `"${b.id}","${b.eventTitle.replace(/"/g, '""')}","${b.eventCategory}","${b.eventDate}","${b.attendee.fullName}","${b.attendee.phone}","${b.tierName}",${b.ticketQuantity},${b.totalAmount},"${b.status}","${b.paymentMethod}"`
    );
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TicketEase-Bookings-Report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEditClick = (event: EventItem) => {
    setEditingEvent(event);
    setIsFormModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingEvent(null);
    setIsFormModalOpen(true);
  };

  const handleFormSave = (event: EventItem) => {
    if (editingEvent) {
      updateEvent(event);
    } else {
      addEvent(event);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Admin Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 shadow-lg shadow-purple-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black font-heading">SuperAdmin Dashboard</h2>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-wider border border-purple-400/30">
                PRO MANAGER
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Manage live events, view recorded revenue, monitor admissions, and inspect bookings.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCreateClick}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>

          <button
            onClick={resetAllDemoData}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
            title="Reset to default mock state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>

          <button
            onClick={() => switchUserRole('attendee')}
            className="px-4 py-2.5 rounded-2xl border border-white/20 hover:bg-white/10 text-white font-semibold text-xs transition-colors"
          >
            Exit to Attendee View →
          </button>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Events</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">{totalEvents}</div>
          <span className="text-xs text-slate-500 block">Across 8 categories</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
            <Ticket className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">{totalBookings}</div>
          <span className="text-xs text-slate-500 block">Stored in local layer</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Demo Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 font-heading">{formatCurrency(totalRevenue)}</div>
          <span className="text-xs text-slate-500 block">Net confirmed volume</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Seats Inventory</span>
            <Users className="w-4 h-4 text-pink-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">{totalSeatsAvailable}</div>
          <span className="text-xs text-slate-500 block">Of {totalCapacity} total capacity</span>
        </div>

      </div>

      {/* Analytics Chart Cards (Visual SVGs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-base text-slate-900">Event Portfolio by Category</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Real-time inventory</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryStats.map((item, idx) => {
              const pct = Math.round((item.count / totalEvents) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item.cat}</span>
                    <span>{item.count} event(s) ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(12, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">Booking Status Pipeline</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Lifecycle distribution of booked passes</p>
          </div>

          <div className="space-y-3 my-auto py-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-950">Confirmed (Awaiting Event)</span>
              </div>
              <span className="text-sm font-extrabold text-emerald-700">
                {bookings.filter(b => b.status === 'Confirmed').length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-blue-950">Checked-in At Gate</span>
              </div>
              <span className="text-sm font-extrabold text-blue-700">
                {bookings.filter(b => b.status === 'Checked-in').length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-rose-950">Cancelled & Refunded</span>
              </div>
              <span className="text-sm font-extrabold text-rose-700">
                {bookings.filter(b => b.status === 'Cancelled').length}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center">
            *Demo data persists dynamically in your browser session.
          </div>
        </div>

      </div>

      {/* Navigation Tabs for Tables */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'events'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Events Management ({events.length})
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Bookings Registry ({bookings.length})
            </button>
          </div>

          {activeTab === 'bookings' && (
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        {/* ================= TAB 1: EVENTS MANAGEMENT ================= */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex items-center px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={eventSearch}
                  onChange={e => setEventSearch(e.target.value)}
                  placeholder="Filter events by title, city, category..."
                  className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={handleCreateClick}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>

            {/* Events Table */}
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Event Details</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Schedule</th>
                      <th className="px-5 py-3.5">Location</th>
                      <th className="px-5 py-3.5">Starting Price</th>
                      <th className="px-5 py-3.5">Inventory</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredEvents.map(event => {
                      const avail = event.tiers.reduce((a, b) => a + b.availableSeats, 0);
                      return (
                        <tr key={event.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-10 h-10 rounded-xl object-cover shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block line-clamp-1">{event.title}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{event.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold text-[11px] border border-purple-100">
                              {event.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-semibold text-slate-800 block">{formatDate(event.date)}</span>
                            <span className="text-[11px] text-slate-400">{event.time}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-semibold text-slate-800 block">{event.city}</span>
                            <span className="text-[11px] text-slate-400 truncate block max-w-xs">{event.venue}</span>
                          </td>
                          <td className="px-5 py-3.5 font-bold text-slate-900">
                            {formatCurrency(event.startingPrice)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              {avail} left
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEventDetail(event)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
                                title="Preview Event"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditClick(event)}
                                className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
                                title="Edit Event"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteEvent(event.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: BOOKINGS REGISTRY ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex items-center px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={e => setBookingSearch(e.target.value)}
                  placeholder="Filter by ref code, attendee name..."
                  className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={bookingStatusFilter}
                  onChange={e => setBookingStatusFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Booking Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-in">Checked-in</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Reference ID</th>
                      <th className="px-5 py-3.5">Event</th>
                      <th className="px-5 py-3.5">Attendee Info</th>
                      <th className="px-5 py-3.5">Tier & Seats</th>
                      <th className="px-5 py-3.5">Amount (₹)</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredBookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-indigo-700">
                          {b.id}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-slate-900 block line-clamp-1">{b.eventTitle}</span>
                          <span className="text-[11px] text-slate-400">{formatDate(b.eventDate)}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-slate-900 block">{b.attendee.fullName}</span>
                          <span className="text-[11px] text-slate-400">{b.attendee.phone}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-slate-800">{b.tierName}</span>
                          <span className="text-slate-500 ml-1">({b.ticketQuantity}x)</span>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          {formatCurrency(b.totalAmount)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : b.status === 'Checked-in'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewingTicket(b)}
                              className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                              title="View Boarding Pass"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            
                            {b.status === 'Confirmed' && (
                              <>
                                <button
                                  onClick={() => checkInBooking(b.id)}
                                  className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                                  title="Mark as Checked-in"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => cancelBooking(b.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                                  title="Cancel Booking"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Edit / Add Modal */}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleFormSave}
        eventToEdit={editingEvent}
      />

    </div>
  );
};
