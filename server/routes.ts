import { Router, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { plannerInputSchema, refineRequestSchema } from '../src/types/planner.ts';
import {
  generateCelebrationPlan,
  refineCelebrationPlan,
  testGeminiConnection,
  formatGeminiError,
} from './gemini.ts';
import { NETWORK_CONFIG } from '../src/constants/index.ts';
import {
  corsOptions,
  requestIdMiddleware,
  rateLimiter,
  routeQuerySchema,
  routeParamsSchema,
} from './security.ts';
import { sanitizeLogData } from './sanitizer.ts';

export const apiRouter = Router();

// Security headers with strict options
apiRouter.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
    crossOriginEmbedderPolicy: false,
    xContentTypeOptions: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    dnsPrefetchControl: { allow: false },
    hidePoweredBy: true,
  })
);

// Strict CORS allowlist
apiRouter.use(cors(corsOptions));

// Assign Request ID header and correlation metadata
apiRouter.use(requestIdMiddleware);

// In-memory sliding window rate limiter
apiRouter.use(rateLimiter);

// In-memory request cache for identical plan generations (TTL: 1 hour)
const planCache = new Map<string, { plan: unknown; timestamp: number }>();
const CACHE_TTL_MS = NETWORK_CONFIG.CACHE_TTL_MS;

// Health check endpoint
apiRouter.get('/health', async (req: Request, res: Response) => {
  const queryValidation = routeQuerySchema.safeParse(req.query);
  if (!queryValidation.success) {
    return res.status(400).json({
      error: 'Invalid query parameters',
      requestId: req.id,
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
apiRouter.post(['/plan', '/plan/generate'], async (req: Request, res: Response) => {
  // Validate query & params
  if (
    !routeQuerySchema.safeParse(req.query).success ||
    !routeParamsSchema.safeParse(req.params).success
  ) {
    return res.status(400).json({
      error: 'Invalid request parameters',
      message: 'Query or route parameters exceed allowable limits.',
      requestId: req.id,
    });
  }

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

    // Check identical request cache
    const cacheKey = JSON.stringify({
      eventType: input.eventType,
      city: input.city.toLowerCase().trim(),
      guestCount: input.guestCount,
      totalBudget: input.totalBudget,
      theme: input.theme.toLowerCase().trim(),
      notes: (input.specialNotes || '').toLowerCase().trim(),
    });

    const cached = planCache.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return res.json({
        plan: cached.plan,
        cached: true,
        requestId: req.id,
      });
    }

    // Call Gemini with prompt injection defense
    const plan = await generateCelebrationPlan(input);

    // Save in cache
    planCache.set(cacheKey, { plan, timestamp: now });

    return res.json({
      plan,
      cached: false,
      requestId: req.id,
    });
  } catch (err: unknown) {
    const safeErrorLog = sanitizeLogData(err);
    console.error(`[API Error ${req.id}]:`, safeErrorLog);
    const formatted = formatGeminiError(err);
    return res.status(formatted.status).json({
      error: 'Event generation error',
      message: formatted.message,
      requestId: req.id,
    });
  }
});

// Refine Celebration Plan
apiRouter.post('/plan/refine', async (req: Request, res: Response) => {
  // Validate query & params
  if (
    !routeQuerySchema.safeParse(req.query).success ||
    !routeParamsSchema.safeParse(req.params).success
  ) {
    return res.status(400).json({
      error: 'Invalid request parameters',
      message: 'Query or route parameters exceed allowable limits.',
      requestId: req.id,
    });
  }

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
    const safeErrorLog = sanitizeLogData(err);
    console.error(`[API Refine Error ${req.id}]:`, safeErrorLog);
    const formatted = formatGeminiError(err);
    return res.status(formatted.status).json({
      error: 'Refinement error',
      message: formatted.message,
      requestId: req.id,
    });
  }
});
