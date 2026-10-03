import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../api/axios';
import { 
  Ticket, 
  Download, 
  QrCode, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQRBooking, setSelectedQRBooking] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/ticket/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EventFlow_Ticket_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('PDF Ticket downloaded successfully!', 'success');
    } catch (err) {
      console.error('Download ticket error:', err);
      showToast('Please complete payment before downloading the ticket.', 'warning');
    }
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
      showToast('Calendar invitation (.ics) downloaded!', 'info');
    } catch (err) {
      console.error('Download ICS error:', err);
    }
  };

  const handlePayNow = async (booking) => {
    try {
      const sessionRes = await api.post(`/bookings/${booking.id}/create-checkout-session/`, {
        frontend_url: window.location.origin,
      });
      if (sessionRes.data.url) {
        window.location.href = sessionRes.data.url;
      }
    } catch (err) {
      console.error('Payment retry error:', err);
      showToast('Unable to launch checkout session.', 'warning');
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <Ticket className="w-16 h-16 text-indigo-500 mb-4" />
        <h2 className="font-extrabold text-2xl text-slate-900 dark:text-slate-100">
          Sign In to Access Your Dashboard
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          View your purchased occasion tickets, scan QR codes, check payment status, and re-download lost tickets.
        </p>
        <Link to="/login" className="gradient-btn px-6 py-3 rounded-full text-sm">
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            Authenticated User Portal
          </div>
          <h1 className="font-extrabold text-3xl text-slate-900 dark:text-white">
            Welcome back, {user.first_name || user.username}!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your event reservations, scan QR codes, check payment statuses, and re-download missing tickets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/calendar"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Calendar className="w-4 h-4 text-purple-500" />
            Open Calendar
          </Link>
          <Link
            to="/verify"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl gradient-btn text-white font-bold text-xs shadow-md"
          >
            <QrCode className="w-4 h-4" />
            Verify QR Ticket
          </Link>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-indigo-500" />
            My Purchased Occasion Tickets
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            Total Bookings: {bookings.length}
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Ticket className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              No Tickets Purchased Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore upcoming events and purchase your occasion tickets to view QR passes here.
            </p>
            <Link to="/" className="inline-block gradient-btn px-5 py-2.5 rounded-full text-xs font-bold">
              Explore Events Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const eventObj = booking.event || booking.service || {};
              const title = eventObj.title || eventObj.name || 'Event Ticket';
              const location = eventObj.location || 'Main Hall';
              const date = eventObj.date || booking.date;

              return (
                <div
                  key={booking.id}
                  className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm hover:shadow-lg"
                >
                  
                  {/* Left Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                          booking.paid
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {booking.paid ? 'PAID & CONFIRMED' : 'PAYMENT PENDING'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        UUID: {booking.ticket_uuid ? booking.ticket_uuid.substring(0, 8) : `#${booking.id}`}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                      {title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        {date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-indigo-500" />
                        Qty: {booking.quantity || 1}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        Total: ${Number(booking.total_price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions & QR Preview */}
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    
                    {booking.paid ? (
                      <>
                        {/* View QR Button */}
                        <button
                          onClick={() => setSelectedQRBooking(booking)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                          Show QR Code
                        </button>

                        {/* Re-download PDF Ticket Button */}
                        <button
                          onClick={() => handleDownloadTicket(booking.id)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl gradient-btn text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                          title="Re-download lost ticket PDF anytime"
                        >
                          <Download className="w-4 h-4" />
                          Re-Download PDF Ticket
                        </button>

                        {/* Download .ics Calendar File */}
                        <button
                          onClick={() => handleDownloadICS(booking.id)}
                          className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Download Calendar (.ics) Invitation"
                        >
                          <Calendar className="w-4 h-4 text-purple-500" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handlePayNow(booking)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md transition-all"
                      >
                        <CreditCard className="w-4 h-4" />
                        Complete Stripe Payment
                      </button>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Modal View */}
      {selectedQRBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 text-center relative space-y-4">
            
            <button
              onClick={() => setSelectedQRBooking(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
              Official QR Entry Ticket
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scan this QR code at the event entrance or scan using the camera tool to verify payment status.
            </p>

            {/* QR Image */}
            <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-200 inline-block mx-auto">
              <img
                src={selectedQRBooking.qr_code || `http://localhost:8000/media/qr_codes/ticket_qr_${selectedQRBooking.ticket_uuid?.substring(0,8)}.png`}
                alt="Ticket QR Code"
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('http://localhost:5173/verify-ticket/' + selectedQRBooking.ticket_uuid)}`;
                }}
              />
            </div>

            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 py-2 rounded-xl">
              UUID: {selectedQRBooking.ticket_uuid}
            </div>

            <button
              onClick={() => {
                const bId = selectedQRBooking.id;
                setSelectedQRBooking(null);
                handleDownloadTicket(bId);
              }}
              className="w-full gradient-btn py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              Download Official PDF Ticket
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
