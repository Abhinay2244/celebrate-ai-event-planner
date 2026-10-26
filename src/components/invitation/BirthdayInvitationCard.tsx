import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { ConfettiShapes, OrnateDivider } from './InvitationOrnaments';

interface BirthdayInvitationCardProps {
  eventTitle: string;
  tagline: string;
  eventDate: string;
  eventCity: string;
  dressCode: string;
}

/**
 * Festive celebration stationery card template for milestone birthdays.
 */
export const BirthdayInvitationCard: React.FC<BirthdayInvitationCardProps> = ({
  eventTitle,
  tagline,
  eventDate,
  eventCity,
  dressCode,
}) => {
  return (
    <div className="relative border-2 border-[#EAD2B8] p-6 sm:p-10 rounded-2xl text-center space-y-6 bg-white/95">
      <ConfettiShapes />
      <div className="space-y-2 relative z-10">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-rose-gold/15 text-rose-gold border border-rose-gold/30">
          ★ MILESTONE CELEBRATION ★
        </span>
        <h3 className="font-serif text-3xl sm:text-5xl font-bold text-indigo-950 pt-2">
          {eventTitle}
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 font-medium">{tagline}</p>
      </div>

      <OrnateDivider className="w-36 h-4 mx-auto text-rose-gold" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-md mx-auto pt-1 text-xs">
        <div className="p-3 rounded-xl bg-gray-50 border border-subtle/50 flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-rose-gold shrink-0" />
          <div>
            <p className="text-[10px] uppercase text-gray-600 font-bold">Date & Time</p>
            <p className="font-semibold text-gray-800">{eventDate} • 7:30 PM Onwards</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 border border-subtle/50 flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-rose-gold shrink-0" />
          <div>
            <p className="text-[10px] uppercase text-gray-600 font-bold">Venue Location</p>
            <p className="font-semibold text-gray-800">{eventCity}</p>
          </div>
        </div>
      </div>

      <div className="pt-2 text-xs text-gray-700 space-y-1">
        <p>
          Dress Code: <strong>{dressCode}</strong>
        </p>
        <p className="text-rose-gold font-semibold text-[11px]">
          RSVP for guestlist entry & wristbands
        </p>
      </div>
    </div>
  );
};
