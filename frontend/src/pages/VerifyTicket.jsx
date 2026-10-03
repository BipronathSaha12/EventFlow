import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { QrCode, Search, CheckCircle2, XCircle, Download, ShieldCheck, User, Calendar, MapPin, Ticket, Loader2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function VerifyTicket() {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const initialQuery = code || searchParams.get('id') || '';

  const { showToast } = useNotifications();
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      handleVerify(initialQuery);
    }
  }, [initialQuery]);

  const handleVerify = async (queryToSearch) => {
    const q = queryToSearch || inputQuery;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.get(`/tickets/verify/${encodeURIComponent(q.trim())}/`);
      setResult(res.data);
    } catch (err) {
      console.error('Ticket verification error:', err);
      setError(err.response?.data?.message || 'Invalid or unrecognized QR ticket code.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicketPDF = async (bookingId) => {
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
      showToast('Ticket PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Please complete payment before downloading.', 'warning');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-4 h-4" />
          <span>Authenticity & Verification Tool</span>
        </div>
        <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Scan & Verify Ticket QR Code
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Scan your QR code or paste your ticket UUID to inspect payment status and re-download missing PDF passes.
        </p>
      </div>

      {/* Input Search Form */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <QrCode className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Paste Ticket UUID or Booking ID (e.g. 5ca79e4b-...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Verify Ticket
          </button>
        </form>
      </div>

      {/* Error Output */}
      {error && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center space-y-2">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="font-bold text-lg text-rose-700 dark:text-rose-300">
            Verification Failed
          </h3>
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        </div>
      )}

      {/* Verification Result Card */}
      {result && result.is_valid && (
        <div className="p-8 rounded-3xl glass-panel border border-emerald-200 dark:border-emerald-900/60 shadow-2xl space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Authentic Ticket Verified
                </span>
                <h2 className="font-extrabold text-2xl text-slate-900 dark:text-slate-100">
                  {result.event_title}
                </h2>
              </div>
            </div>

            <span
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                result.paid
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-amber-100 text-amber-700 border border-amber-300'
              }`}
            >
              {result.paid ? 'Payment Confirmed' : 'Payment Pending'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                Attendee Name
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {result.attendee_name} ({result.attendee_email})
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                Occasion Date
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {result.event_date}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Venue Location
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {result.event_location}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-amber-500" />
                Ticket Quantity & Amount
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {result.quantity} Ticket(s) - ${Number(result.total_price).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Re-download missing ticket action */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Missed your ticket download? Re-download your official PDF ticket instantly using this verified QR session.
            </p>

            <button
              onClick={() => handleDownloadTicketPDF(result.booking_id)}
              disabled={!result.paid}
              className={`px-6 py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                result.paid
                  ? 'gradient-btn shadow-lg'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Download className="w-4 h-4" />
              Re-Download PDF Ticket
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
