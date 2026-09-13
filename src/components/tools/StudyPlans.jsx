import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Square, Clock, Target, Award, ArrowRight } from 'lucide-react';
import { storage } from '../../utils/dataManager';

const STORAGE_KEY = 'bq_study_plan_completed_tasks';

export default function StudyPlans() {
  const [plansData, setPlansData] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('plan-30-day');
  const [completedTasks, setCompletedTasks] = useState(() => storage.get(STORAGE_KEY, {}));

  useEffect(() => {
    fetch('./data/study-plans.json')
      .then(res => res.json())
      .then(data => {
        if (data.plans) setPlansData(data.plans);
      })
      .catch(err => console.error('Failed to load study plans', err));
  }, []);

  function toggleTask(taskId) {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      storage.set(STORAGE_KEY, next);
      return next;
    });
  }

  const currentPlan = plansData.find(p => p.id === selectedPlanId) || plansData[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
          <Calendar className="w-4 h-4" />
          <span>Structured Roadmaps</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          Exam Preparation Study Plans
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Scientifically phased schedules tailored for SBI Clerk, IBPS Clerk, and RRB Office Assistant.
        </p>

        {/* Plan Switcher Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {plansData.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedPlanId === plan.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {plan.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Details & Phases */}
      {currentPlan && (
        <div className="space-y-6">
          {/* Metadata Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-indigo-950/40 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentPlan.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {currentPlan.tagline}
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs shrink-0">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Duration</span>
                <strong className="text-slate-900 dark:text-white font-mono">{currentPlan.durationDays} Days</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Daily Commitment</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{currentPlan.dailyCommitment}</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Target Score</span>
                <strong className="text-emerald-600 font-mono">{currentPlan.targetScore}</strong>
              </div>
            </div>
          </div>

          {/* Phases */}
          <div className="space-y-6">
            {currentPlan.phases?.map((phase) => (
              <div
                key={phase.phaseNumber}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Phase {phase.phaseNumber} • {phase.days}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {phase.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {phase.description}
                </p>

                {/* Daily tasks checklist */}
                {phase.dailyTasks && (
                  <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Daily Milestones & Action Tasks:
                    </span>
                    {phase.dailyTasks.map((task, idx) => {
                      const taskId = `${currentPlan.id}-p${phase.phaseNumber}-t${idx}`;
                      const isDone = !!completedTasks[taskId];
                      return (
                        <div
                          key={taskId}
                          onClick={() => toggleTask(taskId)}
                          className={`p-3 rounded-xl border text-xs flex items-center gap-3 cursor-pointer transition-all select-none ${
                            isDone
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-slate-400 line-through'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span>{task}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
