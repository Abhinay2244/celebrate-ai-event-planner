import { Request, Response } from 'express';
import { plannerInputSchema, refineRequestSchema } from '../../src/types/planner.ts';
import { generateCelebrationPlan, refineCelebrationPlan, testGeminiConnection } from '../gemini.ts';
import { toAppError } from '../errors.ts';
import { sanitizeLogData } from '../sanitizer.ts';
import { planCache } from '../planCache.ts';
import { HEALTH_CHECK_QUERY_PARAM } from '../../src/constants/index.ts';

/**
 * Shared helper to format, log once safely, and send error responses.
 */
export function sendError(
  res: Response,
  req: Request,
  err: unknown,
  title: string,
  status?: number
): Response {
  const safeLog = sanitizeLogData(err);
  console.error(`[API Error ${req.id}]:`, safeLog);
  const appError = toAppError(err);
  const statusCode = status ?? appError.statusCode;
  const message =
    status === 400 && err instanceof Error ? err.message : appError.message;

  return res.status(statusCode).json({
    error: title,
    message,
    requestId: req.id,
  });
}

/**
 * Controller handling GET /api/health requests.
 */
export async function handleHealth(req: Request, res: Response): Promise<Response> {
  const isDeepCheck = req.query[HEALTH_CHECK_QUERY_PARAM] === 'true';
  if (!isDeepCheck) {
    return res.status(200).json({
      status: 'ok',
      service: 'Celebrate AI API',
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  }

  const geminiTest = await testGeminiConnection();
  return res.status(geminiTest.ok ? 200 : 503).json({
    status: geminiTest.ok ? 'ok' : 'degraded',
    service: 'Celebrate AI API',
    gemini: geminiTest,
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Controller handling POST /api/plan and /api/plan/generate requests.
 */
export async function handleGeneratePlan(req: Request, res: Response): Promise<Response> {
  try {
    const parseResult = plannerInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return sendError(
        res,
        req,
        new Error(errorMessages),
        'Invalid celebration request parameters',
        400
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
  } catch (err: unknown) {
    return sendError(res, req, err, 'Event generation error');
  }
}

/**
 * Controller handling POST /api/plan/refine requests.
 */
export async function handleRefinePlan(req: Request, res: Response): Promise<Response> {
  try {
    const parseResult = refineRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues.map((e) => e.message).join(', ');
      return sendError(
        res,
        req,
        new Error(errorMessages),
        'Invalid refinement parameters',
        400
      );
    }

    const result = await refineCelebrationPlan(parseResult.data);
    return res.json({
      ...result,
      requestId: req.id,
    });
  } catch (err: unknown) {
    return sendError(res, req, err, 'Refinement error');
  }
}
