import { describe, it, expect } from 'vitest';
import { normalizeClientError } from '../../src/utils/errorHandler';

describe('Client Error Handler (normalizeClientError)', () => {
  it('categorizes quota / 429 errors with friendly rate limit advice and retry capability', () => {
    const error = new Error('Resource has been exhausted (e.g. check quota) 429');
    const normalized = normalizeClientError(error);

    expect(normalized.category).toBe('quota');
    expect(normalized.title).toBe('AI Capacity Limit Reached');
    expect(normalized.canRetry).toBe(true);
  });

  it('categorizes timeouts and 504 errors correctly', () => {
    const error = new Error('Generation timed out after 90 seconds');
    const normalized = normalizeClientError(error);

    expect(normalized.category).toBe('timeout');
    expect(normalized.title).toBe('Generation Timed Out');
    expect(normalized.canRetry).toBe(true);
  });

  it('categorizes offline and network connectivity drops', () => {
    const error = new Error('Failed to fetch');
    const normalized = normalizeClientError(error);

    expect(normalized.category).toBe('network');
    expect(normalized.title).toBe('Network Connection Issue');
    expect(normalized.canRetry).toBe(true);
  });

  it('categorizes parameter validation errors without retry capability', () => {
    const error = new Error('Invalid city name or budget parameter');
    const normalized = normalizeClientError(error);

    expect(normalized.category).toBe('validation');
    expect(normalized.title).toBe('Invalid Event Parameters');
    expect(normalized.canRetry).toBe(false);
  });

  it('categorizes API key / authorization errors without retry capability', () => {
    const error = new Error('API_KEY_INVALID: Please configure GEMINI_API_KEY');
    const normalized = normalizeClientError(error);

    expect(normalized.category).toBe('unauthorized');
    expect(normalized.title).toBe('Authentication Required');
    expect(normalized.canRetry).toBe(false);
  });

  it('handles non-Error objects and unexpected exceptions gracefully', () => {
    const normalized = normalizeClientError('Unexpected internal glitch');
    expect(normalized.category).toBe('server');
    expect(normalized.title).toBe('Celebration Planning Notice');
    expect(normalized.canRetry).toBe(true);
  });
});
