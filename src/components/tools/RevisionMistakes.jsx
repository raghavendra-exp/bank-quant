import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Trash2, RotateCcw, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { getMistakes, markMistakeReviewed, removeMistake } from '../../utils/dataManager';

export default function RevisionMistakes() {
  const [mistakes, setMistakes] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    setMistakes(getMistakes());
  }, []);

  function handleMarkReviewed(id) {
    const updated = markMistakeReviewed(id);
    setMistakes([...updated]);
  }

  function handleRemove(id) {
    const updated = removeMistake(id);
    setMistakes([...updated]);
  }

  const filtered = filterType === 'all' 
    ? mistakes 
    : mistakes.filter(m => m.mistakeType === filterType);

  const mistakeTypes = [
    { id: 'all', label: 'All Mistakes' },
    { id: 'calculation_error', label: 'Calculation Slip' },
    { id: 'formula_forgot', label: 'Formula Confused' },
    { id: 'question_misread', label: 'Question Misread' },
    { id: 'time_panic', label: 'Timer Panic' },
    { id: 'concept_gap', label: 'Concept Gap' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Mistake Diagnostics</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Revise My Mistakes Hub
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Review and eliminate recurring errors. Every corrected mistake is an extra mark secured on exam day.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-slate-400 block uppercase font-mono">Logged Errors</span>
          <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
            {mistakes.length} Qs
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {mistakeTypes.map(t => (
          <button
            key={t.id}
            onClick={() => setFilterType(t.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              filterType === t.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Mistakes List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No mistakes logged in this category!</h3>
          <p className="text-xs text-slate-500 mt-1">
            Keep practicing in the Practice Arena or Speed Lab. Mistakes you make will be recorded here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition-all bg-white dark:bg-slate-900 ${
                item.reviewed
                  ? 'border-slate-200 dark:border-slate-800 opacity-80'
                  : 'border-rose-200 dark:border-rose-900/40 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {item.topicName || item.topic}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold">
                    {item.mistakeType?.replace('_', ' ')}
                  </span>
                  {item.reviewed && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed ({item.revisionCount || 1}x)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMarkReviewed(item.id)}
                    className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition-all"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded"
                    title="Remove from notebook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question statement */}
              <div className="py-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                {item.question}
              </div>

              {/* Answers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-300">
                  Your Answer: <strong>{item.options[item.selectedOption] || 'Option selected'}</strong>
                </div>
                <div className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                  Correct Answer: <strong>{item.options[item.answerIndex]}</strong>
                </div>
              </div>

              {/* User Note */}
              {item.userNote && (
                <div className="mt-3 p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/30 text-xs text-amber-900 dark:text-amber-300">
                  <strong>My Note:</strong> {item.userNote}
                </div>
              )}

              {/* Topper Solution */}
              {item.topperMethod && (
                <div className="mt-3 p-3 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                    ⚡ Topper Hack:
                  </span>
                  <p>{item.topperMethod.steps?.join(' → ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
