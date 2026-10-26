/**
 * Attempts to repair truncated JSON by balancing dangling string quotes and unclosed brackets.
 */
function attemptTruncatedRepair(raw: string): string {
  let inString = false;
  let isEscaped = false;
  const stack: ('{' | '[')[] = [];

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === '\\') {
      isEscaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{' || char === '[') {
        stack.push(char);
      } else if (char === '}') {
        if (stack.length > 0 && stack[stack.length - 1] === '{') {
          stack.pop();
        }
      } else if (char === ']') {
        if (stack.length > 0 && stack[stack.length - 1] === '[') {
          stack.pop();
        }
      }
    }
  }

  let repaired = raw;
  if (inString) {
    repaired += '"';
  }

  // Strip trailing commas before closing
  repaired = repaired.replace(/,\s*$/, '');

  // Close remaining open brackets in reverse order
  while (stack.length > 0) {
    const openChar = stack.pop();
    if (openChar === '{') repaired += '}';
    else if (openChar === '[') repaired += ']';
  }

  return repaired;
}

/**
 * Robust JSON extraction and parsing fallback for LLM responses.
 * Handles markdown wrapping, trailing commas, truncated JSON, and stray commentary.
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

  // 2. Locate first { or [
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

  let jsonSubstring = '';
  if (endIndex === -1 || endIndex <= startIndex) {
    jsonSubstring = attemptTruncatedRepair(cleaned.substring(startIndex));
  } else {
    jsonSubstring = cleaned.substring(startIndex, endIndex + 1);
  }

  // 3. Try standard parse
  try {
    return JSON.parse(jsonSubstring) as T;
  } catch {
    // 4. Try lenient fixes: remove trailing commas before } or ]
    try {
      const fixedCommas = jsonSubstring.replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(fixedCommas) as T;
    } catch {
      // 5. Try truncated repair on the substring if not already attempted
      try {
        const repairedTruncated = attemptTruncatedRepair(jsonSubstring);
        const fixed = repairedTruncated.replace(/,\s*([}\]])/g, '$1');
        return JSON.parse(fixed) as T;
      } catch (err) {
        if (fallback !== undefined) return fallback;
        throw new Error(`JSON parsing failed: ${(err as Error).message}`);
      }
    }
  }
}
