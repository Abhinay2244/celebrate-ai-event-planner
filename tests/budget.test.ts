import { describe, it, expect } from 'vitest';
import {
  normalizeBudget,
  validateBudgetSum,
  formatINR,
  calculatePerGuest,
} from '../src/utils/budget';
import { BudgetItem } from '../src/types/planner';

describe('Budget Utilities & Edge Cases', () => {
  describe('formatINR', () => {
    it('formats INR correctly with symbol and Indian numbering separators', () => {
      expect(formatINR(500000)).toMatch(/₹\s*5,00,000/);
      expect(formatINR(15000000, true)).toBe('₹1.5 Cr');
      expect(formatINR(250000, true)).toBe('₹2.5 L');
      expect(formatINR(5000, true)).toBe('₹5k');
      expect(formatINR(NaN)).toBe('₹0');
    });

    it('formats huge multi-crore budgets accurately in compact and full mode', () => {
      const tenCrore = 100000000;
      expect(formatINR(tenCrore, true)).toBe('₹10 Cr');
      expect(formatINR(tenCrore)).toMatch(/₹\s*10,00,00,000/);
    });
  });

  describe('validateBudgetSum', () => {
    it('accurately checks budget sum validation within tolerance', () => {
      const items = [{ amount: 300000 }, { amount: 150000 }, { amount: 50000 }];
      const valid = validateBudgetSum(items, 500000);
      expect(valid.isValid).toBe(true);
      expect(valid.sum).toBe(500000);
      expect(valid.diff).toBe(0);

      const invalid = validateBudgetSum(items, 600000);
      expect(invalid.isValid).toBe(false);
      expect(invalid.diff).toBe(100000);
    });
  });

  describe('normalizeBudget', () => {
    it('normalizes budget items so their amounts sum EXACTLY to the target budget', () => {
      const rawItems: BudgetItem[] = [
        {
          category: 'Venue & Catering',
          amount: 333333,
          percentage: 40,
          description: 'Food and hall',
        },
        { category: 'Decor & Floral', amount: 166666, percentage: 20, description: 'Stage decor' },
        { category: 'Photography', amount: 166666, percentage: 20, description: 'Photo & video' },
        { category: 'Entertainment', amount: 83333, percentage: 10, description: 'DJ and sound' },
        { category: 'Miscellaneous', amount: 83333, percentage: 10, description: 'Contingency' },
      ];

      const targetBudget = 1000000; // 10 Lakhs
      const normalized = normalizeBudget(rawItems, targetBudget);

      const sum = normalized.reduce((acc, item) => acc + item.amount, 0);
      expect(sum).toBe(targetBudget);

      normalized.forEach((item) => {
        expect(item.amount).toBeGreaterThan(0);
        expect(item.percentage).toBeGreaterThan(0);
        expect(item.percentage).toBeLessThanOrEqual(100);
      });
    });

    it('resolves rounding discrepancies when budget does not divide evenly', () => {
      // 3 items with equal weights on budget of 100,001 (cannot divide by 3 without remainder)
      const rawItems: BudgetItem[] = [
        { category: 'A', amount: 1, percentage: 33.3, description: 'Cat A' },
        { category: 'B', amount: 1, percentage: 33.3, description: 'Cat B' },
        { category: 'C', amount: 1, percentage: 33.3, description: 'Cat C' },
      ];

      const targetBudget = 100001;
      const normalized = normalizeBudget(rawItems, targetBudget);
      const sum = normalized.reduce((acc, item) => acc + item.amount, 0);

      expect(sum).toBe(targetBudget);
      expect(normalized.every((item) => item.amount > 0 && Number.isInteger(item.amount))).toBe(
        true
      );
    });

    it('handles huge 10 Crore budget without integer overflow or rounding skew', () => {
      const rawItems: BudgetItem[] = [
        { category: 'Venue', amount: 40000000, percentage: 40, description: 'Palace' },
        { category: 'Catering', amount: 30000000, percentage: 30, description: 'Catering' },
        { category: 'Decor', amount: 30000000, percentage: 30, description: 'Decor' },
      ];

      const hugeBudget = 100000000;
      const normalized = normalizeBudget(rawItems, hugeBudget);
      const sum = normalized.reduce((acc, item) => acc + item.amount, 0);

      expect(sum).toBe(hugeBudget);
      expect(normalized[0].amount).toBe(40000000);
    });

    it('handles empty raw items array with resilient fallback allocation', () => {
      const targetBudget = 250000;
      const normalized = normalizeBudget([], targetBudget);

      expect(normalized.length).toBe(1);
      expect(normalized[0].category).toBe('General Celebration');
      expect(normalized[0].amount).toBe(targetBudget);
      expect(normalized[0].percentage).toBe(100);
    });

    it('normalizes items when raw amounts are 0 by using percentages', () => {
      const rawItems: BudgetItem[] = [
        { category: 'Venue', amount: 0, percentage: 50, description: 'Hall' },
        { category: 'Catering', amount: 0, percentage: 30, description: 'Food' },
        { category: 'Gifts', amount: 0, percentage: 20, description: 'Favors' },
      ];

      const targetBudget = 500000;
      const normalized = normalizeBudget(rawItems, targetBudget);

      const sum = normalized.reduce((acc, item) => acc + item.amount, 0);
      expect(sum).toBe(500000);
      expect(normalized[0].amount).toBe(250000);
      expect(normalized[1].amount).toBe(150000);
      expect(normalized[2].amount).toBe(100000);
    });

    it('handles single category allocation with 100% allocation', () => {
      const rawItems: BudgetItem[] = [
        {
          category: 'All-inclusive Package',
          amount: 50000,
          percentage: 100,
          description: 'Package',
        },
      ];

      const targetBudget = 150000;
      const normalized = normalizeBudget(rawItems, targetBudget);

      expect(normalized.length).toBe(1);
      expect(normalized[0].amount).toBe(150000);
      expect(normalized[0].percentage).toBe(100);
    });
  });

  describe('calculatePerGuest', () => {
    it('calculates cost per guest correctly', () => {
      expect(calculatePerGuest(500000, 250)).toBe(2000);
      expect(calculatePerGuest(1000000, 400)).toBe(2500);
    });

    it('handles zero guests safely without returning NaN or Infinity', () => {
      expect(calculatePerGuest(500000, 0)).toBe(0);
      expect(calculatePerGuest(500000, -5)).toBe(0);
    });
  });
});
