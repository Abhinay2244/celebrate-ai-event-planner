import React from 'react';
import { IndianRupee, Clock, CheckCircle2 } from 'lucide-react';
import { EventPlan } from '../../types/planner';
import { TabId } from '../../hooks/useEventPlan';
import { formatINR } from '../../utils/budget';

interface SnapshotCardsProps {
  plan: EventPlan;
  perGuest: number;
  completedVendors: number;
  totalVendors: number;
  onNavigateTab: (tabId: TabId) => void;
}

/**
 * Three diagnostic summary cards: Budget Strategy, Timeline Milestones, and Vendor Readiness.
 */
export const SnapshotCards: React.FC<SnapshotCardsProps> = ({
  plan,
  perGuest,
  completedVendors,
  totalVendors,
  onNavigateTab,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Budget Card */}
      <div className="glass-panel p-6 rounded-3xl shadow-sm space-y-4 hover:border-rose-gold/40 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
          <button
            onClick={() => onNavigateTab('budget')}
            className="text-xs font-semibold text-rose-gold hover:underline cursor-pointer"
          >
            Full Breakdown →
          </button>
        </div>

        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            Per-Guest Allocation
          </span>
          <h4 className="text-2xl font-bold font-serif text-gray-900 dark:text-white mt-0.5">
            {formatINR(perGuest)}
            <span className="text-xs font-normal text-gray-600 dark:text-gray-400 ml-1">
              / person
            </span>
          </h4>
        </div>

        <div className="border-t border-subtle/40 pt-3 space-y-2">
          <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
            <span>Primary Category:</span>
            <span className="font-semibold">
              {plan.budgetBreakdown[0]?.category || 'Catering & Venue'}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
            <span>Allocated Share:</span>
            <span className="font-semibold">{plan.budgetBreakdown[0]?.percentage || 0}%</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 pt-1 line-clamp-2">
            {plan.budgetBreakdown[0]?.tips ||
              'Optimized vendor contracts prevent unforeseen last-minute fees.'}
          </p>
        </div>
      </div>

      {/* 2. Timeline Card */}
      <div className="glass-panel p-6 rounded-3xl shadow-sm space-y-4 hover:border-rose-gold/40 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-gold flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <button
            onClick={() => onNavigateTab('timeline')}
            className="text-xs font-semibold text-rose-gold hover:underline cursor-pointer"
          >
            Full Trail →
          </button>
        </div>

        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            Strategic Roadmap
          </span>
          <h4 className="text-2xl font-bold font-serif text-gray-900 dark:text-white mt-0.5">
            {plan.timeline.length} Key Phases
          </h4>
        </div>

        <div className="border-t border-subtle/40 pt-3 space-y-2 text-xs">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            Next Milestone: {plan.timeline[0]?.title || 'Early Planning'}
          </p>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
            {plan.timeline[0]?.tasks?.[0] || 'Confirm key celebration dates and guestlist roster.'}
          </p>
          <div className="pt-1 flex items-center gap-1.5 text-rose-gold font-medium">
            <span>{plan.timeline[0]?.timeframe}</span>
          </div>
        </div>
      </div>

      {/* 3. Vendors Card */}
      <div className="glass-panel p-6 rounded-3xl shadow-sm space-y-4 hover:border-rose-gold/40 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <button
            onClick={() => onNavigateTab('vendors')}
            className="text-xs font-semibold text-rose-gold hover:underline cursor-pointer"
          >
            Review Team →
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Contract Readiness:
            </span>
            <span className="text-base font-semibold text-gray-900 dark:text-white">
              {completedVendors} / {totalVendors} Locked
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalVendors ? (completedVendors / totalVendors) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 pt-1">
            Includes savvy questions to ask & market negotiation tips.
          </p>
        </div>
      </div>
    </div>
  );
};
