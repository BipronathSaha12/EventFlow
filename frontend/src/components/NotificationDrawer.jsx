import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCheck, X, CreditCard, Calendar, Ticket, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationDrawer() {
  const { notifications, unreadCount, isOpen, setIsOpen, markAsRead, markAllAsRead } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case 'reminder':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'ticket':
        return <Ticket className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  Notifications
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark Read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="font-semibold text-slate-600 dark:text-slate-300">
                  No notifications yet
                </p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  You'll receive alerts when you purchase tickets, receive payment confirmations, or set reminders.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    n.is_read
                      ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-80'
                      : 'bg-white dark:bg-slate-800/90 border-indigo-200 dark:border-indigo-900/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex-shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {n.title}
                        </h4>
                        {!n.is_read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{new Date(n.created_at).toLocaleString()}</span>
                        {n.type === 'ticket' && (
                          <Link
                            to="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            View Ticket →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Go to Ticket Dashboard →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
