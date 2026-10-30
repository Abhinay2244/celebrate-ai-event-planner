import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEventPlan } from '../../src/hooks/useEventPlan.ts';
import { savePlanToStorage } from '../../src/services/storage.ts';
import { SAMPLE_EVENT_PLAN } from '../fixtures/samplePlan.ts';

describe('useEventPlan Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('restores initial plan on mount, and keeps activePlan null when startNewPlan/handleNewPlan is called', () => {
    savePlanToStorage(SAMPLE_EVENT_PLAN);

    const { result } = renderHook(() => useEventPlan());

    // Initially restored from storage
    expect(result.current.activePlan).not.toBeNull();
    expect(result.current.activePlan?.id).toBe(SAMPLE_EVENT_PLAN.id);

    // Call startNewPlan / handleNewPlan
    act(() => {
      result.current.startNewPlan();
    });

    // Confirmed activePlan is null and stays null (does not re-restore)
    expect(result.current.activePlan).toBeNull();

    // Verify handleNewPlan alias behaves identically
    act(() => {
      result.current.selectPlan(SAMPLE_EVENT_PLAN);
    });
    expect(result.current.activePlan?.id).toBe(SAMPLE_EVENT_PLAN.id);

    act(() => {
      result.current.handleNewPlan();
    });
    expect(result.current.activePlan).toBeNull();
  });
});
