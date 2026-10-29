import cors from 'cors';
import { AppError, ERROR_CODES } from '../errors.ts';

/**
 * Strict allowlist of trusted origins for CORS checks.
 * Subdomain wildcard on .run.app covers all Google Cloud Run deployments.
 */
export const ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
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
      Boolean(process.env.APP_URL && origin === process.env.APP_URL);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(
        new AppError(`CORS blocked: Origin ${origin} is not allowed`, 403, ERROR_CODES.FORBIDDEN)
      );
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Health-Check-Token'],
  exposedHeaders: ['X-Request-Id', 'Retry-After'],
  credentials: true,
  maxAge: 86400,
};

export const corsMiddleware = cors(corsOptions);
