import React from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';

export default function EventCard({ event, onBook }) {
  const [imgError, setImgError] = React.useState(false);
  const imageUrl = imgError ? 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80' : (event.image || event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80');
  const isSoldOut = event.available_tickets <= 0;

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800">
        <img
          src={imageUrl}
          alt=""
          onError={() => setImgError(true)}
          className="w-full h-full object-cover text-[0px]"
          loading="lazy"
        />
        {event.category && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded shadow-sm backdrop-blur-sm">
            {event.category.name}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-snug">
            {event.title}
          </h3>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            ${Number(event.price).toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
          {event.description}
        </p>

        <div className="space-y-2 mb-5">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{event.date} • {event.time || '18:00'}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <button
          onClick={() => onBook(event)}
          disabled={isSoldOut}
          className={`w-full py-2.5 px-4 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            isSoldOut
              ? 'bg-slate-100 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-400'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
          }`}
        >
          <Ticket className="w-4 h-4" />
          {isSoldOut ? 'Sold Out' : 'Reserve Ticket'}
        </button>
      </div>
    </div>
  );
}
