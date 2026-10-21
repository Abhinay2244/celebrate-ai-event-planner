import React, { useState, useRef } from 'react';
import { Mail, Copy, Check, MessageSquare, Download, Sparkles, Calendar, Clock, MapPin, Shirt, PhoneCall, RefreshCw, Layers } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { EventPlan } from '../../types/planner';
import { normalizePaletteColor } from '../../utils/color';
import confetti from 'canvas-confetti';

interface InvitationTabProps {
  plan: EventPlan;
}

type CardTemplate = 'classic' | 'modern' | 'minimal';
type TextFormat = 'formal' | 'casual' | 'whatsapp';

// Elegant inline SVG floral corner ornament for wedding & classic stationery
const FloralCorner: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path
      d="M4 4C18 4 30 16 30 30M4 4C4 18 16 30 30 30M4 4L22 22M30 30C36 36 46 36 52 30M30 30C36 24 36 14 30 8M4 14C10 14 18 20 20 28M14 4C14 10 20 18 28 20M4 4H1M4 4V1"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    <circle cx="28" cy="28" r="2" fill="currentColor" />
    <circle cx="44" cy="20" r="1.5" fill="currentColor" />
  </svg>
);

// Ornate divider flourish SVG
const OrnateDivider: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg
    viewBox="0 0 200 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path
      d="M10 12H80M120 12H190M80 12C85 8 92 8 97 12C92 16 85 16 80 12ZM120 12C115 8 108 8 103 12C108 16 115 16 120 12Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="100" cy="12" r="3" fill="currentColor" />
    <circle cx="65" cy="12" r="1.5" fill="currentColor" />
    <circle cx="135" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// Party confetti shapes for birthday invitations
const ConfettiShapes: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" aria-hidden="true">
    <circle cx="10%" cy="15%" r="6" fill="#F59E0B" />
    <polygon points="85,20 90,32 78,32" fill="#EC4899" />
    <rect x="88%" y="18%" width="8" height="8" rx="2" transform="rotate(25 88 18)" fill="#06B6D4" />
    <circle cx="92%" cy="75%" r="5" fill="#EAB308" />
    <polygon points="40,90 46,102 34,102" fill="#8B5CF6" />
    <rect x="8%" y="82%" width="7" height="7" rx="1.5" transform="rotate(45 8 82)" fill="#10B981" />
  </svg>
);

export const InvitationTab: React.FC<InvitationTabProps> = ({ plan }) => {
  const [template, setTemplate] = useState<CardTemplate>('classic');
  const [textFormat, setTextFormat] = useState<TextFormat>('formal');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Normalize color palette
  const palette = (plan.personalizedIdeas?.theme?.colorPalette || []).map((c, i) => normalizePaletteColor(c, i));
  const primaryColor = palette[0]?.hex || '#1B1E4B';
  const secondaryColor = palette[1]?.hex || '#B76E79';
  const accentGold = '#C59A45';

  const texts = plan.invitationText || {
    formal: `You are cordially invited to celebrate ${plan.summary.title} on ${plan.input.date} in ${plan.input.city}.`,
    casual: `Come celebrate ${plan.summary.title} with us on ${plan.input.date}! We can't wait to see you in ${plan.input.city}.`,
    whatsapp: `✨ *${plan.summary.title}* ✨\n📅 Date: ${plan.input.date}\n📍 Location: ${plan.input.city}\nRSVP today!`,
  };

  const currentContent = texts[textFormat];

  // Extract structured details
  const eventTitle = plan.summary.title || `${plan.input.eventType} celebration`;
  const eventType = plan.input.eventType;
  const eventDate = plan.input.date;
  const eventCity = plan.input.city;
  const dressCode = plan.personalizedIdeas?.theme?.name || 'Festive Elegance';

  const handleCopyText = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    confetti({ particleCount: 30, spread: 55, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#FFFFFF',
      });
      const cleanName = eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const link = document.createElement('a');
      link.download = `${cleanName}-invitation.png`;
      link.href = dataUrl;
      link.click();
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Failed to export invitation image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

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
          <p className="text-xs text-gray-500 mt-1">
            Rendered with your event theme colors and typography. Instant PNG export for print & mobile sharing.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-subtle bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Text' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-950 dark:bg-rosegold-gradient text-white text-xs font-semibold shadow-md hover:opacity-95 disabled:opacity-50 transition-all"
          >
            {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isDownloading ? 'Generating PNG...' : 'Download PNG'}</span>
          </button>
        </div>
      </div>

      {/* Template & Text Format Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Template Style Switcher */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-gold" /> Card Style Template:
          </label>
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-subtle">
            {(['classic', 'modern', 'minimal'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTemplate(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  template === t
                    ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-xs border border-subtle'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Text Mode Switcher */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-rose-gold" /> Copy Format:
          </label>
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-subtle">
            {[
              { id: 'formal', label: 'Formal' },
              { id: 'casual', label: 'Casual' },
              { id: 'whatsapp', label: 'WhatsApp' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTextFormat(f.id as TextFormat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  textFormat === f.id
                    ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-xs border border-subtle'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

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
          {/* ========================================================================= */}
          {/* TEMPLATE A: WEDDING / CLASSIC CARD                                        */}
          {/* ========================================================================= */}
          {eventType === 'wedding' && template === 'classic' && (
            <div className="relative border-2 border-[#D8C7A5] p-6 sm:p-10 rounded-2xl text-center space-y-6 bg-[#FCFAF6]/90 shadow-inner">
              {/* Corner Ornaments using inline SVGs */}
              <FloralCorner className="absolute top-2 left-2 w-10 h-10 text-[#C59A45]" />
              <FloralCorner className="absolute top-2 right-2 w-10 h-10 text-[#C59A45] transform scale-x-[-1]" />
              <FloralCorner className="absolute bottom-2 left-2 w-10 h-10 text-[#C59A45] transform scale-y-[-1]" />
              <FloralCorner className="absolute bottom-2 right-2 w-10 h-10 text-[#C59A45] transform scale-x-[-1] scale-y-[-1]" />

              <div className="space-y-2 pt-2">
                <p className="font-cormorant uppercase tracking-[0.25em] text-xs font-semibold text-[#8B6E32]">
                  Together with their families
                </p>
                <h3 className="font-script text-4xl sm:text-6xl text-[#1B1E4B] leading-tight py-1">
                  {eventTitle}
                </h3>
                <p className="font-cormorant italic text-sm sm:text-base text-[#6E5D4B]">
                  request the honour of your presence at their wedding celebration
                </p>
              </div>

              <OrnateDivider className="w-44 h-5 mx-auto text-[#C59A45]" />

              {/* Event Coordinates */}
              <div className="space-y-3 font-cormorant text-base sm:text-lg">
                <div className="flex items-center justify-center gap-2 font-bold tracking-wider text-[#1B1E4B]">
                  <Calendar className="w-4 h-4 text-[#C59A45]" />
                  <span>{eventDate}</span>
                  <span className="text-[#C59A45]">•</span>
                  <Clock className="w-4 h-4 text-[#C59A45]" />
                  <span>Sunset Vows at 5:30 PM</span>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-sm text-[#544638]">
                  <MapPin className="w-4 h-4 text-[#C59A45]" />
                  <span>Grand Heritage Palace & Grounds • {eventCity}</span>
                </div>
              </div>

              <div className="border-t border-[#E8DFD0] pt-4 space-y-2 text-xs font-sans text-[#7A6B5B]">
                <p className="flex items-center justify-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-[#C59A45]" />
                  <span>Dress Code: <strong>{dressCode} (Traditional Indian / Formal)</strong></span>
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#8B6E32] font-semibold">
                  Kindly RSVP by {eventDate} • Celebrations begin at dusk
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE B: BIRTHDAY CELEBRATION CARD                                     */}
          {/* ========================================================================= */}
          {eventType === 'birthday' && template === 'classic' && (
            <div className="relative border-2 border-[#EAD2B8] p-6 sm:p-10 rounded-2xl text-center space-y-6 bg-white/95">
              <ConfettiShapes />
              <div className="space-y-2 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-rose-gold/15 text-rose-gold border border-rose-gold/30">
                  ★ MILESTONE CELEBRATION ★
                </span>
                <h3 className="font-serif text-3xl sm:text-5xl font-bold text-indigo-950 pt-2">
                  {eventTitle}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {plan.summary.tagline}
                </p>
              </div>

              <OrnateDivider className="w-36 h-4 mx-auto text-rose-gold" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-md mx-auto pt-1 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 border border-subtle/50 flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-rose-gold shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Date & Time</p>
                    <p className="font-semibold text-gray-800">{eventDate} • 7:30 PM Onwards</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-subtle/50 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-gold shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Venue Location</p>
                    <p className="font-semibold text-gray-800">{eventCity}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-gray-500 space-y-1">
                <p>Dress Code: <strong>{dressCode}</strong></p>
                <p className="text-rose-gold font-semibold text-[11px]">RSVP for guestlist entry & wristbands</p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE C: COMMUNITY GALA CARD                                           */}
          {/* ========================================================================= */}
          {eventType === 'community' && template === 'classic' && (
            <div className="relative border-2 border-indigo-900/30 p-6 sm:p-10 rounded-2xl text-center space-y-6 bg-white/95">
              <div className="p-3 rounded-xl bg-indigo-950 text-white space-y-1">
                <span className="text-[10px] tracking-widest uppercase font-bold text-rose-gold">
                  COMMUNITY CONVERGENCE & FESTIVAL
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold">
                  {eventTitle}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                {plan.summary.tagline}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pt-2">
                <div className="p-3 rounded-xl border border-subtle bg-gray-50">
                  <Calendar className="w-4 h-4 text-rose-gold mx-auto mb-1" />
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Date</p>
                  <p className="text-xs font-semibold text-gray-800">{eventDate}</p>
                </div>

                <div className="p-3 rounded-xl border border-subtle bg-gray-50">
                  <Clock className="w-4 h-4 text-rose-gold mx-auto mb-1" />
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Timing</p>
                  <p className="text-xs font-semibold text-gray-800">10:00 AM – 9:00 PM</p>
                </div>

                <div className="p-3 rounded-xl border border-subtle bg-gray-50">
                  <MapPin className="w-4 h-4 text-rose-gold mx-auto mb-1" />
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Destination</p>
                  <p className="text-xs font-semibold text-gray-800">{eventCity}</p>
                </div>
              </div>

              <div className="pt-2 text-xs text-gray-500">
                <p>Theme: <strong>{dressCode}</strong> • Open Admission • Pre-Registration Encouraged</p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE MODERN: SLEEK GLASS & HIGH CONTRAST                              */}
          {/* ========================================================================= */}
          {template === 'modern' && (
            <div className="space-y-8 text-center relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-white/10 border border-white/20 text-rose-gold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{eventType.toUpperCase()} INVITATION</span>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                  {eventTitle}
                </h3>
                <p className="text-sm text-gray-300 max-w-lg mx-auto font-light leading-relaxed">
                  {plan.summary.tagline}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-4 border-t border-white/15 text-xs text-left">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-mono">Date</p>
                  <p className="font-semibold text-white mt-0.5">{eventDate}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-mono">Time</p>
                  <p className="font-semibold text-white mt-0.5">6:30 PM</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-mono">City</p>
                  <p className="font-semibold text-white mt-0.5">{eventCity}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-mono">Dress</p>
                  <p className="font-semibold text-white mt-0.5 truncate">{dressCode}</p>
                </div>
              </div>

              <div className="pt-4 text-xs text-gray-300 flex items-center justify-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-rose-gold" />
                <span>Kindly RSVP to secure entry & dietary allocation</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE MINIMAL: LUXURY EDITORIAL                                        */}
          {/* ========================================================================= */}
          {template === 'minimal' && (
            <div className="space-y-8 text-center max-w-lg mx-auto">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.3em] font-mono text-gray-400">
                  AN INVITATION TO CELEBRATE
                </p>
                <div className="w-12 h-px bg-gray-400 mx-auto my-3" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-gray-900 dark:text-white leading-tight">
                  {eventTitle}
                </h3>
                <p className="font-serif italic text-sm text-gray-500">
                  {eventCity} • {eventDate}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                {currentContent}
              </p>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-1 text-xs text-gray-400 font-mono">
                <p>ATTIRE: {dressCode.toUpperCase()}</p>
                <p>PLEASE CONFIRM ATTENDANCE</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Copy Text Preview Drawer */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-rose-gold" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Raw Invitation Text ({textFormat.toUpperCase()} DRAFT)
            </h4>
          </div>
          <button
            onClick={handleCopyText}
            className="text-xs font-semibold text-rose-gold hover:underline flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-pre-line bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-subtle/40 leading-relaxed">
          {currentContent}
        </p>
      </div>
    </div>
  );
};
