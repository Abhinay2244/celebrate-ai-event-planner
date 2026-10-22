import { Router, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { plannerInputSchema, refineRequestSchema } from '../src/types/planner.ts';
import { generateCelebrationPlan, refineCelebrationPlan, testGeminiConnection, formatGeminiError } from './gemini.ts';

export const apiRouter = Router();

// Apply security headers and CORS
apiRouter.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
    crossOriginEmbedderPolicy: false,
  })
);
apiRouter.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// In-memory request cache for identical plan generations (TTL: 1 hour)
const planCache = new Map<string, { plan: unknown; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

// Simple in-memory rate limiter (max 30 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const clientRecord = rateLimitMap.get(clientIp);

  if (!clientRecord || now > clientRecord.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (clientRecord.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Rate limit exceeded. Please wait a moment before sending more celebration requests.',
    });
  }

  clientRecord.count += 1;
  next();
}

apiRouter.use(rateLimiter);

// Health check route that sends a one-line prompt to Gemini to confirm key & model work
apiRouter.get('/health', async (_req: Request, res: Response) => {
  const geminiTest = await testGeminiConnection();
  res.status(geminiTest.ok ? 200 : 503).json({
    status: geminiTest.ok ? 'ok' : 'degraded',
    service: 'Celebrate AI API',
    gemini: geminiTest,
    timestamp: new Date().toISOString(),
  });
});

// Generate Celebration Plan
apiRouter.post('/plan/generate', async (req: Request, res: Response) => {
  try {
    const parseResult = plannerInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return res.status(400).json({
        error: 'Invalid celebration request parameters',
        message: errorMessages,
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
      });
    }

    // Call Gemini
    const plan = await generateCelebrationPlan(input);

    // Save in cache
    planCache.set(cacheKey, { plan, timestamp: now });

    return res.json({
      plan,
      cached: false,
    });
  } catch (err: unknown) {
    console.error('[API Route /plan/generate Error]:', err);
    const formatted = formatGeminiError(err);
    return res.status(formatted.status).json({
      error: 'Event generation error',
      message: formatted.message,
    });
  }
});

// Refine Celebration Plan
apiRouter.post('/plan/refine', async (req: Request, res: Response) => {
  try {
    const parseResult = refineRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid refinement parameters',
        message: parseResult.error.issues.map((e) => e.message).join(', '),
      });
    }

    const result = await refineCelebrationPlan(parseResult.data);
    return res.json(result);
  } catch (err: unknown) {
    console.error('[API Route /plan/refine Error]:', err);
    const formatted = formatGeminiError(err);
    return res.status(formatted.status).json({
      error: 'Refinement error',
      message: formatted.message,
    });
  }
});
