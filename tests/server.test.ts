import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { apiRouter } from '../server/routes';
import * as geminiModule from '../server/gemini';
import { SAMPLE_EVENT_PLAN, SAMPLE_PLANNER_INPUT } from './fixtures/samplePlan';

// Create a clean Express application with apiRouter
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', apiRouter);
  return app;
}

describe('Server API Endpoints with Supertest', () => {
  let app: express.Application;

  beforeEach(() => {
    vi.restoreAllMocks();
    app = createTestApp();
  });

  describe('POST /api/plan (and /api/plan/generate)', () => {
    it('returns 200 and generated event plan on valid input', async () => {
      vi.spyOn(geminiModule, 'generateCelebrationPlan').mockResolvedValueOnce(SAMPLE_EVENT_PLAN);

      const uniqueInput = {
        ...SAMPLE_PLANNER_INPUT,
        city: `TestCity-${Date.now()}`,
      };

      const res = await request(app)
        .post('/api/plan')
        .send(uniqueInput)
        .set('X-Forwarded-For', `ip-${Date.now()}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('plan');
      expect(res.body.plan.id).toBe(SAMPLE_EVENT_PLAN.id);
      expect(res.body.cached).toBe(false);
    });

    it('returns 400 when invalid input is provided', async () => {
      const invalidInput = {
        eventType: 'invalid-type',
        city: 'X', // too short
        guestCount: 2, // minimum is 5
        totalBudget: 100, // minimum is 5000
      };

      const res = await request(app)
        .post('/api/plan')
        .send(invalidInput)
        .set('X-Forwarded-For', `ip-${Date.now()}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid celebration request parameters');
      expect(res.body).toHaveProperty('message');
    });

    it('returns friendly error when Gemini throws an exception', async () => {
      vi.spyOn(geminiModule, 'generateCelebrationPlan').mockRejectedValueOnce(
        new Error('Resource has been exhausted (e.g. check quota) 429')
      );

      const uniqueInput = {
        ...SAMPLE_PLANNER_INPUT,
        city: `QuotaCity-${Date.now()}`,
      };

      const res = await request(app)
        .post('/api/plan')
        .send(uniqueInput)
        .set('X-Forwarded-For', `ip-${Date.now()}`);

      expect(res.status).toBe(429);
      expect(res.body).toHaveProperty('error', 'Event generation error');
      expect(res.body.message).toMatch(/rate limit|quota/i);
    });

    it('serves cached plan on identical subsequent requests', async () => {
      vi.spyOn(geminiModule, 'generateCelebrationPlan').mockResolvedValue(SAMPLE_EVENT_PLAN);

      const identicalInput = {
        ...SAMPLE_PLANNER_INPUT,
        city: `CachedCity-${Date.now()}`,
      };

      const ip = `ip-cache-${Date.now()}`;

      // First call (uncached)
      const res1 = await request(app)
        .post('/api/plan')
        .send(identicalInput)
        .set('X-Forwarded-For', ip);

      expect(res1.status).toBe(200);
      expect(res1.body.cached).toBe(false);

      // Second call (should hit in-memory cache)
      const res2 = await request(app)
        .post('/api/plan')
        .send(identicalInput)
        .set('X-Forwarded-For', ip);

      expect(res2.status).toBe(200);
      expect(res2.body.cached).toBe(true);
    });
  });

  describe('POST /api/plan/refine (Chat Route)', () => {
    it('returns 200 with assistant reply and updated plan on valid refinement', async () => {
      const mockResult = {
        reply: 'Vegetarian menu updated successfully.',
        updatedPlan: {
          ...SAMPLE_EVENT_PLAN,
          summary: {
            ...SAMPLE_EVENT_PLAN.summary,
            tagline: '100% Vegetarian royal feast',
          },
        },
      };

      vi.spyOn(geminiModule, 'refineCelebrationPlan').mockResolvedValueOnce(mockResult);

      const res = await request(app)
        .post('/api/plan/refine')
        .send({
          plan: SAMPLE_EVENT_PLAN,
          message: 'Make the menu strictly vegetarian',
        })
        .set('X-Forwarded-For', `ip-${Date.now()}`);

      expect(res.status).toBe(200);
      expect(res.body.reply).toBe(mockResult.reply);
      expect(res.body.updatedPlan.summary.tagline).toBe('100% Vegetarian royal feast');
    });

    it('returns 400 when refinement request payload is invalid', async () => {
      const res = await request(app)
        .post('/api/plan/refine')
        .send({
          message: '', // empty message is invalid
        })
        .set('X-Forwarded-For', `ip-${Date.now()}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid refinement parameters');
    });

    it('returns friendly error when refinement fails in Gemini', async () => {
      vi.spyOn(geminiModule, 'refineCelebrationPlan').mockRejectedValueOnce(
        new Error('Request timed out after deadline')
      );

      const res = await request(app)
        .post('/api/plan/refine')
        .send({
          plan: SAMPLE_EVENT_PLAN,
          message: 'Adjust lighting',
        })
        .set('X-Forwarded-For', `ip-${Date.now()}`);

      expect(res.status).toBe(504);
      expect(res.body).toHaveProperty('error', 'Refinement error');
      expect(res.body.message).toMatch(/timed out/i);
    });
  });

  describe('Rate Limiter (429)', () => {
    it('enforces rate limit when request threshold is exceeded', async () => {
      const testIp = `rate-limit-test-${Date.now()}`;
      vi.spyOn(geminiModule, 'generateCelebrationPlan').mockResolvedValue(SAMPLE_EVENT_PLAN);

      // Send 30 allowed requests in parallel
      await Promise.all(
        Array.from({ length: 30 }, () =>
          request(app).get('/api/health').set('X-Forwarded-For', testIp)
        )
      );

      // The 31st request should trigger 429
      const rateLimitedRes = await request(app).get('/api/health').set('X-Forwarded-For', testIp);

      expect(rateLimitedRes.status).toBe(429);
      expect(rateLimitedRes.body).toHaveProperty('error', 'Rate limit exceeded');
    });
  });

  describe('GET /api/health', () => {
    it('returns 200 when Gemini connection is healthy', async () => {
      vi.spyOn(geminiModule, 'testGeminiConnection').mockResolvedValueOnce({
        ok: true,
        model: 'gemini-3-flash-preview',
        response: 'hello',
      });

      const res = await request(app)
        .get('/api/health')
        .set('X-Forwarded-For', `ip-health-${Date.now()}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('returns 503 degraded when Gemini connection fails', async () => {
      vi.spyOn(geminiModule, 'testGeminiConnection').mockResolvedValueOnce({
        ok: false,
        model: 'gemini-3-flash-preview',
        error: 'API key missing',
      });

      const res = await request(app)
        .get('/api/health')
        .set('X-Forwarded-For', `ip-health-fail-${Date.now()}`);

      expect(res.status).toBe(503);
      expect(res.body.status).toBe('degraded');
    });
  });
});
