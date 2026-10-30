import { useState } from 'react';
import { EventPlan, PlannerInput } from '../types/planner.ts';
import { generatePlanApi } from '../services/api.ts';
import { normalizeClientError } from '../utils/errorHandler.ts';

export interface UsePlanGenerationReturn {
  isLoading: boolean;
  error: string | null;
  dismissError: () => void;
  lastSubmittedInput: PlannerInput | null;
  generatePlan: (input: PlannerInput) => Promise<EventPlan | null>;
}

/**
 * Hook managing event plan generation lifecycle, loading states, and error states.
 */
export function usePlanGeneration(
  onPlanGenerated?: (plan: EventPlan) => void
): UsePlanGenerationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmittedInput, setLastSubmittedInput] = useState<PlannerInput | null>(null);

  const generatePlan = async (input: PlannerInput): Promise<EventPlan | null> => {
    setLastSubmittedInput(input);
    setIsLoading(true);
    setError(null);

    let generatedPlan: EventPlan | null = null;

    try {
      const result = await generatePlanApi(input);
      generatedPlan = result.plan;
      if (onPlanGenerated) {
        onPlanGenerated(result.plan);
      }
    } catch (err: unknown) {
      const normalized = normalizeClientError(err);
      setError(normalized.message);
      return null;
    } finally {
      setIsLoading(false);
    }

    // Trigger celebratory confetti outside try/catch so any confetti failure cannot mask successful generation
    try {
      const confettiModule = await import('canvas-confetti');
      const triggerConfetti = confettiModule.default || confettiModule;
      triggerConfetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti visual enhancement is non-critical
    }

    return generatedPlan;
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
