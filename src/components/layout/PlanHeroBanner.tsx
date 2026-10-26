import React from 'react';
import { Sparkles, FolderOpen } from 'lucide-react';

interface PlanHeroBannerProps {
  savedPlansCount: number;
  onOpenSavedModal: () => void;
}

/**
 * Top hero banner displayed on the landing state when no celebration plan is active.
 */
export const PlanHeroBanner: React.FC<PlanHeroBannerProps> = ({
  savedPlansCount,
  onOpenSavedModal,
}) => {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-4 pt-4 sm:pt-8">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-gold/15 border border-rose-gold/30 text-rose-gold text-xs font-semibold tracking-wider uppercase">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Next-Gen Celebration Architecture</span>
      </div>

      <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-indigo-950 dark:text-white leading-[1.15]">
        Plan Unforgettable Weddings, Birthdays & Gatherings.
      </h1>

      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
        Enter your guest count, city, and rupee budget. Celebrate AI formulates an
        exact-to-the-rupee budget breakdown, milestone timelines, vetted vendor questions, bespoke
        menus, and stationery.
      </p>

      {savedPlansCount > 0 && (
        <div className="pt-2">
          <button
            onClick={onOpenSavedModal}
            className="inline-flex items-center gap-1.5 text-xs text-rose-gold hover:underline font-semibold cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
            <span>View your {savedPlansCount} saved celebrations</span>
          </button>
        </div>
      )}
    </div>
  );
};
