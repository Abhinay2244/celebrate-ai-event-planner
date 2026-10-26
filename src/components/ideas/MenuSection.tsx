import React from 'react';
import { Utensils, Wine, GlassWater } from 'lucide-react';
import { EventPlan } from '../../types/planner';

interface MenuSectionProps {
  menu: NonNullable<EventPlan['personalizedIdeas']>['menu'];
}

/**
 * Catering courses, cuisine style, and signature beverages section.
 */
export const MenuSection: React.FC<MenuSectionProps> = ({ menu }) => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm border border-subtle space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-rose-gold/15 text-rose-gold">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold">
            Gastronomy & Beverage Pairings
          </span>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
            Catering Blueprint ({menu.cuisineStyle})
          </h2>
        </div>
      </div>

      {/* Signature courses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {menu.signatureCourses.map((course, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-subtle space-y-2.5"
          >
            <h3 className="font-serif font-bold text-sm text-indigo-950 dark:text-white border-b border-subtle pb-1.5 flex items-center gap-1.5">
              <Wine className="w-3.5 h-3.5 text-rose-gold" />
              <span>{course.course}</span>
            </h3>
            <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
              {course.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-1.5">
                  <span className="text-rose-gold">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Beverages */}
      {menu.beverages && menu.beverages.length > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-950 text-white space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-gold flex items-center gap-1.5">
            <GlassWater className="w-3.5 h-3.5" /> Signature Mocktails & Spirits:
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {menu.beverages.map((bev, bIdx) => (
              <span
                key={bIdx}
                className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20 text-gray-200"
              >
                {bev}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
