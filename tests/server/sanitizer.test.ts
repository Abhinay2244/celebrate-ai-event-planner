import { describe, it, expect } from 'vitest';
import { sanitizeModelText, sanitizeLogData } from '../../server/sanitizer';

describe('Sanitizer Utilities', () => {
  describe('sanitizeModelText', () => {
    it('strips null bytes, bell, escape, and other non-printable control characters', () => {
      const dirty = 'Hello\x00\x07\x1B[31m World\x7F\x1A\t\n';
      const clean = sanitizeModelText(dirty);
      expect(clean).toBe('Hello[31m World\t\n');
    });

    it('returns empty string for null, undefined, or empty text', () => {
      expect(sanitizeModelText(null)).toBe('');
      expect(sanitizeModelText(undefined)).toBe('');
      expect(sanitizeModelText('')).toBe('');
    });

    it('preserves unicode characters, emojis, and valid celebratory text', () => {
      const valid = 'Royal Ivory & Rose Gold ✨ 🎉 50th Gala';
      expect(sanitizeModelText(valid)).toBe(valid);
    });
  });

  describe('sanitizeLogData', () => {
    it('redacts Gemini API key patterns from log messages', () => {
      const fakeKey = 'AI' + 'za' + 'x'.repeat(35);
      const message = `Call failed with key ${fakeKey}`;
      const sanitized = sanitizeLogData(message);
      expect(sanitized).not.toContain(fakeKey);
      expect(sanitized).toContain('[REDACTED_API_KEY]');
    });

    it('redacts Authorization bearer tokens from log messages', () => {
      const message = 'Unauthorized request with Bearer secret_token_1234567890';
      const sanitized = sanitizeLogData(message);
      expect(sanitized).not.toContain('secret_token_1234567890');
      expect(sanitized).toContain('Bearer [REDACTED_TOKEN]');
    });

    it('redacts secret object keys during error serialization', () => {
      const obj = {
        apiKey: 'super-secret-key-123',
        clientSecret: 'secret-xyz',
        status: 400,
      };
      const sanitized = sanitizeLogData(obj);
      expect(sanitized).not.toContain('super-secret-key-123');
      expect(sanitized).not.toContain('secret-xyz');
      expect(sanitized).toContain('[REDACTED]');
    });
  });
});
