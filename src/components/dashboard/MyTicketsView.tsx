import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { downloadTicketAsDocument } from '../../utils/pdfGenerator';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  QrCode, 
  Download, 
  ExternalLink, 
  Frown, 
  CheckCircle2, 
  User, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export const MyTicketsView: React.FC = () => {
  const { 
    bookings, 
    currentUser, 
    setViewingTicket, 
    setActivePage,
    resetAllDemoData 
  } = useApp();

  const [statusTab, setStatusTab] = useState<'all' | 'Confirmed' | 'Checked-in' | 'Cancelled'>('all');
  const [ticketSearch, setTicketSearch] = useState<string>('');

  // Metrics
  const totalBookings = bookings.length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const checkedInCount = bookings.filter(b => b.status === 'Checked-in').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;
  const totalSpent = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (statusTab !== 'all' && b.status !== statusTab) {
        return false;
      }
      if (ticketSearch.trim()) {
        const query = ticketSearch.toLowerCase();
        const matchTitle = b.eventTitle.toLowerCase().includes(query);
        const matchId = b.id.toLowerCase().includes(query);
        const matchVenue = b.venue.toLowerCase().includes(query);
        return matchTitle || matchId || matchVenue;
      }
      return true;
    });
  }, [bookings, statusTab, ticketSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Top Profile Summary Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover rounded-[14px]" />
            ) : (
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
                <User className="w-8 h-8 text-indigo-400" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black font-heading">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider border border-indigo-400/30">
                Attendee
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{currentUser.email} • {currentUser.phone}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActivePage('events')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Book New Event</span>
          </button>

          <button
            onClick={resetAllDemoData}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
            title="Reset to default sample bookings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">{totalBookings}</span>
          <span className="text-xs text-slate-500 block">Lifetime transactions</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Upcoming Active</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading">{confirmedCount}</span>
          <span className="text-xs text-slate-500 block">Ready for gate scan</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Checked-In / Past</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600 font-heading">{checkedInCount}</span>
          <span className="text-xs text-slate-500 block">Events attended</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Total Spend (Demo)</span>
          <span className="text-2xl sm:text-3xl font-black text-indigo-600 font-heading">{formatCurrency(totalSpent)}</span>
          <span className="text-xs text-slate-500 block">Recorded demo value</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs overflow-x-auto">
          {[
            { id: 'all', label: `All (${totalBookings})` },
            { id: 'Confirmed', label: `Upcoming (${confirmedCount})` },
            { id: 'Checked-in', label: `Checked-In (${checkedInCount})` },
            { id: 'Cancelled', label: `Cancelled (${cancelledCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                statusTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex items-center px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={ticketSearch}
            onChange={e => setTicketSearch(e.target.value)}
            placeholder="Search booking ID, event..."
            className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
          />
        </div>

      </div>

      {/* Tickets Cards Grid or Empty State */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map(ticket => (
            <div
              key={ticket.id}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={ticket.imageUrl}
                      alt={ticket.eventTitle}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-xs"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                        {ticket.eventCategory}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 line-clamp-1">
                        {ticket.eventTitle}
                      </h4>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {ticket.id}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase shrink-0 ${
                    ticket.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : ticket.status === 'Checked-in'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {ticket.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{formatDate(ticket.eventDate)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{ticket.eventTime}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span className="truncate">{ticket.venue}, {ticket.city}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Tier & Seats</span>
                    <span className="font-bold text-slate-800">{ticket.tierName} • {ticket.ticketQuantity} Seat(s)</span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block font-medium">Total Paid</span>
                    <span className="font-black text-slate-900 text-sm font-heading">{formatCurrency(ticket.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingTicket(ticket)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View Pass & QR</span>
                </button>

                <button
                  onClick={() => downloadTicketAsDocument(ticket, '')}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No bookings yet</h3>
          <p className="text-sm text-slate-500">
            Discover concerts, movies, sports, and travel passes to generate your first digital boarding pass!
          </p>
          <button
            onClick={() => setActivePage('events')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
          >
            <span>Explore Events Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
