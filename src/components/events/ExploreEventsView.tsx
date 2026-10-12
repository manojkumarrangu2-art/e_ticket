import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EventFilters } from './EventFilters';
import { EventCard } from './EventCard';
import { Compass, Sparkles, Frown, RotateCcw } from 'lucide-react';

export const ExploreEventsView: React.FC = () => {
  const {
    events,
    searchQuery,
    selectedCategory,
    selectedCity,
    sortBy,
    setSearchQuery,
    setSelectedCategory,
    setSelectedCity,
  } = useApp();

  const [priceFilter, setPriceFilter] = useState<string>('all');

  // Filter and sort computation
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Category filter
      if (selectedCategory !== 'All' && event.category !== selectedCategory) {
        return false;
      }

      // City filter
      if (selectedCity !== 'All' && event.city !== selectedCity) {
        return false;
      }

      // Keyword search (title, description, venue, tags)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = event.title.toLowerCase().includes(query);
        const matchDesc = event.description.toLowerCase().includes(query);
        const matchVenue = event.venue.toLowerCase().includes(query);
        const matchTags = event.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchVenue && !matchTags) {
          return false;
        }
      }

      // Price filter
      if (priceFilter === 'under-1000' && event.startingPrice >= 1000) return false;
      if (priceFilter === '1000-2500' && (event.startingPrice < 1000 || event.startingPrice > 2500)) return false;
      if (priceFilter === 'above-2500' && event.startingPrice <= 2500) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'price-low') {
        return a.startingPrice - b.startingPrice;
      }
      if (sortBy === 'price-high') {
        return b.startingPrice - a.startingPrice;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 'popular' default
      return b.reviewCount - a.reviewCount;
    });
  }, [events, searchQuery, selectedCategory, selectedCity, priceFilter, sortBy]);

  return (
    <div id="explore-events-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover Top Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore All <span className="gradient-text">Live Events</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Book official tickets for music festivals, IMAX cinema, sports clashes, college galas, and luxury high-speed transit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{filteredEvents.length} Events Available</span>
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <EventFilters
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        filteredCount={filteredEvents.length}
      />

      {/* Event Grid or Empty State */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <Frown className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No events found</h3>
          <p className="text-sm text-slate-500">
            We couldn't find any events matching your selected filters. Try searching for a different city, keyword, or clear your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedCity('All');
              setPriceFilter('all');
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All Filters</span>
          </button>
        </div>
      )}

    </div>
  );
};
