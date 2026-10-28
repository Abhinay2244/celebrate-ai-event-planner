import { useState, useEffect } from 'react';
import { EventPlan, PlannerInput } from '../types/planner.ts';
import { useTheme } from './useTheme.ts';
import { useSavedPlans } from './useSavedPlans.ts';
import { usePlanGeneration } from './usePlanGeneration.ts';

export type TabId = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'invitation';

/**
 * Composite hook coordinating theme, saved plans, active plan lifecycle, and tabs.
 */
export function useEventPlan() {
  const { darkMode, setDarkMode, toggleDarkMode } = useTheme();
  const { savedPlans, initialActivePlanId, savePlan, deletePlan, selectPlanId } = useSavedPlans();

  const [activePlan, setActivePlan] = useState<EventPlan | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  const {
    isLoading,
    error,
    setError,
    lastSubmittedInput,
    generatePlan,
  } = usePlanGeneration((generatedPlan) => {
    setActivePlan(generatedPlan);
    savePlan(generatedPlan);
    setActiveTab('overview');
  });

  // Restore initial active plan once saved plans load
  useEffect(() => {
    if (initialActivePlanId && savedPlans.length > 0 && !activePlan) {
      const match = savedPlans.find((p) => p.id === initialActivePlanId);
      if (match) {
        setActivePlan(match);
      }
    }
  }, [initialActivePlanId, savedPlans, activePlan]);

  const handleGeneratePlan = async (input: PlannerInput) => {
    await generatePlan(input);
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
    setError(null);
  };

  const handleUpdatePlan = (updatedPlan: EventPlan) => {
    setActivePlan(updatedPlan);
    savePlan(updatedPlan);
  };

  return {
    darkMode,
    setDarkMode,
    toggleDarkMode,
    savedPlans,
    activePlan,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    setError,
    isChatOpen,
    setIsChatOpen,
    isSavedModalOpen,
    setIsSavedModalOpen,
    lastSubmittedInput,
    handleGeneratePlan,
    handleSelectPlan,
    handleDeletePlan,
    handleNewPlan,
    handleUpdatePlan,
  };
}
