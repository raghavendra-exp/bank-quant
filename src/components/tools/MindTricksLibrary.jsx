import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, RotateCw, Lightbulb, Zap, HelpCircle, 
  BookOpen, Calculator, Award, ArrowRight, ShieldCheck, Flame
} from 'lucide-react';
import MentalMathBookViewer from './mindtricks/MentalMathBookViewer';
import HumanCalculatorLab from './mindtricks/HumanCalculatorLab';
import BookExercisesTrainer from './mindtricks/BookExercisesTrainer';

export default function MindTricksLibrary() {
  const [tricksData, setTricksData] = useState(null);
  // 'book' | 'lab' | 'exercises' | 'shortcuts' | 'sutras' | 'flashcards'
  const [activeTab, setActiveTab] = useState('book');
  const [activeSimulator, setActiveSimulator] = useState('dsVerifier');
  const [activeExerciseSet, setActiveExerciseSet] = useState('ex-11');
  const [searchQuery, setSearchQuery] = useState('');
  const [flippedCardIdx, setFlippedCardIdx] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/tricks.json`)
      .then(res => res.json())
      .then(data => setTricksData(data))
      .catch(err => console.error('Failed to load tricks.json', err));
  }, []);

  function handleOpenLab(simType) {
    setActiveSimulator(simType || 'dsVerifier');
    setActiveTab('lab');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }

  function handleOpenExercise(setId) {
    setActiveExerciseSet(setId || 'ex-11');
    setActiveTab('exercises');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }

  if (!tricksData) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-800">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-xs font-semibold text-slate-500">Loading Speed Calculation Repository...</p>
      </div>
    );
  }

  const shortcuts = (tricksData.shortcuts || []).filter(sc => 
    !searchQuery || 
    sc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sc.whyItWorks.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sutras = (tricksData.vedicSutras || []).filter(su => 
    !searchQuery ||
    su.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    su.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    su.suitability.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fractions = tricksData.fractionPercentTable || [];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Speed Math & Human Calculator Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Mind Tricks & Speed Calculation Mastery
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
            Complete integration of <strong className="text-indigo-600 dark:text-indigo-400">Mental Math: Tricks To Become A Human Calculator</strong> (Second Edition by Abhishek V.R / Ofpad) alongside high-yield Banking Topper Shortcuts & Vedic Sutras.
          </p>
        </div>

        {/* Master Tab Bar */}
        <div className="flex flex-wrap gap-1 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {[
            { id: 'book', label: 'Human Calculator Book (18 Ch)', icon: BookOpen },
            { id: 'lab', label: 'Simulation Lab', icon: Calculator },
            { id: 'exercises', label: '17 Practice Workbooks', icon: Award },
            { id: 'shortcuts', label: 'Exam Topper Shortcuts', icon: Zap },
            { id: 'sutras', label: 'Vedic Sutras', icon: Sparkles },
            { id: 'flashcards', label: 'Fraction Flashcards', icon: HelpCircle }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Complete Ofpad Mental Math Book (18 Chapters) */}
      {activeTab === 'book' && (
        <MentalMathBookViewer 
          onOpenLab={handleOpenLab}
          onOpenExercise={handleOpenExercise}
        />
      )}

      {/* Tab 2: Interactive Human Calculator Lab */}
      {activeTab === 'lab' && (
        <HumanCalculatorLab initialSimulator={activeSimulator} />
      )}

      {/* Tab 3: Official Book Practice Exercises */}
      {activeTab === 'exercises' && (
        <BookExercisesTrainer initialSetId={activeExerciseSet} />
      )}

      {/* Tab 4: Banking Exam Shortcuts */}
      {activeTab === 'shortcuts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Exam Topper Hacks vs Textbook Steps
              </h3>
              <p className="text-xs text-slate-500">
                Direct comparisons of time-saving shortcuts for SBI Clerk, IBPS PO/Clerk, and RRB.
              </p>
            </div>
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter shortcuts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortcuts.map((sc) => (
              <div
                key={sc.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded uppercase tracking-wider">
                      {sc.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
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
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs font-mono">
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
        </div>
      )}

      {/* Tab 5: Vedic Sutras */}
      {activeTab === 'sutras' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Ancient Vedic Mathematical Sutras
              </h3>
              <p className="text-xs text-slate-500">
                Mental algorithms for instantaneous mental multiplication, squaring, and base computation.
              </p>
            </div>
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter sutras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sutras.map((sutra) => (
              <div
                key={sutra.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
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

                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 text-xs">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold block mb-1">
                    Worked Example: {sutra.example}
                  </span>
                  <p className="font-mono text-slate-800 dark:text-slate-200">{sutra.walkthrough}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Fraction Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Fraction ↔ Percentage Flashcards
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Click any card to flip between fraction and its percentage equivalent. Essential for bank exam DI and Arithmetic.
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
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-indigo-400'
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
