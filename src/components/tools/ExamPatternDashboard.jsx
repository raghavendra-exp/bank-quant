import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ExamPatternDashboard() {
  const [examConfig, setExamConfig] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState('sbi-clerk');

  useEffect(() => {
    fetch('./data/exam-config.json')
      .then(res => res.json())
      .then(data => setExamConfig(data))
      .catch(err => console.error('Failed to load exam-config.json', err));
  }, []);

  if (!examConfig) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  const exams = examConfig.exams || [];
  const currentExam = exams.find(e => e.id === selectedExamId) || exams[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Official Notification Rules</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          Exam Pattern & Timing Architecture
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Strictly grounded in official IBPS and SBI notifications. Sectional timing vs composite time rules.
        </p>

        {/* Exam Switcher */}
        <div className="flex flex-wrap gap-2 mt-6">
          {exams.map(exam => (
            <button
              key={exam.id}
              onClick={() => setSelectedExamId(exam.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedExamId === exam.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {exam.name}
            </button>
          ))}
        </div>
      </div>

      {currentExam && (
        <div className="space-y-6">
          {/* Prelims Stage Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Stage 1: {currentExam.stages?.prelims?.name}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Section: {currentExam.stages?.prelims?.sectionName}
                </h3>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold">
                  {currentExam.stages?.prelims?.questions} Qs / {currentExam.stages?.prelims?.marks} Marks
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 font-bold">
                  ⏱ {currentExam.stages?.prelims?.durationMinutes} Mins
                </span>
              </div>
            </div>

            {/* Timing Rules Callout */}
            <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
              currentExam.stages?.prelims?.sectionalTiming
                ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300'
                : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-300'
            }`}>
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <strong>Timing Rule: </strong>
                {currentExam.stages?.prelims?.sectionalTiming ? (
                  <span>Strict 20-minute sectional timer! When 20 minutes elapse, the system automatically locks the section.</span>
                ) : (
                  <span>{currentExam.stages?.prelims?.compositeExplanation}</span>
                )}
              </div>
            </div>

            {/* Target benchmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Negative Marking</span>
                <strong className="text-rose-600">-{currentExam.stages?.prelims?.negativeMarking} Marks</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sectional Cutoff</span>
                <strong className="text-slate-900 dark:text-white">
                  {currentExam.stages?.prelims?.hasSectionalCutoff ? 'Yes (Mandatory)' : 'No (SBI JA rule)'}
                </strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Ideal Attempt</span>
                <strong className="text-emerald-600">{currentExam.stages?.prelims?.idealAttempt}</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Ideal Accuracy</span>
                <strong className="text-indigo-600">{currentExam.stages?.prelims?.idealAccuracy}</strong>
              </div>
            </div>

            {/* Order of attempt strategy */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Recommended Order of Attempt Strategy:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {currentExam.stages?.prelims?.orderOfAttemptStrategy?.map((step) => (
                  <div
                    key={step.order}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">Step {step.order}</span>
                      <span className="text-slate-400 font-mono">{step.time}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{step.topic}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Target: {step.target}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mains Stage Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Stage 2: {currentExam.stages?.mains?.name}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Section: {currentExam.stages?.mains?.sectionName}
                </h3>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 font-bold">
                  {currentExam.stages?.mains?.questions} Qs / {currentExam.stages?.mains?.marks} Marks
                  {currentExam.stages?.mains?.markWeight && ` (${currentExam.stages?.mains?.markWeight} marks/Q)`}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 font-bold">
                  ⏱ {currentExam.stages?.mains?.durationMinutes} Mins
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Ideal Attempt: <strong>{currentExam.stages?.mains?.idealAttempt}</strong> with accuracy {currentExam.stages?.mains?.idealAccuracy}. Focus heavily on Caselets, Missing Tabular DI, and Quantity Comparison (Q1 vs Q2).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
