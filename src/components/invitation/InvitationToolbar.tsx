import React from 'react';
import { Layers, MessageSquare } from 'lucide-react';
import { CardTemplate, TextFormat } from '../tabs/InvitationTab';

interface InvitationToolbarProps {
  template: CardTemplate;
  setTemplate: (tmpl: CardTemplate) => void;
  textFormat: TextFormat;
  setTextFormat: (fmt: TextFormat) => void;
}

const TEMPLATES = ['classic', 'modern', 'minimal'] as const;
const FORMATS: Array<{ id: TextFormat; label: string }> = [
  { id: 'formal', label: 'Formal' },
  { id: 'casual', label: 'Casual' },
  { id: 'whatsapp', label: 'WhatsApp' },
];

/**
 * Switcher toolbar for invitation templates (Classic, Modern, Minimal) and text formats.
 */
export const InvitationToolbar: React.FC<InvitationToolbarProps> = ({
  template,
  setTemplate,
  textFormat,
  setTextFormat,
}) => {
  const templateRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const formatRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const handleTemplateKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % TEMPLATES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + TEMPLATES.length) % TEMPLATES.length;
    }
    if (nextIndex !== -1) {
      e.preventDefault();
      setTemplate(TEMPLATES[nextIndex]);
      templateRefs.current[nextIndex]?.focus();
    }
  };

  const handleFormatKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % FORMATS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + FORMATS.length) % FORMATS.length;
    }
    if (nextIndex !== -1) {
      e.preventDefault();
      setTextFormat(FORMATS[nextIndex].id);
      formatRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5">
        <span
          id="card-template-label"
          className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-rose-gold" /> Card Style Template:
        </span>
        <div
          role="radiogroup"
          aria-labelledby="card-template-label"
          className="inline-flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-subtle"
        >
          {TEMPLATES.map((t, idx) => (
            <button
              key={t}
              ref={(el) => {
                templateRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={template === t}
              tabIndex={template === t ? 0 : -1}
              onClick={() => setTemplate(t)}
              onKeyDown={(e) => handleTemplateKeyDown(e, idx)}
              className={`min-h-[44px] min-w-[44px] px-3.5 py-2 flex items-center justify-center rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold ${
                template === t
                  ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-xs border border-subtle'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <span
          id="copy-format-label"
          className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5 text-rose-gold" /> Copy Format:
        </span>
        <div
          role="radiogroup"
          aria-labelledby="copy-format-label"
          className="inline-flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-subtle"
        >
          {FORMATS.map((f, idx) => (
            <button
              key={f.id}
              ref={(el) => {
                formatRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={textFormat === f.id}
              tabIndex={textFormat === f.id ? 0 : -1}
              onClick={() => setTextFormat(f.id)}
              onKeyDown={(e) => handleFormatKeyDown(e, idx)}
              className={`min-h-[44px] min-w-[44px] px-3.5 py-2 flex items-center justify-center rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold ${
                textFormat === f.id
                  ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-xs border border-subtle'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
