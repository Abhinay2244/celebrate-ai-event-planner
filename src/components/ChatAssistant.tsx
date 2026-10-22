import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Wand2, X, RefreshCw, CheckCircle2, Bot, User, AlertCircle } from 'lucide-react';
import { ChatMessage, EventPlan } from '../types/planner';
import { refinePlanApi } from '../services/api';
import confetti from 'canvas-confetti';

interface ChatAssistantProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const QUICK_PROMPTS = [
  'Make it 15% cheaper while keeping guest count',
  'Add an outdoor rain and weather contingency plan',
  'Make catering 100% vegetarian & Jain friendly',
  'Add Sangeet choreography & DJ soundcheck into timeline',
  'Suggest eco-friendly & zero-waste decor ideas',
];

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  plan,
  onUpdatePlan,
  isOpen,
  onToggle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your Celebrate AI celebration strategist. Need to adjust your budget, adapt your theme, or add weather contingencies? Tell me what you'd like to refine!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSubmitting) return;

    setError(null);
    setInputText('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSubmitting(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await refinePlanApi({
        plan,
        message: text,
        history,
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appliedChanges: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      onUpdatePlan(res.updatedPlan);
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.85 } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to refine plan';
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `I ran into an issue updating your plan: ${msg}. Please try again or rephrase your request.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        aria-label="Open Celebrate AI refinement assistant"
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-indigo-950 dark:bg-rosegold-gradient text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-white/20 group"
      >
        <Sparkles className="w-5 h-5 text-rose-gold dark:text-white group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-semibold hidden sm:inline">Refine Plan</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    );
  }

  return (
    <div
      role="dialog"
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
            <h3 id="chat-title" className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
              Refine With Celebrate AI
            </h3>
            <p className="text-[10px] text-gray-300">
              Modifies your live plan in-context
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          aria-label="Close refinement assistant"
          className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div
        role="log"
        aria-live="polite"
        className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs"
      >
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

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-black/5 dark:bg-white/5 border-t border-subtle/40 overflow-x-auto flex gap-1.5 no-scrollbar">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-subtle hover:border-rose-gold text-gray-700 dark:text-gray-300 transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
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
    </div>
  );
};
