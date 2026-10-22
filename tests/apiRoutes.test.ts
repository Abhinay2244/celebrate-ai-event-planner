import { describe, it, expect, vi } from 'vitest';
import { formatGeminiError } from '../server/gemini';

describe('Gemini Error Diagnostics and Formatting', () => {
  it('formats 429 quota error into friendly rate limit message', () => {
    const error = new Error('Resource has been exhausted (e.g. check quota) 429');
    const result = formatGeminiError(error);
    expect(result.status).toBe(429);
    expect(result.message).toContain('quota exceeded or rate limited');
  });

  it('formats 404 model not found error with model details', () => {
    const error = new Error('Model models/gemini-invalid was not found');
    const result = formatGeminiError(error);
    expect(result.status).toBe(502);
    expect(result.message).toContain('Model unavailable');
  });

  it('formats 401/403 authorization failures safely', () => {
    const error = new Error('API_KEY_INVALID or permission_denied 401');
    const result = formatGeminiError(error);
    expect(result.status).toBe(401);
    expect(result.message).toContain('authentication failed');
  });

  it('formats timeout errors appropriately', () => {
    const error = new Error('Request timed out after deadline');
    const result = formatGeminiError(error);
    expect(result.status).toBe(504);
    expect(result.message).toContain('timed out');
  });

  it('formats generic service errors without crashing', () => {
    const error = new Error('Unexpected network failure');
    const result = formatGeminiError(error);
    expect(result.status).toBe(500);
    expect(result.message).toContain('Unexpected network failure');
  });
});
