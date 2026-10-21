import { describe, it, expect } from 'vitest';
import { normalizeHex, normalizePaletteColor } from '../src/utils/color';

describe('Hex & Color Normalization', () => {
  it('normalizes valid 6-digit hex values', () => {
    expect(normalizeHex('#B76E79')).toBe('#B76E79');
    expect(normalizeHex('#1b1e4b')).toBe('#1B1E4B');
    expect(normalizeHex('   #ffffff   ')).toBe('#FFFFFF');
  });

  it('adds missing "#" prefix to valid 6-digit or 3-digit hex', () => {
    expect(normalizeHex('B76E79')).toBe('#B76E79');
    expect(normalizeHex('1b1e4b')).toBe('#1B1E4B');
    expect(normalizeHex('fff')).toBe('#FFF');
    expect(normalizeHex('#abc')).toBe('#ABC');
  });

  it('falls back to default colour if invalid or not a hex', () => {
    const fallback = '#1B1E4B';
    expect(normalizeHex('invalid-color', fallback)).toBe(fallback);
    expect(normalizeHex('#12345', fallback)).toBe(fallback); // 5 digits
    expect(normalizeHex('#GGGGGG', fallback)).toBe(fallback); // non-hex chars
    expect(normalizeHex('', fallback)).toBe(fallback);
    expect(normalizeHex(null, fallback)).toBe(fallback);
    expect(normalizeHex(undefined, fallback)).toBe(fallback);
    expect(normalizeHex(123456 as any, fallback)).toBe(fallback);
  });

  it('normalizes palette objects with name and hex', () => {
    const item = { name: 'Royal Gold', hex: 'D4AF37' };
    const normalized = normalizePaletteColor(item, 0);
    expect(normalized.name).toBe('Royal Gold');
    expect(normalized.hex).toBe('#D4AF37');
  });

  it('normalizes string palette inputs', () => {
    const normalized = normalizePaletteColor('#2A9D8F', 2);
    expect(normalized.name).toBe('Color 3');
    expect(normalized.hex).toBe('#2A9D8F');
  });

  it('handles invalid palette items gracefully with sensible fallback', () => {
    const normalized = normalizePaletteColor({}, 1);
    expect(normalized.name).toBe('Palette 2');
    expect(normalized.hex).toMatch(/^#[0-9A-F]{6}$/);
  });
});
