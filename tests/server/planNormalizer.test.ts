import { describe, it, expect } from 'vitest';
import { buildEventPlanFromLLM, mergeRefinedPlan } from '../../server/planNormalizer';
import { buildPlannerPrompt, buildRefinePrompt } from '../../server/prompts';
import {
  SAMPLE_EVENT_PLAN,
  SAMPLE_PLANNER_INPUT,
  SAMPLE_REFINE_REQUEST,
} from '../fixtures/samplePlan';

describe('Server Plan Normalizer & Prompts', () => {
  describe('buildEventPlanFromLLM', () => {
    it('normalizes raw parsed data and enforces exact totalBudget math', () => {
      const rawData = {
        summary: SAMPLE_EVENT_PLAN.summary,
        budgetBreakdown: [
          { category: 'Venue', amount: 1500000, percentage: 60, description: 'Palace' },
          { category: 'Food', amount: 1000000, percentage: 40, description: 'Royal thali' },
        ],
        timeline: SAMPLE_EVENT_PLAN.timeline,
        vendorChecklist: [
          {
            id: '',
            category: 'Catering',
            vendorType: 'Royal Caterers',
            whatToAsk: ['Tasting?'],
            tips: 'Book early',
            done: false,
          },
        ],
        personalizedIdeas: SAMPLE_EVENT_PLAN.personalizedIdeas,
        invitationText: SAMPLE_EVENT_PLAN.invitationText,
      };

      const result = buildEventPlanFromLLM(rawData, SAMPLE_PLANNER_INPUT);

      expect(result.id).toMatch(/^plan-/);
      expect(result.totalBudgetCalculated).toBe(SAMPLE_PLANNER_INPUT.totalBudget);
      const budgetSum = result.budgetBreakdown.reduce((acc, i) => acc + i.amount, 0);
      expect(budgetSum).toBe(SAMPLE_PLANNER_INPUT.totalBudget);
      expect(result.vendorChecklist[0].id).toBe('vendor-1');
    });
  });

  describe('mergeRefinedPlan', () => {
    it('merges partial updates cleanly while preserving existing vendors and categories', () => {
      const partialUpdate = {
        summary: {
          ...SAMPLE_EVENT_PLAN.summary,
          tagline: 'Eco-conscious royal celebration',
        },
        vendorChecklist: [{ ...SAMPLE_EVENT_PLAN.vendorChecklist[0], done: true }],
      };

      const updated = mergeRefinedPlan(SAMPLE_EVENT_PLAN, partialUpdate);

      expect(updated.summary.tagline).toBe('Eco-conscious royal celebration');
      expect(updated.vendorChecklist[0].done).toBe(true);
      expect(updated.totalBudgetCalculated).toBe(SAMPLE_EVENT_PLAN.input.totalBudget);
    });
  });

  describe('Prompt Builders', () => {
    it('generates structured planner prompt with requirements and limits', () => {
      const prompt = buildPlannerPrompt(SAMPLE_PLANNER_INPUT);

      expect(prompt).toContain(SAMPLE_PLANNER_INPUT.eventType.toUpperCase());
      expect(prompt).toContain(SAMPLE_PLANNER_INPUT.city);
      expect(prompt).toContain(String(SAMPLE_PLANNER_INPUT.totalBudget));
      expect(prompt).toContain('Provide max 6 budget categories');
      expect(prompt).toContain('Provide max 6 timeline milestones');
      expect(prompt).toContain('Provide max 5 vendor categories');
    });

    it('generates refinement prompt with current context and user request', () => {
      const prompt = buildRefinePrompt(SAMPLE_REFINE_REQUEST, SAMPLE_EVENT_PLAN);

      expect(prompt).toContain(SAMPLE_REFINE_REQUEST.message);
      expect(prompt).toContain(SAMPLE_EVENT_PLAN.input.city);
      expect(prompt).toContain(String(SAMPLE_EVENT_PLAN.input.totalBudget));
    });
  });
});
