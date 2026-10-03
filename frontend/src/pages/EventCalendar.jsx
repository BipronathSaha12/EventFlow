import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../api/axios';
import { Calendar as CalendarIcon, Clock, Bell, Download, MapPin, Ticket, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventCalendar() {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remindersSet, setRemindersSet] = useState({});

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching calendar bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetReminder = (booking) => {
    if (!('Notification' in window)) {
      showToast('Browser notification API is not supported on this device.', 'warning');
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const eventTitle = booking.event?.title || booking.service?.name || 'EventFlow Occasion';
        new Notification(`Reminder Set: ${eventTitle}`, {
          body: `Event scheduled for ${booking.event?.date || booking.date}. We'll remind you before the occasion starts!`,
          icon: '/favicon.svg',
        });
        setRemindersSet((prev) => ({ ...prev, [booking.id]: true }));
        showToast(`Browser reminder set for "${eventTitle}"!`, 'success');
      } else {
        showToast('Please allow browser notifications in settings to receive reminders.', 'warning');
      }
    });
  };

  const handleDownloadICS = async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/calendar-ics/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EventFlow_Calendar_${bookingId}.ics`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Calendar invitation (.ics) file downloaded!', 'info');
    } catch (err) {
      console.error('Download ICS error:', err);
      showToast('Failed to download calendar file.', 'warning');
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <CalendarIcon className="w-16 h-16 text-purple-500 mb-4" />
        <h2 className="font-extrabold text-2xl text-slate-900 dark:text-slate-100">
          Sign In to Manage Your Event Schedule
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          Open your interactive occasion calendar, remember dates, and set browser reminders.
        </p>
        <Link to="/login" className="gradient-btn px-6 py-3 rounded-full text-sm">
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      
      {/* Header */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
          <Sparkles className="w-4 h-4" />
          Interactive Schedule & Reminders
        </div>
        <h1 className="font-extrabold text-3xl text-slate-900 dark:text-white">
          Event Schedule Calendar
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
          Never miss an upcoming occasion! View your event dates, sync to Google Calendar or Apple iCal via `.ics`, and set browser notification alerts.
        </p>
      </div>

      {/* Calendar List */}
      <div className="space-y-4">
        <h2 className="font-bold text-2xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-500" />
          Scheduled Occasions ({bookings.length})
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              No Scheduled Events
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't reserved any occasion tickets yet. Explore upcoming events to populate your calendar.
            </p>
            <Link to="/" className="inline-block gradient-btn px-5 py-2.5 rounded-full text-xs font-bold">
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => {
              const eventObj = booking.event || booking.service || {};
              const title = eventObj.title || eventObj.name || 'Event Ticket';
              const location = eventObj.location || 'Main Hall';
              const date = eventObj.date || booking.date;
              const isReminded = remindersSet[booking.id];

              return (
                <div
                  key={booking.id}
                  className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-purple-400 dark:hover:border-purple-500/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                        {date}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {eventObj.time || '18:00'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                      {title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>
                  </div>

                  {/* Calendar Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    {/* Set Reminder Button */}
                    <button
                      onClick={() => handleSetReminder(booking)}
                      className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        isReminded
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300'
                          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-100'
                      }`}
                    >
                      {isReminded ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                      {isReminded ? 'Reminder Set' : 'Set Reminder'}
                    </button>

                    {/* Download .ics Invitation Button */}
                    <button
                      onClick={() => handleDownloadICS(booking.id)}
                      className="py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
                      title="Sync to Google / iCal / Outlook"
                    >
                      <Download className="w-4 h-4 text-indigo-500" />
                      Sync .ics
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
