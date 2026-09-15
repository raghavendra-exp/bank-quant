import React, { useState, useEffect } from 'react';
import { Sparkles, Search, RotateCw, Lightbulb, Zap, HelpCircle } from 'lucide-react';

export default function MindTricksLibrary() {
  const [tricksData, setTricksData] = useState(null);
  const [activeTab, setActiveTab] = useState('shortcuts'); // 'shortcuts' | 'sutras' | 'flashcards' | 'patterns'
  const [searchQuery, setSearchQuery] = useState('');
  const [flippedCardIdx, setFlippedCardIdx] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/tricks.json`)
      .then(res => res.json())
      .then(data => setTricksData(data))
      .catch(err => console.error('Failed to load tricks.json', err));
  }, []);

  if (!tricksData) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  const shortcuts = tricksData.shortcuts || [];
  const sutras = tricksData.vedicSutras || [];
  const fractions = tricksData.fractionPercentTable || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Speed Calculation Repository</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Topper Shortcuts & Mind Tricks
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            25+ verified shortcuts comparing conventional textbook steps vs high-speed topper hacks.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {[
            { id: 'shortcuts', label: 'Topper Shortcuts' },
            { id: 'sutras', label: 'Vedic Sutras' },
            { id: 'flashcards', label: 'Fraction Flashcards' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Shortcuts */}
      {activeTab === 'shortcuts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortcuts.map((sc) => (
            <div
              key={sc.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded uppercase tracking-wider">
                    {sc.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    ⚡ Saves {sc.timeSaved}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  {sc.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  <strong>Why it works:</strong> {sc.whyItWorks}
                </p>

                {/* Example Walkthrough */}
                {sc.example && (
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-mono">
                    <span className="text-slate-400 block mb-1">Example: {sc.example}</span>
                    <div className="text-rose-500 text-[11px] mb-1">Normal: {sc.normalSteps}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">Topper: {sc.topperSteps}</div>
                  </div>
                )}
              </div>

              {sc.commonMistake && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
                  <span className="font-bold">⚠️ Warning:</span>
                  <span>{sc.commonMistake}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Vedic Sutras */}
      {activeTab === 'sutras' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sutras.map((sutra) => (
            <div
              key={sutra.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
            >
              <div>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold block">
                  {sutra.hindiName}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {sutra.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  <strong>When to use:</strong> {sutra.suitability}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {sutra.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">•</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-xs">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold block mb-1">
                  Worked Example: {sutra.example}
                </span>
                <p className="font-mono text-slate-800 dark:text-slate-200">{sutra.walkthrough}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Interactive Fraction Flashcards */}
      {activeTab === 'flashcards' && (
        <div>
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Fraction ↔ Percentage Flashcards
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Click any card to flip between fraction and its percentage equivalent.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {fractions.map((card, i) => {
              const isFlipped = flippedCardIdx === i;
              return (
                <div
                  key={i}
                  onClick={() => setFlippedCardIdx(isFlipped ? null : i)}
                  className={`h-28 rounded-2xl p-4 cursor-pointer border transition-all duration-300 flex flex-col items-center justify-center text-center shadow-sm select-none ${
                    isFlipped
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-indigo-600 scale-105'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                  }`}
                >
                  <span className="text-[10px] opacity-60 uppercase font-semibold mb-1">
                    {isFlipped ? 'Percentage' : 'Fraction'}
                  </span>
                  <span className="text-xl font-mono font-bold">
                    {isFlipped ? card.percent : card.fraction}
                  </span>
                  <span className="text-[10px] opacity-50 mt-1">Tap to flip ↺</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
