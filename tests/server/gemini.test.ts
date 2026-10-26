import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import {
  getGeminiClient,
  formatGeminiError,
  testGeminiConnection,
  generateCelebrationPlan,
  refineCelebrationPlan,
} from '../../server/gemini';
import {
  SAMPLE_PLANNER_INPUT,
  SAMPLE_EVENT_PLAN,
  SAMPLE_REFINE_REQUEST,
} from '../fixtures/samplePlan';

const { MockGoogleGenAI, mockGenerateContent } = vi.hoisted(() => {
  const mockGenerateContent = vi.fn();

  class MockGoogleGenAI {
    models = {
      generateContent: mockGenerateContent,
    };
    constructor(_opts?: unknown) {}
  }

  return { MockGoogleGenAI, mockGenerateContent };
});

vi.mock('@google/genai', () => ({
  GoogleGenAI: MockGoogleGenAI,
  Type: {
    OBJECT: 'OBJECT',
    STRING: 'STRING',
    NUMBER: 'NUMBER',
    ARRAY: 'ARRAY',
    BOOLEAN: 'BOOLEAN',
  },
}));

describe('Server Gemini Module (server/gemini.ts)', () => {
  const originalKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-gemini-key';
  });

  afterAll(() => {
    process.env.GEMINI_API_KEY = originalKey;
  });

  it('throws error in getGeminiClient if GEMINI_API_KEY is not configured', () => {
    delete process.env.GEMINI_API_KEY;
    expect(() => getGeminiClient()).toThrow(/API key missing/i);
  });

  it('initializes GoogleGenAI client when key is configured', () => {
    process.env.GEMINI_API_KEY = 'valid-test-key';
    const client = getGeminiClient();
    expect(client).toBeDefined();
    expect(client.models).toBeDefined();
  });

  it('formats Gemini error into safe HTTP status code and message', () => {
    const quotaErr = new Error('Resource has been exhausted (e.g. check quota) 429');
    const formatted = formatGeminiError(quotaErr);
    expect(formatted.status).toBe(429);
    expect(formatted.message).toMatch(/rate limit|quota/i);
  });

  it('testGeminiConnection returns ok: true when connection succeeds', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: 'hello from Gemini',
    });

    const res = await testGeminiConnection();
    expect(res.ok).toBe(true);
    expect(res.response).toBe('hello from Gemini');
  });

  it('testGeminiConnection returns ok: false with error when connection fails', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Connection failure'));

    const res = await testGeminiConnection();
    expect(res.ok).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('generateCelebrationPlan calls Gemini and returns a normalized plan', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({
        summary: SAMPLE_EVENT_PLAN.summary,
        budgetBreakdown: SAMPLE_EVENT_PLAN.budgetBreakdown,
        timeline: SAMPLE_EVENT_PLAN.timeline,
        vendorChecklist: SAMPLE_EVENT_PLAN.vendorChecklist,
        personalizedIdeas: SAMPLE_EVENT_PLAN.personalizedIdeas,
        invitationText: SAMPLE_EVENT_PLAN.invitationText,
      }),
    });

    const plan = await generateCelebrationPlan(SAMPLE_PLANNER_INPUT);
    expect(plan.id).toMatch(/^plan-/);
    expect(plan.totalBudgetCalculated).toBe(SAMPLE_PLANNER_INPUT.totalBudget);
    expect(plan.summary.title).toBe(SAMPLE_EVENT_PLAN.summary.title);
  });

  it('refineCelebrationPlan calls Gemini and returns assistant reply and updated plan', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({
        reply: 'I have updated your dining menu.',
        updatedPlan: {
          summary: {
            ...SAMPLE_EVENT_PLAN.summary,
            tagline: 'Refined menu tagline',
          },
        },
      }),
    });

    const result = await refineCelebrationPlan(SAMPLE_REFINE_REQUEST);
    expect(result.reply).toBe('I have updated your dining menu.');
    expect(result.updatedPlan.summary.tagline).toBe('Refined menu tagline');
  });
});
