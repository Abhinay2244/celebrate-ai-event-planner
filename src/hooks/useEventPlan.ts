import { useState, useEffect } from 'react';
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
  handleSelectPlan: (plan: EventPlan) => void;
  handleDeletePlan: (id: string) => void;
  handleNewPlan: () => void;
  handleUpdatePlan: (updatedPlan: EventPlan) => void;
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

  const { isLoading, error, dismissError, lastSubmittedInput, generatePlan } = usePlanGeneration(
    (generatedPlan) => {
      setActivePlan(generatedPlan);
      savePlan(generatedPlan);
      setActiveTab('overview');
    }
  );

  // Restore initial active plan once saved plans load
  useEffect(() => {
    if (initialActivePlanId && savedPlans.length > 0 && !activePlan) {
      const match = savedPlans.find((p) => p.id === initialActivePlanId);
      if (match) {
        setActivePlan(match);
      }
    }
  }, [initialActivePlanId, savedPlans, activePlan]);

  const selectTab = (tab: TabId) => {
    setActiveTab(tab);
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const openSavedModal = () => {
    setIsSavedModalOpen(true);
  };

  const closeSavedModal = () => {
    setIsSavedModalOpen(false);
  };

  const handleSelectPlan = (plan: EventPlan) => {
    setActivePlan(plan);
    selectPlanId(plan.id);
    setActiveTab('overview');
  };

  const handleDeletePlan = (id: string) => {
    const updated = deletePlan(id);
    if (activePlan?.id === id) {
      setActivePlan(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleNewPlan = () => {
    setActivePlan(null);
    dismissError();
  };

  const handleUpdatePlan = (updatedPlan: EventPlan) => {
    setActivePlan(updatedPlan);
    savePlan(updatedPlan);
  };

  return {
    darkMode,
    toggleDarkMode,
    savedPlans,
    activePlan,
    activeTab,
    selectTab,
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
    handleSelectPlan,
    handleDeletePlan,
    handleNewPlan,
    handleUpdatePlan,
  };
}
