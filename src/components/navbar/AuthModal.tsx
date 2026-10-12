import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_USER, ADMIN_USER } from '../../utils/storage';
import { X, User, Shield, Sparkles, LogIn, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAs } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');

  if (!isAuthModalOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs({
      id: 'usr-' + Math.random().toString(36).substring(2, 7),
      name: name || 'Demo User',
      email: email || 'user@example.com',
      phone: phone || '+91 90000 00000',
      role: 'attendee',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header decoration */}
        <div className="relative p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>TicketEase Account</span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight">
            {tab === 'signin' ? 'Welcome Back!' : 'Join TicketEase'}
          </h3>
          <p className="text-white/80 text-sm mt-1">
            Access your bookings, digital passes, and instant checkout.
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="p-6 pb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
            ⚡ Quick Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => loginAs(DEFAULT_USER)}
              className="p-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100/70 text-left transition-all hover:scale-[1.02] flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-300">
                <User className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="font-semibold text-xs text-indigo-950 truncate group-hover:text-indigo-700">
                  Alex Rivera
                </div>
                <div className="text-[11px] text-indigo-600 font-medium">Attendee</div>
              </div>
            </button>

            <button
              onClick={() => loginAs(ADMIN_USER)}
              className="p-3 rounded-2xl border border-purple-100 bg-purple-50/60 hover:bg-purple-100/70 text-left transition-all hover:scale-[1.02] flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-300">
                <Shield className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="font-semibold text-xs text-purple-950 truncate group-hover:text-purple-700">
                  SuperAdmin
                </div>
                <div className="text-[11px] text-purple-600 font-medium">Manager</div>
              </div>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 flex border-b border-slate-100">
          <button
            onClick={() => setTab('signin')}
            className={`pb-2.5 px-3 text-sm font-semibold transition-colors border-b-2 ${
              tab === 'signin'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`pb-2.5 px-3 text-sm font-semibold transition-colors border-b-2 ${
              tab === 'signup'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Custom form */}
        <form onSubmit={handleCustomSubmit} className="p-6 space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <LogIn className="w-4 h-4" />
            <span>{tab === 'signin' ? 'Sign In & Continue' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <p className="text-center text-[11px] text-slate-400">
            *Demo Authentication: Any email or password will log you in safely.
          </p>
        </form>
      </div>
    </div>
  );
};
