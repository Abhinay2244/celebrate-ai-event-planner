import { EventPlan, PlannerInput } from '../src/types/planner.ts';
import { NETWORK_CONFIG } from '../src/constants/index.ts';

interface CacheEntry {
  plan: EventPlan;
  timestamp: number;
}

const MAX_CACHE_SIZE = 100;
const CACHE_TTL_MS = NETWORK_CONFIG.CACHE_TTL_MS;

/**
 * In-memory LRU/FIFO plan cache to prevent duplicate Gemini invocations.
 */
class PlanCache {
  private cache = new Map<string, CacheEntry>();

  public get(key: string): EventPlan | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.plan;
  }

  public set(key: string, plan: EventPlan): void {
    if (this.cache.size >= MAX_CACHE_SIZE) {
      // Evict oldest entry
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(key, { plan, timestamp: Date.now() });
  }

  public buildKey(input: PlannerInput): string {
    return JSON.stringify({
      eventType: input.eventType,
      city: input.city.toLowerCase().trim(),
      guestCount: input.guestCount,
      totalBudget: input.totalBudget,
      theme: input.theme.toLowerCase().trim(),
      notes: (input.specialNotes || '').toLowerCase().trim(),
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}

export const planCache = new PlanCache();
