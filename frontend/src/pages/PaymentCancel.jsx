import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancel() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-6">
        
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-500 mx-auto flex items-center justify-center">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="font-extrabold text-2xl text-slate-900 dark:text-slate-100">
            Payment Cancelled
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You cancelled the Stripe payment session. Your reservation is saved, and you can try again anytime.
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/"
            className="w-full py-3.5 rounded-2xl font-extrabold text-sm gradient-btn shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again / Explore Events
          </Link>

          <Link
            to="/dashboard"
            className="w-full py-3 rounded-2xl font-bold text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
