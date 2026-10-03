import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 dark:bg-slate-950 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Ticket className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-xl text-slate-900 dark:text-white">EventFlow</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A professional platform for booking and managing event tickets securely.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Product</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Explore Events</Link></li>
              <li><Link to="/calendar" className="hover:text-indigo-600 dark:hover:text-indigo-400">Calendar</Link></li>
              <li><Link to="/verify" className="hover:text-indigo-600 dark:hover:text-indigo-400">Verify Ticket</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Company</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-indigo-600 dark:hover:text-indigo-400">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} EventFlow Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Twitter</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
