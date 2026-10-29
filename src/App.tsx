import React from 'react';
import { Navbar } from './components/Navbar.tsx';
import { PlannerForm } from './components/PlannerForm.tsx';
import { SkeletonPlanLoader } from './components/SkeletonPlanLoader.tsx';
import { SavedPlansModal } from './components/SavedPlansModal.tsx';
import { useEventPlan } from './hooks/useEventPlan.ts';
import { ErrorAlert } from './components/layout/ErrorAlert.tsx';
import { PlanHeroBanner } from './components/layout/PlanHeroBanner.tsx';
import { ActivePlanView } from './components/layout/ActivePlanView.tsx';
import { AppFooter } from './components/layout/AppFooter.tsx';
import { SkipLink } from './components/layout/SkipLink.tsx';

/**
 * Primary Application Shell for Celebrate AI.
 * Orchestrates navigation landmarks, celebration configuration forms,
 * active blueprint dashboard, and persistence modals.
 */
export default function App() {
  const {
    darkMode,
    toggleDarkMode,
    savedPlans,
    activePlan,
    activeTab,
    selectTab,
    isLoading,
    error,
    dismissError,
    isChatOpen,
    toggleChat,
    isSavedModalOpen,
    openSavedModal,
    closeSavedModal,
    lastSubmittedInput,
    generatePlan,
    handleSelectPlan,
    handleDeletePlan,
    handleNewPlan,
    handleUpdatePlan,
  } = useEventPlan();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      {/* Skip to Main Content Link (First focusable element for accessibility) */}
      <SkipLink />

      {/* Top Header Landmark */}
      <header role="banner" className="sticky top-0 z-40 w-full backdrop-blur-md">
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          savedPlans={savedPlans}
          activePlan={activePlan}
          onSelectPlan={handleSelectPlan}
          onNewPlan={handleNewPlan}
        />
      </header>

      {/* Main Landmark */}
      <main
        id="main"
        tabIndex={-1}
        aria-busy={isLoading}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 focus:outline-none"
      >
        {/* Error Alert Box */}
        {error && (
          <ErrorAlert
            error={error}
            onRetry={lastSubmittedInput ? () => generatePlan(lastSubmittedInput) : undefined}
            onDismiss={dismissError}
          />
        )}

        {/* State 1: Loading Skeleton */}
        {isLoading && <SkeletonPlanLoader />}

        {/* State 2: Planner Input Form */}
        {!isLoading && !activePlan && (
          <div className="space-y-10 animate-fadeIn">
            <PlanHeroBanner savedPlansCount={savedPlans.length} onOpenSavedModal={openSavedModal} />
            <PlannerForm onSubmit={generatePlan} isLoading={isLoading} />
          </div>
        )}

        {/* State 3: Active Plan Results Tabs */}
        {!isLoading && activePlan && (
          <ActivePlanView
            plan={activePlan}
            activeTab={activeTab}
            savedPlansCount={savedPlans.length}
            isChatOpen={isChatOpen}
            onSelectTab={selectTab}
            onNewPlan={handleNewPlan}
            onOpenSavedModal={openSavedModal}
            onUpdatePlan={handleUpdatePlan}
            onToggleChat={toggleChat}
          />
        )}
      </main>

      {/* Saved Plans Modal */}
      <SavedPlansModal
        isOpen={isSavedModalOpen}
        onClose={closeSavedModal}
        savedPlans={savedPlans}
        activePlanId={activePlan?.id ?? null}
        onSelectPlan={handleSelectPlan}
        onDeletePlan={handleDeletePlan}
        onNewPlan={handleNewPlan}
      />

      {/* Footer Landmark */}
      <AppFooter />
    </div>
  );
}
