import { describe, it, expect } from 'vitest';
import { normalizeBudget, validateBudgetSum, formatINR, calculatePerGuest } from '../src/utils/budget';
import { BudgetItem } from '../src/types/planner';

describe('Budget Utilities', () => {
  it('formats INR correctly with symbol and Indian numbering separators', () => {
    expect(formatINR(500000)).toMatch(/₹\s*5,00,000/);
    expect(formatINR(15000000, true)).toBe('₹1.5 Cr');
    expect(formatINR(250000, true)).toBe('₹2.5 L');
    expect(formatINR(5000, true)).toBe('₹5k');
  });

  it('accurately checks budget sum validation', () => {
    const items = [
      { amount: 300000 },
      { amount: 150000 },
      { amount: 50000 },
    ];
    const valid = validateBudgetSum(items, 500000);
    expect(valid.isValid).toBe(true);
    expect(valid.sum).toBe(500000);
    expect(valid.diff).toBe(0);

    const invalid = validateBudgetSum(items, 600000);
    expect(invalid.isValid).toBe(false);
    expect(invalid.diff).toBe(100000);
  });

  it('normalizes budget items so their amounts sum EXACTLY to the target budget', () => {
    const rawItems: BudgetItem[] = [
      { category: 'Venue & Catering', amount: 333333, percentage: 40, description: 'Food and hall' },
      { category: 'Decor & Floral', amount: 166666, percentage: 20, description: 'Stage decor' },
      { category: 'Photography', amount: 166666, percentage: 20, description: 'Photo & video' },
      { category: 'Entertainment', amount: 83333, percentage: 10, description: 'DJ and sound' },
      { category: 'Miscellaneous', amount: 83333, percentage: 10, description: 'Contingency' },
    ];

    const targetBudget = 1000000; // 10 Lakhs
    const normalized = normalizeBudget(rawItems, targetBudget);

    const sum = normalized.reduce((acc, item) => acc + item.amount, 0);
    expect(sum).toBe(targetBudget);

    // Each percentage should be a valid positive number
    normalized.forEach((item) => {
      expect(item.amount).toBeGreaterThan(0);
      expect(item.percentage).toBeGreaterThan(0);
      expect(item.percentage).toBeLessThanOrEqual(100);
    });
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

  it('calculates cost per guest correctly', () => {
    expect(calculatePerGuest(500000, 250)).toBe(2000);
    expect(calculatePerGuest(500000, 0)).toBe(0);
  });
});
