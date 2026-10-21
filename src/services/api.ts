import { EventPlan, PlannerInput, RefineRequest } from '../types/planner';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const CLIENT_TIMEOUT_MS = 100000; // 100 seconds

/**
 * Health check querying Gemini
 */
export async function checkServerHealthApi(): Promise<{
  ok: boolean;
  status: string;
  gemini?: { ok: boolean; model: string; response?: string; error?: string };
}> {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return { ok: false, status: 'unreachable' };
  }
}

/**
 * Call backend to generate a fresh celebration plan.
 */
export async function generatePlanApi(input: PlannerInput): Promise<{ plan: EventPlan; cached?: boolean }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const res = await fetch('/api/plan/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errMsg = 'Failed to generate plan';
      try {
        const errJson = await res.json();
        errMsg = errJson.message || errJson.error || errJson.details || errMsg;
      } catch {
        errMsg = `Server returned HTTP ${res.status}`;
      }
      throw new ApiError(errMsg, res.status);
    }

    const data = await res.json();
    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError('The planning request timed out after 100 seconds. Please try again.');
    }
    throw new ApiError(err instanceof Error ? err.message : 'Network error communicating with the celebration server');
  }
}

/**
 * Call backend to refine an existing plan via conversational prompts.
 */
export async function refinePlanApi(request: RefineRequest): Promise<{ reply: string; updatedPlan: EventPlan }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const res = await fetch('/api/plan/refine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errMsg = 'Failed to refine plan';
      try {
        const errJson = await res.json();
        errMsg = errJson.message || errJson.error || errJson.details || errMsg;
      } catch {
        errMsg = `Server returned HTTP ${res.status}`;
      }
      throw new ApiError(errMsg, res.status);
    }

    return await res.json();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError('The refinement request timed out after 100 seconds. Please try again.');
    }
    throw new ApiError(err instanceof Error ? err.message : 'Network error communicating with the celebration server');
  }
}
