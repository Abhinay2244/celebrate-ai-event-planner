import React, { useState } from 'react';
import { EventPlan } from '../../types/planner';
import { TabId } from '../../hooks/useEventPlan';
import { calculatePerGuest } from '../../utils/budget';
import { exportPlanToPdf } from '../../utils/pdfExport';
import { HeroDossierCard } from '../overview/HeroDossierCard';
import { SnapshotCards } from '../overview/SnapshotCards';
import { AtmosphereSection } from '../overview/AtmosphereSection';
import confetti from 'canvas-confetti';

export interface OverviewTabProps {
  plan: EventPlan;
  onNavigateTab: (tabId: TabId) => void;
}

/**
 * Executive Celebration Overview Tab.
 * Presents executive metrics, budget breakdown summary, vendor status, and theme moodboard.
 */
export const OverviewTab: React.FC<OverviewTabProps> = ({ plan, onNavigateTab }) => {
  const [copiedInvite, setCopiedInvite] = useState(false);
  const perGuest = calculatePerGuest(plan.totalBudgetCalculated, plan.input.guestCount);
  const completedVendors = plan.vendorChecklist.filter((v) => v.done).length;
  const totalVendors = plan.vendorChecklist.length;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(plan.invitationText.formal);
    setCopiedInvite(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleExportPdf = () => {
    exportPlanToPdf(plan);
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Dossier Card */}
      <HeroDossierCard
        plan={plan}
        copiedInvite={copiedInvite}
        onCopyInvite={handleCopyInvite}
        onExportPdf={handleExportPdf}
      />

      {/* Strategic Snapshot Cards */}
      <SnapshotCards
        plan={plan}
        perGuest={perGuest}
        completedVendors={completedVendors}
        totalVendors={totalVendors}
        onNavigateTab={onNavigateTab}
      />

      {/* Theme Moodboard & Color Palette Highlight */}
      <AtmosphereSection theme={plan.personalizedIdeas?.theme} onNavigateTab={onNavigateTab} />
    </div>
  );
};
