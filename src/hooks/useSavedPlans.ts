import { useState, useEffect, useCallback } from 'react';
import { EventPlan } from '../types/planner.ts';
import {
  getSavedPlans,
  savePlanToStorage,
  deletePlanFromStorage,
  getActivePlanId,
  setActivePlanId,
} from '../services/storage.ts';

/**
 * Manages saved event blueprints persisted in browser localStorage.
 */
export function useSavedPlans() {
  const [savedPlans, setSavedPlans] = useState<EventPlan[]>([]);
  const [initialActivePlanId, setInitialActivePlanId] = useState<string | null>(null);

  useEffect(() => {
    const plans = getSavedPlans();
    setSavedPlans(plans);
    setInitialActivePlanId(getActivePlanId());
  }, []);

  const savePlan = useCallback((plan: EventPlan) => {
    savePlanToStorage(plan);
    setSavedPlans(getSavedPlans());
  }, []);

  const deletePlan = useCallback((id: string) => {
    const updated = deletePlanFromStorage(id);
    setSavedPlans(updated);
    return updated;
  }, []);

  const selectPlanId = useCallback((id: string) => {
    setActivePlanId(id);
  }, []);

  return {
    savedPlans,
    initialActivePlanId,
    savePlan,
    deletePlan,
    selectPlanId,
  };
}
