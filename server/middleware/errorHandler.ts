import { Request, Response, NextFunction } from 'express';
import { sanitizeLogData } from '../sanitizer.ts';

/**
 * Handles JSON parsing and payload-too-large syntax errors from express.json.
 */
export function jsonSyntaxErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    res.status(400).json({
      error: 'Malformed JSON payload',
      message: 'The request body could not be parsed as valid JSON.',
    });
    return;
  }
  if (err && (err as { type?: string }).type === 'entity.too.large') {
    res.status(413).json({
      error: 'Payload too large',
      message: 'Request payload exceeds the 250KB limit.',
    });
    return;
  }
  next(err);
}

/**
 * Catch-all final error handling middleware.
 * Prevents leaking raw internal stacks or uncaught exception details.
 */
export function finalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const safeLog = sanitizeLogData(err);
  console.error(`[Unhandled Server Error ${req.id || 'unknown'}]:`, safeLog);

  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected operational error occurred.',
    requestId: req.id || 'unknown',
  });
}
