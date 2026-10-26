import React from 'react';
import { EventPlan } from '../../types/planner';
import { ThemeDecorSection } from '../ideas/ThemeDecorSection';
import { MenuSection } from '../ideas/MenuSection';
import { EntertainmentSection } from '../ideas/EntertainmentSection';

export interface IdeasTabProps {
  plan: EventPlan;
}

/**
 * Creative Concept & Menus tab.
 * Details aesthetic visual direction, floral architecture, gastronomy menus, and sonic playlists.
 */
export const IdeasTab: React.FC<IdeasTabProps> = ({ plan }) => {
  const ideas = plan.personalizedIdeas;

  if (!ideas) {
    return <div className="p-8 text-center text-gray-500">No personalized ideas available.</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* 1 & 2. Theme Visual Direction & Decor Architecture */}
      <ThemeDecorSection theme={ideas.theme} decor={ideas.decor} />

      {/* 3. Culinary Curation & Bar Menu */}
      <MenuSection menu={ideas.menu} />

      {/* 4. Activities & Sonic Architecture */}
      <EntertainmentSection activities={ideas.activities} music={ideas.music} />
    </div>
  );
};
