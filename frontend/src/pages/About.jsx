import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">About EventFlow</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Redefining how you discover, book, and experience events globally.
        </p>
      </div>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            At EventFlow, we believe that attending your favorite events should be a seamless, secure, and purely joyful experience. We bridge the gap between event organizers and attendees by providing an incredibly robust platform that handles everything from ticket inventory to secure Stripe payments, completely eliminating friction.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Why We Built This</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The event ticketing industry is filled with outdated software, hidden fees, and confusing user interfaces. EventFlow was engineered from the ground up by senior developers to be different. We leverage modern web technologies to ensure lightning-fast bookings and provide verified QR codes, so you never have to worry about ticket fraud again.
          </p>
        </div>
      </div>
    </div>
  );
}
