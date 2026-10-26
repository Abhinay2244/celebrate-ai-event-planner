/**
 * Unified client-side error handling utility for Celebrate AI.
 * Normalizes network, API, parsing, and timeout errors into user-friendly messages.
 */

export type ErrorSeverity = 'warning' | 'error' | 'fatal';
export type ErrorCategory =
  'quota' | 'timeout' | 'network' | 'validation' | 'unauthorized' | 'server';

export interface NormalizedError {
  /** User-friendly title suitable for headers */
  title: string;
  /** Detailed, friendly guidance message */
  message: string;
  /** Error category for styling and retry logic */
  category: ErrorCategory;
  /** Whether the user can meaningfully retry the failed operation */
  canRetry: boolean;
  /** Original error if available */
  originalError?: unknown;
}

/**
 * Normalizes any caught error into a user-friendly structured error.
 *
 * @param error Caught error object (Error, string, or unknown)
 * @returns NormalizedError with actionable advice
 */
export function normalizeClientError(error: unknown): NormalizedError {
  const rawMessage =
    error instanceof Error ? error.message : String(error || 'An unexpected error occurred.');
  const lowerMsg = rawMessage.toLowerCase();

  // 1. Quota / Rate Limiting
  if (lowerMsg.includes('quota') || lowerMsg.includes('429') || lowerMsg.includes('rate limit')) {
    return {
      title: 'AI Capacity Limit Reached',
      message:
        'The Gemini planner is receiving high traffic. Please wait 30 seconds and try generating your plan again.',
      category: 'quota',
      canRetry: true,
      originalError: error,
    };
  }

  // 2. Request Timeout
  if (lowerMsg.includes('timeout') || lowerMsg.includes('timed out') || lowerMsg.includes('504')) {
    return {
      title: 'Generation Timed Out',
      message:
        'Formulating your detailed celebration took longer than 90 seconds. Please click Retry to formulate your plan.',
      category: 'timeout',
      canRetry: true,
      originalError: error,
    };
  }

  // 3. Network Offline / Fetch Failures
  if (
    lowerMsg.includes('failed to fetch') ||
    lowerMsg.includes('network') ||
    lowerMsg.includes('offline') ||
    lowerMsg.includes('econnrefused')
  ) {
    return {
      title: 'Network Connection Issue',
      message:
        'Could not connect to the celebration planning server. Please check your internet connection and try again.',
      category: 'network',
      canRetry: true,
      originalError: error,
    };
  }

  // 4. API Authentication / Key missing
  if (
    lowerMsg.includes('api key') ||
    lowerMsg.includes('api_key') ||
    lowerMsg.includes('unauthorized') ||
    lowerMsg.includes('permission_denied') ||
    lowerMsg.includes('401') ||
    lowerMsg.includes('403')
  ) {
    return {
      title: 'Authentication Required',
      message:
        'Server Gemini API credentials are misconfigured. Please contact support or verify server configuration.',
      category: 'unauthorized',
      canRetry: false,
      originalError: error,
    };
  }

  // 5. Validation error
  if (
    lowerMsg.includes('validation') ||
    lowerMsg.includes('invalid') ||
    lowerMsg.includes('parameters')
  ) {
    return {
      title: 'Invalid Event Parameters',
      message: rawMessage,
      category: 'validation',
      canRetry: false,
      originalError: error,
    };
  }

  // 6. Generic server error fallback
  return {
    title: 'Celebration Planning Notice',
    message: rawMessage,
    category: 'server',
    canRetry: true,
    originalError: error,
  };
}
