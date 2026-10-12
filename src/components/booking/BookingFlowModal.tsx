import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingAttendee } from '../../types';
import { formatCurrency, formatDate, generateBookingId, generateTransactionId } from '../../utils/formatters';
import { applyCoupon } from '../../data/coupons';
import { downloadTicketAsDocument, printTicket } from '../../utils/pdfGenerator';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Ticket, 
  User, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Minus, 
  Smartphone, 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  CheckCircle2, 
  Loader2, 
  Tag, 
  Building2, 
  Wallet,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';

export const BookingFlowModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    setIsBookingModalOpen, 
    selectedEvent, 
    currentUser, 
    createBooking, 
    showToast,
    setActivePage 
  } = useApp();

  // Wizard Step: 1 = Event Overview, 2 = Choose Tickets, 3 = Attendee Info, 4 = Payment & Review, 5 = E-Ticket Pass
  const [step, setStep] = useState<number>(2); // Start at step 2 if event is already selected

  // Step 2: Tickets
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Step 3: Attendee Details
  const [fullName, setFullName] = useState<string>(currentUser.name || 'Alex Rivera');
  const [email, setEmail] = useState<string>(currentUser.email || 'alex.rivera@example.com');
  const [phone, setPhone] = useState<string>(currentUser.phone || '+91 98765 43210');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Step 4: Coupon & Payment Method
  const [couponInput, setCouponInput] = useState<string>('WELCOME100');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [couponMessage, setCouponMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Digital Wallet'>('UPI');
  
  // Mock Payment fields
  const [upiId, setUpiId] = useState<string>('alex.rivera@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('842');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Step 5: Completed Booking & QR Data
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Auto-init tier when event changes
  useEffect(() => {
    if (selectedEvent && selectedEvent.tiers.length > 0) {
      setSelectedTierId(selectedEvent.tiers[0].id);
      setQuantity(1);
      setStep(2);
      setCompletedBooking(null);
      setQrCodeDataUrl('');
    }
  }, [selectedEvent]);

  if (!isBookingModalOpen || !selectedEvent) return null;

  const currentTier = selectedEvent.tiers.find(t => t.id === selectedTierId) || selectedEvent.tiers[0];

  // Pricing math
  const subtotal = currentTier.price * quantity;
  const bookingFee = Math.round(subtotal * 0.05); // 5%
  const gstAmount = Math.round((subtotal + bookingFee) * 0.18);
  const grossTotal = subtotal + bookingFee + gstAmount;
  const netTotal = Math.max(0, grossTotal - couponDiscount);

  // Handle coupon apply
  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput, subtotal);
    if (res.valid) {
      setCouponDiscount(res.discount);
      setAppliedCouponCode(res.coupon?.code || couponInput.toUpperCase());
      setCouponMessage(res.message);
      showToast('Coupon Applied', res.message, 'success');
    } else {
      setCouponDiscount(0);
      setAppliedCouponCode('');
      setCouponMessage(res.message);
      showToast('Invalid Coupon', res.message, 'error');
    }
  };

  // Process Mock Payment
  const handleConfirmBooking = async () => {
    setIsProcessing(true);

    // Simulate 1.5s bank authorization
    setTimeout(async () => {
      const bookingId = generateBookingId();
      const transactionId = generateTransactionId();

      const qrPayload = JSON.stringify({
        id: bookingId,
        event: selectedEvent.title,
        attendee: fullName,
        tier: currentTier.name,
        seats: quantity,
        venue: selectedEvent.venue,
        date: selectedEvent.date,
        paid: netTotal,
        valid: true,
        hash: `SHA256-${bookingId}-OK`,
      });

      let qrUrl = '';
      try {
        qrUrl = await QRCode.toDataURL(qrPayload, {
          width: 320,
          margin: 1,
          color: {
            dark: '#172033',
            light: '#ffffff',
          },
        });
        setQrCodeDataUrl(qrUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }

      const newBooking: Booking = {
        id: bookingId,
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        eventCategory: selectedEvent.category,
        eventDate: selectedEvent.date,
        eventTime: selectedEvent.time,
        venue: selectedEvent.venue,
        city: selectedEvent.city,
        imageUrl: selectedEvent.imageUrl,
        tierId: currentTier.id,
        tierName: currentTier.name,
        ticketQuantity: quantity,
        ticketPrice: currentTier.price,
        subtotal,
        bookingFee,
        gstAmount,
        discountAmount: couponDiscount,
        couponCodeApplied: appliedCouponCode || undefined,
        totalAmount: netTotal,
        attendee: {
          fullName,
          email,
          phone,
          specialRequests,
        },
        paymentMethod,
        paymentId: transactionId,
        bookingDate: new Date().toISOString(),
        status: 'Confirmed',
        qrPayload,
      };

      createBooking(newBooking);
      setCompletedBooking(newBooking);
      setIsProcessing(false);
      setStep(5);

      // Trigger Celebration Confetti!
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#4F46E5', '#9333EA', '#06B6D4', '#FB7185', '#10B981'],
        });
      } catch {}
    }, 1200);
  };

  const handleCopyRef = () => {
    if (!completedBooking) return;
    navigator.clipboard.writeText(completedBooking.id);
    setIsCopied(true);
    showToast('Copied to Clipboard', `Booking ID ${completedBooking.id} copied.`, 'info');
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Wizard Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shrink-0">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">Guided Ticket Booking</h3>
                <p className="text-xs text-slate-300 truncate max-w-xs sm:max-w-md">
                  {selectedEvent.title}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 5-Step Visual Progress Bar */}
          <div className="pt-4 grid grid-cols-5 gap-1 text-center">
            {[
              { num: 1, label: 'Event' },
              { num: 2, label: 'Tickets' },
              { num: 3, label: 'Details' },
              { num: 4, label: 'Payment' },
              { num: 5, label: 'E-Ticket' },
            ].map(s => {
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <div key={s.num} className="space-y-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-400 to-pink-400'
                        : isPast
                        ? 'bg-emerald-400'
                        : 'bg-white/15'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block ${
                      isActive ? 'text-white' : isPast ? 'text-emerald-300' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* ================= STEP 2: CHOOSE TICKETS ================= */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Step 2: Choose Ticket Tier & Quantity</h4>
                  <p className="text-xs text-slate-500">Pick your preferred seating or pass tier for this experience</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                  {selectedEvent.city}
                </span>
              </div>

              {/* Tiers List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {selectedEvent.tiers.map(tier => {
                  const isSelected = tier.id === currentTier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-500/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wider text-indigo-700">
                          {tier.name}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className="mt-2 text-xl font-black text-slate-900 font-heading">
                        {formatCurrency(tier.price)}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {tier.description}
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                        {tier.availableSeats} tickets available
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quantity Counter */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Ticket Quantity
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatCurrency(currentTier.price)} each • Max 10 per order
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-black text-slate-900 min-w-8 text-center font-heading">
                    {quantity}
                  </span>
                  <button
                    onClick={() => quantity < Math.min(10, currentTier.availableSeats) && setQuantity(quantity + 1)}
                    disabled={quantity >= Math.min(10, currentTier.availableSeats)}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Subtotal Bar */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
                <span className="text-indigo-900 font-medium">
                  Subtotal for {quantity}x {currentTier.name} tickets
                </span>
                <span className="text-base font-extrabold text-indigo-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
          )}

          {/* ================= STEP 3: ATTENDEE DETAILS ================= */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Step 3: Attendee Information</h4>
                <p className="text-xs text-slate-500">
                  Your digital ticket and gate QR code will be linked to this attendee
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Attendee Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (for E-Ticket delivery) *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (SMS Updates) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Requests / Accessibility
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={e => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Wheelchair access, Aisle seating"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  I confirm that the attendee details above match valid government-issued ID for gate verification. I accept the demo booking policy.
                </span>
              </label>
            </div>
          )}

          {/* ================= STEP 4: PAYMENT & CONFIRMATION ================= */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Step 4: Confirm Booking & Payment</h4>
                <p className="text-xs text-slate-500">
                  Review booking summary, apply coupons, and choose mock payment method
                </p>
              </div>

              {/* Order Summary Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{selectedEvent.title}</h5>
                    <p className="text-xs text-slate-500">
                      {formatDate(selectedEvent.date)} • {selectedEvent.time} • {selectedEvent.venue}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold">
                    {currentTier.name} x {quantity}
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Ticket Fare ({quantity}x {formatCurrency(currentTier.price)})</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (5%)</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(bookingFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(gstAmount)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon Discount ({appliedCouponCode})</span>
                      <span>-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Net Amount Payable</span>
                    <span className="text-indigo-600">{formatCurrency(netTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Have a Promo Coupon?</span>
                  <span className="text-slate-400 font-normal">(Try WELCOME100, FESTIVE20, or SUPERVIP)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon Code"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs uppercase font-bold tracking-wider focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-xs font-medium ${couponDiscount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Payment Gateway (Mock Demo Mode)
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'UPI', label: 'UPI (GPay / PhonePe)', icon: <Smartphone className="w-4 h-4" /> },
                    { id: 'Credit/Debit Card', label: 'Card Payment', icon: <CreditCard className="w-4 h-4" /> },
                    { id: 'Net Banking', label: 'Net Banking', icon: <Building2 className="w-4 h-4" /> },
                    { id: 'Digital Wallet', label: 'Wallets', icon: <Wallet className="w-4 h-4" /> },
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-20 ${
                        paymentMethod === method.id
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {method.icon}
                        {paymentMethod === method.id && (
                          <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold leading-tight">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Simulated Input based on payment method */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                  {paymentMethod === 'UPI' && (
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">UPI Virtual Address (VPA)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">Supports Google Pay, PhonePe, Paytm & BHIM UPI</span>
                    </div>
                  )}

                  {paymentMethod === 'Credit/Debit Card' && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          placeholder="4532 0000 0000 0000"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-mono focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={e => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-mono focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Net Banking' && (
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Choose Bank</label>
                      <select className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none cursor-pointer">
                        <option>HDFC Bank (Instant Confirmation)</option>
                        <option>State Bank of India (SBI)</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'Digital Wallet' && (
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Choose Wallet</label>
                      <select className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none cursor-pointer">
                        <option>Paytm Wallet</option>
                        <option>Amazon Pay</option>
                        <option>MobiKwik</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>256-bit TLS Encrypted Demo Checkout • No actual currency will be debited</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: VIEW DIGITAL E-TICKET ================= */}
          {step === 5 && completedBooking && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              
              {/* Success celebration banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Booking Confirmed Successfully!</h5>
                    <p className="text-xs text-emerald-700">
                      Your digital boarding pass and QR code have been created.
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                    {completedBooking.id}
                  </span>
                </div>
              </div>

              {/* The Master Boarding Pass Ticket */}
              <div 
                id="printable-ticket"
                className="relative rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden"
              >
                {/* Header Band */}
                <div className="p-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-indigo-200" />
                      <span className="font-black text-lg tracking-tight font-heading">TicketEase PASS</span>
                    </div>
                    <span className="text-[11px] text-white/80 font-medium">Official Digital Event E-Ticket</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
                      {completedBooking.tierName} PASS
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-400 text-slate-900 text-xs font-extrabold">
                      CONFIRMED
                    </span>
                  </div>
                </div>

                {/* Ticket Details Body */}
                <div className="p-6 space-y-5 bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                        {completedBooking.eventCategory}
                      </span>
                      <h4 className="text-xl font-black text-slate-900 mt-0.5">
                        {completedBooking.eventTitle}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Date</span>
                      <span className="font-bold text-slate-800 text-sm">{formatDate(completedBooking.eventDate)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Time</span>
                      <span className="font-bold text-slate-800 text-sm">{completedBooking.eventTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Venue</span>
                      <span className="font-bold text-slate-800 text-sm truncate block">{completedBooking.venue}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">City</span>
                      <span className="font-bold text-slate-800 text-sm">{completedBooking.city}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Attendee Name</span>
                      <span className="font-bold text-slate-800">{completedBooking.attendee.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Tickets</span>
                      <span className="font-bold text-slate-800">{completedBooking.ticketQuantity} Seat(s)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Total Paid</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(completedBooking.totalAmount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Payment Mode</span>
                      <span className="font-bold text-slate-800">{completedBooking.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Perforation notched tear line */}
                <div className="relative border-b-2 border-dashed border-slate-200 py-1 bg-slate-50/50">
                  <div className="ticket-notch-left" />
                  <div className="ticket-notch-right" />
                </div>

                {/* QR Code and Reference Strip */}
                <div className="p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Booking Reference ID
                    </span>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-xl font-black font-mono text-indigo-700">
                        {completedBooking.id}
                      </span>
                      <button
                        onClick={handleCopyRef}
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
                        title="Copy Reference"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500 block font-mono">
                      Ref: {completedBooking.paymentId}
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium block">
                      *Demo Ticket: Show this QR pass or reference code at venue entrance.
                    </span>
                  </div>

                  <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="Booking QR Code"
                        className="w-28 h-28 object-contain"
                      />
                    ) : (
                      <QrCode className="w-28 h-28 text-slate-800" />
                    )}
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase mt-1">
                      Scan To Verify
                    </span>
                  </div>
                </div>

              </div>

              {/* Functional Actions Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <button
                  onClick={() => downloadTicketAsDocument(completedBooking, qrCodeDataUrl)}
                  className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Pass</span>
                </button>

                <button
                  onClick={printTicket}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Ticket</span>
                </button>

                <button
                  onClick={handleCopyRef}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Copy className="w-4 h-4" />
                  <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsBookingModalOpen(false);
                    setActivePage('my-tickets');
                  }}
                  className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Ticket className="w-4 h-4" />
                  <span>My Tickets →</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Wizard Footer Navigation Actions */}
        {step < 5 && (
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            {step > 2 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
              >
                <span>Continue to Attendee Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                disabled={!fullName.trim() || !email.trim() || !phone.trim() || !agreeTerms}
                onClick={() => setStep(4)}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span>Review & Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmBooking}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Demo Booking...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Pay {formatCurrency(netTotal)}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
