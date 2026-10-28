/**
 * Sanitizes user-provided text destined for LLM prompts and API diagnostics.
 * Strips non-printable ASCII and Unicode control characters while preserving standard whitespace.
 *
 * @param text The input string to sanitize
 * @returns Clean string with control characters stripped
 */
export function sanitizeModelText(text: string | undefined | null): string {
  if (!text) return '';
  // Remove ASCII 0-8, 11-12, 14-31, 127 and Unicode control 128-159
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
}

/**
 * Sanitizes logging metadata to ensure API keys, authorization headers,
 * and sensitive secrets are never printed to terminal or server logs.
 *
 * @param obj Any arbitrary object or error
 * @returns Sanitized string safe for logging
 */
export function sanitizeLogData(obj: unknown): string {
  if (obj === null || obj === undefined) return '';
  if (typeof obj === 'string') {
    // Redact any patterns resembling API keys or tokens
    return obj
      .replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_API_KEY]')
      .replace(/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [REDACTED_TOKEN]')
      .replace(/GEMINI_API_KEY(=|:)\s*["']?[^"',\s]+["']?/gi, 'GEMINI_API_KEY=[REDACTED]');
  }
  if (obj instanceof Error) {
    return sanitizeLogData(obj.message);
  }
  try {
    const serialized = JSON.stringify(obj, (key, value) => {
      if (/key|secret|token|password|auth/i.test(key)) {
        return '[REDACTED]';
      }
      return value;
    });
    return sanitizeLogData(serialized);
  } catch {
    return '[Unserializable data]';
  }
}
