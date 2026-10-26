import React, { useState, Suspense } from 'react';
import { IndianRupee, ShieldCheck, Users } from 'lucide-react';
import { EventPlan } from '../../types/planner.ts';
import { formatINR, calculatePerGuest, validateBudgetSum } from '../../utils/budget.ts';
import { ACCENT_PALETTE } from '../../constants/index.ts';
import { BudgetCategoryItem } from '../budget/BudgetCategoryItem.tsx';

// Lazy-load the recharts component on demand with dynamic import
const BudgetPieChart = React.lazy(() => import('../charts/BudgetPieChart.tsx'));

export interface BudgetTabProps {
  plan: EventPlan;
}

const PALETTE = ACCENT_PALETTE;

/**
 * Financial Architecture and Budget Math tab.
 * Visualizes allocation proportions with an interactive donut chart and granular category cards.
 */
export const BudgetTab: React.FC<BudgetTabProps> = ({ plan }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const perGuest = calculatePerGuest(plan.totalBudgetCalculated, plan.input.guestCount);
  const validation = validateBudgetSum(plan.budgetBreakdown, plan.totalBudgetCalculated);

  const chartData = plan.budgetBreakdown.map((item, index) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
    color: PALETTE[index % PALETTE.length],
    description: item.description,
    tips: item.tips,
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner with Total and Validation status */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-subtle">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold">
            Financial Architecture
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
            Total Event Budget: {formatINR(plan.totalBudgetCalculated)}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-rose-gold" />
            <span>
              Per Guest Allocation: <strong>{formatINR(perGuest)}</strong> ({plan.input.guestCount}{' '}
              Guests)
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
              validation.isValid
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{validation.isValid ? 'Math Balanced (100%)' : 'Adjusted Allocation'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recharts Donut Chart (Lazy loaded) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl shadow-sm border border-subtle flex flex-col items-center">
          <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white mb-2 self-start">
            Capital Distribution
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 self-start">
            Hover over segments to inspect category allocations.
          </p>

          <div className="w-full h-[320px] relative flex items-center justify-center">
            <Suspense
              fallback={
                <div className="w-48 h-48 rounded-full border-4 border-dashed border-subtle animate-spin flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-rose-gold" />
                </div>
              }
            >
              <BudgetPieChart data={chartData} activeIndex={activeIndex} onHover={setActiveIndex} />
            </Suspense>
          </div>
        </div>

        {/* Right: Detailed Category Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
              Category Details & Advice
            </h3>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {plan.budgetBreakdown.length} core allocations
            </span>
          </div>

          <div className="space-y-3">
            {plan.budgetBreakdown.map((item, idx) => (
              <BudgetCategoryItem
                key={idx}
                item={item}
                index={idx}
                color={PALETTE[idx % PALETTE.length]}
                isHovered={activeIndex === idx}
                onHover={setActiveIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
