import { GoogleGenAI, type Schema } from '@google/genai';
import { EventPlan, PlannerInput, RefineRequest } from '../src/types/planner.ts';
import { extractAndParseJSON } from '../src/utils/jsonRepair.ts';
import { NETWORK_CONFIG, DEFAULT_REFINE_REPLY } from '../src/constants/index.ts';
import { AppError, toAppError, ERROR_CODES } from './errors.ts';
import { sanitizeLogData } from './sanitizer.ts';
import { CELEBRATION_PLAN_SCHEMA, REFINE_RESPONSE_SCHEMA } from './schemas.ts';
import {
  buildPlannerPrompt,
  buildRefinePrompt,
  PLANNER_SYSTEM_INSTRUCTION,
  REFINE_SYSTEM_INSTRUCTION,
} from './prompts.ts';
import { buildEventPlanFromLLM, mergeRefinedPlan } from './planNormalizer.ts';

let cachedClient: GoogleGenAI | null = null;

/**
 * Checks whether an error is transient and eligible for retry.
 * Retries strictly on 503, 504, or gateway timeouts (NOT on 429/quota).
 */
function isRetryableError(err: unknown): boolean {
  if (!err) return false;
  const appError = toAppError(err);
  return (
    appError.statusCode === 503 ||
    appError.statusCode === 504 ||
    appError.code === ERROR_CODES.GATEWAY_TIMEOUT
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
    console.warn('[Gemini Call Failed - Attempting 1 retry]:', sanitizeLogData(firstErr));
    await new Promise((resolve) => setTimeout(resolve, NETWORK_CONFIG.GEMINI_RETRY_DELAY_MS));
    return await fn();
  }
}

/**
 * Returns a memoized GoogleGenAI client instance.
 */
export function getGeminiClient(): GoogleGenAI {
  if (cachedClient) {
    return cachedClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[Gemini Client]: GEMINI_API_KEY is not configured in server environment');
    throw new AppError('AI service is not configured', 500, ERROR_CODES.API_KEY_MISSING);
  }

  cachedClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: NETWORK_CONFIG.GEMINI_TIMEOUT_MS,
      headers: {
        'User-Agent': NETWORK_CONFIG.USER_AGENT,
      },
    },
  });
  return cachedClient;
}

/**
 * Clears the memoized GoogleGenAI client (useful for tests or environment changes).
 */
export function resetGeminiClient(): void {
  cachedClient = null;
}

/**
 * Low-level helper to execute a Gemini generation request expecting JSON output.
 */
async function callGeminiJson(
  prompt: string,
  schema: Schema,
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
 * Lightweight test connection function for /api/health.
 * Never exposes raw internal error text in client responses.
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
    console.error('[Gemini Connection Test Failed]:', sanitizeLogData(err));
    return {
      ok: false,
      model: NETWORK_CONFIG.GEMINI_MODEL,
      error: 'Service connectivity degraded',
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
    reply: parsed.reply || DEFAULT_REFINE_REPLY,
    updatedPlan,
  };
}
