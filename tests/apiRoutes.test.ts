import { describe, it, expect } from 'vitest';
import { toAppError } from '../server/errors';

describe('Gemini Error Diagnostics and Formatting with toAppError', () => {
  it('formats 429 quota error into friendly rate limit message', () => {
    const error = Object.assign(new Error('Quota exceeded'), { status: 429 });
    const result = toAppError(error);
    expect(result.statusCode).toBe(429);
    expect(result.message).toContain('quota exceeded or rate limited');
  });

  it('formats 404 model not found error with model details', () => {
    const error = Object.assign(new Error('Model not found'), { status: 404 });
    const result = toAppError(error);
    expect(result.statusCode).toBe(502);
    expect(result.message).toContain('unavailable');
  });

  it('formats 401/403 authorization failures safely as 502 bad gateway', () => {
    const error = Object.assign(new Error('Permission denied'), { status: 401 });
    const result = toAppError(error);
    expect(result.statusCode).toBe(502);
    expect(result.message).toContain('authentication failed');
  });

  it('formats timeout errors appropriately', () => {
    const error = new Error('Request timed out after deadline');
    const result = toAppError(error);
    expect(result.statusCode).toBe(504);
    expect(result.message).toContain('timed out');
  });

  it('formats generic service errors with sanitized message avoiding raw upstream leak', () => {
    const error = new Error('Unexpected internal database secret leak failure');
    const result = toAppError(error);
    expect(result.statusCode).toBe(500);
    expect(result.message).not.toContain('secret leak');
    expect(result.message).toContain('unexpected error');
  });
});
