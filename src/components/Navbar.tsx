import React from 'react';
import { Sparkles, Moon, Sun, BookmarkCheck, PlusCircle } from 'lucide-react';
import { EventPlan } from '../types/planner';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  savedPlans: EventPlan[];
  activePlan: EventPlan | null;
  onSelectPlan: (plan: EventPlan) => void;
  onNewPlan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  savedPlans,
  activePlan,
  onSelectPlan,
  onNewPlan,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-subtle glass-panel backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rosegold-gradient flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-indigo-950 dark:text-white">
                Celebrate <span className="text-rose-gold">AI</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-rose-gold border border-rose-gold/40 px-1.5 py-0.5 rounded">
                GenAI Planner
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:block">
              Weddings • Birthdays • Community Events
            </p>
          </div>
        </div>

        {/* Center / Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Saved Plans selector */}
          {savedPlans.length > 0 && (
            <div className="relative">
              <select
                aria-label="Select saved celebration plan"
                value={activePlan?.id || ''}
                onChange={(e) => {
                  const target = savedPlans.find((p) => p.id === e.target.value);
                  if (target) onSelectPlan(target);
                }}
                className="text-xs sm:text-sm bg-white/70 dark:bg-slate-800/80 border border-subtle text-gray-700 dark:text-gray-200 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-rose-gold cursor-pointer"
              >
                {savedPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.summary.title || `${plan.input.eventType} in ${plan.input.city}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* New Plan Button */}
          <button
            onClick={onNewPlan}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl bg-indigo-950 text-white hover:bg-indigo-900 dark:bg-rose-gold dark:text-white dark:hover:opacity-95 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-gold"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden md:inline">New Celebration</span>
            <span className="md:hidden">New</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-gold"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-indigo-900" />}
          </button>
        </div>
      </div>
    </header>
  );
};
