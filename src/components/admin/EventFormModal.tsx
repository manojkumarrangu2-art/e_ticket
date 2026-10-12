import React, { useState, useEffect } from 'react';
import { EventItem, EventCategory, TicketTier } from '../../types';
import { X, Sparkles, Plus, Trash2, Check } from 'lucide-react';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: EventItem) => void;
  eventToEdit?: EventItem | null;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  eventToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Music Concerts');
  const [date, setDate] = useState('2026-11-30');
  const [time, setTime] = useState('07:00 PM');
  const [venue, setVenue] = useState('Jio World Convention Centre, BKC');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [startingPrice, setStartingPrice] = useState(999);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [organizer, setOrganizer] = useState('TicketEase Entertainment');
  const [tagsStr, setTagsStr] = useState('Live, Weekend, Entertainment');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setCategory(eventToEdit.category);
      setDate(eventToEdit.date);
      setTime(eventToEdit.time);
      setVenue(eventToEdit.venue);
      setCity(eventToEdit.city);
      setState(eventToEdit.state);
      setStartingPrice(eventToEdit.startingPrice);
      setImageUrl(eventToEdit.imageUrl);
      setDescription(eventToEdit.description);
      setLongDescription(eventToEdit.longDescription);
      setOrganizer(eventToEdit.organizer);
      setTagsStr(eventToEdit.tags.join(', '));
    } else {
      setTitle('');
      setDescription('');
      setLongDescription('');
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsStr.split(',').map(s => s.trim()).filter(Boolean);

    const defaultTiers: TicketTier[] = [
      {
        id: `tier-st-${Date.now()}`,
        name: 'Standard',
        price: Number(startingPrice),
        description: 'General entry with standard seating views.',
        perks: ['General Admission', 'Food Court Access'],
        totalSeats: 1000,
        availableSeats: 850,
      },
      {
        id: `tier-pr-${Date.now()}`,
        name: 'Premium',
        price: Math.round(Number(startingPrice) * 1.8),
        description: 'Elevated view with priority fast-track gate.',
        perks: ['Fast Track Entry', 'Elevated Viewing Lounge', 'Complimentary Drink'],
        totalSeats: 400,
        availableSeats: 320,
      },
      {
        id: `tier-vip-${Date.now()}`,
        name: 'VIP',
        price: Math.round(Number(startingPrice) * 3.5),
        description: 'All-inclusive VIP hospitality pass with front row access.',
        perks: ['Front Row Access', 'VIP Hospitality Lounge', 'Complimentary Buffet', 'Exclusive Merch'],
        totalSeats: 100,
        availableSeats: 80,
      },
    ];

    const newEvent: EventItem = {
      id: eventToEdit ? eventToEdit.id : `evt-custom-${Date.now()}`,
      title: title || 'Untitled Event',
      category,
      date,
      time,
      venue,
      city,
      state,
      startingPrice: Number(startingPrice),
      imageUrl,
      description: description || 'Exciting live experience powered by TicketEase.',
      longDescription: longDescription || description || 'Full event experience with verified digital passes.',
      organizer: organizer || 'TicketEase Global',
      status: 'Available',
      rating: 4.8,
      reviewCount: 120,
      tags: tags.length ? tags : ['Live Event'],
      tiers: eventToEdit ? eventToEdit.tiers : defaultTiers,
    };

    onSave(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-300" />
            <h3 className="font-bold text-base font-heading">
              {eventToEdit ? 'Edit Event Details' : 'Create New Live Event'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Coldplay Music of the Spheres Tour 2026"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as EventCategory)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
              >
                <option value="Music Concerts">Music Concerts</option>
                <option value="Movies">Movies</option>
                <option value="Sports">Sports</option>
                <option value="College Events">College Events</option>
                <option value="Cultural Programs">Cultural Programs</option>
                <option value="Technology Conferences">Technology Conferences</option>
                <option value="Bus Travel">Bus Travel</option>
                <option value="Train Travel">Train Travel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Starting Price (₹) *</label>
              <input
                type="number"
                min="0"
                value={startingPrice}
                onChange={e => setStartingPrice(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Event Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Event Time *</label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 07:30 PM"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Venue Name *</label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="e.g. DY Patil Stadium"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Bengaluru"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Short Summary</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief 1-sentence teaser"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Description</label>
            <textarea
              rows={3}
              value={longDescription}
              onChange={e => setLongDescription(e.target.value)}
              placeholder="Detailed schedule, artist notes, venue highlights..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organizer Name</label>
              <input
                type="text"
                value={organizer}
                onChange={e => setOrganizer(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsStr}
                onChange={e => setTagsStr(e.target.value)}
                placeholder="Concert, Rock, Live"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{eventToEdit ? 'Update Event' : 'Create & Publish'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
