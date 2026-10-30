import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { createApp } from '../server.ts';
import * as geminiModule from '../server/gemini.ts';
import { resetRateLimiter } from '../server/middleware/rateLimiter.ts';
import { SAMPLE_EVENT_PLAN, SAMPLE_PLANNER_INPUT } from './fixtures/samplePlan.ts';

describe('Server API Endpoints with Supertest', () => {
  let app: express.Application;

  beforeEach(() => {
    vi.restoreAllMocks();
    resetRateLimiter();
    app = createApp();
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
      expect(res.body).toHaveProperty('error', 'Rate limit exceeded');
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
      expect(res.body).toHaveProperty('error', 'Gateway timeout');
      expect(res.body.message).toMatch(/timed out/i);
    });
  });

  describe('Rate Limiter (429)', () => {
    it('enforces rate limit when request threshold is exceeded', async () => {
      const testIp = `rate-limit-test-${Date.now()}`;
      vi.spyOn(geminiModule, 'testGeminiConnection').mockResolvedValue({
        ok: true,
        model: 'gemini-3-flash-preview',
        response: 'ok',
      });

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
      expect(rateLimitedRes.headers['retry-after']).toBeDefined();
    });
  });

  describe('GET /api/health', () => {
    const originalToken = process.env.HEALTH_CHECK_TOKEN;

    afterEach(() => {
      process.env.HEALTH_CHECK_TOKEN = originalToken;
    });

    it('returns 200 lightweight health status by default', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('X-Forwarded-For', `ip-health-${Date.now()}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).not.toHaveProperty('gemini');
    });

    it('denies deep check and returns basic health when token is missing or mismatched', async () => {
      process.env.HEALTH_CHECK_TOKEN = 'secret-token';
      const res = await request(app)
        .get('/api/health?deep=true')
        .set('x-health-check-token', 'wrong-token');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).not.toHaveProperty('gemini');
    });

    it('returns 200 when Gemini connection is healthy on ?deep=true with valid token', async () => {
      process.env.HEALTH_CHECK_TOKEN = 'secret-token';
      vi.spyOn(geminiModule, 'testGeminiConnection').mockResolvedValueOnce({
        ok: true,
        model: 'gemini-3-flash-preview',
        response: 'hello',
      });

      const res = await request(app)
        .get('/api/health?deep=true')
        .set('x-health-check-token', 'secret-token');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.gemini.ok).toBe(true);
    });

    it('returns 503 degraded when Gemini connection fails on ?deep=true with valid token', async () => {
      process.env.HEALTH_CHECK_TOKEN = 'secret-token';
      vi.spyOn(geminiModule, 'testGeminiConnection').mockResolvedValueOnce({
        ok: false,
        model: 'gemini-3-flash-preview',
        error: 'API key missing',
      });

      const res = await request(app)
        .get('/api/health?deep=true')
        .set('x-health-check-token', 'secret-token');

      expect(res.status).toBe(503);
      expect(res.body.status).toBe('degraded');
    });

    it('returns structured JSON 404 for unmatched /api routes', async () => {
      const res = await request(app).get('/api/non-existent-endpoint');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Not found');
      expect(res.body).toHaveProperty('requestId');
    });
  });

  describe('Security Hardening Headers & CORS', () => {
    it('sets security headers including nosniff and referrer-policy via Helmet', async () => {
      vi.spyOn(geminiModule, 'testGeminiConnection').mockResolvedValueOnce({
        ok: true,
        model: 'gemini-3-flash-preview',
        response: 'ok',
      });

      const res = await request(app).get('/api/health');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });

    it('attaches unique X-Request-Id header and returns requestId in responses', async () => {
      vi.spyOn(geminiModule, 'testGeminiConnection').mockResolvedValueOnce({
        ok: true,
        model: 'gemini-3-flash-preview',
        response: 'ok',
      });

      const res = await request(app).get('/api/health');
      expect(res.headers['x-request-id']).toBeDefined();
      expect(res.body).toHaveProperty('requestId');
      expect(res.body.requestId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it('accepts valid client-provided X-Request-Id header matching regex', async () => {
      const customId = 'client-custom-req-12345';
      const res = await request(app).get('/api/health').set('X-Request-Id', customId);
      expect(res.headers['x-request-id']).toBe(customId);
      expect(res.body.requestId).toBe(customId);
    });

    it('generates a new Request ID when client sends invalid characters', async () => {
      const invalidId = 'bad req with spaces & <script>';
      const res = await request(app).get('/api/health').set('X-Request-Id', invalidId);
      expect(res.headers['x-request-id']).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
      expect(res.body.requestId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it('shields stack traces from error responses', async () => {
      vi.spyOn(geminiModule, 'generateCelebrationPlan').mockRejectedValueOnce(
        new Error('Sensitive internal failure')
      );

      const res = await request(app)
        .post('/api/plan')
        .send(SAMPLE_PLANNER_INPUT)
        .set('X-Forwarded-For', `ip-sec-${Date.now()}`);

      expect(res.body).not.toHaveProperty('stack');
      expect(res.body).toHaveProperty('requestId');
    });

    it('allows trusted origins in CORS allowlist and rejects untrusted origins with 403', async () => {
      vi.spyOn(geminiModule, 'testGeminiConnection').mockResolvedValueOnce({
        ok: true,
        model: 'gemini-3-flash-preview',
        response: 'ok',
      });

      // Allowed origin: localhost
      const allowedRes = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');
      expect(allowedRes.headers['access-control-allow-origin']).toBe('http://localhost:3000');

      // Untrusted origin: malicious.example.com
      const blockedRes = await request(app)
        .get('/api/health')
        .set('Origin', 'https://malicious.example.com');
      expect(blockedRes.status).toBe(403);
      expect(blockedRes.headers['access-control-allow-origin']).toBeUndefined();
      expect(blockedRes.body).toHaveProperty('error', 'Forbidden');
    });
  });
});
