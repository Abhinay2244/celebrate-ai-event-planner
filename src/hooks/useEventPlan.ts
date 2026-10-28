import { useState, useEffect } from 'react';
import { EventPlan, PlannerInput } from '../types/planner.ts';
import { generatePlanApi } from '../services/api.ts';
import { useTheme } from './useTheme.ts';
import { useSavedPlans } from './useSavedPlans.ts';
import confetti from 'canvas-confetti';

export type TabId = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'invitation';

/**
 * Composite hook coordinating theme, saved plans, active plan lifecycle, and tabs.
 */
export function useEventPlan() {
  const { darkMode, setDarkMode, toggleDarkMode } = useTheme();
  const { savedPlans, initialActivePlanId, savePlan, deletePlan, selectPlanId } = useSavedPlans();

  const [activePlan, setActivePlan] = useState<EventPlan | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [lastSubmittedInput, setLastSubmittedInput] = useState<PlannerInput | null>(null);

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
    setLastSubmittedInput(input);
    setIsLoading(true);
    setError(null);

    try {
      const result = await generatePlanApi(input);
      setActivePlan(result.plan);
      savePlan(result.plan);
      setActiveTab('overview');
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate plan';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
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
