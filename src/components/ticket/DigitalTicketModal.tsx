import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { downloadTicketAsDocument, printTicket } from '../../utils/pdfGenerator';
import QRCode from 'qrcode';
import { 
  X, 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  Printer, 
  Copy, 
  QrCode, 
  AlertTriangle,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const DigitalTicketModal: React.FC = () => {
  const { 
    viewingTicket, 
    setViewingTicket, 
    cancelBooking, 
    showToast 
  } = useApp();

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (viewingTicket) {
      setShowCancelConfirm(false);
      QRCode.toDataURL(viewingTicket.qrPayload || viewingTicket.id, {
        width: 300,
        margin: 1,
        color: { dark: '#172033', light: '#ffffff' },
      }).then(url => setQrCodeUrl(url)).catch(() => {});
    }
  }, [viewingTicket]);

  if (!viewingTicket) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(viewingTicket.id);
    setIsCopied(true);
    showToast('Copied Reference', `Booking ID ${viewingTicket.id} copied to clipboard.`, 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCancel = () => {
    cancelBooking(viewingTicket.id);
    setShowCancelConfirm(false);
    setViewingTicket(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Modal Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base font-heading">Digital Boarding Pass</h3>
          </div>

          <button
            onClick={() => setViewingTicket(null)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Pass Card */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          <div id="printable-ticket" className="rounded-3xl border border-slate-200 shadow-md bg-white overflow-hidden">
            
            {/* Ticket Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-200">
                  <span>TicketEase Official Pass</span>
                </div>
                <h4 className="text-xl font-black mt-0.5 font-heading">{viewingTicket.eventTitle}</h4>
                <p className="text-xs text-white/80">{viewingTicket.eventCategory}</p>
              </div>

              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  viewingTicket.status === 'Confirmed'
                    ? 'bg-emerald-400 text-slate-950'
                    : viewingTicket.status === 'Checked-in'
                    ? 'bg-blue-400 text-slate-950'
                    : 'bg-rose-400 text-slate-950'
                }`}>
                  {viewingTicket.status}
                </span>
                <span className="block text-[10px] text-white/70 mt-1 font-mono">
                  {viewingTicket.tierName} TIER
                </span>
              </div>
            </div>

            {/* Ticket Info Grid */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Date & Time</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {formatDate(viewingTicket.eventDate)}
                  </span>
                  <span className="text-slate-500 block">{viewingTicket.eventTime}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Venue</span>
                  <span className="font-bold text-slate-800 text-sm truncate block">
                    {viewingTicket.venue}
                  </span>
                  <span className="text-slate-500 block">{viewingTicket.city}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Attendee</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {viewingTicket.attendee.fullName}
                  </span>
                  <span className="text-slate-500 block">{viewingTicket.attendee.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-4 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Seats / Quantity</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {viewingTicket.ticketQuantity} Seat(s)
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Total Paid</span>
                  <span className="font-bold text-emerald-600 text-base">
                    {formatCurrency(viewingTicket.totalAmount)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Payment Mode</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {viewingTicket.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Perforated Notches */}
            <div className="relative border-b-2 border-dashed border-slate-200 py-1 bg-slate-50">
              <div className="ticket-notch-left" />
              <div className="ticket-notch-right" />
            </div>

            {/* QR Section */}
            <div className="p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Booking Reference Number
                </span>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-2xl font-black font-mono text-indigo-700">
                    {viewingTicket.id}
                  </span>
                  <button
                    onClick={handleCopyRef}
                    className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-mono block">
                  Txn ID: {viewingTicket.paymentId}
                </span>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                  Present this QR pass to venue marshals or scanners for admission.
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center shrink-0">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Pass" className="w-28 h-28 object-contain" />
                ) : (
                  <QrCode className="w-28 h-28 text-slate-700" />
                )}
                <span className="text-[10px] font-mono font-bold text-slate-400 mt-1">GATE PASS QR</span>
              </div>
            </div>

          </div>

          {/* Cancellation Notice if active */}
          {viewingTicket.status === 'Confirmed' && !showCancelConfirm && (
            <div className="text-right">
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline transition-colors"
              >
                Need to cancel this booking?
              </button>
            </div>
          )}

          {showCancelConfirm && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Are you sure you want to cancel this booking?</span>
              </div>
              <p className="text-rose-700">
                Cancelling will release your reserved seats ({viewingTicket.ticketQuantity}x) back to the event pool and update the ticket status.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCancel}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Yes, Cancel Booking
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 font-semibold text-xs"
                >
                  Keep Booking
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadTicketAsDocument(viewingTicket, qrCodeUrl)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF/Pass</span>
            </button>

            <button
              onClick={printTicket}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>

          <button
            onClick={handleCopyRef}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Reference Copied!' : 'Copy Ref'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
