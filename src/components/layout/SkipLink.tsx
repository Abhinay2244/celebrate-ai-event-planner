import React from 'react';

interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

/**
 * Accessible Skip to Main Content link.
 * First focusable element allowing screen readers and keyboard users to bypass navigation.
 */
export function SkipLink({ targetId = '#main', label = 'Skip to main content' }: SkipLinkProps) {
  return (
    <a
      href={targetId}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-indigo-950 focus:text-white focus:rounded-xl focus:shadow-2xl focus:ring-2 focus:ring-rose-gold focus:outline-none text-xs font-semibold cursor-pointer"
    >
      {label}
    </a>
  );
}
