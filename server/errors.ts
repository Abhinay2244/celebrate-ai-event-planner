/**
 * Server-side error handling architecture for Celebrate AI.
 * Provides a unified AppError class, standardized error codes, and formatting utilities.
 */

export const ERROR_CODES = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  RATE_LIMITED: 'RATE_LIMITED',
  MODEL_UNAVAILABLE: 'MODEL_UNAVAILABLE',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
  SERVICE_ERROR: 'SERVICE_ERROR',
  API_KEY_MISSING: 'API_KEY_MISSING',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Custom operational error class for all server-side application errors.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: ErrorCode;
  public readonly title?: string;

  constructor(
    message: string,
    statusCode = 500,
    code: ErrorCode = ERROR_CODES.INTERNAL_ERROR,
    isOperational = true,
    title?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.title = title;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

interface ErrorWithStatus {
  status?: number;
  statusCode?: number;
  message?: string;
}

/**
 * Checks if an unknown error object contains an HTTP status code.
 */
function extractStatusCode(err: unknown): number | null {
  if (typeof err === 'object' && err !== null) {
    const candidate = err as ErrorWithStatus;
    if (typeof candidate.status === 'number') return candidate.status;
    if (typeof candidate.statusCode === 'number') return candidate.statusCode;
  }
  return null;
}

/**
 * Formats any caught exception into a structured AppError.
 * Classifies by HTTP status code first, then uses message heuristics as fallback.
 * Client-facing messages are strictly sanitized and never contain raw upstream error text.
 */
export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) {
    return err;
  }

  const status = extractStatusCode(err);
  const rawMsg = err instanceof Error ? err.message : String(err);
  const lowerMsg = rawMsg.toLowerCase();

  // 1. Classify by HTTP status code first
  if (status === 429) {
    return new AppError(
      'Gemini quota exceeded or rate limited. Please try again shortly.',
      429,
      ERROR_CODES.QUOTA_EXCEEDED
    );
  }

  if (status === 404) {
    return new AppError(
      'The requested AI model is currently unavailable.',
      502,
      ERROR_CODES.MODEL_UNAVAILABLE
    );
  }

  if (status === 401 || status === 403) {
    return new AppError(
      'Upstream AI service authentication failed.',
      502,
      ERROR_CODES.SERVICE_ERROR
    );
  }

  if (status === 504) {
    return new AppError(
      'Gemini request timed out. Please retry with a simpler prompt.',
      504,
      ERROR_CODES.GATEWAY_TIMEOUT
    );
  }

  if (status === 400) {
    return new AppError('Invalid request parameters.', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  // 2. Message matching only as a fallback
  if (lowerMsg.includes('quota') || lowerMsg.includes('resource_exhausted')) {
    return new AppError(
      'Gemini quota exceeded or rate limited. Please try again shortly.',
      429,
      ERROR_CODES.QUOTA_EXCEEDED
    );
  }

  if (
    lowerMsg.includes('timeout') ||
    lowerMsg.includes('deadline') ||
    lowerMsg.includes('etimedout')
  ) {
    return new AppError(
      'Gemini request timed out. Please retry with a simpler prompt.',
      504,
      ERROR_CODES.GATEWAY_TIMEOUT
    );
  }

  if (
    lowerMsg.includes('unauthenticated') ||
    lowerMsg.includes('permission_denied') ||
    lowerMsg.includes('api_key_invalid')
  ) {
    return new AppError(
      'Upstream AI service authentication failed.',
      502,
      ERROR_CODES.SERVICE_ERROR
    );
  }

  const effectiveStatus = status && status >= 400 && status < 600 ? status : 500;
  return new AppError(
    'An unexpected error occurred while communicating with the service.',
    effectiveStatus,
    ERROR_CODES.SERVICE_ERROR
  );
}
