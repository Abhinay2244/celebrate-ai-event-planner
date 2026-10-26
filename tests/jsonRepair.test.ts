import { describe, it, expect } from 'vitest';
import { extractAndParseJSON } from '../src/utils/jsonRepair';

describe('JSON Parsing and Repair Fallback & Edge Cases', () => {
  it('parses standard clean JSON', () => {
    const raw = '{"hello": "world", "count": 42}';
    const result = extractAndParseJSON<{ hello: string; count: number }>(raw);
    expect(result.hello).toBe('world');
    expect(result.count).toBe(42);
  });

  it('strips markdown ```json wrapper and commentary before and after', () => {
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

  it('repairs truncated JSON where closing braces are cut off', () => {
    const truncatedObject = '{"summary": {"title": "Grand Gala", "tagline": "Unforgettable"';
    const result = extractAndParseJSON<{ summary: { title: string; tagline: string } }>(
      truncatedObject
    );
    expect(result.summary.title).toBe('Grand Gala');
    expect(result.summary.tagline).toBe('Unforgettable');
  });

  it('repairs truncated JSON where strings and arrays are cut off mid-stream', () => {
    const truncatedArray = '{"tags": ["heritage", "royal", "lanterns';
    const result = extractAndParseJSON<{ tags: string[] }>(truncatedArray);
    expect(result.tags[0]).toBe('heritage');
    expect(result.tags[1]).toBe('royal');
  });

  it('uses fallback value when JSON is invalid or missing', () => {
    const raw = 'I apologize, but I could not formulate a plan right now.';
    const fallback = { fallbackUsed: true };
    const result = extractAndParseJSON(raw, fallback);
    expect(result).toEqual(fallback);
  });

  it('handles empty string or non-string input by using fallback or throwing', () => {
    const fallback = { ok: false };
    expect(extractAndParseJSON('', fallback)).toEqual(fallback);
    expect(() => extractAndParseJSON('')).toThrow('Input text is empty or not a string');
  });

  it('throws descriptive error if invalid and no fallback provided', () => {
    const raw = 'Just a normal text without any brackets';
    expect(() => extractAndParseJSON(raw)).toThrow('No JSON object or array found in text');
  });
});
