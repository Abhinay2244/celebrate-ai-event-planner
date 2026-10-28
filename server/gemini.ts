import { GoogleGenAI } from '@google/genai';
import { EventPlan, PlannerInput, RefineRequest } from '../src/types/planner.ts';
import { extractAndParseJSON } from '../src/utils/jsonRepair.ts';
import { NETWORK_CONFIG } from '../src/constants/index.ts';
import { AppError, toAppError } from './errors.ts';
import { CELEBRATION_PLAN_SCHEMA, REFINE_RESPONSE_SCHEMA } from './schemas.ts';
import {
  buildPlannerPrompt,
  buildRefinePrompt,
  PLANNER_SYSTEM_INSTRUCTION,
  REFINE_SYSTEM_INSTRUCTION,
} from './prompts.ts';
import { buildEventPlanFromLLM, mergeRefinedPlan } from './planNormalizer.ts';

let cachedClient: GoogleGenAI | null = null;
let lastApiKey: string | undefined = undefined;

/**
 * Checks whether an error is transient and eligible for retry.
 */
function isRetryableError(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();
  return (
    lower.includes('429') ||
    lower.includes('quota') ||
    lower.includes('resource_exhausted') ||
    lower.includes('503') ||
    lower.includes('unavailable') ||
    lower.includes('timeout') ||
    lower.includes('deadline') ||
    lower.includes('econnreset') ||
    lower.includes('etimedout') ||
    lower.includes('network')
  );
}

/**
 * Retry helper capped at 1 retry max, executed only for retryable errors.
 */
async function withMaxOneRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (firstErr: unknown) {
    if (!isRetryableError(firstErr)) {
      throw firstErr;
    }
    console.warn(
      '[Gemini Call Failed - Attempting 1 retry]:',
      firstErr instanceof Error ? firstErr.message : firstErr
    );
    await new Promise((resolve) => setTimeout(resolve, NETWORK_CONFIG.GEMINI_RETRY_DELAY_MS));
    return await fn();
  }
}

/**
 * Returns a memoized GoogleGenAI client or initializes a new one if key changes.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AppError(
      'API key missing: GEMINI_API_KEY is not configured in server environment',
      500,
      'API_KEY_MISSING'
    );
  }

  if (cachedClient && lastApiKey === apiKey) {
    return cachedClient;
  }

  cachedClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: NETWORK_CONFIG.GEMINI_TIMEOUT_MS,
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  lastApiKey = apiKey;
  return cachedClient;
}

/**
 * Clears the memoized GoogleGenAI client (useful for tests or environment changes).
 */
export function resetGeminiClient(): void {
  cachedClient = null;
  lastApiKey = undefined;
}

/**
 * Low-level helper to execute a Gemini generation request expecting JSON output.
 */
async function callGeminiJson(
  prompt: string,
  schema: unknown,
  systemInstruction: string
): Promise<string> {
  const ai = getGeminiClient();
  const response = await withMaxOneRetry(async () => {
    return await ai.models.generateContent({
      model: NETWORK_CONFIG.GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });
  });

  return response.text || '';
}

/**
 * Lightweight test connection function for /api/health
 */
export async function testGeminiConnection(): Promise<{
  ok: boolean;
  model: string;
  response?: string;
  error?: string;
}> {
  try {
    const ai = getGeminiClient();
    const result = await ai.models.generateContent({
      model: NETWORK_CONFIG.GEMINI_MODEL,
      contents: NETWORK_CONFIG.GEMINI_TEST_PROMPT,
    });
    return {
      ok: true,
      model: NETWORK_CONFIG.GEMINI_MODEL,
      response: result.text?.trim(),
    };
  } catch (err: unknown) {
    console.error('[Gemini Connection Test Failed]:', err);
    const appError = toAppError(err);
    return {
      ok: false,
      model: NETWORK_CONFIG.GEMINI_MODEL,
      error: appError.message,
    };
  }
}

/**
 * Generate a complete celebration plan using Gemini Flash.
 */
export async function generateCelebrationPlan(input: PlannerInput): Promise<EventPlan> {
  const prompt = buildPlannerPrompt(input);
  const responseText = await callGeminiJson(
    prompt,
    CELEBRATION_PLAN_SCHEMA,
    PLANNER_SYSTEM_INSTRUCTION
  );

  const parsedData =
    extractAndParseJSON<
      Omit<EventPlan, 'id' | 'createdAt' | 'updatedAt' | 'input' | 'totalBudgetCalculated'>
    >(responseText);

  return buildEventPlanFromLLM(parsedData, input);
}

/**
 * Refine the celebration plan based on user feedback.
 */
export async function refineCelebrationPlan(
  request: RefineRequest
): Promise<{ reply: string; updatedPlan: EventPlan }> {
  const currentPlan = request.plan;
  const prompt = buildRefinePrompt(request, currentPlan);
  const responseText = await callGeminiJson(
    prompt,
    REFINE_RESPONSE_SCHEMA,
    REFINE_SYSTEM_INSTRUCTION
  );

  const parsed = extractAndParseJSON<{ reply: string; updatedPlan: Partial<EventPlan> }>(
    responseText
  );
  const updatedPlan = mergeRefinedPlan(currentPlan, parsed.updatedPlan);

  return {
    reply: parsed.reply || 'I have updated your celebration plan to reflect your preferences.',
    updatedPlan,
  };
}
