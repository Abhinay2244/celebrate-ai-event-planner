import { useState } from 'react';
import { EventPlan, PlannerInput } from '../types/planner.ts';
import { generatePlanApi } from '../services/api.ts';
import confetti from 'canvas-confetti';

/**
 * Hook managing event plan generation lifecycle, loading states, and error states.
 */
export function usePlanGeneration(onPlanGenerated?: (plan: EventPlan) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmittedInput, setLastSubmittedInput] = useState<PlannerInput | null>(null);

  const generatePlan = async (input: PlannerInput): Promise<EventPlan | null> => {
    setLastSubmittedInput(input);
    setIsLoading(true);
    setError(null);

    try {
      const result = await generatePlanApi(input);
      if (onPlanGenerated) {
        onPlanGenerated(result.plan);
      }
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
      });
      return result.plan;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate plan';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const dismissError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    dismissError,
    lastSubmittedInput,
    generatePlan,
  };
}
