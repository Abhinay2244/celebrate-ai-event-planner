import { GoogleGenAI, Type } from '@google/genai';
import { EventPlan, PlannerInput, RefineRequest } from '../src/types/planner.ts';
import { extractAndParseJSON } from '../src/utils/jsonRepair.ts';
import { normalizeBudget } from '../src/utils/budget.ts';
import { normalizePaletteColor } from '../src/utils/color.ts';

// Single constant for the Gemini model definitely available to this project
export const GEMINI_MODEL = 'gemini-3-flash-preview';
export const GEMINI_TIMEOUT_MS = 90000; // 90 seconds

// Helper to initialize GoogleGenAI client safely
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
 */
export function formatGeminiError(err: unknown): { status: number; message: string } {
  console.error('[Gemini API Underlying Error]:', err);

  const rawMsg = err instanceof Error ? err.message : String(err);
  const status = (err as any)?.status || (err as any)?.statusCode || 500;

  if (!process.env.GEMINI_API_KEY) {
    return { status: 500, message: 'API key missing: GEMINI_API_KEY is not configured on the server' };
  }
  if (rawMsg.includes('429') || rawMsg.toLowerCase().includes('quota') || rawMsg.toLowerCase().includes('resource_exhausted')) {
    return { status: 429, message: 'Gemini quota exceeded or rate limited. Please try again shortly.' };
  }
  if (rawMsg.includes('404') || rawMsg.toLowerCase().includes('not found') || rawMsg.toLowerCase().includes('model')) {
    return { status: 502, message: `Model unavailable (${GEMINI_MODEL}): ${rawMsg}` };
  }
  if (
    rawMsg.includes('401') ||
    rawMsg.includes('403') ||
    rawMsg.toLowerCase().includes('api_key_invalid') ||
    rawMsg.toLowerCase().includes('unauthenticated') ||
    rawMsg.toLowerCase().includes('permission_denied')
  ) {
    return { status: 401, message: 'API authentication failed: invalid or unauthorized GEMINI_API_KEY' };
  }
  if (
    rawMsg.toLowerCase().includes('timeout') ||
    rawMsg.toLowerCase().includes('aborted') ||
    rawMsg.toLowerCase().includes('deadline')
  ) {
    return { status: 504, message: 'Gemini request timed out after 90 seconds' };
  }

  return { status, message: `Gemini service error: ${rawMsg}` };
}

/**
 * Retry helper capped at 1 retry max.
 */
async function withMaxOneRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (firstErr) {
    console.warn('[Gemini Call Failed - Attempting 1 retry]:', firstErr instanceof Error ? firstErr.message : firstErr);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await fn();
  }
}

/**
 * Lightweight test connection function for /api/health
 */
export async function testGeminiConnection(): Promise<{ ok: boolean; model: string; response?: string; error?: string }> {
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

// Strict, compact JSON response schema for fast execution
const CELEBRATION_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        tagline: { type: Type.STRING },
        vibeSummary: { type: Type.STRING },
        budgetSummary: { type: Type.STRING },
        guestSummary: { type: Type.STRING },
      },
      required: ['title', 'tagline', 'vibeSummary', 'budgetSummary', 'guestSummary'],
    },
    budgetBreakdown: {
      type: Type.ARRAY,
      description: 'Maximum 6 core categories summing to the total budget',
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          percentage: { type: Type.NUMBER },
          description: { type: Type.STRING },
          tips: { type: Type.STRING },
        },
        required: ['category', 'amount', 'percentage', 'description'],
      },
    },
    timeline: {
      type: Type.ARRAY,
      description: 'Maximum 6 milestone countdown phases',
      items: {
        type: Type.OBJECT,
        properties: {
          timeframe: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          tasks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['timeframe', 'title', 'description', 'tasks'],
      },
    },
    vendorChecklist: {
      type: Type.ARRAY,
      description: 'Maximum 5 priority vendor partners',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING },
          vendorType: { type: Type.STRING },
          whatToAsk: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          tips: { type: Type.STRING },
          done: { type: Type.BOOLEAN },
        },
        required: ['category', 'vendorType', 'whatToAsk', 'tips'],
      },
    },
    personalizedIdeas: {
      type: Type.OBJECT,
      properties: {
        theme: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            colorPalette: {
              type: Type.ARRAY,
              description: '4 distinct palette colours for the celebration',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'Descriptive colour name e.g. Royal Indigo' },
                  hex: { type: Type.STRING, description: '6-digit hex colour code starting with #' },
                },
                required: ['name', 'hex'],
              },
            },
          },
          required: ['name', 'description', 'colorPalette'],
        },
        decor: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING },
            focalPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            diyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['concept', 'focalPoints', 'diyTips'],
        },
        menu: {
          type: Type.OBJECT,
          properties: {
            cuisineStyle: { type: Type.STRING },
            signatureCourses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  course: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['course', 'items'],
              },
            },
            beverages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['cuisineStyle', 'signatureCourses', 'beverages'],
        },
        activities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              bestTiming: { type: Type.STRING },
            },
            required: ['title', 'description', 'bestTiming'],
          },
        },
        music: {
          type: Type.OBJECT,
          properties: {
            vibe: { type: Type.STRING },
            recommendedGenres: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            samplePlaylistsOrArtists: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['vibe', 'recommendedGenres', 'samplePlaylistsOrArtists'],
        },
      },
      required: ['theme', 'decor', 'menu', 'activities', 'music'],
    },
    invitationText: {
      type: Type.OBJECT,
      properties: {
        formal: { type: Type.STRING },
        casual: { type: Type.STRING },
        whatsapp: { type: Type.STRING },
      },
      required: ['formal', 'casual', 'whatsapp'],
    },
  },
  required: ['summary', 'budgetBreakdown', 'timeline', 'vendorChecklist', 'personalizedIdeas', 'invitationText'],
};

/**
 * Generate a complete celebration plan using Gemini 3.8 Flash.
 */
export async function generateCelebrationPlan(input: PlannerInput): Promise<EventPlan> {
  const ai = getGeminiClient();

  const prompt = `
Create a focused celebration blueprint:
- Event: ${input.eventType.toUpperCase()} (${input.title || `${input.eventType} celebration`})
- Date: ${input.date} | City: ${input.city} | Guests: ${input.guestCount}
- Budget: ₹${input.totalBudget} INR
- Theme: ${input.theme}
- Notes: ${input.specialNotes || 'None'}

REQUIREMENTS FOR SPEED & QUALITY:
1. Provide max 6 budget categories summing exactly to ₹${input.totalBudget}.
2. Provide max 6 timeline milestones (from weeks before down to day-of event).
3. Provide max 5 vendor categories with 2-3 interview questions each.
4. Keep all descriptions punchy, vivid and under 25 words per field.
5. Provide 3 invitation styles (formal, casual, whatsapp).
`;

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
  const parsedData = extractAndParseJSON<Omit<EventPlan, 'id' | 'createdAt' | 'updatedAt' | 'input' | 'totalBudgetCalculated'>>(responseText);

  // Guarantee exact budget math
  const normalizedBudget = normalizeBudget(parsedData.budgetBreakdown.slice(0, 6), input.totalBudget);

  const planId = `plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const vendorChecklist = (parsedData.vendorChecklist || []).slice(0, 5).map((item, idx) => ({
    ...item,
    id: item.id || `vendor-${idx + 1}`,
    done: Boolean(item.done),
  }));

  const fullPlan: EventPlan = {
    id: planId,
    createdAt: now,
    updatedAt: now,
    input,
    summary: parsedData.summary,
    budgetBreakdown: normalizedBudget,
    totalBudgetCalculated: input.totalBudget,
    timeline: (parsedData.timeline || []).slice(0, 6),
    vendorChecklist,
    personalizedIdeas: {
      ...parsedData.personalizedIdeas,
      theme: {
        ...parsedData.personalizedIdeas.theme,
        colorPalette: (parsedData.personalizedIdeas.theme.colorPalette || []).map((c, idx) =>
          normalizePaletteColor(c, idx)
        ),
      },
    },
    invitationText: parsedData.invitationText,
  };

  return fullPlan;
}

/**
 * Refine the celebration plan based on user feedback.
 */
export async function refineCelebrationPlan(request: RefineRequest): Promise<{ reply: string; updatedPlan: EventPlan }> {
  const ai = getGeminiClient();
  const currentPlan = request.plan;

  const prompt = `
User refinement request: "${request.message}"

Current Context:
- Event: ${currentPlan.input.eventType} in ${currentPlan.input.city}
- Guests: ${currentPlan.input.guestCount} | Budget: ₹${currentPlan.input.totalBudget} INR
- Theme: ${currentPlan.input.theme}

Update the plan concisely reflecting their requested changes. Ensure budget sum equals ₹${currentPlan.input.totalBudget}. Keep max 6 budget items, 6 milestones, 5 vendors.
`;

  const REFINE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      reply: { type: Type.STRING },
      updatedPlan: CELEBRATION_PLAN_SCHEMA,
    },
    required: ['reply', 'updatedPlan'],
  };

  const result = await withMaxOneRetry(async () => {
    return await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are Celebrate AI refinement assistant. Update the event plan concisely and return valid JSON with a warm reply.',
        responseMimeType: 'application/json',
        responseSchema: REFINE_SCHEMA,
      },
    });
  });

  const responseText = result.text || '';
  const parsed = extractAndParseJSON<{ reply: string; updatedPlan: Partial<EventPlan> }>(responseText);

  const rawBudget = (parsed.updatedPlan?.budgetBreakdown || currentPlan.budgetBreakdown).slice(0, 6);
  const targetBudget = currentPlan.input.totalBudget;
  const normalizedBudget = normalizeBudget(rawBudget, targetBudget);

  const updatedPlan: EventPlan = {
    ...currentPlan,
    updatedAt: new Date().toISOString(),
    summary: parsed.updatedPlan?.summary ? { ...currentPlan.summary, ...parsed.updatedPlan.summary } : currentPlan.summary,
    budgetBreakdown: normalizedBudget,
    totalBudgetCalculated: targetBudget,
    timeline: (parsed.updatedPlan?.timeline || currentPlan.timeline).slice(0, 6),
    vendorChecklist: (parsed.updatedPlan?.vendorChecklist || currentPlan.vendorChecklist).slice(0, 5).map((item, idx) => ({
      ...item,
      id: item.id || `vendor-${idx + 1}`,
      done: item.done !== undefined ? item.done : (currentPlan.vendorChecklist.find((c) => c.id === item.id)?.done || false),
    })),
    personalizedIdeas: parsed.updatedPlan?.personalizedIdeas
      ? {
          ...parsed.updatedPlan.personalizedIdeas,
          theme: {
            ...parsed.updatedPlan.personalizedIdeas.theme,
            colorPalette: (parsed.updatedPlan.personalizedIdeas.theme?.colorPalette || []).map((c, idx) =>
              normalizePaletteColor(c, idx)
            ),
          },
        }
      : currentPlan.personalizedIdeas,
    invitationText: parsed.updatedPlan?.invitationText || currentPlan.invitationText,
  };

  return {
    reply: parsed.reply || 'I have updated your celebration plan to reflect your preferences.',
    updatedPlan,
  };
}
