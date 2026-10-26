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
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-rose-gold" /> Card Style Template:
        </label>
        <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-subtle">
          {TEMPLATES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTemplate(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
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
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-rose-gold" /> Copy Format:
        </label>
        <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-subtle">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTextFormat(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
