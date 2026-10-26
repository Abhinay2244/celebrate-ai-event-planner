import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Check, Sparkles } from 'lucide-react';
import { EventPlan } from '../../types/planner';

export interface TimelineTabProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
}

/**
 * Event Milestones & Chronology Roadmap tab.
 * Visualizes chronological countdown phases with interactive deliverable check-offs.
 */
export const TimelineTab: React.FC<TimelineTabProps> = ({ plan, onUpdatePlan }) => {
  // Store checked task IDs or task keys in local state / plan
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey],
    }));
  };

  const totalTasks = plan.timeline.reduce((acc, m) => acc + (m.tasks?.length || 0), 0);
  const checkedTasksCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((checkedTasksCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header and Progress Bar */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm border border-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Countdown Roadmap
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              Event Milestones & Chronology
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-2xl border border-subtle">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Action Items Completed:
            </span>
            <span className="text-sm font-bold text-rose-gold">
              {checkedTasksCount} / {totalTasks} ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Overall timeline progress bar */}
        <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-rosegold-gradient rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Timeline Steps Trail */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-rose-gold/30 space-y-8">
        {plan.timeline.map((milestone, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === plan.timeline.length - 1;

          return (
            <div key={idx} className="relative group">
              {/* Timeline pin circle */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-rose-gold flex items-center justify-center shadow-xs">
                <span className="w-2 h-2 rounded-full bg-rose-gold" />
              </div>

              {/* Milestone Card */}
              <div className="glass-panel p-6 rounded-3xl shadow-sm border border-subtle hover:border-rose-gold/50 transition-colors space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-rose-gold/15 text-rose-gold">
                      {milestone.timeframe}
                    </span>
                    {isFirst && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Priority Phase
                      </span>
                    )}
                    {isLast && (
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        🏁 Grand Day
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                    {milestone.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {milestone.description}
                </p>

                {/* Milestone Task Checklist */}
                {milestone.tasks && milestone.tasks.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Deliverables Checklist:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {milestone.tasks.map((task, tIdx) => {
                        const taskKey = `${idx}-${tIdx}`;
                        const isDone = Boolean(completedTasks[taskKey]);

                        return (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={() => toggleTask(taskKey)}
                            className={`min-h-[44px] flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-gold ${
                              isDone
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300 line-through'
                                : 'bg-white/50 dark:bg-slate-800/50 border-subtle text-gray-800 dark:text-gray-100 hover:border-rose-gold/60'
                            }`}
                          >
                            <span className="shrink-0">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              )}
                            </span>
                            <span className="leading-snug">{task}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
