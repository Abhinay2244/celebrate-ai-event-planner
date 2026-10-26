import React from 'react';
import { Sparkles, PhoneCall } from 'lucide-react';
import { EventPlan } from '../../types/planner';

interface ModernCardProps {
  plan: EventPlan;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventCity: string;
  dressCode: string;
}

/**
 * Modern card template featuring neon glass styling and high-contrast typography.
 */
export const ModernCard: React.FC<ModernCardProps> = ({
  plan,
  eventTitle,
  eventType,
  eventDate,
  eventCity,
  dressCode,
}) => {
  return (
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
          <p className="text-[10px] uppercase text-gray-300 font-mono">Date</p>
          <p className="font-semibold text-white mt-0.5">{eventDate}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-gray-300 font-mono">Time</p>
          <p className="font-semibold text-white mt-0.5">6:30 PM</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-gray-300 font-mono">City</p>
          <p className="font-semibold text-white mt-0.5">{eventCity}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-gray-300 font-mono">Dress</p>
          <p className="font-semibold text-white mt-0.5 truncate">{dressCode}</p>
        </div>
      </div>

      <div className="pt-4 text-xs text-gray-300 flex items-center justify-center gap-2">
        <PhoneCall className="w-3.5 h-3.5 text-rose-gold" />
        <span>Kindly RSVP to secure entry & dietary allocation</span>
      </div>
    </div>
  );
};
