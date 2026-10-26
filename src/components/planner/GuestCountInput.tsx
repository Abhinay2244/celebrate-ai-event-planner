import React from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { PLANNER_CONSTRAINTS } from '../../constants';

interface GuestCountInputProps {
  guestCount: number;
  setGuestCount: (val: number) => void;
  error?: string;
}

const GUEST_PRESETS = [50, 100, 200, 350, 600, 1000] as const;

/**
 * Guest Count input field with preset quick-selection buttons.
 */
export const GuestCountInput: React.FC<GuestCountInputProps> = ({
  guestCount,
  setGuestCount,
  error,
}) => {
  return (
    <div>
      <label
        htmlFor="event-guests"
        className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
      >
        Guest Count <span className="text-rose-gold">*</span>
      </label>
      <div className="relative">
        <input
          id="event-guests"
          type="number"
          min={PLANNER_CONSTRAINTS.MIN_GUEST_COUNT}
          max={PLANNER_CONSTRAINTS.MAX_GUEST_COUNT}
          required
          value={guestCount}
          onChange={(e) =>
            setGuestCount(
              Math.max(
                PLANNER_CONSTRAINTS.MIN_GUEST_COUNT,
                parseInt(e.target.value) || PLANNER_CONSTRAINTS.MIN_GUEST_COUNT
              )
            )
          }
          className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white text-sm"
        />
        <Users className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
      </div>
      <div className="flex gap-2 mt-2.5 flex-wrap">
        {GUEST_PRESETS.map((num) => (
          <button
            type="button"
            key={num}
            onClick={() => setGuestCount(num)}
            className="text-xs px-2.5 py-1.5 min-h-[36px] rounded-lg bg-black/5 dark:bg-white/10 text-gray-800 dark:text-gray-100 font-medium hover:text-rose-gold hover:border-rose-gold border border-transparent transition-colors cursor-pointer"
          >
            {num}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
