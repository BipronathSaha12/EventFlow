import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CategoryPills from '../components/CategoryPills';
import EventCard from '../components/EventCard';
import BookingModal from '../components/BookingModal';
import { Search, Sparkles, ShieldCheck, Ticket, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 36; // About 3 pages for 100+ events

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setCurrentPage(1); // reset to first page on filter change
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/events/', { params });
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const paginatedEvents = events.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      
      {/* Clean Professional Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Discover & Book Great Events
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
          A seamless platform for securing tickets to world-class conferences, concerts, and workshops. Reliable, fast, and secure.
        </p>

        {/* Minimal Search Bar */}
        <div className="max-w-2xl mx-auto flex items-center border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all shadow-sm">
          <div className="pl-4 pr-3">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, keyword, or venue..."
            className="w-full py-3 pr-4 text-sm text-slate-900 dark:text-white bg-transparent outline-none placeholder-slate-400"
          />
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Header & Filter */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming Schedule</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Showing {events.length} total events</p>
          </div>
          <CategoryPills
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <p className="text-slate-500 dark:text-slate-400">No events found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onBook={setSelectedEventForBooking}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

      </section>

      {/* Checkout Modal */}
      {selectedEventForBooking && (
        <BookingModal
          event={selectedEventForBooking}
          onClose={() => setSelectedEventForBooking(null)}
        />
      )}

    </div>
  );
}
