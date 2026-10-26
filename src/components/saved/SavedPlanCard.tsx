import React from 'react';
import { ArrowRight, Trash2, AlertTriangle, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { EventPlan } from '../../types/planner';
import { formatINR } from '../../utils/budget';

interface SavedPlanCardProps {
  plan: EventPlan;
  isActive: boolean;
  isConfirmingDelete: boolean;
  onSelect: () => void;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

/**
 * Single card row in the saved celebration blueprints modal.
 * Displays title, parameters, active indicator, and inline delete confirmation.
 */
export const SavedPlanCard: React.FC<SavedPlanCardProps> = ({
  plan,
  isActive,
  isConfirmingDelete,
  onSelect,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}) => {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isActive
          ? 'border-rose-gold bg-rose-gold/10 dark:bg-rose-gold/15 shadow-sm'
          : 'border-subtle hover:border-gray-300 dark:hover:border-slate-700 bg-white/50 dark:bg-slate-800/50'
      }`}
    >
      <div onClick={onSelect} className="cursor-pointer space-y-1.5 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200">
            {plan.input.eventType}
          </span>
          {isActive && (
            <span className="text-[10px] font-bold text-rose-gold px-2 py-0.5 rounded bg-rose-gold/20">
              Active Plan
            </span>
          )}
        </div>
        <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">
          {plan.summary.title}
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-gold" /> {plan.input.city}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-rose-gold" /> {plan.input.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-rose-gold" />{' '}
            {formatINR(plan.totalBudgetCalculated)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {!isConfirmingDelete && (
          <button
            onClick={onSelect}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950 text-white dark:bg-slate-700 hover:opacity-90 flex items-center gap-1 cursor-pointer"
          >
            <span>Load</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}

        {/* Inline Delete Confirmation */}
        {isConfirmingDelete ? (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-red-500/10 border border-red-500/30 text-xs animate-fadeIn">
            <span className="text-[11px] font-medium text-red-600 dark:text-red-400 pl-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Delete?
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onConfirmDelete();
              }}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] shadow-xs transition-colors cursor-pointer"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCancelDelete();
              }}
              className="px-2 py-1 rounded-lg bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 text-[11px] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete();
            }}
            aria-label={`Delete ${plan.summary.title}`}
            title="Delete celebration plan"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-gold cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
