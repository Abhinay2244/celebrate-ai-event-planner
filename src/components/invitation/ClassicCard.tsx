import React from 'react';
import { EventPlan } from '../../types/planner';
import { WeddingInvitationCard } from './WeddingInvitationCard';
import { BirthdayInvitationCard } from './BirthdayInvitationCard';
import { CommunityInvitationCard } from './CommunityInvitationCard';

interface ClassicCardProps {
  plan: EventPlan;
  eventTitle: string;
  eventType: 'wedding' | 'birthday' | 'community';
  eventDate: string;
  eventCity: string;
  dressCode: string;
}

/**
 * Renders the Classic stationery template adapted to event type (wedding, birthday, community).
 */
export const ClassicCard: React.FC<ClassicCardProps> = ({
  plan,
  eventTitle,
  eventType,
  eventDate,
  eventCity,
  dressCode,
}) => {
  if (eventType === 'wedding') {
    return (
      <WeddingInvitationCard
        eventTitle={eventTitle}
        eventDate={eventDate}
        eventCity={eventCity}
        dressCode={dressCode}
      />
    );
  }

  if (eventType === 'birthday') {
    return (
      <BirthdayInvitationCard
        eventTitle={eventTitle}
        tagline={plan.summary.tagline}
        eventDate={eventDate}
        eventCity={eventCity}
        dressCode={dressCode}
      />
    );
  }

  return (
    <CommunityInvitationCard
      eventTitle={eventTitle}
      tagline={plan.summary.tagline}
      eventDate={eventDate}
      eventCity={eventCity}
      dressCode={dressCode}
    />
  );
};
