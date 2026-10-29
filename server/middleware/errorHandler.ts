import { Request, Response, NextFunction } from 'express';
import { sanitizeLogData } from '../sanitizer.ts';
import { toAppError, ERROR_CODES, AppError } from '../errors.ts';
import { SERVER_CONFIG } from '../../src/constants/index.ts';

interface SyntaxErrorWithStatus extends SyntaxError {
  status: number;
}

interface EntityTooLargeError {
  type: string;
}

function isSyntaxErrorWithStatus(err: unknown): err is SyntaxErrorWithStatus {
  return err instanceof SyntaxError && typeof (err as { status?: unknown }).status === 'number';
}

function isEntityTooLargeError(err: unknown): err is EntityTooLargeError {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { type?: unknown }).type === 'entity.too.large'
  );
}

/**
 * Handles JSON parsing and payload-too-large syntax errors from express.json.
 */
export function bodyParserErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (isSyntaxErrorWithStatus(err) && err.status === 400) {
    res.status(400).json({
      error: 'Malformed JSON payload',
      message: 'The request body could not be parsed as valid JSON.',
    });
    return;
  }
  if (isEntityTooLargeError(err)) {
    res.status(413).json({
      error: 'Payload too large',
      message: `Request payload exceeds the ${SERVER_CONFIG.JSON_BODY_LIMIT} limit.`,
    });
    return;
  }
  next(err);
}

/**
 * Maps error status codes and error codes to client-facing error titles.
 */
function getErrorTitle(appError: AppError): string {
  if (appError.title) return appError.title;
  if (appError.code === ERROR_CODES.VALIDATION_ERROR) return 'Invalid request parameters';
  if (appError.statusCode === 400) return 'Invalid request';
  if (appError.statusCode === 401) return 'Unauthorized';
  if (appError.statusCode === 403) return 'Forbidden';
  if (appError.statusCode === 404) return 'Not found';
  if (appError.statusCode === 429) return 'Rate limit exceeded';
  if (appError.statusCode === 502) return 'Service unavailable';
  if (appError.statusCode === 504) return 'Gateway timeout';
  return 'Internal server error';
}

/**
 * Catch-all final error handling middleware.
 * Formats all error responses consistently and logs sanitized diagnostics strictly for 5xx responses.
 */
export function finalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const appError = toAppError(err);
  const requestId = req.id ?? 'unknown';

  // Log sanitized errors strictly for 5xx server-side failures
  if (appError.statusCode >= 500) {
    const safeLog = sanitizeLogData(err);
    console.error(`[Server Error ${requestId}]:`, safeLog);
  }

  const title = getErrorTitle(appError);

  res.status(appError.statusCode).json({
    error: title,
    message: appError.message,
    requestId,
  });
}
