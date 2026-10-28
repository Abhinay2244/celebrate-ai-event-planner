import React from 'react';
import { EventPlan } from '../../types/planner.ts';
import { TabId } from '../../hooks/useEventPlan.ts';
import { PlanToolbar } from './PlanToolbar.tsx';
import { TabBar } from './TabBar.tsx';
import { OverviewTab } from '../tabs/OverviewTab.tsx';
import { BudgetTab } from '../tabs/BudgetTab.tsx';
import { TimelineTab } from '../tabs/TimelineTab.tsx';
import { VendorsTab } from '../tabs/VendorsTab.tsx';
import { IdeasTab } from '../tabs/IdeasTab.tsx';
import { InvitationTab } from '../tabs/InvitationTab.tsx';
import { ChatAssistant } from '../ChatAssistant.tsx';

interface TabRenderContext {
  plan: EventPlan;
  onNavigateTab: (tab: TabId) => void;
  onUpdatePlan: (plan: EventPlan) => void;
}

const TAB_RENDERERS: Record<TabId, (ctx: TabRenderContext) => React.ReactNode> = {
  overview: ({ plan, onNavigateTab }) => <OverviewTab plan={plan} onNavigateTab={onNavigateTab} />,
  budget: ({ plan }) => <BudgetTab plan={plan} />,
  timeline: ({ plan, onUpdatePlan }) => <TimelineTab plan={plan} onUpdatePlan={onUpdatePlan} />,
  vendors: ({ plan, onUpdatePlan }) => <VendorsTab plan={plan} onUpdatePlan={onUpdatePlan} />,
  ideas: ({ plan }) => <IdeasTab plan={plan} />,
  invitation: ({ plan }) => <InvitationTab plan={plan} />,
};

interface ActivePlanViewProps {
  plan: EventPlan;
  activeTab: TabId;
  savedPlansCount: number;
  isChatOpen: boolean;
  onSelectTab: (tab: TabId) => void;
  onNewPlan: () => void;
  onOpenSavedModal: () => void;
  onUpdatePlan: (plan: EventPlan) => void;
  onToggleChat: () => void;
}

/**
 * Renders the active celebration plan tabs, toolbar, and refinement assistant.
 */
export const ActivePlanView: React.FC<ActivePlanViewProps> = ({
  plan,
  activeTab,
  savedPlansCount,
  isChatOpen,
  onSelectTab,
  onNewPlan,
  onOpenSavedModal,
  onUpdatePlan,
  onToggleChat,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <PlanToolbar
        planTitle={plan.summary.title}
        savedPlansCount={savedPlansCount}
        onNewPlan={onNewPlan}
        onOpenSavedModal={onOpenSavedModal}
      />

      <TabBar activeTab={activeTab} onSelectTab={onSelectTab} />

      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="pt-2 focus:outline-none"
      >
        {TAB_RENDERERS[activeTab]?.({
          plan,
          onNavigateTab: onSelectTab,
          onUpdatePlan,
        })}
      </div>

      <ChatAssistant
        plan={plan}
        onUpdatePlan={onUpdatePlan}
        isOpen={isChatOpen}
        onToggle={onToggleChat}
      />
    </div>
  );
};
