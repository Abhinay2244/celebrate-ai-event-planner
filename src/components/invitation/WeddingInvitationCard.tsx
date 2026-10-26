import React from 'react';
import { Calendar, Clock, MapPin, Shirt } from 'lucide-react';
import { FloralCorner, OrnateDivider } from './InvitationOrnaments';

interface WeddingInvitationCardProps {
  eventTitle: string;
  eventDate: string;
  eventCity: string;
  dressCode: string;
}

/**
 * Traditional classic invitation card template for weddings.
 */
export const WeddingInvitationCard: React.FC<WeddingInvitationCardProps> = ({
  eventTitle,
  eventDate,
  eventCity,
  dressCode,
}) => {
  return (
    <div className="relative border-2 border-[#D8C7A5] p-6 sm:p-10 rounded-2xl text-center space-y-6 bg-[#FCFAF6]/90 shadow-inner">
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
          <span>
            Dress Code: <strong>{dressCode} (Traditional Indian / Formal)</strong>
          </span>
        </p>
        <p className="text-[11px] uppercase tracking-wider text-[#8B6E32] font-semibold">
          Kindly RSVP by {eventDate} • Celebrations begin at dusk
        </p>
      </div>
    </div>
  );
};
