import React from 'react';
import { useApp } from '../../context/AppContext';
import { EventCategory } from '../../types';
import { 
  Music, 
  Film, 
  Trophy, 
  GraduationCap, 
  Palette, 
  Cpu, 
  Bus, 
  Train, 
  ArrowRight 
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Music Concerts' as EventCategory,
    icon: <Music className="w-6 h-6" />,
    gradient: 'from-purple-600 to-indigo-600',
    description: 'Symphonies, stadium tours, EDM arenas & live acoustic sets',
    count: '340+ Shows',
  },
  {
    name: 'Movies' as EventCategory,
    icon: <Film className="w-6 h-6" />,
    gradient: 'from-rose-500 to-pink-600',
    description: 'IMAX 3D lasers, blockbusters, premieres & film festivals',
    count: '520+ Screens',
  },
  {
    name: 'Sports' as EventCategory,
    icon: <Trophy className="w-6 h-6" />,
    gradient: 'from-emerald-500 to-teal-600',
    description: 'T20 Cricket, IPL, Kabaddi leagues & football derbies',
    count: '110+ Matches',
  },
  {
    name: 'College Events' as EventCategory,
    icon: <GraduationCap className="w-6 h-6" />,
    gradient: 'from-amber-500 to-orange-600',
    description: 'Mood Indigo, BITS Waves, celebrity pro-nights & campus battles',
    count: '95+ Fests',
  },
  {
    name: 'Cultural Programs' as EventCategory,
    icon: <Palette className="w-6 h-6" />,
    gradient: 'from-orange-500 to-rose-500',
    description: 'Ganga Aarti ceremonies, classical kathak, sitar & folk galas',
    count: '140+ Programs',
  },
  {
    name: 'Technology Conferences' as EventCategory,
    icon: <Cpu className="w-6 h-6" />,
    gradient: 'from-blue-600 to-cyan-600',
    description: 'AI summits, developer devcons, cloud conventions & startup arenas',
    count: '80+ Summits',
  },
  {
    name: 'Bus Travel' as EventCategory,
    icon: <Bus className="w-6 h-6" />,
    gradient: 'from-indigo-600 to-blue-600',
    description: 'Volvo AC multi-axle sleeper buses with live GPS tracking',
    count: '1,200+ Routes',
  },
  {
    name: 'Train Travel' as EventCategory,
    icon: <Train className="w-6 h-6" />,
    gradient: 'from-teal-600 to-emerald-700',
    description: 'Vande Bharat Express, Tejas luxury chair cars & fast trains',
    count: '450+ Trains',
  },
];

export const CategoryShowcase: React.FC = () => {
  const { setSelectedCategory, setActivePage } = useApp();

  const handleSelect = (cat: EventCategory) => {
    setSelectedCategory(cat);
    setActivePage('events');
    const el = document.getElementById('explore-events-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider inline-block">
          All-In-One Entertainment & Travel Hub
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Browse by <span className="gradient-text">Experience Category</span>
        </h2>
        <p className="text-slate-500 text-sm">
          Whether you want a pulsating music festival, stadium cricket cheering, or a scenic high-speed train voyage, TicketEase has you covered.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CATEGORIES.map((cat, i) => (
          <div
            key={i}
            onClick={() => handleSelect(cat.name)}
            className="group relative p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div>
              <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${cat.gradient} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>

              <div className="text-xs font-bold text-indigo-600 mb-1">{cat.count}</div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-indigo-600">
              <span>View Tickets</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
