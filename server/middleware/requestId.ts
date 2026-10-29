import { Request, Response, NextFunction } from 'express';

const VALID_REQUEST_ID_REGEX = /^[\w-]{1,64}$/;

function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Middleware assigning a validated or generated Request ID.
 * Accepts a client X-Request-Id only if it is a single string matching /^[\w-]{1,64}$/;
 * otherwise securely generates a unique diagnostic correlation identifier.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const headerVal = req.headers['x-request-id'];
  const candidateId = typeof headerVal === 'string' ? headerVal : undefined;

  const reqId =
    candidateId && VALID_REQUEST_ID_REGEX.test(candidateId) ? candidateId : generateRequestId();

  req.id = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
}
