import { useState, useRef, useEffect } from 'react';
import { ChatMessage, EventPlan } from '../types/planner';
import { refinePlanApi } from '../services/api';
import confetti from 'canvas-confetti';

interface UseChatRefinementProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
  isOpen: boolean;
}

/**
 * Custom hook managing conversation history and live event plan refinements via Gemini.
 */
export function useChatRefinement({ plan, onUpdatePlan, isOpen }: UseChatRefinementProps) {
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

  return {
    messages,
    inputText,
    setInputText,
    isSubmitting,
    error,
    messagesEndRef,
    handleSendMessage,
  };
}
