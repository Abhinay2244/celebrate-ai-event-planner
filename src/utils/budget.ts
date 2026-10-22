import { BudgetItem } from '../types/planner.ts';

/**
 * Format a number as Indian Rupee (INR) currency.
 * e.g. 500000 -> ₹5,00,000
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount)) return '₹0';
  
  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      const cr = (amount / 10000000).toFixed(2).replace(/\.?0+$/, '');
      return `₹${cr} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      const lakh = (amount / 100000).toFixed(2).replace(/\.?0+$/, '');
      return `₹${lakh} L`;
    }
    if (Math.abs(amount) >= 1000) {
      const k = (amount / 1000).toFixed(1).replace(/\.?0+$/, '');
      return `₹${k}k`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Validates whether the sum of budget breakdown items equals the target budget.
 */
export function validateBudgetSum(
  items: Array<{ amount: number }>,
  targetBudget: number,
  tolerance: number = 1
): { isValid: boolean; sum: number; diff: number } {
  const sum = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const diff = Math.round(targetBudget - sum);
  return {
    isValid: Math.abs(diff) <= tolerance,
    sum,
    diff,
  };
}

/**
 * Normalizes budget items so that their amounts sum EXACTLY to the target total budget,
 * and percentages accurately reflect the proportions and sum to 100%.
 */
export function normalizeBudget(
  rawItems: BudgetItem[],
  targetBudget: number
): BudgetItem[] {
  if (!rawItems || rawItems.length === 0) {
    return [
      {
        category: 'General Celebration',
        amount: Math.round(targetBudget),
        percentage: 100,
        description: 'Comprehensive allocation for venue, dining, and hospitality',
      },
    ];
  }

  // Calculate current sum of amounts or fallback to percentage ratios
  const currentSum = rawItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  let proportionalWeights: number[] = [];
  if (currentSum > 0) {
    proportionalWeights = rawItems.map((item) => (Number(item.amount) || 0) / currentSum);
  } else {
    // If amounts are 0, use percentages if present, or split evenly
    const percentageSum = rawItems.reduce((acc, item) => acc + (Number(item.percentage) || 0), 0);
    if (percentageSum > 0) {
      proportionalWeights = rawItems.map((item) => (Number(item.percentage) || 0) / percentageSum);
    } else {
      const evenWeight = 1 / rawItems.length;
      proportionalWeights = rawItems.map(() => evenWeight);
    }
  }

  // Calculate rounded integer amounts
  let allocatedSum = 0;
  const normalized: BudgetItem[] = rawItems.map((item, index) => {
    const rawAllocated = Math.round(proportionalWeights[index] * targetBudget);
    allocatedSum += rawAllocated;
    return {
      ...item,
      amount: rawAllocated,
      percentage: Number(((proportionalWeights[index]) * 100).toFixed(1)),
    };
  });

  // Handle rounding discrepancy on the largest allocation category
  const discrepancy = Math.round(targetBudget - allocatedSum);
  if (discrepancy !== 0 && normalized.length > 0) {
    // Find index of max amount item to absorb the rounding delta without going negative
    let maxIndex = 0;
    for (let i = 1; i < normalized.length; i++) {
      if (normalized[i].amount > normalized[maxIndex].amount) {
        maxIndex = i;
      }
    }
    normalized[maxIndex].amount = Math.max(0, normalized[maxIndex].amount + discrepancy);
  }

  // Recalculate clean percentages
  normalized.forEach((item) => {
    item.percentage = Number(((item.amount / targetBudget) * 100).toFixed(1));
  });

  return normalized;
}

/**
 * Calculates per-guest spend.
 */
export function calculatePerGuest(totalBudget: number, guestCount: number): number {
  if (!guestCount || guestCount <= 0) return 0;
  return Math.round(totalBudget / guestCount);
}
