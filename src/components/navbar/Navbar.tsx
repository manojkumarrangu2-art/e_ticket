import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Ticket, 
  Compass, 
  CalendarCheck, 
  ShieldCheck, 
  QrCode, 
  Menu, 
  X, 
  User, 
  Sparkles,
  Info,
  PhoneCall,
  RotateCcw
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    bookings, 
    currentUser, 
    switchUserRole, 
    setIsAuthModalOpen,
    setIsQRScannerModalOpen,
    resetAllDemoData
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeBookingsCount = bookings.filter(b => b.status === 'Confirmed').length;

  const handleNav = (page: any) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all group-hover:scale-105">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
                <Ticket className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-heading">
                  Ticket<span className="text-indigo-600">Ease</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md">
                  PRO
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 -mt-1 tracking-wider uppercase hidden sm:block">
                Smart E-Ticketing
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activePage === 'home'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('events')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activePage === 'events'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-500" />
              <span>Explore Events</span>
            </button>

            <button
              onClick={() => handleNav('my-tickets')}
              className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activePage === 'my-tickets'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-purple-500" />
              <span>My Tickets</span>
              {activeBookingsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-purple-600 text-white shadow-sm">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('admin')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activePage === 'admin'
                  ? 'bg-purple-100 text-purple-800 shadow-sm'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activePage === 'about'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activePage === 'contact'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Gate Scanner tool */}
            <button
              onClick={() => setIsQRScannerModalOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold"
              title="Open Gate Pass QR Validator"
            >
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span>Verify Pass</span>
            </button>

            {/* Role switch toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs">
              <button
                onClick={() => switchUserRole('attendee')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  currentUser.role === 'attendee'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Attendee
              </button>
              <button
                onClick={() => switchUserRole('admin')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  currentUser.role === 'admin'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Profile Avatar / Login */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all"
            >
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="text-left text-xs leading-none">
                <span className="font-semibold text-slate-800 block truncate max-w-[90px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">
                  {currentUser.role}
                </span>
              </div>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsQRScannerModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-indigo-600"
              title="Verify Ticket"
            >
              <QrCode className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => switchUserRole('attendee')}
              className={`p-2 rounded-xl text-xs font-semibold text-center ${
                currentUser.role === 'attendee'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              Attendee View
            </button>
            <button
              onClick={() => switchUserRole('admin')}
              className={`p-2 rounded-xl text-xs font-semibold text-center ${
                currentUser.role === 'admin'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              Admin Dashboard
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleNav('home')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold ${
                activePage === 'home' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNav('events')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold ${
                activePage === 'events' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-500" />
                Explore Events
              </span>
            </button>

            <button
              onClick={() => handleNav('my-tickets')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold ${
                activePage === 'my-tickets' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-purple-500" />
                My Tickets
              </span>
              {activeBookingsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-600 text-white">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('admin')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold ${
                activePage === 'admin' ? 'bg-purple-100 text-purple-800' : 'text-slate-700 hover:bg-purple-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Admin Dashboard
              </span>
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold ${
                activePage === 'about' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                About TicketEase
              </span>
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold ${
                activePage === 'contact' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-slate-400" />
                Contact & Support
              </span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600"
            >
              <User className="w-4 h-4" />
              <span>{currentUser.name} ({currentUser.role})</span>
            </button>

            <button
              onClick={() => {
                resetAllDemoData();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
