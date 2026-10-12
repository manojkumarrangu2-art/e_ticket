import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, Send, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, setSelectedCategory, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Subscribed to TicketEase VIP!', `Exclusive early access alerts will be sent to ${newsletterEmail}`, 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
                  <Ticket className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight font-heading">
                Ticket<span className="text-indigo-400">Ease</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              India’s next-generation electronic ticket booking platform. Instant QR passes, live seat tier selections, tamper-proof entries, and effortless event experiences.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Get Early-Bird Concert Alerts
              </span>
              <div className="flex max-w-sm gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-indigo-400 transition-colors">
                  Home Landing
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('events')} className="hover:text-indigo-400 transition-colors">
                  Explore All Events
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('my-tickets')} className="hover:text-indigo-400 transition-colors">
                  My Booked Tickets
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin')} className="hover:text-purple-400 transition-colors">
                  Admin Management
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('about')} className="hover:text-indigo-400 transition-colors">
                  About the Platform
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-indigo-400 transition-colors">
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => { setSelectedCategory('Music Concerts'); setActivePage('events'); }} className="hover:text-indigo-400 transition-colors">
                  🎵 Music Concerts
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('Movies'); setActivePage('events'); }} className="hover:text-indigo-400 transition-colors">
                  🎬 IMAX Movies
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('Sports'); setActivePage('events'); }} className="hover:text-indigo-400 transition-colors">
                  ⚽ Cricket & Sports
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('Technology Conferences'); setActivePage('events'); }} className="hover:text-indigo-400 transition-colors">
                  💻 Tech & AI Summits
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('Train Travel'); setActivePage('events'); }} className="hover:text-indigo-400 transition-colors">
                  🚆 Vande Bharat Express
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('Bus Travel'); setActivePage('events'); }} className="hover:text-indigo-400 transition-colors">
                  🚌 Luxury SmartBuses
                </button>
              </li>
            </ul>
          </div>

          {/* Trust Badges & Payments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Security & Payment
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>256-Bit SSL Secured</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Supports UPI, Credit/Debit Cards, Net Banking, and Instant QR passes.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">UPI</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">RuPay</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">Visa</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">Mastercard</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer and Copyright */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1 text-center sm:text-left">
            <span>© 2026 TicketEase Technologies Inc. Crafted for smooth experiences.</span>
          </div>

          <div className="text-[11px] text-slate-500 text-center sm:text-right">
            <span>*Demonstration E-Ticketing System — all bookings, passes, and payments are mock simulated.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
