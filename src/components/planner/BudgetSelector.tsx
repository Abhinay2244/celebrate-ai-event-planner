import React from 'react';
import { IndianRupee } from 'lucide-react';
import { formatINR } from '../../utils/budget';
import { BUDGET_PRESETS, PLANNER_CONSTRAINTS } from '../../constants/index.ts';

interface BudgetSelectorProps {
  totalBudget: number;
  onChangeBudget: (val: number) => void;
  error?: string;
}

/**
 * Interactive budget selector with numerical input and quick allocation preset chips.
 */
export const BudgetSelector: React.FC<BudgetSelectorProps> = ({
  totalBudget,
  onChangeBudget,
  error,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-amber-500/5 border border-rose-gold/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <label
          htmlFor="event-budget"
          className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5"
        >
          <IndianRupee className="w-4 h-4 text-rose-gold" />
          Total Budget in INR (₹) <span className="text-rose-gold">*</span>
        </label>
        <span className="text-base sm:text-lg font-serif font-bold text-rose-gold">
          {formatINR(totalBudget)}{' '}
          <span className="text-xs font-sans text-gray-600 dark:text-gray-400 font-normal">
            ({formatINR(totalBudget, true)})
          </span>
        </span>
      </div>

      <div className="relative">
        <input
          id="event-budget"
          type="number"
          min={PLANNER_CONSTRAINTS.MIN_BUDGET_INR}
          max={PLANNER_CONSTRAINTS.MAX_BUDGET_INR}
          step={10000}
          aria-invalid={!!error}
          aria-describedby={error ? 'event-budget-error' : undefined}
          value={totalBudget}
          onChange={(e) =>
            onChangeBudget(
              Math.max(
                PLANNER_CONSTRAINTS.MIN_BUDGET_INR,
                parseInt(e.target.value) || PLANNER_CONSTRAINTS.MIN_BUDGET_INR
              )
            )
          }
          className="w-full px-4 py-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-3 items-center">
        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
          Quick allocations:
        </span>
        {BUDGET_PRESETS.map((preset) => (
          <button
            type="button"
            key={preset.value}
            onClick={() => onChangeBudget(preset.value)}
            className="text-xs px-3 py-2 min-h-[44px] flex items-center rounded-lg bg-black/5 dark:bg-white/10 text-gray-800 dark:text-gray-100 font-medium hover:text-rose-gold hover:border-rose-gold border border-transparent transition-colors cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>
      {error && (
        <p id="event-budget-error" role="alert" className="text-xs text-red-500 mt-2">
          {error}
        </p>
      )}
    </div>
  );
};
