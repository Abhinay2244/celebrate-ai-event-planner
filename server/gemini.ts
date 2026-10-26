import { GoogleGenAI } from '@google/genai';
import { EventPlan, PlannerInput, RefineRequest } from '../src/types/planner.ts';
import { extractAndParseJSON } from '../src/utils/jsonRepair.ts';
import { NETWORK_CONFIG } from '../src/constants/index.ts';
import { toAppError } from './errors.ts';
import { CELEBRATION_PLAN_SCHEMA, REFINE_RESPONSE_SCHEMA } from './schemas.ts';
import { buildPlannerPrompt, buildRefinePrompt } from './prompts.ts';
import { buildEventPlanFromLLM, mergeRefinedPlan } from './planNormalizer.ts';

export const GEMINI_MODEL = NETWORK_CONFIG.GEMINI_MODEL;
export const GEMINI_TIMEOUT_MS = NETWORK_CONFIG.GEMINI_TIMEOUT_MS;

/**
 * Helper to initialize GoogleGenAI client safely.
 *
 * @returns Configured GoogleGenAI SDK client
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API key missing: GEMINI_API_KEY is not configured in server environment');
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: GEMINI_TIMEOUT_MS,
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Parses and formats Gemini API errors into safe, informative messages with HTTP status.
 *
 * @param err Caught error object
 * @returns Structured HTTP status and sanitized message
 */
export function formatGeminiError(err: unknown): { status: number; message: string } {
  console.error('[Gemini API Underlying Error]:', err);
  const appError = toAppError(err);
  return { status: appError.statusCode, message: appError.message };
}

/**
 * Retry helper capped at 1 retry max.
 */
async function withMaxOneRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (firstErr) {
    console.warn(
      '[Gemini Call Failed - Attempting 1 retry]:',
      firstErr instanceof Error ? firstErr.message : firstErr
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await fn();
  }
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
      model: GEMINI_MODEL,
      contents: 'say hello in 5 words',
    });
    return {
      ok: true,
      model: GEMINI_MODEL,
      response: result.text?.trim(),
    };
  } catch (err: unknown) {
    console.error('[Gemini Connection Test Failed]:', err);
    const formatted = formatGeminiError(err);
    return {
      ok: false,
      model: GEMINI_MODEL,
      error: formatted.message,
    };
  }
}

/**
 * Generate a complete celebration plan using Gemini 3.8 Flash.
 *
 * @param input Planner input parameters
 * @returns Fully normalized EventPlan
 */
export async function generateCelebrationPlan(input: PlannerInput): Promise<EventPlan> {
  const ai = getGeminiClient();
  const prompt = buildPlannerPrompt(input);

  const result = await withMaxOneRetry(async () => {
    return await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are Celebrate AI, an expert event strategist. Return clean, concise JSON matching the exact schema. Max 6 budget categories, max 6 timeline milestones, max 5 vendors.',
        responseMimeType: 'application/json',
        responseSchema: CELEBRATION_PLAN_SCHEMA,
      },
    });
  });

  const responseText = result.text || '';
  const parsedData =
    extractAndParseJSON<
      Omit<EventPlan, 'id' | 'createdAt' | 'updatedAt' | 'input' | 'totalBudgetCalculated'>
    >(responseText);

  return buildEventPlanFromLLM(parsedData, input);
}

/**
 * Refine the celebration plan based on user feedback.
 *
 * @param request Refinement request containing user message and current event plan
 * @returns AI reply message and updated EventPlan
 */
export async function refineCelebrationPlan(
  request: RefineRequest
): Promise<{ reply: string; updatedPlan: EventPlan }> {
  const ai = getGeminiClient();
  const currentPlan = request.plan;
  const prompt = buildRefinePrompt(request, currentPlan);

  const result = await withMaxOneRetry(async () => {
    return await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are Celebrate AI refinement assistant. Update the event plan concisely and return valid JSON with a warm reply.',
        responseMimeType: 'application/json',
        responseSchema: REFINE_RESPONSE_SCHEMA,
      },
    });
  });

  const responseText = result.text || '';
  const parsed = extractAndParseJSON<{ reply: string; updatedPlan: Partial<EventPlan> }>(
    responseText
  );
  const updatedPlan = mergeRefinedPlan(currentPlan, parsed.updatedPlan);

  return {
    reply: parsed.reply || 'I have updated your celebration plan to reflect your preferences.',
    updatedPlan,
  };
}
