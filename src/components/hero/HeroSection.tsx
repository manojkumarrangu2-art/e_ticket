import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  QrCode, 
  Flame, 
  Star,
  CheckCircle2,
  Ticket
} from 'lucide-react';

const CATEGORY_CHIPS = [
  { label: '🎵 Music', cat: 'Music Concerts' },
  { label: '🎬 Movies', cat: 'Movies' },
  { label: '⚽ Sports', cat: 'Sports' },
  { label: '🎓 College', cat: 'College Events' },
  { label: '🎭 Cultural', cat: 'Cultural Programs' },
  { label: '💻 Tech Conf', cat: 'Technology Conferences' },
  { label: '🚌 Bus Travel', cat: 'Bus Travel' },
  { label: '🚆 Train Travel', cat: 'Train Travel' },
];

export const HeroSection: React.FC = () => {
  const { 
    setActivePage, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    selectedCity,
    setSelectedCity,
    events,
    openEventDetail
  } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePage('events');
    const targetElement = document.getElementById('explore-events-anchor');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sampleFeatured = events[0]; // Arijit Singh

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 gradient-mesh">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/25 to-pink-500/15 rounded-full blur-3xl pointer-events-none animate-glow" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-indigo-200/60 shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 tracking-wide">
                Next-Gen E-Ticketing System 2026
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Your Next Experience{' '}
              <span className="gradient-text">Starts Here!</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
              Discover events, book tickets instantly, and keep every memorable experience in one place. Instant QR passes, zero waiting.
            </p>

            {/* Search Bar Widget */}
            <form 
              onSubmit={handleSearchSubmit}
              className="p-3 sm:p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl shadow-indigo-500/5 space-y-3 sm:space-y-0"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Event Name */}
                <div className="relative flex items-center px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                  <Search className="w-4 h-4 text-indigo-500 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Event, artist, movie..."
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative flex items-center px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                  <Ticket className="w-4 h-4 text-purple-500 shrink-0 mr-2.5" />
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Music Concerts">Music Concerts</option>
                    <option value="Movies">Movies</option>
                    <option value="Sports">Sports</option>
                    <option value="College Events">College Events</option>
                    <option value="Cultural Programs">Cultural Programs</option>
                    <option value="Technology Conferences">Tech Conferences</option>
                    <option value="Bus Travel">Bus Travel</option>
                    <option value="Train Travel">Train Travel</option>
                  </select>
                </div>

                {/* City Dropdown */}
                <div className="relative flex items-center px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                  <MapPin className="w-4 h-4 text-pink-500 shrink-0 mr-2.5" />
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Cities</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Varanasi">Varanasi</option>
                  </select>
                </div>

              </div>

              {/* Submit CTA */}
              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Instant E-Ticket
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    Verified QR Pass
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Category Quick Chips */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Trending Categories
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {CATEGORY_CHIPS.map(chip => (
                  <button
                    key={chip.cat}
                    onClick={() => {
                      setSelectedCategory(chip.cat);
                      setActivePage('events');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedCategory === chip.cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/70 hover:border-indigo-300'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: High-Impact 3D/Floating Digital Pass Visual */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Glowing Backdrop behind ticket */}
            <div className="absolute w-72 h-96 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 rounded-3xl blur-2xl pointer-events-none animate-glow" />

            {/* Main Interactive Ticket Pass Card */}
            <div 
              onClick={() => sampleFeatured && openEventDetail(sampleFeatured)}
              className="relative w-full max-w-sm rounded-3xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl shadow-indigo-900/10 overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300 animate-float"
            >
              {/* Event Cover Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={sampleFeatured?.imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'}
                  alt="Featured Live Concert"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold backdrop-blur-md shadow-sm flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    SELLING FAST
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/40 text-white text-[11px] font-semibold backdrop-blur-md border border-white/20">
                    VIP PASS
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                    Featured Event
                  </span>
                  <h4 className="font-bold text-lg leading-tight truncate">
                    {sampleFeatured?.title || 'Arijit Singh Symphony Live 2026'}
                  </h4>
                </div>
              </div>

              {/* Perforation notches */}
              <div className="relative border-b-2 border-dashed border-slate-200 py-1">
                <div className="ticket-notch-left" />
                <div className="ticket-notch-right" />
              </div>

              {/* Ticket Body */}
              <div className="p-5 space-y-4 bg-gradient-to-b from-white to-slate-50/50">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Date & Time</span>
                    <span className="font-bold text-slate-800">Nov 20, 2026 • 6:30 PM</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Venue</span>
                    <span className="font-bold text-slate-800 truncate block">DY Patil Stadium, Mumbai</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      ₹
                    </div>
                    <div>
                      <span className="text-[11px] text-indigo-600 font-semibold block">Starts From</span>
                      <span className="text-base font-extrabold text-indigo-950">₹1,499</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>4.9 (1.4k)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                      <QrCode className="w-7 h-7 text-indigo-700" />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold text-slate-800 block">DEMO PASS VERIFIED</span>
                      <span className="text-slate-400 font-mono">TE-2026-X892M</span>
                    </div>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 group-hover:bg-indigo-700 transition-colors">
                    Book Now →
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Floating Accent Badges */}
            <div className="absolute -top-4 -left-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl shadow-black/5 flex items-center gap-2.5 animate-float-delayed hidden sm:flex">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Instant QR Pass</span>
                <span className="text-emerald-600 font-medium">Ready in 2 seconds</span>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl shadow-black/5 flex items-center gap-2.5 animate-float hidden sm:flex">
              <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Official Partners</span>
                <span className="text-purple-600 font-medium">100% Genuine Tickets</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
