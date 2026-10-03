import React from 'react';

export default function CategoryPills({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
          activeCategory === 'all'
            ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
        }`}
      >
        All Events
      </button>

      {categories.map((cat) => {
        const isSelected = activeCategory === cat.slug;
        return (
          <button
            key={cat.id || cat.slug}
            onClick={() => onSelectCategory(cat.slug)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border flex items-center gap-2 ${
              isSelected
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
            }`}
          >
            {cat.name}
            {cat.events_count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isSelected ? 'bg-white/20 dark:bg-black/10' : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                {cat.events_count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
