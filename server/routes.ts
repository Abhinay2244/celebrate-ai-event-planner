import { Router, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { plannerInputSchema, refineRequestSchema } from '../src/types/planner.ts';
import { generateCelebrationPlan, refineCelebrationPlan, testGeminiConnection } from './gemini.ts';
import { toAppError } from './errors.ts';
import {
  corsOptions,
  requestIdMiddleware,
  rateLimiter,
  routeQuerySchema,
  routeParamsSchema,
} from './security.ts';
import { sanitizeLogData } from './sanitizer.ts';
import { planCache } from './planCache.ts';

export const apiRouter = Router();

// Strict CORS allowlist
apiRouter.use(cors(corsOptions));

// Assign Request ID header and correlation metadata
apiRouter.use(requestIdMiddleware);

// In-memory sliding window rate limiter
apiRouter.use(rateLimiter);

/**
 * Middleware ensuring query and path parameter shapes conform to bounds.
 */
export function validateRequestShape(req: Request, res: Response, next: NextFunction): void {
  const queryResult = routeQuerySchema.safeParse(req.query);
  const paramsResult = routeParamsSchema.safeParse(req.params);

  if (!queryResult.success || !paramsResult.success) {
    res.status(400).json({
      error: 'Invalid request parameters',
      message: 'Query or route parameters exceed allowable limits.',
      requestId: req.id,
    });
    return;
  }
  next();
}

/**
 * Shared helper to format, log once safely, and send error responses.
 */
function sendError(res: Response, req: Request, err: unknown, title: string): Response {
  const safeLog = sanitizeLogData(err);
  console.error(`[API Error ${req.id}]:`, safeLog);
  const appError = toAppError(err);
  return res.status(appError.statusCode).json({
    error: title,
    message: appError.message,
    requestId: req.id,
  });
}

// Health check endpoint (lightweight by default; deep check via ?deep=true)
apiRouter.get('/health', async (req: Request, res: Response) => {
  const queryValidation = routeQuerySchema.safeParse(req.query);
  if (!queryValidation.success) {
    return res.status(400).json({
      error: 'Invalid query parameters',
      requestId: req.id,
    });
  }

  const isDeepCheck = req.query.deep === 'true';
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
});

// Generate Celebration Plan (supports /plan and /plan/generate)
apiRouter.post(
  ['/plan', '/plan/generate'],
  validateRequestShape,
  async (req: Request, res: Response) => {
    try {
      const parseResult = plannerInputSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errorMessages = parseResult.error.issues
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        return res.status(400).json({
          error: 'Invalid celebration request parameters',
          message: errorMessages,
          requestId: req.id,
        });
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
);

// Refine Celebration Plan
apiRouter.post('/plan/refine', validateRequestShape, async (req: Request, res: Response) => {
  try {
    const parseResult = refineRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid refinement parameters',
        message: parseResult.error.issues.map((e) => e.message).join(', '),
        requestId: req.id,
      });
    }

    const result = await refineCelebrationPlan(parseResult.data);
    return res.json({
      ...result,
      requestId: req.id,
    });
  } catch (err: unknown) {
    return sendError(res, req, err, 'Refinement error');
  }
});
