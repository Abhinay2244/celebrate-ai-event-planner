import React from 'react';

/**
 * Elegant inline SVG floral corner ornament for wedding & classic stationery.
 */
export const FloralCorner: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className,
  style,
}) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path
      d="M4 4C18 4 30 16 30 30M4 4C4 18 16 30 30 30M4 4L22 22M30 30C36 36 46 36 52 30M30 30C36 24 36 14 30 8M4 14C10 14 18 20 20 28M14 4C14 10 20 18 28 20M4 4H1M4 4V1"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    <circle cx="28" cy="28" r="2" fill="currentColor" />
    <circle cx="44" cy="20" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Ornate divider flourish SVG for card centerpieces.
 */
export const OrnateDivider: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className,
  style,
}) => (
  <svg
    viewBox="0 0 200 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path
      d="M10 12H80M120 12H190M80 12C85 8 92 8 97 12C92 16 85 16 80 12ZM120 12C115 8 108 8 103 12C108 16 115 16 120 12Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="100" cy="12" r="3" fill="currentColor" />
    <circle cx="65" cy="12" r="1.5" fill="currentColor" />
    <circle cx="135" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Party confetti shapes for celebratory milestone cards.
 */
export const ConfettiShapes: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" aria-hidden="true">
    <circle cx="10%" cy="15%" r="6" fill="#F59E0B" />
    <polygon points="85,20 90,32 78,32" fill="#EC4899" />
    <rect x="88%" y="18%" width="8" height="8" rx="2" transform="rotate(25 88 18)" fill="#06B6D4" />
    <circle cx="92%" cy="75%" r="5" fill="#EAB308" />
    <polygon points="40,90 46,102 34,102" fill="#8B5CF6" />
    <rect x="8%" y="82%" width="7" height="7" rx="1.5" transform="rotate(45 8 82)" fill="#10B981" />
  </svg>
);
