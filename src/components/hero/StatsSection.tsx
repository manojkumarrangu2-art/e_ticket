import React from 'react';
import { Calendar, Ticket, Users, Building2, Sparkles, TrendingUp } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: <Calendar className="w-6 h-6 text-indigo-600" />,
      value: '2,500+',
      label: 'Live Events Curated',
      detail: 'Concerts, Sports & Travel',
      bg: 'bg-indigo-50 border-indigo-100',
    },
    {
      icon: <Ticket className="w-6 h-6 text-purple-600" />,
      value: '850,000+',
      label: 'Tickets Booked',
      detail: 'Instant QR generation',
      bg: 'bg-purple-50 border-purple-100',
    },
    {
      icon: <Users className="w-6 h-6 text-pink-600" />,
      value: '99.8%',
      label: 'Happy Attendees',
      detail: 'Top rated experiences',
      bg: 'bg-pink-50 border-pink-100',
    },
    {
      icon: <Building2 className="w-6 h-6 text-cyan-600" />,
      value: '50+ Cities',
      label: 'Across India',
      detail: 'Pan-India venue network',
      bg: 'bg-cyan-50 border-cyan-100',
    },
  ];

  return (
    <section className="relative z-10 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Scale & Real-Time Impact</h3>
              <p className="text-xs text-slate-500">Live analytics overview across all booking categories</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Demonstration Metrics</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${stat.bg} transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex flex-col justify-between`}
            >
              <div className="w-11 h-11 rounded-xl bg-white shadow-xs flex items-center justify-center mb-3">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {stat.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
