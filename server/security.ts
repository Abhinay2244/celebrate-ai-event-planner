import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { NETWORK_CONFIG } from '../src/constants/index.ts';

// Declare custom request properties for TypeScript
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

/**
 * Strict allowlist of trusted origins for CORS checks.
 */
export const ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/[a-z0-9-]+-211474125508\.asia-southeast1\.run\.app$/,
  /^https:\/\/[a-z0-9-]+\.run\.app$/,
  /^https:\/\/[a-z0-9-]+\.google\.com$/,
  /^https:\/\/aistudio\.google\.com$/,
];

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Requests with no origin (supertest, mobile clients, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    const isAllowed =
      ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin)) ||
      (process.env.APP_URL && origin === process.env.APP_URL);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: Origin ${origin} is not allowed`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id'],
  credentials: true,
  maxAge: 86400,
};

/**
 * Middleware assigning a unique Request ID for diagnostic correlation and security shielding.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const reqId =
    (req.headers['x-request-id'] as string) ||
    `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
  req.id = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
}

// In-memory sliding window rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = NETWORK_CONFIG.RATE_LIMIT_WINDOW_MS;
const MAX_REQUESTS_PER_WINDOW = NETWORK_CONFIG.RATE_LIMIT_MAX_REQUESTS;

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const clientIp =
    (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const clientRecord = rateLimitMap.get(clientIp);

  if (!clientRecord || now > clientRecord.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (clientRecord.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message:
        'Rate limit exceeded. Please wait a moment before sending more celebration requests.',
      requestId: req.id,
    });
  }

  clientRecord.count += 1;
  next();
}

/**
 * Strict Zod validator for route query parameters with length and key count caps.
 */
export const routeQuerySchema = z
  .record(z.string(), z.string().max(100))
  .refine((obj) => Object.keys(obj).length <= 10, 'Too many query parameters');

/**
 * Strict Zod validator for route params.
 */
export const routeParamsSchema = z
  .record(z.string(), z.string().max(100))
  .refine((obj) => Object.keys(obj).length <= 10, 'Too many route parameters');
