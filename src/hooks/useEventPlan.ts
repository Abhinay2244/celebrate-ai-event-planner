import { useState, useEffect, useRef } from 'react';
import { EventPlan, PlannerInput, TabId } from '../types/planner.ts';
import { useTheme } from './useTheme.ts';
import { useSavedPlans } from './useSavedPlans.ts';
import { usePlanGeneration } from './usePlanGeneration.ts';

export type { TabId } from '../types/planner.ts';

export interface UseEventPlanReturn {
  darkMode: boolean;
  toggleDarkMode: () => void;
  savedPlans: EventPlan[];
  activePlan: EventPlan | null;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  selectTab: (tab: TabId) => void;
  isLoading: boolean;
  error: string | null;
  dismissError: () => void;
  isChatOpen: boolean;
  toggleChat: () => void;
  isSavedModalOpen: boolean;
  openSavedModal: () => void;
  closeSavedModal: () => void;
  lastSubmittedInput: PlannerInput | null;
  generatePlan: (input: PlannerInput) => Promise<EventPlan | null>;
  selectPlan: (plan: EventPlan) => void;
  removePlan: (id: string) => void;
  startNewPlan: () => void;
  handleNewPlan: () => void;
  updatePlan: (updatedPlan: EventPlan) => void;
}

/**
 * Composite hook coordinating theme, saved plans, active plan lifecycle, and tabs.
 */
export function useEventPlan(): UseEventPlanReturn {
  const { darkMode, toggleDarkMode } = useTheme();
  const { savedPlans, initialActivePlanId, savePlan, deletePlan, selectPlanId } = useSavedPlans();

  const [activePlan, setActivePlan] = useState<EventPlan | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const hasRestoredRef = useRef(false);

  const { isLoading, error, dismissError, lastSubmittedInput, generatePlan } = usePlanGeneration(
    (generatedPlan) => {
      setActivePlan(generatedPlan);
      savePlan(generatedPlan);
      setActiveTab('overview');
    }
  );

  // Restore initial active plan once on initial load only
  useEffect(() => {
    if (hasRestoredRef.current) return;

    if (initialActivePlanId && savedPlans.length > 0) {
      const match = savedPlans.find((p) => p.id === initialActivePlanId);
      if (match) {
        setActivePlan(match);
      }
      hasRestoredRef.current = true;
    }
  }, [initialActivePlanId, savedPlans]);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const openSavedModal = () => {
    setIsSavedModalOpen(true);
  };

  const closeSavedModal = () => {
    setIsSavedModalOpen(false);
  };

  const selectPlan = (plan: EventPlan) => {
    setActivePlan(plan);
    selectPlanId(plan.id);
    setActiveTab('overview');
  };

  const removePlan = (id: string) => {
    const updated = deletePlan(id);
    if (activePlan?.id === id) {
      setActivePlan(updated.length > 0 ? updated[0] : null);
    }
  };

  const startNewPlan = () => {
    setActivePlan(null);
    dismissError();
  };

  const updatePlan = (updatedPlan: EventPlan) => {
    setActivePlan(updatedPlan);
    savePlan(updatedPlan);
  };

  return {
    darkMode,
    toggleDarkMode,
    savedPlans,
    activePlan,
    activeTab,
    setActiveTab,
    selectTab: setActiveTab,
    isLoading,
    error,
    dismissError,
    isChatOpen,
    toggleChat,
    isSavedModalOpen,
    openSavedModal,
    closeSavedModal,
    lastSubmittedInput,
    generatePlan,
    selectPlan,
    removePlan,
    startNewPlan,
    handleNewPlan: startNewPlan,
    updatePlan,
  };
}
