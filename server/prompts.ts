import { EventPlan, PlannerInput, RefineRequest } from '../src/types/planner.ts';

/**
 * Builds the initial celebration plan generation prompt.
 *
 * @param input Planner input parameters from the user
 * @returns Formatted prompt string for Gemini
 */
export function buildPlannerPrompt(input: PlannerInput): string {
  return `
Create a focused celebration blueprint:
- Event: ${input.eventType.toUpperCase()} (${input.title || `${input.eventType} celebration`})
- Date: ${input.date} | City: ${input.city} | Guests: ${input.guestCount}
- Budget: ₹${input.totalBudget} INR
- Theme: ${input.theme}
- Notes: ${input.specialNotes || 'None'}

REQUIREMENTS FOR SPEED & QUALITY:
1. Provide max 6 budget categories summing exactly to ₹${input.totalBudget}.
2. Provide max 6 timeline milestones (from weeks before down to day-of event).
3. Provide max 5 vendor categories with 2-3 interview questions each.
4. Keep all descriptions punchy, vivid and under 25 words per field.
5. Provide 3 invitation styles (formal, casual, whatsapp).
`;
}

/**
 * Builds the plan refinement prompt based on user chat message.
 *
 * @param request Refinement request containing chat message and current event plan
 * @returns Formatted prompt string for Gemini
 */
export function buildRefinePrompt(request: RefineRequest, currentPlan: EventPlan): string {
  return `
User refinement request: "${request.message}"

Current Context:
- Event: ${currentPlan.input.eventType} in ${currentPlan.input.city}
- Guests: ${currentPlan.input.guestCount} | Budget: ₹${currentPlan.input.totalBudget} INR
- Theme: ${currentPlan.input.theme}

Update the plan concisely reflecting their requested changes. Ensure budget sum equals ₹${currentPlan.input.totalBudget}. Keep max 6 budget items, 6 milestones, 5 vendors.
`;
}
