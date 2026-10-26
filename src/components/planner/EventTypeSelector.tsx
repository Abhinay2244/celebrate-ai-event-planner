import React from 'react';
import { HeartHandshake, Cake, Users2 } from 'lucide-react';
import { EventType } from '../../types/planner';

interface EventTypeSelectorProps {
  eventType: EventType;
  onSelectType: (type: EventType) => void;
}

const EVENT_TYPE_OPTIONS = [
  {
    type: 'wedding' as const,
    label: 'Wedding',
    desc: 'Sangeet, Vows & Receptions',
    icon: HeartHandshake,
  },
  {
    type: 'birthday' as const,
    label: 'Milestone Birthday',
    desc: '1st, 18th, 21st, 50th Galas',
    icon: Cake,
  },
  {
    type: 'community' as const,
    label: 'Community & Gala',
    desc: 'Festivals, Meetups & Fundraisers',
    icon: Users2,
  },
];

/**
 * Event type cards selector (Wedding, Birthday, Community).
 */
export const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({
  eventType,
  onSelectType,
}) => {
  return (
    <div>
      <h3 className="block text-sm font-semibold tracking-wide text-gray-900 dark:text-white uppercase mb-3">
        1. Select Event Nature
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {EVENT_TYPE_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isSelected = eventType === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onSelectType(item.type)}
              className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-rose-gold bg-rose-gold/10 dark:bg-rose-gold/15 shadow-md'
                  : 'border-transparent bg-white/60 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon
                  className={`w-6 h-6 ${isSelected ? 'text-rose-gold' : 'text-gray-600 dark:text-gray-400'}`}
                />
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-gold ring-4 ring-rose-gold/20" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                  {item.label}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
