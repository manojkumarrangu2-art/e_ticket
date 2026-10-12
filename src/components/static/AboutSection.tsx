import React from 'react';
import { ShieldCheck, Zap, Sparkles, QrCode, Heart, Globe, Award, Lock } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider inline-block">
          About TicketEase
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading">
          Redefining How India Experiences <span className="gradient-text">Live Events</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          TicketEase is a next-generation Electronic Ticketing platform built for music concerts, stadium sports, film premieres, college fests, and intercity travel. Our mission is to make event booking effortless, transparent, and counterfeit-proof.
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
            title: '100% Genuine Passes',
            desc: 'Every ticket is backed by cryptographic verification tokens, eliminating counterfeit passes and unauthorized resale scalping.',
          },
          {
            icon: <Zap className="w-6 h-6 text-purple-600" />,
            title: 'Instant QR Issuance',
            desc: 'Zero lag. Receive your interactive digital boarding pass immediately after checkout with one-click PDF downloading and printing.',
          },
          {
            icon: <Lock className="w-6 h-6 text-pink-600" />,
            title: 'Bank-Grade Security',
            desc: 'End-to-end encrypted checkout supporting UPI, Rupay, Visa, Mastercard, and top net-banking gateways.',
          },
          {
            icon: <Heart className="w-6 h-6 text-emerald-600" />,
            title: 'Attendee First',
            desc: 'Transparent pricing with no hidden surprises, fair seat allocations, and hassle-free cancellation policies.',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Tech Stack Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white relative overflow-hidden space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Engineered For Scale & Aesthetics
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading">
            Modern Full-Stack Architecture
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Built using React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, client-side PDF document generation, and dynamic QR Code generation.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {[
            { label: 'Frontend', val: 'React 19 + TypeScript' },
            { label: 'Styling', val: 'Tailwind CSS v4' },
            { label: 'Icons', val: 'Lucide Icons' },
            { label: 'QR & Passes', val: 'Dynamic Vector Engine' },
          ].map((tech, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{tech.label}</span>
              <span className="text-xs font-bold text-white mt-1 block">{tech.val}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
