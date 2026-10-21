/**
 * Color and Hex normalization utilities for Celebrate AI
 */

const DEFAULT_HEX_FALLBACKS = [
  '#1B1E4B', // Deep Indigo
  '#B76E79', // Rose Gold
  '#DDA092', // Warm Coral
  '#FAF8F5', // Warm Ivory
  '#D4AF37', // Gold
  '#2A9D8F', // Emerald Teal
];

const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

/**
 * Normalizes a hex color string:
 * - Trims whitespace
 * - Adds '#' if missing
 * - Validates against 3-digit or 6-digit hex regex
 * - Falls back to a sensible default if invalid or missing
 */
export function normalizeHex(raw: unknown, fallback: string = '#B76E79'): string {
  if (typeof raw !== 'string') {
    return fallback;
  }

  let cleaned = raw.trim();
  if (!cleaned) {
    return fallback;
  }

  if (!cleaned.startsWith('#')) {
    cleaned = '#' + cleaned;
  }

  if (HEX_REGEX.test(cleaned)) {
    return cleaned.toUpperCase();
  }

  return fallback;
}

export interface PaletteColor {
  name: string;
  hex: string;
}

/**
 * Normalizes a palette entry which may be a string or an object { name, hex }
 */
export function normalizePaletteColor(item: unknown, index: number = 0): PaletteColor {
  const fallback = DEFAULT_HEX_FALLBACKS[index % DEFAULT_HEX_FALLBACKS.length];

  if (typeof item === 'string') {
    const hex = normalizeHex(item, fallback);
    return {
      name: item.startsWith('#') ? `Color ${index + 1}` : item,
      hex,
    };
  }

  if (item && typeof item === 'object') {
    const obj = item as Record<string, unknown>;
    const name = typeof obj.name === 'string' && obj.name.trim() ? obj.name.trim() : `Palette ${index + 1}`;
    const rawHex = typeof obj.hex === 'string' ? obj.hex : (typeof obj.code === 'string' ? obj.code : '');
    const hex = normalizeHex(rawHex, fallback);
    return { name, hex };
  }

  return {
    name: `Palette ${index + 1}`,
    hex: fallback,
  };
}
