import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Ticket, 
  UserCheck, 
  CreditCard, 
  QrCode, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const GuidedProcessSection: React.FC = () => {
  const { setActivePage } = useApp();

  const steps = [
    {
      num: '01',
      title: 'Select Event',
      desc: 'Discover live concerts, sports tournaments, movies, or intercity travel trips.',
      icon: <Search className="w-6 h-6 text-indigo-600" />,
      tag: 'Explore',
    },
    {
      num: '02',
      title: 'Choose Tickets',
      desc: 'Pick Standard, Premium, or VIP tiers with live seating availability and transparent pricing.',
      icon: <Ticket className="w-6 h-6 text-purple-600" />,
      tag: 'Customize',
    },
    {
      num: '03',
      title: 'Enter Details',
      desc: 'Provide attendee names and contact details for official gate verification.',
      icon: <UserCheck className="w-6 h-6 text-pink-600" />,
      tag: 'Personalize',
    },
    {
      num: '04',
      title: 'Confirm Booking',
      desc: 'Apply promo coupon codes and complete rapid mock checkout with UPI or Cards.',
      icon: <CreditCard className="w-6 h-6 text-cyan-600" />,
      tag: 'Secure Pay',
    },
    {
      num: '05',
      title: 'View E-Ticket',
      desc: 'Instantly download, print, or scan your verified digital pass with unique QR token.',
      icon: <QrCode className="w-6 h-6 text-emerald-600" />,
      tag: 'Boarding Pass',
    },
  ];

  return (
    <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Frictionless 5-Step Experience</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-heading">
            How TicketEase <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Anyone can book an official ticket in under 60 seconds with our guided smart workflow.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-400/50 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black font-mono text-white/20 group-hover:text-indigo-400 transition-colors">
                    {step.num}
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                  Step {idx + 1} • {step.tag}
                </span>

                <h3 className="text-base font-bold text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center text-[11px] font-semibold text-indigo-300">
                <span>Try Demo Booking</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => setActivePage('events')}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 inline-flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Book Your First Experience Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
