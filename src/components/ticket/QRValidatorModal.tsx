import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Search, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const QRValidatorModal: React.FC = () => {
  const { 
    isQRScannerModalOpen, 
    setIsQRScannerModalOpen, 
    bookings, 
    checkInBooking,
    showToast 
  } = useApp();

  const [inputRef, setInputRef] = useState<string>('TE-2026-X892M');
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  const [validationError, setValidationError] = useState<string>('');

  if (!isQRScannerModalOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError('');
    setScannedResult(null);

    const trimmed = inputRef.trim();
    if (!trimmed) {
      setValidationError('Please enter a booking reference code.');
      return;
    }

    const matched = bookings.find(b => b.id.toLowerCase() === trimmed.toLowerCase());
    if (!matched) {
      setValidationError(`No booking found matching "${trimmed}". Please check the reference.`);
      return;
    }

    setScannedResult(matched);
  };

  const handleGateCheckIn = (bookingId: string) => {
    const success = checkInBooking(bookingId);
    if (success) {
      setScannedResult((prev: any) => prev ? { ...prev, status: 'Checked-in' } : null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-heading">Gate Pass QR Validator</h3>
              <p className="text-[11px] text-slate-300">Official venue admission scanner</p>
            </div>
          </div>

          <button
            onClick={() => setIsQRScannerModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form and Scanner Body */}
        <div className="p-6 space-y-5">
          
          <form onSubmit={handleVerify} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enter Booking ID or Paste QR Payload
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputRef}
                  onChange={e => setInputRef(e.target.value)}
                  placeholder="e.g. TE-2026-X892M"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Verify</span>
              </button>
            </div>

            {/* Quick Demo Reference shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Test codes:</span>
              {bookings.slice(0, 3).map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setInputRef(b.id);
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[11px] font-mono font-semibold text-slate-600 transition-colors"
                >
                  {b.id}
                </button>
              ))}
            </div>
          </form>

          {/* Error display */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Validation Result Box */}
          {scannedResult && (
            <div className="p-5 rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-sm text-slate-900">Valid Ticket Verified</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  scannedResult.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : scannedResult.status === 'Checked-in'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
                  {scannedResult.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Event</span>
                  <span className="font-bold text-slate-800 text-sm">{scannedResult.eventTitle}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 font-medium block">Attendee Name</span>
                    <span className="font-bold text-slate-800">{scannedResult.attendee.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Seating Tier</span>
                    <span className="font-bold text-slate-800">{scannedResult.tierName} ({scannedResult.ticketQuantity} Seats)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Event Schedule</span>
                    <span className="font-bold text-slate-800">{formatDate(scannedResult.eventDate)} • {scannedResult.eventTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Venue</span>
                    <span className="font-bold text-slate-800 truncate block">{scannedResult.venue}</span>
                  </div>
                </div>
              </div>

              {/* Check-in Action Button */}
              {scannedResult.status === 'Confirmed' && (
                <button
                  onClick={() => handleGateCheckIn(scannedResult.id)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Admit & Mark as Checked-in</span>
                </button>
              )}

              {scannedResult.status === 'Checked-in' && (
                <div className="p-2.5 rounded-xl bg-blue-100/70 text-blue-800 text-xs font-semibold text-center">
                  ✓ Attendee Already Scanned In At Venue Gate
                </div>
              )}
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              Real TicketEase gates verify cryptographically hashed QR tokens via offline micro-services, ensuring zero counterfeit entries even without internet.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
