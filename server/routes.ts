import { Router, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { corsOptions, requestIdMiddleware, rateLimiter, routeQuerySchema } from './security.ts';
import {
  handleHealth,
  handleGeneratePlan,
  handleRefinePlan,
  sendError,
} from './controllers/planController.ts';

export const apiRouter = Router();

// Strict CORS allowlist
apiRouter.use(cors(corsOptions));

// Assign Request ID header and correlation metadata
apiRouter.use(requestIdMiddleware);

// In-memory sliding window rate limiter
apiRouter.use(rateLimiter);

/**
 * Middleware ensuring query parameters conform to bounds.
 */
export function validateRequestShape(req: Request, res: Response, next: NextFunction): void {
  const queryResult = routeQuerySchema.safeParse(req.query);
  if (!queryResult.success) {
    sendError(
      res,
      req,
      new Error('Query parameters exceed allowable limits.'),
      'Invalid request parameters',
      400
    );
    return;
  }
  next();
}

// Health check endpoint (lightweight by default; deep check via ?deep=true)
apiRouter.get('/health', validateRequestShape, handleHealth);

// Generate Celebration Plan (supports /plan and /plan/generate)
apiRouter.post(['/plan', '/plan/generate'], validateRequestShape, handleGeneratePlan);

// Refine Celebration Plan (chat refinement)
apiRouter.post('/plan/refine', validateRequestShape, handleRefinePlan);
