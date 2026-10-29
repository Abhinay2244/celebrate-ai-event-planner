import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError, ERROR_CODES } from '../errors.ts';

/**
 * Strict Zod validator for route query parameters with length and key count caps.
 */
export const routeQuerySchema = z
  .record(z.string(), z.string().max(100))
  .refine((obj) => Object.keys(obj).length <= 10, 'Too many query parameters');

/**
 * Middleware ensuring query parameters conform to strict shape bounds.
 * Throws AppError(400, VALIDATION_ERROR) if queries fail schema validation.
 */
export function validateRequestShape(req: Request, _res: Response, next: NextFunction): void {
  const queryResult = routeQuerySchema.safeParse(req.query);
  if (!queryResult.success) {
    throw new AppError(
      'Query parameters exceed allowable limits.',
      400,
      ERROR_CODES.VALIDATION_ERROR
    );
  }
  next();
}
