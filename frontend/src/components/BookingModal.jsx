import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../api/axios';
import { X, Ticket, Calendar, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingModal({ event, onClose }) {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!event) return null;

  const unitPrice = Number(event.price) || 0;
  const totalPrice = unitPrice * quantity;

  const handleProceedToCheckout = async () => {
    if (!user) {
      showToast('Please sign in to purchase event tickets.', 'warning');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create Booking in backend
      const bookingRes = await api.post('/bookings/', {
        event_id: event.id,
        date: event.date,
        quantity: quantity,
      });

      const bookingId = bookingRes.data.id;

      // 2. Create Stripe Checkout Session
      const sessionRes = await api.post(`/bookings/${bookingId}/create-checkout-session/`, {
        frontend_url: window.location.origin,
      });

      if (sessionRes.data.url) {
        // Redirect user to Stripe secure Checkout
        window.location.href = sessionRes.data.url;
      } else {
        setError('Failed to initialize Stripe checkout session.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Booking checkout error:', err);
      setError(err.response?.data?.error || err.message || 'Error initializing payment checkout.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 block">
              Ticket Reservation
            </span>
            <h2 className="font-bold text-xl text-slate-900 dark:text-white line-clamp-1">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-sm">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                Event Date & Time
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {event.date} at {event.time || '18:00'}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Venue Location
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                {event.location}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-indigo-500" />
                Single Ticket Price
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                ${unitPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Ticket Quantity Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Ticket Quantity
            </label>
            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors"
              >
                -
              </button>
              <span className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(event.available_tickets || 10, q + 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Total Calculation */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Total Payable Amount</p>
              <p className="font-extrabold text-2xl text-slate-900 dark:text-slate-100">
                ${totalPrice.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <span>Stripe 256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleProceedToCheckout}
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Pay ${totalPrice.toFixed(2)} with Stripe
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
