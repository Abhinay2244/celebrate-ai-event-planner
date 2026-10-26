import { EventPlan, PlannerInput } from '../src/types/planner.ts';
import { normalizeBudget } from '../src/utils/budget.ts';
import { normalizePaletteColor } from '../src/utils/color.ts';

/**
 * Normalizes raw parsed celebration plan data from Gemini into a validated EventPlan.
 *
 * @param parsedData Raw parsed payload from LLM
 * @param input Original user planner input parameters
 * @returns Fully populated and normalized EventPlan
 */
export function buildEventPlanFromLLM(
  parsedData: Omit<EventPlan, 'id' | 'createdAt' | 'updatedAt' | 'input' | 'totalBudgetCalculated'>,
  input: PlannerInput
): EventPlan {
  const normalizedBudget = normalizeBudget(
    parsedData.budgetBreakdown.slice(0, 6),
    input.totalBudget
  );
  const planId = `plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const vendorChecklist = (parsedData.vendorChecklist || []).slice(0, 5).map((item, idx) => ({
    ...item,
    id: item.id || `vendor-${idx + 1}`,
    done: Boolean(item.done),
  }));

  return {
    id: planId,
    createdAt: now,
    updatedAt: now,
    input,
    summary: parsedData.summary,
    budgetBreakdown: normalizedBudget,
    totalBudgetCalculated: input.totalBudget,
    timeline: (parsedData.timeline || []).slice(0, 6),
    vendorChecklist,
    personalizedIdeas: {
      ...parsedData.personalizedIdeas,
      theme: {
        ...parsedData.personalizedIdeas.theme,
        colorPalette: (parsedData.personalizedIdeas.theme.colorPalette || []).map((c, idx) =>
          normalizePaletteColor(c, idx)
        ),
      },
    },
    invitationText: parsedData.invitationText,
  };
}

/**
 * Merges a refined partial plan into an existing EventPlan with budget and vendor normalization.
 *
 * @param currentPlan Active EventPlan before refinement
 * @param updatedPlan Partial EventPlan updates returned by LLM
 * @returns Fully updated EventPlan
 */
export function mergeRefinedPlan(
  currentPlan: EventPlan,
  updatedPlan?: Partial<EventPlan>
): EventPlan {
  const rawBudget = (updatedPlan?.budgetBreakdown || currentPlan.budgetBreakdown).slice(0, 6);
  const targetBudget = currentPlan.input.totalBudget;
  const normalizedBudget = normalizeBudget(rawBudget, targetBudget);

  return {
    ...currentPlan,
    updatedAt: new Date().toISOString(),
    summary: updatedPlan?.summary
      ? { ...currentPlan.summary, ...updatedPlan.summary }
      : currentPlan.summary,
    budgetBreakdown: normalizedBudget,
    totalBudgetCalculated: targetBudget,
    timeline: (updatedPlan?.timeline || currentPlan.timeline).slice(0, 6),
    vendorChecklist: (updatedPlan?.vendorChecklist || currentPlan.vendorChecklist)
      .slice(0, 5)
      .map((item, idx) => ({
        ...item,
        id: item.id || `vendor-${idx + 1}`,
        done:
          item.done !== undefined
            ? item.done
            : currentPlan.vendorChecklist.find((c) => c.id === item.id)?.done || false,
      })),
    personalizedIdeas: updatedPlan?.personalizedIdeas
      ? {
          ...updatedPlan.personalizedIdeas,
          theme: {
            ...updatedPlan.personalizedIdeas.theme,
            colorPalette: (updatedPlan.personalizedIdeas.theme?.colorPalette || []).map((c, idx) =>
              normalizePaletteColor(c, idx)
            ),
          },
        }
      : currentPlan.personalizedIdeas,
    invitationText: updatedPlan?.invitationText || currentPlan.invitationText,
  };
}
