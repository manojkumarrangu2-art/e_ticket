import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/navbar/Navbar';
import { AuthModal } from './components/navbar/AuthModal';
import { HeroSection } from './components/hero/HeroSection';
import { StatsSection } from './components/hero/StatsSection';
import { CategoryShowcase } from './components/home/CategoryShowcase';
import { GuidedProcessSection } from './components/home/GuidedProcessSection';
import { ExploreEventsView } from './components/events/ExploreEventsView';
import { EventCard } from './components/events/EventCard';
import { EventDetailModal } from './components/events/EventDetailModal';
import { BookingFlowModal } from './components/booking/BookingFlowModal';
import { DigitalTicketModal } from './components/ticket/DigitalTicketModal';
import { QRValidatorModal } from './components/ticket/QRValidatorModal';
import { MyTicketsView } from './components/dashboard/MyTicketsView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AboutSection } from './components/static/AboutSection';
import { ContactSection } from './components/static/ContactSection';
import { FaqSection } from './components/static/FaqSection';
import { Footer } from './components/footer/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activePage, setActivePage, events } = useApp();

  const featuredEvents = events.filter(e => e.featured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Notifications and Modals */}
      <ToastContainer />
      <Navbar />
      <AuthModal />
      <EventDetailModal />
      <BookingFlowModal />
      <DigitalTicketModal />
      <QRValidatorModal />

      {/* Main Pages Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <div className="space-y-12">
            <HeroSection />
            <StatsSection />

            {/* Featured & Trending Events Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Trending Right Now</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
                    Featured <span className="gradient-text">Live Experiences</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-1 max-w-xl">
                    Hand-picked concerts, stadium sports, and VIP passes selling fast across India.
                  </p>
                </div>

                <button
                  onClick={() => setActivePage('events')}
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
                >
                  <span>Explore All {events.length} Events</span>
                  <ArrowRight className="w-4 h-4 text-indigo-600" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>

            <CategoryShowcase />
            <GuidedProcessSection />
            <FaqSection />
          </div>
        )}

        {activePage === 'events' && <ExploreEventsView />}

        {activePage === 'my-tickets' && <MyTicketsView />}

        {activePage === 'admin' && <AdminDashboardView />}

        {activePage === 'about' && (
          <>
            <AboutSection />
            <FaqSection />
          </>
        )}

        {activePage === 'contact' && <ContactSection />}
      </main>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
