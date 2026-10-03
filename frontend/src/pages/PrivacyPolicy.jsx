import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">1. Information We Collect</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          We collect information you provide directly to us when creating an account, booking an event, or communicating with us. This includes your name, email address, and payment information (processed securely via Stripe).
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">2. How We Use Your Information</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          We use the information we collect to provide, maintain, and improve our services, process transactions, send technical notices, and communicate with you about products, services, and events.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">3. Data Security</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          We implement industry-standard security measures to protect your personal information. Your payment details are never stored on our servers and are encrypted by Stripe.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">4. Contact Us</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          If you have any questions about this Privacy Policy, please visit our Contact page.
        </p>
      </div>
    </div>
  );
}
