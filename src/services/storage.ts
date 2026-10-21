import { EventPlan } from '../types/planner';

const STORAGE_KEY = 'celebrate_ai_saved_plans_v1';
const CURRENT_ACTIVE_KEY = 'celebrate_ai_active_plan_id';

export function getSavedPlans(): EventPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading saved plans from localStorage:', err);
    return [];
  }
}

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

export function getActivePlanId(): string | null {
  try {
    return localStorage.getItem(CURRENT_ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function setActivePlanId(id: string): void {
  try {
    localStorage.setItem(CURRENT_ACTIVE_KEY, id);
  } catch {
    // ignore
  }
}
