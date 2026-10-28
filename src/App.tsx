import React from 'react';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { PlannerForm } from './components/PlannerForm';
import { SkeletonPlanLoader } from './components/SkeletonPlanLoader';
import { OverviewTab } from './components/tabs/OverviewTab';
import { BudgetTab } from './components/tabs/BudgetTab';
import { TimelineTab } from './components/tabs/TimelineTab';
import { VendorsTab } from './components/tabs/VendorsTab';
import { IdeasTab } from './components/tabs/IdeasTab';
import { InvitationTab } from './components/tabs/InvitationTab';
import { ChatAssistant } from './components/ChatAssistant';
import { SavedPlansModal } from './components/SavedPlansModal';
import { useEventPlan } from './hooks/useEventPlan';
import { ErrorAlert } from './components/layout/ErrorAlert';
import { TabBar } from './components/layout/TabBar';
import { PlanHeroBanner } from './components/layout/PlanHeroBanner';
import { AppFooter } from './components/layout/AppFooter';

/**
 * Primary Application Shell for Celebrate AI.
 * Orchestrates navigation landmarks, live active celebration plan tabs,
 * and conversational refinement assistant.
 */
export default function App() {
  const {
    darkMode,
    setDarkMode,
    savedPlans,
    activePlan,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    setError,
    isChatOpen,
    setIsChatOpen,
    isSavedModalOpen,
    setIsSavedModalOpen,
    lastSubmittedInput,
    handleGeneratePlan,
    handleSelectPlan,
    handleDeletePlan,
    handleNewPlan,
    handleUpdatePlan,
  } = useEventPlan();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      {/* Skip to Main Content Link (First focusable element for accessibility) */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-indigo-950 focus:text-white focus:rounded-xl focus:shadow-2xl focus:ring-2 focus:ring-rose-gold focus:outline-none text-xs font-semibold cursor-pointer"
      >
        Skip to main content
      </a>

      {/* Top Header Landmark */}
      <header role="banner" className="sticky top-0 z-40 w-full backdrop-blur-md">
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
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
            onRetry={lastSubmittedInput ? () => handleGeneratePlan(lastSubmittedInput) : undefined}
            onDismiss={() => setError(null)}
          />
        )}

        {/* State 1: Loading Skeleton */}
        {isLoading && <SkeletonPlanLoader />}

        {/* State 2: Planner Input Form */}
        {!isLoading && !activePlan && (
          <div className="space-y-10 animate-fadeIn">
            <PlanHeroBanner
              savedPlansCount={savedPlans.length}
              onOpenSavedModal={() => setIsSavedModalOpen(true)}
            />
            <PlannerForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
          </div>
        )}

        {/* State 3: Active Plan Results Tabs */}
        {!isLoading && activePlan && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Toolbar / Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-subtle">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleNewPlan}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-950 dark:hover:text-white px-3 py-1.5 rounded-xl border border-subtle bg-white/50 dark:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>New Plan</span>
                </button>
                <div className="h-4 w-[1px] bg-subtle" />
                {/* Single h1 landmark on active plan screen */}
                <h1 className="text-xs sm:text-sm text-rose-gold font-semibold truncate max-w-[200px] sm:max-w-xs font-serif">
                  {activePlan.summary.title}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSavedModalOpen(true)}
                  className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-200 hover:text-rose-gold px-3 py-1.5 rounded-xl border border-subtle min-h-[36px] cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Saved Plans ({savedPlans.length})</span>
                </button>
              </div>
            </div>

            {/* Accessible Tab Navigation */}
            <TabBar activeTab={activeTab} onSelectTab={setActiveTab} />

            {/* Tab Panel Display */}
            <div
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className="pt-2 focus:outline-none"
            >
              {activeTab === 'overview' && (
                <OverviewTab plan={activePlan} onNavigateTab={setActiveTab} />
              )}
              {activeTab === 'budget' && <BudgetTab plan={activePlan} />}
              {activeTab === 'timeline' && (
                <TimelineTab plan={activePlan} onUpdatePlan={handleUpdatePlan} />
              )}
              {activeTab === 'vendors' && (
                <VendorsTab plan={activePlan} onUpdatePlan={handleUpdatePlan} />
              )}
              {activeTab === 'ideas' && <IdeasTab plan={activePlan} />}
              {activeTab === 'invitation' && <InvitationTab plan={activePlan} />}
            </div>

            {/* In-Context Chat Refinement Assistant */}
            <ChatAssistant
              plan={activePlan}
              onUpdatePlan={handleUpdatePlan}
              isOpen={isChatOpen}
              onToggle={() => setIsChatOpen((prev) => !prev)}
            />
          </div>
        )}
      </main>

      {/* Saved Plans Modal */}
      <SavedPlansModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedPlans={savedPlans}
        activePlanId={activePlan?.id || null}
        onSelectPlan={handleSelectPlan}
        onDeletePlan={handleDeletePlan}
        onNewPlan={handleNewPlan}
      />

      {/* Footer Landmark */}
      <AppFooter />
    </div>
  );
}
