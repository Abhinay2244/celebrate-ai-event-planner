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
  return (
    <div
      role="tablist"
      aria-label="Celebration Blueprint Sections"
      className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-subtle overflow-x-auto no-scrollbar"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-gold cursor-pointer ${
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
