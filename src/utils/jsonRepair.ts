/**
 * Robust JSON extraction and parsing fallback for LLM responses.
 * Handles markdown wrapping, trailing commas, and stray commentary.
 */
export function extractAndParseJSON<T = unknown>(rawText: string, fallback?: T): T {
  if (!rawText || typeof rawText !== 'string') {
    if (fallback !== undefined) return fallback;
    throw new Error('Input text is empty or not a string');
  }

  // 1. Remove markdown backtick blocks (```json ... ``` or ``` ...)
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  }

  // 2. Locate first { or [ and last } or ]
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let startIndex = -1;

  if (firstBrace !== -1 && firstBracket !== -1) {
    startIndex = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIndex = firstBrace;
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
  }

  if (startIndex === -1) {
    if (fallback !== undefined) return fallback;
    throw new Error('No JSON object or array found in text');
  }

  const isObject = cleaned[startIndex] === '{';
  const endIndex = isObject ? cleaned.lastIndexOf('}') : cleaned.lastIndexOf(']');

  if (endIndex === -1 || endIndex <= startIndex) {
    if (fallback !== undefined) return fallback;
    throw new Error('Incomplete JSON structure in text');
  }

  let jsonSubstring = cleaned.substring(startIndex, endIndex + 1);

  // 3. Try standard parse
  try {
    return JSON.parse(jsonSubstring) as T;
  } catch {
    // 4. Try lenient fixes: remove trailing commas before } or ]
    try {
      const fixedCommas = jsonSubstring.replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(fixedCommas) as T;
    } catch {
      // 5. Try unescaped newline cleanup in string literals
      try {
        const sanitized = jsonSubstring
          .replace(/[\u0000-\u001F]+/g, (match) => {
            if (match === '\n' || match === '\r' || match === '\t') return match;
            return '';
          })
          .replace(/,\s*([}\]])/g, '$1');
        return JSON.parse(sanitized) as T;
      } catch (err) {
        if (fallback !== undefined) return fallback;
        throw new Error(`JSON parsing failed: ${(err as Error).message}`);
      }
    }
  }
}
