import React from 'react';
import { QUICK_PROMPTS } from '../../constants/index.ts';

interface ChatQuickPromptsProps {
  isSubmitting: boolean;
  onSelectPrompt: (prompt: string) => void;
}

/**
 * Scrollable chip list of instant refinement suggestions.
 */
export const ChatQuickPrompts: React.FC<ChatQuickPromptsProps> = ({
  isSubmitting,
  onSelectPrompt,
}) => {
  return (
    <div className="px-3 py-2 bg-black/5 dark:bg-white/5 border-t border-subtle/40 overflow-x-auto flex gap-1.5 no-scrollbar">
      {QUICK_PROMPTS.map((prompt, idx) => (
        <button
          key={idx}
          type="button"
          disabled={isSubmitting}
          onClick={() => onSelectPrompt(prompt)}
          className="text-[11px] whitespace-nowrap px-2.5 py-1.5 min-h-[32px] rounded-lg bg-white/70 dark:bg-slate-800/70 border border-subtle hover:border-rose-gold text-gray-700 dark:text-gray-300 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
