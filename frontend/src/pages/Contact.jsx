import React from 'react';
import { Mail, Send, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Have a question or need support? Send us a message and we'll get back to you shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Get in touch</h2>
          <div className="flex items-start gap-4 text-slate-600 dark:text-slate-400">
            <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Email Support</h3>
              <p>bipronathsaha@gmail.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4 text-slate-600 dark:text-slate-400">
            <Phone className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-4 text-slate-600 dark:text-slate-400">
            <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Office</h3>
              <p>123 Innovation Drive<br/>Tech District, San Francisco<br/>CA 94105</p>
            </div>
          </div>
        </div>

        {/* Contact Form using FormSubmit */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <form action="https://formsubmit.co/bipronathsaha@gmail.com" method="POST" className="space-y-6">
            {/* Honeypot / Config */}
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value="http://localhost:5173/" />
            <input type="hidden" name="_subject" value="New Contact Form Submission from EventFlow!" />

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input type="text" name="name" id="name" required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input type="email" name="email" id="email" required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea name="message" id="message" rows="4" required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"></textarea>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
