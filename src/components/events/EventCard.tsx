import React from 'react';
import { EventItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  Calendar, 
  MapPin, 
  Star, 
  Flame, 
  Clock, 
  ArrowRight,
  Ticket
} from 'lucide-react';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { openEventDetail, openBookingForEvent } = useApp();

  // Category color mapper
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Music Concerts':
        return { badge: 'bg-purple-100 text-purple-800 border-purple-200', tag: '🎵 Concert' };
      case 'Movies':
        return { badge: 'bg-rose-100 text-rose-800 border-rose-200', tag: '🎬 Cinema' };
      case 'Sports':
        return { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', tag: '⚽ Sports' };
      case 'Technology Conferences':
        return { badge: 'bg-blue-100 text-blue-800 border-blue-200', tag: '💻 Tech Summit' };
      case 'College Events':
        return { badge: 'bg-amber-100 text-amber-800 border-amber-200', tag: '🎓 College Fest' };
      case 'Cultural Programs':
        return { badge: 'bg-orange-100 text-orange-800 border-orange-200', tag: '🎭 Cultural' };
      case 'Train Travel':
        return { badge: 'bg-teal-100 text-teal-800 border-teal-200', tag: '🚆 Express Train' };
      case 'Bus Travel':
        return { badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', tag: '🚌 SmartBus' };
      default:
        return { badge: 'bg-slate-100 text-slate-800 border-slate-200', tag: '🎟️ Event' };
    }
  };

  const theme = getCategoryTheme(event.category);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    if (status === 'Selling Fast') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-rose-500/90 text-white text-[11px] font-bold backdrop-blur-md shadow-sm flex items-center gap-1">
          <Flame className="w-3 h-3" />
          Selling Fast
        </span>
      );
    }
    if (status === 'Limited Seats') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[11px] font-bold backdrop-blur-md shadow-sm flex items-center gap-1">
          Limited Seats
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold backdrop-blur-md shadow-sm">
        Available
      </span>
    );
  };

  // Remaining seats estimation
  const totalAvailableSeats = event.tiers.reduce((acc, t) => acc + t.availableSeats, 0);

  return (
    <div className="group rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5">
      
      {/* Cover Image Container */}
      <div className="relative h-52 overflow-hidden cursor-pointer" onClick={() => openEventDetail(event)}>
        <img
          src={event.imageUrl}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${theme.badge}`}>
            {theme.tag}
          </span>
          {getStatusBadge(event.status)}
        </div>

        {/* Bottom image overlay with rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{event.rating.toFixed(1)}</span>
            <span className="text-white/70">({event.reviewCount})</span>
          </span>

          <span className="text-[11px] font-medium text-white/90 bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded-md">
            {event.city}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Title */}
          <h3 
            onClick={() => openEventDetail(event)}
            className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
            title={event.title}
          >
            {event.title}
          </h3>

          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
            <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{formatDate(event.date)}</span>
            <span>•</span>
            <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{event.time}</span>
          </div>

          {/* Venue */}
          <div className="flex items-start gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Card Footer: Price & Actions */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900 font-heading">
                  {formatCurrency(event.startingPrice)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">/ person</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                {totalAvailableSeats} seats left
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openEventDetail(event)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all text-center"
            >
              View Details
            </button>

            <button
              onClick={() => openBookingForEvent(event)}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1 group-hover:shadow-indigo-500/30"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Book Ticket</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
