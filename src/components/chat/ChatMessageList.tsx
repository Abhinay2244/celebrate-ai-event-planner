import React, { RefObject } from 'react';
import { User, Bot, CheckCircle2, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../../types/planner';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isSubmitting: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

/**
 * Message stream showing user requests and assistant plan modifications.
 */
export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isSubmitting,
  messagesEndRef,
}) => {
  return (
    <div role="log" aria-live="polite" className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] ${
                isUser ? 'bg-indigo-700' : 'bg-rose-gold'
              }`}
            >
              {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[82%] p-3 rounded-2xl space-y-1 ${
                isUser
                  ? 'bg-indigo-950 text-white rounded-tr-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 border border-subtle text-gray-800 dark:text-gray-200 rounded-tl-xs'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <div className="flex items-center justify-between gap-2 text-[9px] text-gray-400 pt-0.5">
                <span>{msg.timestamp}</span>
                {msg.appliedChanges && (
                  <span className="text-emerald-500 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Live Plan Updated
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {isSubmitting && (
        <div className="flex items-center gap-2 text-rose-gold text-xs italic pl-8 animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Harmonizing adjustments and recalculating budget...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
