import React, { FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputFormProps {
  inputText: string;
  setInputText: (text: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

/**
 * Text input form for sending natural-language plan adjustments.
 */
export const ChatInputForm: React.FC<ChatInputFormProps> = ({
  inputText,
  setInputText,
  isSubmitting,
  onSubmit,
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-white/95 dark:bg-slate-900/95 border-t border-subtle flex items-center gap-2"
    >
      <input
        type="text"
        aria-label="Celebration plan refinement prompt"
        placeholder="Ask e.g. 'Make it cheaper' or 'Add rain backup'..."
        value={inputText}
        disabled={isSubmitting}
        onChange={(e) => setInputText(e.target.value)}
        className="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-slate-800 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white"
      />
      <button
        type="submit"
        disabled={isSubmitting || !inputText.trim()}
        aria-label="Send refinement request"
        className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-indigo-950 dark:bg-rose-gold text-white disabled:opacity-40 hover:opacity-90 transition-all shrink-0 cursor-pointer"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};
