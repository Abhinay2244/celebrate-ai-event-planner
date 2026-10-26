import React from 'react';
import { Lightbulb } from 'lucide-react';
import { formatINR } from '../../utils/budget.ts';
import { EventPlan } from '../../types/planner.ts';

interface BudgetCategoryItemProps {
  item: EventPlan['budgetBreakdown'][0];
  index: number;
  color: string;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}

/**
 * Individual category breakdown item card in the Budget tab.
 */
export const BudgetCategoryItem: React.FC<BudgetCategoryItemProps> = ({
  item,
  index,
  color,
  isHovered,
  onHover,
}) => {
  return (
    <div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className={`p-5 rounded-2xl border transition-all duration-200 ${
        isHovered
          ? 'border-rose-gold shadow-md bg-white dark:bg-slate-800 translate-x-1'
          : 'border-subtle glass-panel'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3.5 h-3.5 rounded-lg shrink-0 shadow-xs"
            style={{ backgroundColor: color }}
          />
          <h4 className="font-semibold text-gray-900 dark:text-white text-base">{item.category}</h4>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono font-bold text-base text-gray-900 dark:text-white">
            {formatINR(item.amount)}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-gold/15 text-rose-gold">
            {item.percentage}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${item.percentage}%`, backgroundColor: color }}
        />
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300">{item.description}</p>

      {item.tips && (
        <div className="mt-2.5 pt-2 border-t border-subtle/50 flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-300/90 bg-amber-500/5 p-2 rounded-lg">
          <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
          <span>{item.tips}</span>
        </div>
      )}
    </div>
  );
};
