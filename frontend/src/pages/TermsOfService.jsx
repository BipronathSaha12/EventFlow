import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Terms of Service</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">1. Acceptance of Terms</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          By accessing and using EventFlow, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">2. Ticket Purchases</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          All ticket sales are final unless otherwise specified by the event organizer. QR codes generated for tickets must be presented at the venue for verification. We are not responsible for lost or stolen QR codes, though they can be re-downloaded from your dashboard.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">3. User Conduct</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          You agree to use our service for lawful purposes only and not to engage in any activity that could damage, disable, or impair our platform's functionality.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">4. Limitation of Liability</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          EventFlow operates as a ticketing platform. We are not liable for any event cancellations, changes, or incidents that occur at the physical venues.
        </p>
      </div>
    </div>
  );
}
