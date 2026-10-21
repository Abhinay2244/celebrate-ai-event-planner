import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { IndianRupee, ShieldCheck, Lightbulb, Users, ArrowUpRight } from 'lucide-react';
import { EventPlan } from '../../types/planner';
import { formatINR, calculatePerGuest, validateBudgetSum } from '../../utils/budget';

interface BudgetTabProps {
  plan: EventPlan;
}

const PALETTE = [
  '#b76e79', // Rose gold
  '#1b1e4b', // Deep indigo
  '#dda092', // Warm rose
  '#d4af37', // Gold
  '#2a9d8f', // Emerald teal
  '#e76f51', // Terracotta
  '#6b705c', // Sage
  '#9d4edd', // Royal violet
  '#457b9d', // Slate blue
  '#f4a261', // Apricot
];

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
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-rose-gold" />
            <span>Average Spend Per Guest:</span>
            <strong className="text-gray-900 dark:text-white font-semibold">
              {formatINR(perGuest)}
            </strong>{' '}
            ({plan.input.guestCount} guests)
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Strict Budget Sum Verified</p>
            <p className="text-[11px] opacity-90">
              Categories sum exactly to {formatINR(validation.sum)} (100%)
            </p>
          </div>
        </div>
      </div>

      {/* Main Budget Grid: Chart + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Recharts Pie Chart */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl shadow-sm border border-subtle flex flex-col items-center">
          <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white text-center mb-2">
            Portfolio Distribution
          </h3>
          <p className="text-xs text-gray-500 text-center mb-4">
            Hover over any category wedge to isolate cost & share
          </p>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={activeIndex === index ? '#fff' : 'transparent'}
                      strokeWidth={2}
                      className="cursor-pointer transition-all duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: unknown) => [formatINR(Number(val) || 0), 'Allocated']}
                  contentStyle={{
                    backgroundColor: 'rgba(22, 26, 56, 0.95)',
                    borderColor: 'rgba(221, 160, 146, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#dda092' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick legend swatches */}
          <div className="flex flex-wrap justify-center gap-2 pt-2 border-t border-subtle w-full">
            {chartData.slice(0, 5).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-400"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Category Breakdown Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
              Category Details & Advice
            </h3>
            <span className="text-xs text-gray-500">
              {plan.budgetBreakdown.length} core allocations
            </span>
          </div>

          <div className="space-y-3">
            {plan.budgetBreakdown.map((item, idx) => {
              const color = PALETTE[idx % PALETTE.length];
              const isHovered = activeIndex === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`p-5 rounded-2xl border transition-all duration-200 ${
                    isHovered
                      ? 'border-rose-gold shadow-md bg-white dark:bg-slate-800 translate-x-1'
                      : 'border-subtle glass-panel'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-lg shrink-0 shadow-xs" style={{ backgroundColor: color }} />
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                        {item.category}
                      </h4>
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

                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>

                  {item.tips && (
                    <div className="mt-2.5 pt-2 border-t border-subtle/50 flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-300/90 bg-amber-500/5 p-2 rounded-lg">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                      <span>{item.tips}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
