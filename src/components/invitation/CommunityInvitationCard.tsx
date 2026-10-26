import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface CommunityInvitationCardProps {
  eventTitle: string;
  tagline: string;
  eventDate: string;
  eventCity: string;
  dressCode: string;
}

/**
 * Bold civic festival stationery card template for community events.
 */
export const CommunityInvitationCard: React.FC<CommunityInvitationCardProps> = ({
  eventTitle,
  tagline,
  eventDate,
  eventCity,
  dressCode,
}) => {
  return (
    <div className="relative border-2 border-indigo-900/30 p-6 sm:p-10 rounded-2xl text-center space-y-6 bg-white/95">
      <div className="p-3 rounded-xl bg-indigo-950 text-white space-y-1">
        <span className="text-[10px] tracking-widest uppercase font-bold text-rose-gold">
          COMMUNITY CONVERGENCE & FESTIVAL
        </span>
        <h3 className="font-serif text-2xl sm:text-4xl font-bold">{eventTitle}</h3>
      </div>

      <p className="text-xs sm:text-sm text-gray-700 max-w-lg mx-auto leading-relaxed">{tagline}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pt-2">
        <div className="p-3 rounded-xl border border-subtle bg-gray-50">
          <Calendar className="w-4 h-4 text-rose-gold mx-auto mb-1" />
          <p className="text-[10px] uppercase text-gray-600 font-bold">Date</p>
          <p className="text-xs font-semibold text-gray-800">{eventDate}</p>
        </div>

        <div className="p-3 rounded-xl border border-subtle bg-gray-50">
          <Clock className="w-4 h-4 text-rose-gold mx-auto mb-1" />
          <p className="text-[10px] uppercase text-gray-600 font-bold">Timing</p>
          <p className="text-xs font-semibold text-gray-800">10:00 AM – 9:00 PM</p>
        </div>

        <div className="p-3 rounded-xl border border-subtle bg-gray-50">
          <MapPin className="w-4 h-4 text-rose-gold mx-auto mb-1" />
          <p className="text-[10px] uppercase text-gray-600 font-bold">Destination</p>
          <p className="text-xs font-semibold text-gray-800">{eventCity}</p>
        </div>
      </div>

      <div className="pt-2 text-xs text-gray-700">
        <p>
          Theme: <strong>{dressCode}</strong> • Open Admission • Pre-Registration Encouraged
        </p>
      </div>
    </div>
  );
};
