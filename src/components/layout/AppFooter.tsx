import React from 'react';

/**
 * Footer landmark with copyright and AI technology stack acknowledgment.
 */
export const AppFooter: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-subtle py-8 text-center text-xs text-gray-600 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          © 2026 Celebrate AI • GenAI Event Strategist for Weddings, Birthdays & Community Festivals
        </p>
        <p className="flex items-center gap-1.5">
          <span>Powered by Gemini 3.8 Flash</span>
          <span>•</span>
          <span className="text-rose-gold font-medium">Strict Zod Integrity</span>
        </p>
      </div>
    </footer>
  );
};
