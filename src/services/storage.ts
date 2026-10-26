import { EventPlan } from '../types/planner';
import { STORAGE_KEYS } from '../constants/index.ts';

const STORAGE_KEY = STORAGE_KEYS.SAVED_PLANS;
const CURRENT_ACTIVE_KEY = STORAGE_KEYS.ACTIVE_PLAN_ID;

/**
 * Retrieves all saved celebration blueprints from localStorage.
 *
 * @returns Array of saved EventPlan objects, or empty array if none found
 */
export function getSavedPlans(): EventPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as EventPlan[]) : [];
  } catch (err) {
    console.error('Error reading saved plans from localStorage:', err);
    return [];
  }
}

/**
 * Saves or updates a celebration blueprint in localStorage.
 *
 * @param plan The EventPlan to save
 */
export function savePlanToStorage(plan: EventPlan): void {
  try {
    const existing = getSavedPlans();
    const index = existing.findIndex((p) => p.id === plan.id);
    let updated: EventPlan[];

    if (index >= 0) {
      updated = [...existing];
      updated[index] = plan;
    } else {
      updated = [plan, ...existing];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(CURRENT_ACTIVE_KEY, plan.id);
  } catch (err) {
    console.error('Error saving plan to localStorage:', err);
  }
}

/**
 * Removes a celebration blueprint from localStorage.
 *
 * @param id Unique ID of the celebration blueprint to remove
 * @returns Updated array of remaining saved plans
 */
export function deletePlanFromStorage(id: string): EventPlan[] {
  try {
    const existing = getSavedPlans();
    const filtered = existing.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    if (localStorage.getItem(CURRENT_ACTIVE_KEY) === id) {
      if (filtered.length > 0) {
        localStorage.setItem(CURRENT_ACTIVE_KEY, filtered[0].id);
      } else {
        localStorage.removeItem(CURRENT_ACTIVE_KEY);
      }
    }
    return filtered;
  } catch (err) {
    console.error('Error deleting plan from localStorage:', err);
    return [];
  }
}

/**
 * Retrieves the ID of the most recently active plan from localStorage.
 *
 * @returns Active plan ID or null
 */
export function getActivePlanId(): string | null {
  try {
    return localStorage.getItem(CURRENT_ACTIVE_KEY);
  } catch {
    return null;
  }
}

/**
 * Sets the ID of the currently active plan in localStorage.
 *
 * @param id Plan ID to record as active
 */
export function setActivePlanId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(CURRENT_ACTIVE_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_ACTIVE_KEY);
    }
  } catch {
    // ignore storage access errors
  }
}
