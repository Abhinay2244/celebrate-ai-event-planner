import { describe, it, expect } from 'vitest';
import { extractAndParseJSON } from '../src/utils/jsonRepair';

describe('JSON Parsing and Repair Fallback', () => {
  it('parses standard clean JSON', () => {
    const raw = '{"hello": "world", "count": 42}';
    const result = extractAndParseJSON<{ hello: string; count: number }>(raw);
    expect(result.hello).toBe('world');
    expect(result.count).toBe(42);
  });

  it('strips markdown ```json wrapper and commentary before/after', () => {
    const raw = `
Here is your celebration plan:
\`\`\`json
{
  "theme": "Vintage Garden",
  "budget": 200000
}
\`\`\`
Hope this helps! Let me know if you need tweaks.
    `;
    const result = extractAndParseJSON<{ theme: string; budget: number }>(raw);
    expect(result.theme).toBe('Vintage Garden');
    expect(result.budget).toBe(200000);
  });

  it('fixes trailing commas in objects and arrays', () => {
    const raw = `
    {
      "items": [
        "Catering",
        "Photography",
      ],
      "active": true,
    }
    `;
    const result = extractAndParseJSON<{ items: string[]; active: boolean }>(raw);
    expect(result.items.length).toBe(2);
    expect(result.active).toBe(true);
  });

  it('uses fallback value when JSON is invalid or missing', () => {
    const raw = 'I apologize, but I could not formulate a plan right now.';
    const fallback = { fallbackUsed: true };
    const result = extractAndParseJSON(raw, fallback);
    expect(result).toEqual(fallback);
  });

  it('throws descriptive error if invalid and no fallback provided', () => {
    const raw = 'Just a normal text without any brackets';
    expect(() => extractAndParseJSON(raw)).toThrow('No JSON object or array found in text');
  });
});
