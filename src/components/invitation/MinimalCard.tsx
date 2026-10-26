import React from 'react';

interface MinimalCardProps {
  eventTitle: string;
  eventDate: string;
  eventCity: string;
  dressCode: string;
  currentContent: string;
}

/**
 * Editorial minimalist stationery card template.
 */
export const MinimalCard: React.FC<MinimalCardProps> = ({
  eventTitle,
  eventDate,
  eventCity,
  dressCode,
  currentContent,
}) => {
  return (
    <div className="space-y-8 text-center max-w-lg mx-auto">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.3em] font-mono text-gray-600 dark:text-gray-300">
          AN INVITATION TO CELEBRATE
        </p>
        <div className="w-12 h-px bg-gray-400 dark:bg-gray-600 mx-auto my-3" />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-3xl sm:text-4xl font-normal text-gray-900 dark:text-white leading-tight">
          {eventTitle}
        </h3>
        <p className="font-serif italic text-sm text-gray-600 dark:text-gray-300">
          {eventCity} • {eventDate}
        </p>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
        {currentContent}
      </p>

      <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-1 text-xs text-gray-600 dark:text-gray-300 font-mono">
        <p>ATTIRE: {dressCode.toUpperCase()}</p>
        <p>PLEASE CONFIRM ATTENDANCE</p>
      </div>
    </div>
  );
};
