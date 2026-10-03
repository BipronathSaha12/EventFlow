import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useNotifications } from '../context/NotificationContext';
import { CheckCircle2, Download, Ticket, QrCode, ArrowRight, Loader2 } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const { showToast, fetchNotifications } = useNotifications();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      confirmPayment();
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  const confirmPayment = async () => {
    try {
      const res = await api.post(`/bookings/${bookingId}/confirm-payment/`);
      setBooking(res.data);
      showToast('Payment verified successfully! Your ticket is confirmed.', 'success');
      fetchNotifications();
    } catch (err) {
      console.error('Payment confirmation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!bookingId) return;
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-200">
          Verifying Payment with Stripe...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-emerald-200 dark:border-emerald-900/60 text-center space-y-6 animate-in zoom-in-95 duration-200">
        
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-500 mx-auto flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Payment Confirmed
          </span>
          <h1 className="font-extrabold text-3xl text-slate-900 dark:text-slate-100">
            You're Going to the Event!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Your Stripe payment has been completed. Your QR pass and PDF ticket are ready.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleDownloadPDF}
            className="w-full py-3.5 rounded-2xl font-extrabold text-sm gradient-btn shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
          >
            <Download className="w-5 h-5" />
            Download Official PDF Ticket
          </button>

          <Link
            to="/dashboard"
            className="w-full py-3 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Ticket className="w-4 h-4 text-indigo-500" />
            Go to My Tickets Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
