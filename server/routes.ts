import { Router } from 'express';
import { corsMiddleware } from './middleware/cors.ts';
import { requestIdMiddleware } from './middleware/requestId.ts';
import { rateLimiter } from './middleware/rateLimiter.ts';
import { validateRequestShape } from './middleware/validateRequest.ts';
import { asyncHandler } from './middleware/asyncHandler.ts';
import {
  handleHealth,
  handleGeneratePlan,
  handleRefinePlan,
} from './controllers/planController.ts';

export const apiRouter = Router();

// Strict CORS allowlist
apiRouter.use(corsMiddleware);

// Assign Request ID header and correlation metadata
apiRouter.use(requestIdMiddleware);

// Fixed-window rate limiter
apiRouter.use(rateLimiter);

// Health check endpoint (lightweight by default; deep check via ?deep=true)
apiRouter.get('/health', validateRequestShape, asyncHandler(handleHealth));

// Generate Celebration Plan (supports /plan and /plan/generate)
apiRouter.post(['/plan', '/plan/generate'], validateRequestShape, asyncHandler(handleGeneratePlan));

// Refine Celebration Plan (chat refinement)
apiRouter.post('/plan/refine', validateRequestShape, asyncHandler(handleRefinePlan));
