import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Users, 
  Check, 
  Plus, 
  Minus, 
  Ticket, 
  ArrowRight,
  Info
} from 'lucide-react';

export const EventDetailModal: React.FC = () => {
  const { 
    selectedEvent, 
    isDetailModalOpen, 
    setIsDetailModalOpen, 
    openBookingForEvent 
  } = useApp();

  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!isDetailModalOpen || !selectedEvent) return null;

  // Default to first tier if not chosen
  const currentTier = selectedEvent.tiers.find(t => t.id === selectedTierId) || selectedEvent.tiers[0];

  const handleTierSelect = (tierId: string) => {
    setSelectedTierId(tierId);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < Math.min(10, currentTier.availableSeats)) {
      setQuantity(quantity + 1);
    }
  };

  // Calculations
  const subtotal = currentTier.price * quantity;
  const platformFee = Math.round(subtotal * 0.05); // 5% fee
  const gst = Math.round((subtotal + platformFee) * 0.18); // 18% GST display
  const total = subtotal + platformFee + gst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Cover Banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0">
          <img
            src={selectedEvent.imageUrl}
            alt={selectedEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setIsDetailModalOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner bottom info */}
          <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-600/90 text-white text-xs font-bold tracking-wide backdrop-blur-md">
                {selectedEvent.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{selectedEvent.rating.toFixed(1)} ({selectedEvent.reviewCount} reviews)</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {selectedEvent.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                {formatDate(selectedEvent.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                {selectedEvent.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-pink-400" />
                {selectedEvent.venue}, {selectedEvent.city}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Overview & About */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Event Overview & Highlights</span>
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedEvent.longDescription}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedEvent.tags?.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Ticket Tier Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-purple-600" />
                <span>Select Ticket Tier & Seating Category</span>
              </h4>
              <span className="text-xs text-slate-400 font-medium">Step 1 of 5</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedEvent.tiers.map(tier => {
                const isSelected = tier.id === currentTier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => handleTierSelect(tier.id)}
                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-500/10 scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                          {tier.name}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {tier.availableSeats} left
                        </span>
                      </div>

                      <div className="mt-2 mb-2">
                        <span className="text-2xl font-black text-slate-900 font-heading">
                          {formatCurrency(tier.price)}
                        </span>
                        <span className="text-xs text-slate-500 font-normal"> / ticket</span>
                      </div>

                      <p className="text-xs text-slate-600 mb-3 leading-snug">
                        {tier.description}
                      </p>

                      <ul className="space-y-1.5 border-t border-slate-100 pt-3">
                        {tier.perks.map((perk, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 mt-3">
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${Math.min(100, (tier.availableSeats / tier.totalSeats) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector & Price Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Quantity */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Number of Tickets
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-lg shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-black text-slate-900 min-w-8 text-center font-heading">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  disabled={quantity >= Math.min(10, currentTier.availableSeats)}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-lg shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-500 pl-2">
                  (Max 10 per transaction)
                </span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
              <div className="flex justify-between">
                <span>{currentTier.name} ({quantity}x {formatCurrency(currentTier.price)})</span>
                <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform & Convenience Fee (5%)</span>
                <span className="font-semibold text-slate-800">{formatCurrency(platformFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% applied on booking fee)</span>
                <span className="font-semibold text-slate-800">{formatCurrency(gst)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Payable</span>
                <span className="text-indigo-600">{formatCurrency(total)}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Footer Action */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-500 block">Total for {quantity} {quantity === 1 ? 'ticket' : 'tickets'}</span>
            <span className="text-2xl font-black text-slate-900 font-heading">
              {formatCurrency(total)}
            </span>
          </div>

          <button
            onClick={() => {
              openBookingForEvent(selectedEvent);
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Proceed to Booking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
