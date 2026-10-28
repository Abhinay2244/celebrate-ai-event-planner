import React, { useEffect } from 'react';
import { Sparkles, X, Bot } from 'lucide-react';
import { EventPlan } from '../types/planner';
import { useChatRefinement } from '../hooks/useChatRefinement';
import { ChatMessageList } from './chat/ChatMessageList';
import { ChatQuickPrompts } from './chat/ChatQuickPrompts';
import { ChatInputForm } from './chat/ChatInputForm';

export interface ChatAssistantProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Conversational refinement assistant drawer.
 * Allows users to converse with Gemini in natural language to dynamically adjust the live plan.
 */
export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  plan,
  onUpdatePlan,
  isOpen,
  onToggle,
}) => {
  const { messages, inputText, setInputText, isSubmitting, messagesEndRef, handleSendMessage } =
    useChatRefinement({ plan, onUpdatePlan, isOpen });
  const chatRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input on drawer open
      const timer = setTimeout(() => {
        const inputEl = chatRef.current?.querySelector<HTMLInputElement>('input');
        inputEl?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onToggle();
        } else if (e.key === 'Tab') {
          const focusables = chatRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (!focusables || focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        triggerRef.current?.focus();
      };
    }
  }, [isOpen, onToggle]);

  if (!isOpen) {
    return (
      <button
        ref={triggerRef}
        onClick={onToggle}
        aria-label="Open Celebrate AI refinement assistant"
        className="fixed bottom-6 right-6 z-40 p-4 min-h-[44px] min-w-[44px] rounded-2xl bg-indigo-950 dark:bg-rosegold-gradient text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-white/20 group cursor-pointer"
      >
        <Sparkles className="w-5 h-5 text-rose-gold dark:text-white group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-semibold hidden sm:inline">Refine Plan</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    );
  }

  return (
    <div
      ref={chatRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[85vh] h-[600px] flex flex-col rounded-3xl glass-dropdown border border-subtle shadow-2xl overflow-hidden animate-slideUp"
    >
      {/* Header */}
      <div className="p-4 bg-indigo-950 text-white flex items-center justify-between border-b border-indigo-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rosegold-gradient flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3
              id="chat-title"
              className="font-serif font-bold text-sm text-white flex items-center gap-1.5"
            >
              Refine With Celebrate AI
            </h3>
            <p className="text-[10px] text-gray-300">Modifies your live plan in-context</p>
          </div>
        </div>

        <button
          onClick={onToggle}
          aria-label="Close refinement assistant"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <ChatMessageList
        messages={messages}
        isSubmitting={isSubmitting}
        messagesEndRef={messagesEndRef}
      />

      {/* Suggested Quick Prompts */}
      <ChatQuickPrompts
        isSubmitting={isSubmitting}
        onSelectPrompt={(prompt) => handleSendMessage(prompt)}
      />

      {/* Input Form */}
      <ChatInputForm
        inputText={inputText}
        setInputText={setInputText}
        isSubmitting={isSubmitting}
        onSubmit={() => handleSendMessage()}
      />
    </div>
  );
};
