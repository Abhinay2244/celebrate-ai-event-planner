import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  PieChart as PieChartIcon,
  Calendar,
  CheckSquare,
  Lightbulb,
  Mail,
  LayoutDashboard,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { EventPlan, PlannerInput } from './types/planner';
import { generatePlanApi } from './services/api';
import {
  getSavedPlans,
  savePlanToStorage,
  deletePlanFromStorage,
  getActivePlanId,
  setActivePlanId,
} from './services/storage';
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
import confetti from 'canvas-confetti';

type TabId = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'invitation';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('celebrate_ai_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [savedPlans, setSavedPlans] = useState<EventPlan[]>([]);
  const [activePlan, setActivePlan] = useState<EventPlan | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  // Initialize theme
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('celebrate_ai_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('celebrate_ai_theme', 'light');
    }
  }, [darkMode]);

  // Load saved plans on mount
  useEffect(() => {
    const plans = getSavedPlans();
    setSavedPlans(plans);

    const activeId = getActivePlanId();
    if (activeId && plans.length > 0) {
      const match = plans.find((p) => p.id === activeId);
      if (match) {
        setActivePlan(match);
      }
    }
  }, []);

  const [lastSubmittedInput, setLastSubmittedInput] = useState<PlannerInput | null>(null);

  const handleGeneratePlan = async (input: PlannerInput) => {
    setLastSubmittedInput(input);
    setIsLoading(true);
    setError(null);

    try {
      const result = await generatePlanApi(input);
      setActivePlan(result.plan);
      savePlanToStorage(result.plan);
      setSavedPlans(getSavedPlans());
      setActiveTab('overview');
      confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate plan';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePlan = (updatedPlan: EventPlan) => {
    setActivePlan(updatedPlan);
    savePlanToStorage(updatedPlan);
    setSavedPlans(getSavedPlans());
  };

  const handleDeletePlan = (id: string) => {
    const remaining = deletePlanFromStorage(id);
    setSavedPlans(remaining);
    if (activePlan?.id === id) {
      setActivePlan(remaining[0] || null);
    }
  };

  const handleSelectPlan = (plan: EventPlan) => {
    setActivePlan(plan);
    setActivePlanId(plan.id);
    setActiveTab('overview');
  };

  const handleNewPlan = () => {
    setActivePlan(null);
    setError(null);
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'budget', label: 'Budget Math', icon: PieChartIcon },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'vendors', label: 'Vendor Sourcing', icon: CheckSquare },
    { id: 'ideas', label: 'Ideas & Menu', icon: Lightbulb },
    { id: 'invitation', label: 'Invitations', icon: Mail },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        savedPlans={savedPlans}
        activePlan={activePlan}
        onSelectPlan={handleSelectPlan}
        onNewPlan={handleNewPlan}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Error Alert Box */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-8 p-5 sm:p-6 rounded-3xl bg-red-500/10 border-2 border-red-500/30 text-red-900 dark:text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-sm sm:text-base text-red-950 dark:text-red-100">
                  {error.toLowerCase().includes('quota') || error.toLowerCase().includes('429')
                    ? 'AI Capacity Limit'
                    : error.toLowerCase().includes('timed out') || error.toLowerCase().includes('timeout')
                    ? 'Request Timed Out'
                    : error.toLowerCase().includes('offline')
                    ? 'Network Connection Issue'
                    : 'Celebration Planning Notice'}
                </h2>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed text-red-800 dark:text-red-300 max-w-2xl">
                  {error}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {lastSubmittedInput && (
                <button
                  type="button"
                  onClick={() => handleGeneratePlan(lastSubmittedInput)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setError(null)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 border border-subtle text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-gold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* State 1: Loading Skeleton */}
        {isLoading && <SkeletonPlanLoader />}

        {/* State 2: Planner Input Form */}
        {!isLoading && !activePlan && (
          <div className="space-y-10 animate-fadeIn">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4 pt-4 sm:pt-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-gold/15 border border-rose-gold/30 text-rose-gold text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Celebration Architecture</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-indigo-950 dark:text-white leading-[1.15]">
                Plan Unforgettable Weddings, Birthdays & Gatherings.
              </h1>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                Enter your guest count, city, and rupee budget. Celebrate AI formulates an exact-to-the-rupee budget breakdown, milestone timelines, vetted vendor questions, bespoke menus, and stationery.
              </p>

              {savedPlans.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => setIsSavedModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-gold hover:underline font-semibold"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>View your {savedPlans.length} saved celebrations</span>
                  </button>
                </div>
              )}
            </div>

            {/* Planner Form */}
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
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-950 dark:hover:text-white px-3 py-1.5 rounded-xl border border-subtle bg-white/50 dark:bg-slate-800/50 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>New Plan</span>
                </button>
                <div className="h-4 w-[1px] bg-subtle" />
                <span className="text-xs text-rose-gold font-medium truncate max-w-[200px] sm:max-w-xs">
                  {activePlan.summary.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSavedModalOpen(true)}
                  className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 hover:text-rose-gold px-3 py-1.5 rounded-xl border border-subtle"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Saved Plans ({savedPlans.length})</span>
                </button>
              </div>
            </div>

            {/* Accessible Tab Navigation */}
            <div
              role="tablist"
              aria-label="Celebration Blueprint Sections"
              className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-subtle overflow-x-auto no-scrollbar"
            >
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as TabId)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-gold ${
                      isActive
                        ? 'bg-indigo-950 text-white dark:bg-rose-gold dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-indigo-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panel Display */}
            <div
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className="pt-2 focus:outline-none"
            >
              {activeTab === 'overview' && (
                <OverviewTab plan={activePlan} onNavigateTab={(tab) => setActiveTab(tab as TabId)} />
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

      {/* Footer */}
      <footer className="mt-auto border-t border-subtle py-8 text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Celebrate AI • GenAI Event Strategist for Weddings, Birthdays & Community Festivals</p>
          <p className="flex items-center gap-1.5">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span className="text-rose-gold font-medium">Strict Zod Integrity</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
