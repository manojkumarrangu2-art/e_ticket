import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, SlidersHorizontal, RotateCcw, ArrowUpDown, DollarSign } from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: '🌟 All Events' },
  { id: 'Music Concerts', label: '🎵 Music Concerts' },
  { id: 'Movies', label: '🎬 Movies' },
  { id: 'Sports', label: '⚽ Sports' },
  { id: 'College Events', label: '🎓 College Events' },
  { id: 'Cultural Programs', label: '🎭 Cultural Programs' },
  { id: 'Technology Conferences', label: '💻 Tech Conferences' },
  { id: 'Bus Travel', label: '🚌 Bus Travel' },
  { id: 'Train Travel', label: '🚆 Train Travel' },
];

interface EventFiltersProps {
  priceFilter: string;
  setPriceFilter: (val: string) => void;
  filteredCount: number;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  priceFilter,
  setPriceFilter,
  filteredCount,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCity,
    setSelectedCity,
    sortBy,
    setSortBy,
  } = useApp();

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setPriceFilter('all');
    setSortBy('popular');
  };

  return (
    <div className="space-y-6">
      
      {/* Category Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Keyword Search */}
          <div className="relative flex items-center px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, artist, venue..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* City / Venue Dropdown */}
          <div className="relative flex items-center px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <MapPin className="w-4 h-4 text-pink-500 shrink-0 mr-2.5" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Cities (Across India)</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Chennai">Chennai</option>
              <option value="Varanasi">Varanasi</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="relative flex items-center px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <DollarSign className="w-4 h-4 text-emerald-500 shrink-0 mr-2.5" />
            <select
              value={priceFilter}
              onChange={e => setPriceFilter(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Any Ticket Price</option>
              <option value="under-1000">Under ₹1,000</option>
              <option value="1000-2500">₹1,000 - ₹2,500</option>
              <option value="above-2500">Above ₹2,500</option>
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="relative flex items-center px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <ArrowUpDown className="w-4 h-4 text-indigo-500 shrink-0 mr-2.5" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="date">Date (Earliest First)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Filter Summary & Reset Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredCount}</strong> experiences matching your criteria
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 font-semibold text-slate-500 hover:text-indigo-600 transition-colors p-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

      </div>

    </div>
  );
};
