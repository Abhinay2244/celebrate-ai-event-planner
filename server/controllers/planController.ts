import { Request, Response } from 'express';
import { plannerInputSchema, refineRequestSchema } from '../../src/types/planner.ts';
import { generateCelebrationPlan, refineCelebrationPlan, testGeminiConnection } from '../gemini.ts';
import { AppError, ERROR_CODES } from '../errors.ts';
import { planCache } from '../planCache.ts';
import { HEALTH_CHECK_QUERY_PARAM, HEALTH_CHECK_HEADER } from '../../src/constants/index.ts';

/**
 * Controller handling GET /api/health requests.
 * Lightweight by default. Deep connection check is gated behind HEALTH_CHECK_TOKEN in production.
 */
export async function handleHealth(req: Request, res: Response): Promise<Response> {
  const isDeepRequested = req.query[HEALTH_CHECK_QUERY_PARAM] === 'true';

  if (!isDeepRequested) {
    return res.status(200).json({
      status: 'ok',
      service: 'Celebrate AI API',
      requestId: req.id ?? 'unknown',
      timestamp: new Date().toISOString(),
    });
  }

  // Gate deep health checks in production or when token is configured
  const token = process.env.HEALTH_CHECK_TOKEN;
  if (token && req.headers[HEALTH_CHECK_HEADER] !== token) {
    return res.status(200).json({
      status: 'ok',
      service: 'Celebrate AI API',
      requestId: req.id ?? 'unknown',
      timestamp: new Date().toISOString(),
    });
  }

  const geminiTest = await testGeminiConnection();
  return res.status(geminiTest.ok ? 200 : 503).json({
    status: geminiTest.ok ? 'ok' : 'degraded',
    service: 'Celebrate AI API',
    gemini: geminiTest,
    requestId: req.id ?? 'unknown',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Controller handling POST /api/plan and /api/plan/generate requests.
 */
export async function handleGeneratePlan(req: Request, res: Response): Promise<Response> {
  const parseResult = plannerInputSchema.safeParse(req.body);
  if (!parseResult.success) {
    const errorMessages = parseResult.error.issues
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
    throw new AppError(
      errorMessages,
      400,
      ERROR_CODES.VALIDATION_ERROR,
      true,
      'Invalid celebration request parameters'
    );
  }

  const input = parseResult.data;
  const cacheKey = planCache.buildKey(input);
  const cachedPlan = planCache.get(cacheKey);

  if (cachedPlan) {
    return res.json({
      plan: cachedPlan,
      cached: true,
      requestId: req.id,
    });
  }

  const plan = await generateCelebrationPlan(input);
  planCache.set(cacheKey, plan);

  return res.json({
    plan,
    cached: false,
    requestId: req.id,
  });
}

/**
 * Controller handling POST /api/plan/refine requests.
 */
export async function handleRefinePlan(req: Request, res: Response): Promise<Response> {
  const parseResult = refineRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    const errorMessages = parseResult.error.issues.map((e) => e.message).join(', ');
    throw new AppError(
      errorMessages,
      400,
      ERROR_CODES.VALIDATION_ERROR,
      true,
      'Invalid refinement parameters'
    );
  }

  const result = await refineCelebrationPlan(parseResult.data);
  return res.json({
    ...result,
    requestId: req.id,
  });
}
