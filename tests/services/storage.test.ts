import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSavedPlans,
  savePlanToStorage,
  deletePlanFromStorage,
  getActivePlanId,
  setActivePlanId,
} from '../../src/services/storage';
import { SAMPLE_EVENT_PLAN, MINIMAL_EVENT_PLAN } from '../fixtures/samplePlan';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when nothing is stored', () => {
    expect(getSavedPlans()).toEqual([]);
  });

  it('returns empty array gracefully if storage contains invalid JSON', () => {
    localStorage.setItem('celebrate_saved_plans_v1', '{invalid-json');
    expect(getSavedPlans()).toEqual([]);
  });

  it('saves new plans and sets the active plan ID', () => {
    savePlanToStorage(SAMPLE_EVENT_PLAN);
    const plans = getSavedPlans();
    expect(plans.length).toBe(1);
    expect(plans[0].id).toBe(SAMPLE_EVENT_PLAN.id);
    expect(getActivePlanId()).toBe(SAMPLE_EVENT_PLAN.id);
  });

  it('updates an existing plan without duplicating it in storage', () => {
    savePlanToStorage(SAMPLE_EVENT_PLAN);

    const modifiedPlan = {
      ...SAMPLE_EVENT_PLAN,
      summary: {
        ...SAMPLE_EVENT_PLAN.summary,
        tagline: 'Updated Tagline',
      },
    };

    savePlanToStorage(modifiedPlan);
    const plans = getSavedPlans();
    expect(plans.length).toBe(1);
    expect(plans[0].summary.tagline).toBe('Updated Tagline');
  });

  it('deletes a plan from storage and switches active plan or clears if empty', () => {
    savePlanToStorage(SAMPLE_EVENT_PLAN);
    savePlanToStorage(MINIMAL_EVENT_PLAN);
    setActivePlanId(SAMPLE_EVENT_PLAN.id);

    expect(getSavedPlans().length).toBe(2);

    const remaining = deletePlanFromStorage(SAMPLE_EVENT_PLAN.id);
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(MINIMAL_EVENT_PLAN.id);
    expect(getActivePlanId()).toBe(MINIMAL_EVENT_PLAN.id);

    deletePlanFromStorage(MINIMAL_EVENT_PLAN.id);
    expect(getActivePlanId()).toBeNull();
  });

  it('sets and retrieves active plan ID properly', () => {
    setActivePlanId('plan-999');
    expect(getActivePlanId()).toBe('plan-999');

    setActivePlanId(null);
    expect(getActivePlanId()).toBeNull();
  });
});
