/**
 * Server-side error handling architecture for Celebrate AI.
 * Provides a unified AppError class and error formatting utilities.
 */

import { NETWORK_CONFIG } from '../src/constants/index.ts';

/**
 * Custom operational error class for all server-side application errors.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
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
function extractStatusCode(err: unknown): number {
  if (typeof err === 'object' && err !== null) {
    const candidate = err as ErrorWithStatus;
    if (typeof candidate.status === 'number') return candidate.status;
    if (typeof candidate.statusCode === 'number') return candidate.statusCode;
  }
  return 500;
}

/**
 * Formats any caught exception into a structured AppError.
 *
 * @param err The unknown error caught in server routes or Gemini services
 * @returns A normalized AppError with accurate HTTP status and sanitized message
 */
export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) {
    return err;
  }

  const rawMsg = err instanceof Error ? err.message : String(err);
  const status = extractStatusCode(err);
  const lowerMsg = rawMsg.toLowerCase();

  if (!process.env.GEMINI_API_KEY) {
    return new AppError(
      'API key missing: GEMINI_API_KEY is not configured in the server environment.',
      500,
      'API_KEY_MISSING'
    );
  }

  if (
    rawMsg.includes('429') ||
    lowerMsg.includes('quota') ||
    lowerMsg.includes('resource_exhausted')
  ) {
    return new AppError(
      'Gemini quota exceeded or rate limited. Please try again shortly.',
      429,
      'QUOTA_EXCEEDED'
    );
  }

  if (rawMsg.includes('404') || lowerMsg.includes('not found') || lowerMsg.includes('model')) {
    return new AppError(
      `Model unavailable (${NETWORK_CONFIG.GEMINI_MODEL}): ${rawMsg}`,
      502,
      'MODEL_UNAVAILABLE'
    );
  }

  if (
    rawMsg.includes('401') ||
    rawMsg.includes('403') ||
    lowerMsg.includes('api_key_invalid') ||
    lowerMsg.includes('unauthenticated') ||
    lowerMsg.includes('permission_denied')
  ) {
    return new AppError(
      'API authentication failed: Invalid or unauthorized GEMINI_API_KEY.',
      401,
      'UNAUTHORIZED'
    );
  }

  if (
    lowerMsg.includes('timeout') ||
    lowerMsg.includes('aborted') ||
    lowerMsg.includes('deadline')
  ) {
    return new AppError(
      `Gemini request timed out after ${NETWORK_CONFIG.GEMINI_TIMEOUT_MS / 1000} seconds. Please retry with a simpler prompt.`,
      504,
      'GATEWAY_TIMEOUT'
    );
  }

  return new AppError(`Gemini service error: ${rawMsg}`, status, 'SERVICE_ERROR');
}
