import { Request, Response, NextFunction } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wraps asynchronous Express route handlers to automatically forward unhandled rejections to next(err).
 */
export function asyncHandler(fn: AsyncRequestHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
