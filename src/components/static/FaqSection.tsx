import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I access and display my booked E-Ticket at the venue?',
    a: 'Immediately upon completing your booking, a digital boarding pass is generated with a unique QR code. You can also view, download, or print it anytime under "My Tickets" in your account dashboard. Simply display the pass on your smartphone screen at the venue gate for instant scanning.',
  },
  {
    q: 'Can I cancel my ticket and receive a refund?',
    a: 'Yes, you can cancel any confirmed ticket directly from the "View Ticket" pass modal or the "My Tickets" dashboard. In demo mode, your reserved seats are instantly restored to the inventory pool and marked as cancelled.',
  },
  {
    q: 'What payment methods are supported on TicketEase?',
    a: 'TicketEase supports all leading Indian payment instruments including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit & Debit Cards (Visa, Mastercard, RuPay), Net Banking (HDFC, ICICI, SBI, Axis), and Digital Wallets. All transactions in this demo application are simulated for risk-free demonstration.',
  },
  {
    q: 'Are promo coupons available for discounts?',
    a: 'Yes! You can use test coupons like WELCOME100 (₹100 flat off), FESTIVE20 (20% off up to ₹500), or SUPERVIP (₹300 off VIP passes) during checkout in Step 4.',
  },
  {
    q: 'How does the Gate QR Scanner work for event managers?',
    a: 'Event staff and venue managers can click the "Verify Pass" tool in the top navigation bar to scan or test-validate any booking code (e.g. TE-2026-X892M) and mark the ticket as checked-in in real-time.',
  },
  {
    q: 'Can I test the platform as an Administrator?',
    a: 'Absolutely! Click the "Admin" link in the top bar or use the role switcher in the header to toggle to "SuperAdmin". You will be able to create new events, edit or delete events, view analytics charts, and manage the full bookings registry.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
          Got Questions? We’ve Got <span className="gradient-text">Answers</span>
        </h2>
        <p className="text-slate-500 text-sm">
          Everything you need to know about booking, QR boarding passes, and platform features.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};
