/**
 * Application constants for Celebrate AI.
 * Centralizes magic numbers, storage keys, limits, and configuration defaults.
 */

/**
 * LocalStorage keys for client-side persistence
 */
export const STORAGE_KEYS = {
  THEME: 'celebrate_ai_theme',
  SAVED_PLANS: 'celebrate_ai_saved_plans',
  ACTIVE_PLAN_ID: 'celebrate_ai_active_plan_id',
} as const;

/**
 * Event planning input limits and constraints
 */
export const PLANNER_CONSTRAINTS = {
  MIN_GUEST_COUNT: 5,
  MAX_GUEST_COUNT: 5000,
  MIN_BUDGET_INR: 10000,
  MAX_BUDGET_INR: 50000000, // 5 Crore INR
  DEFAULT_BUDGET_INR: 500000,
  DEFAULT_GUEST_COUNT: 100,
  MAX_BUDGET_CATEGORIES: 6,
  MAX_TIMELINE_PHASES: 6,
  MAX_VENDOR_CATEGORIES: 5,
  MAX_PALETTE_COLORS: 4,
} as const;

/**
 * Quick-select budget presets in Indian Rupees (INR)
 */
export const BUDGET_PRESETS: readonly { label: string; value: number }[] = [
  { label: '₹50K', value: 50000 },
  { label: '₹1.5L', value: 150000 },
  { label: '₹5L', value: 500000 },
  { label: '₹12L', value: 1200000 },
  { label: '₹30L', value: 3000000 },
] as const;

/**
 * Server and API network configuration
 */
export const NETWORK_CONFIG = {
  GEMINI_MODEL: 'gemini-3-flash-preview',
  GEMINI_TIMEOUT_MS: 90000, // 90s deadline
  GEMINI_RETRY_DELAY_MS: 1000, // 1s backoff for retryable errors
  GEMINI_TEST_PROMPT: 'say hello in 5 words',
  CACHE_TTL_MS: 60 * 60 * 1000, // 1 hour
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 30, // 30 req / min
} as const;

/**
 * API Route endpoints
 */
export const API_ROUTES = {
  HEALTH: '/api/health',
  GENERATE_PLAN: '/api/plan/generate',
  REFINE_PLAN: '/api/plan/refine',
} as const;

/**
 * Color palette configuration and fallback colors
 */
export const ACCENT_PALETTE = [
  '#96424e', // Rose gold (accessible AA)
  '#1b1e4b', // Deep indigo
  '#c26d5f', // Warm terracotta
  '#b88a14', // Gold (accessible AA)
  '#1b7a6e', // Emerald teal
  '#c85236', // Rust
  '#555a49', // Deep sage
  '#7b33b8', // Royal violet
  '#2d5e7d', // Slate blue
  '#c7732a', // Deep apricot
] as const;

/**
 * Default fallback color for unparseable hex codes
 */
export const DEFAULT_PALETTE_COLOR = '#8c3845';

/**
 * Quick prompts for chat refinement
 */
export const QUICK_PROMPTS: readonly string[] = [
  'Make it 15% cheaper while keeping guest count',
  'Add an outdoor rain and weather contingency plan',
  'Make catering 100% vegetarian & Jain friendly',
  'Add Sangeet choreography & DJ soundcheck into timeline',
  'Suggest eco-friendly & zero-waste decor ideas',
] as const;
