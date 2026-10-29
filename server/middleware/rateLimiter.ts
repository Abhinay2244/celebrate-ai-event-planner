import { Request, Response, NextFunction } from 'express';
import { NETWORK_CONFIG } from '../../src/constants/index.ts';
import { AppError, ERROR_CODES } from '../errors.ts';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory fixed-window rate limiter storage
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = NETWORK_CONFIG.RATE_LIMIT_WINDOW_MS;
const MAX_REQUESTS_PER_WINDOW = NETWORK_CONFIG.RATE_LIMIT_MAX_REQUESTS;

/**
 * Sweeps expired records from the rate limiter map to prevent unbounded memory growth.
 */
export function sweepExpiredRateLimitEntries(now = Date.now()): void {
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

// Periodic background sweep every window interval, unreferenced to avoid keeping the process alive
const sweepInterval = setInterval(() => {
  sweepExpiredRateLimitEntries();
}, RATE_LIMIT_WINDOW_MS);
sweepInterval.unref?.();

/**
 * In-memory fixed-window rate limiter middleware.
 * Uses Express req.ip (enabled by trust proxy) to track client volume.
 */
export function rateLimiter(req: Request, _res: Response, next: NextFunction): void {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const clientRecord = rateLimitMap.get(clientIp);

  if (!clientRecord || now > clientRecord.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (clientRecord.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.max(1, Math.ceil((clientRecord.resetTime - now) / 1000));
    _res.setHeader('Retry-After', String(retryAfterSeconds));
    throw new AppError(
      'Rate limit exceeded. Please wait a moment before sending more celebration requests.',
      429,
      ERROR_CODES.RATE_LIMITED,
      true,
      'Rate limit exceeded'
    );
  }

  clientRecord.count += 1;
  next();
}

/**
 * Resets the in-memory rate limiter state (useful in test teardown).
 */
export function resetRateLimiter(): void {
  rateLimitMap.clear();
}
