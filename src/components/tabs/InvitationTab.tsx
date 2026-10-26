import React, { useState, useRef } from 'react';
import { Mail, Copy, Check, Download, RefreshCw } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { EventPlan } from '../../types/planner';
import { normalizePaletteColor } from '../../utils/color';
import { useInvitationActions } from '../../hooks/useInvitationActions';
import { ClassicCard } from '../invitation/ClassicCard';
import { ModernCard } from '../invitation/ModernCard';
import { MinimalCard } from '../invitation/MinimalCard';
import { RawTextDrawer } from '../invitation/RawTextDrawer';
import { InvitationToolbar } from '../invitation/InvitationToolbar';

export interface InvitationTabProps {
  plan: EventPlan;
}

export type CardTemplate = 'classic' | 'modern' | 'minimal';
export type TextFormat = 'formal' | 'casual' | 'whatsapp';

/**
 * Bespoke Invitation Atelier tab.
 * Allows switching stationery templates, copying structured text formats,
 * and downloading a high-resolution PNG of the invitation.
 */
export const InvitationTab: React.FC<InvitationTabProps> = ({ plan }) => {
  const [template, setTemplate] = useState<CardTemplate>('classic');
  const [textFormat, setTextFormat] = useState<TextFormat>('formal');
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Normalize color palette for dynamic card styling
  const palette = (plan.personalizedIdeas?.theme?.colorPalette || []).map((c, i) =>
    normalizePaletteColor(c, i)
  );
  const primaryColor = palette[0]?.hex || '#1B1E4B';
  const secondaryColor = palette[1]?.hex || '#B76E79';

  const texts = plan.invitationText || {
    formal: `You are cordially invited to celebrate ${plan.summary.title} on ${plan.input.date} in ${plan.input.city}.`,
    casual: `Come celebrate ${plan.summary.title} with us on ${plan.input.date}! We can't wait to see you in ${plan.input.city}.`,
    whatsapp: `✨ *${plan.summary.title}* ✨\n📅 Date: ${plan.input.date}\n📍 Location: ${plan.input.city}\nRSVP today!`,
  };

  const currentContent = texts[textFormat];
  const eventTitle = plan.summary.title || `${plan.input.eventType} celebration`;
  const eventType = plan.input.eventType;
  const eventDate = plan.input.date;
  const eventCity = plan.input.city;
  const dressCode = plan.personalizedIdeas?.theme?.name || 'Festive Elegance';

  const { copied, isDownloading, handleCopyText, handleDownloadPng } = useInvitationActions({
    cardRef,
    eventTitle,
    currentContent,
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Top Banner and Quick Controls */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm border border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold flex items-center gap-1.5">
            <Mail className="w-4 h-4" /> Bespoke Invitation Atelier
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
            Stationery & Guest Suite
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            Rendered with your event theme colors and typography. Instant PNG export for print &
            mobile sharing.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-subtle bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Text' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-950 dark:bg-rosegold-gradient text-white text-xs font-semibold shadow-md hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isDownloading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloading ? 'Generating PNG...' : 'Download PNG'}</span>
          </button>
        </div>
      </div>

      {/* Template & Text Format Selectors */}
      <InvitationToolbar
        template={template}
        setTemplate={setTemplate}
        textFormat={textFormat}
        setTextFormat={setTextFormat}
      />

      {/* Main Invitation Card Display */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex justify-center"
      >
        <div
          ref={cardRef}
          className={`w-full max-w-2xl transition-all duration-300 shadow-2xl overflow-hidden select-none ${
            template === 'minimal'
              ? 'p-8 sm:p-14 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl text-gray-900 dark:text-white'
              : template === 'modern'
                ? 'p-8 sm:p-14 rounded-3xl bg-slate-900 text-white relative'
                : 'p-8 sm:p-14 bg-[#FAF7F2] text-[#241F1A] rounded-3xl border-[6px] border-[#E8DFD0] relative'
          }`}
          style={
            template === 'modern'
              ? {
                  background: `linear-gradient(135deg, ${primaryColor} 0%, #0F1226 70%, ${secondaryColor} 100%)`,
                }
              : undefined
          }
        >
          {template === 'classic' && (
            <ClassicCard
              plan={plan}
              eventTitle={eventTitle}
              eventType={eventType}
              eventDate={eventDate}
              eventCity={eventCity}
              dressCode={dressCode}
            />
          )}

          {template === 'modern' && (
            <ModernCard
              plan={plan}
              eventTitle={eventTitle}
              eventType={eventType}
              eventDate={eventDate}
              eventCity={eventCity}
              dressCode={dressCode}
            />
          )}

          {template === 'minimal' && (
            <MinimalCard
              eventTitle={eventTitle}
              eventDate={eventDate}
              eventCity={eventCity}
              dressCode={dressCode}
              currentContent={currentContent}
            />
          )}
        </div>
      </motion.div>

      {/* Copy Text Preview Drawer */}
      <RawTextDrawer
        currentContent={currentContent}
        textFormat={textFormat}
        copied={copied}
        onCopyText={handleCopyText}
      />
    </div>
  );
};
