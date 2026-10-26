import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkServerHealthApi,
  generatePlanApi,
  refinePlanApi,
  ApiError,
} from '../../src/services/api';
import {
  SAMPLE_PLANNER_INPUT,
  SAMPLE_EVENT_PLAN,
  SAMPLE_REFINE_REQUEST,
} from '../fixtures/samplePlan';

describe('Frontend API Client (api.ts)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('checkServerHealthApi', () => {
    it('returns healthy status when server responds ok', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          status: 'ok',
          gemini: { ok: true, model: 'gemini-3-flash-preview' },
        }),
      } as Response);

      const res = await checkServerHealthApi();
      expect(res.ok).toBe(true);
      expect(res.status).toBe('ok');
    });

    it('returns unreachable status when network fetch fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Connection refused'));

      const res = await checkServerHealthApi();
      expect(res.ok).toBe(false);
      expect(res.status).toBe('unreachable');
    });
  });

  describe('generatePlanApi', () => {
    it('succeeds and returns plan when fetch is 200 OK', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ plan: SAMPLE_EVENT_PLAN, cached: false }),
      } as Response);

      const res = await generatePlanApi(SAMPLE_PLANNER_INPUT);
      expect(res.plan.id).toBe(SAMPLE_EVENT_PLAN.id);
      expect(res.cached).toBe(false);
    });

    it('throws ApiError with server error message on non-200 status', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Rate limit exceeded', message: 'Too many requests' }),
      } as Response);

      await expect(generatePlanApi(SAMPLE_PLANNER_INPUT)).rejects.toThrow(ApiError);
    });

    it('throws friendly timeout ApiError on AbortError', async () => {
      const abortError = new Error('The user aborted a request.');
      abortError.name = 'AbortError';
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(abortError);

      await expect(generatePlanApi(SAMPLE_PLANNER_INPUT)).rejects.toThrow(/timed out/i);
    });
  });

  describe('refinePlanApi', () => {
    it('succeeds and returns reply and updated plan when fetch is 200 OK', async () => {
      const mockResponse = {
        reply: 'Updated menu to vegetarian.',
        updatedPlan: SAMPLE_EVENT_PLAN,
      };

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const res = await refinePlanApi(SAMPLE_REFINE_REQUEST);
      expect(res.reply).toBe('Updated menu to vegetarian.');
      expect(res.updatedPlan.id).toBe(SAMPLE_EVENT_PLAN.id);
    });

    it('throws ApiError on non-200 response with raw status fallback', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Not JSON');
        },
      } as unknown as Response);

      await expect(refinePlanApi(SAMPLE_REFINE_REQUEST)).rejects.toThrow(
        /Server returned HTTP 500/i
      );
    });

    it('throws friendly timeout ApiError on AbortError in refinePlanApi', async () => {
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(abortError);

      await expect(refinePlanApi(SAMPLE_REFINE_REQUEST)).rejects.toThrow(
        /refinement request timed out/i
      );
    });
  });
});
