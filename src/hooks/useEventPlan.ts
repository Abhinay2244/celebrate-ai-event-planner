import { useState, useEffect } from 'react';
import { EventPlan, PlannerInput } from '../types/planner';
import { generatePlanApi } from '../services/api';
import {
  getSavedPlans,
  savePlanToStorage,
  deletePlanFromStorage,
  getActivePlanId,
  setActivePlanId,
} from '../services/storage';
import { STORAGE_KEYS } from '../constants/index.ts';
import confetti from 'canvas-confetti';

export type TabId = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'invitation';

/**
 * Custom hook managing active celebration plans, saved blueprints, theme, and tab navigation.
 */
export function useEventPlan() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [savedPlans, setSavedPlans] = useState<EventPlan[]>([]);
  const [activePlan, setActivePlan] = useState<EventPlan | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [lastSubmittedInput, setLastSubmittedInput] = useState<PlannerInput | null>(null);

  // Sync theme changes to document and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [darkMode]);

  // Load saved plans and active plan on initial mount
  useEffect(() => {
    const plans = getSavedPlans();
    setSavedPlans(plans);

    const activeId = getActivePlanId();
    if (activeId && plans.length > 0) {
      const match = plans.find((p) => p.id === activeId);
      if (match) {
        setActivePlan(match);
      }
    }
  }, []);

  const handleGeneratePlan = async (input: PlannerInput) => {
    setLastSubmittedInput(input);
    setIsLoading(true);
    setError(null);

    try {
      const result = await generatePlanApi(input);
      setActivePlan(result.plan);
      savePlanToStorage(result.plan);
      setSavedPlans(getSavedPlans());
      setActiveTab('overview');
      confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate plan';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (plan: EventPlan) => {
    setActivePlan(plan);
    setActivePlanId(plan.id);
    setActiveTab('overview');
  };

  const handleDeletePlan = (id: string) => {
    const updated = deletePlanFromStorage(id);
    setSavedPlans(updated);
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
    savePlanToStorage(updatedPlan);
    setSavedPlans(getSavedPlans());
  };

  return {
    darkMode,
    setDarkMode,
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
