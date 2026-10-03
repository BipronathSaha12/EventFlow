import React from 'react';

export default function Careers() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Careers at EventFlow</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Help us build the future of event management and ticketing. We're a fast-growing team looking for passionate engineers and designers.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No open positions right now!</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          We aren't actively hiring at this exact moment, but we are always on the lookout for incredible talent. If you think you'd be a great fit for EventFlow, we'd love to hear from you.
        </p>
        <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
          Get in touch
        </a>
      </div>
    </div>
  );
}
