import React from 'react';
import {
  LayoutDashboard,
  PieChart as PieChartIcon,
  Calendar,
  CheckSquare,
  Lightbulb,
  Mail,
  LucideIcon,
} from 'lucide-react';
import { TabId } from '../../hooks/useEventPlan';

interface TabItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

export const TABS: readonly TabItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'budget', label: 'Budget Math', icon: PieChartIcon },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'vendors', label: 'Vendor Sourcing', icon: CheckSquare },
  { id: 'ideas', label: 'Ideas & Menu', icon: Lightbulb },
  { id: 'invitation', label: 'Invitations', icon: Mail },
] as const;

interface TabBarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

/**
 * Accessible tab navigation list with keyboard and screen reader support.
 */
export const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelectTab }) => {
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = -1;
    if (e.key === 'ArrowRight') {
      targetIndex = (index + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      targetIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      targetIndex = 0;
    } else if (e.key === 'End') {
      targetIndex = TABS.length - 1;
    }

    if (targetIndex !== -1) {
      e.preventDefault();
      const targetTab = TABS[targetIndex];
      onSelectTab(targetTab.id);
      tabRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Celebration Blueprint Sections"
      className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-subtle overflow-x-auto no-scrollbar"
    >
      {TABS.map((tab, idx) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelectTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer ${
              isActive
                ? 'bg-indigo-950 text-white dark:bg-rose-gold dark:text-slate-950 shadow-md font-bold'
                : 'text-gray-700 dark:text-gray-200 hover:text-indigo-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
