import React, { useState } from 'react';
import { Compass, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Award } from 'lucide-react';

const SAMPLE_SELECTION_QUESTIONS = [
  {
    id: 'sel-1',
    topic: 'Simplification',
    question: '37.5% of 640 + 25% of 320 − 15 = ?',
    correctCategory: 'SOLVE_FIRST',
    rationale: 'Direct fraction conversion (3/8 and 1/4) takes under 10 seconds. Guaranteed 1 mark.'
  },
  {
    id: 'sel-2',
    topic: 'Permutations & Combinations',
    question: 'In how many ways can 5 boys and 4 girls be seated in a circle such that no two girls sit adjacent and two particular boys always sit together?',
    correctCategory: 'SKIP_COMPLETELY',
    rationale: 'Circular permutation with dual constraints (no two adjacent + together). Requires multiple case checks and takes 2+ minutes. Skip immediately in Prelims!'
  },
  {
    id: 'sel-3',
    topic: 'Quadratic Equations',
    question: 'I. x² − 14x − 51 = 0\nII. y² − 19y − 42 = 0',
    correctCategory: 'SOLVE_FIRST',
    rationale: 'Both constant terms are negative (-51 and -42). Solvable in 2 seconds via CND sign rule!'
  },
  {
    id: 'sel-4',
    topic: 'Caselet DI',
    question: 'A survey of 600 students studying 3 languages: Hindi, English, and French. Ratio of only Hindi to only English is 4:5. 15% study both Hindi and French but not English...',
    correctCategory: 'SOLVE_LATER',
    rationale: 'Venn diagram decoding takes at least 90-120 seconds to set up. Only attempt after all speed math is locked in.'
  },
  {
    id: 'sel-5',
    topic: 'Ages',
    question: 'The ratio of present ages of A and B is 4:5. Six years hence, the ratio becomes 5:6. Find A\'s present age.',
    correctCategory: 'SOLVE_LATER',
    rationale: 'Straightforward unit difference (1 unit = 6 years → A = 24). High accuracy, perfect for 2nd wave of attempts.'
  },
  {
    id: 'sel-6',
    topic: 'Approximation',
    question: '49.8% of 800.04 + 11.98 × 15.02 − √624.9 ≈ ?',
    correctCategory: 'SOLVE_FIRST',
    rationale: 'Clean friendly numbers: 400 + 180 − 25 = 555 in 12 seconds. Clear first-priority question.'
  },
  {
    id: 'sel-7',
    topic: 'Mixture & Alligation',
    question: 'A container contains 80 litres of milk. 8 litres is taken out and replaced with water. This process is repeated two more times. Find the amount of milk left.',
    correctCategory: 'SOLVE_LATER',
    rationale: 'Standard repeated replacement formula 80 × (1 - 8/80)³. Solvable in 30 seconds once speed math is done.'
  },
  {
    id: 'sel-8',
    topic: 'Tabular DI',
    question: 'Table shows total employees in 5 companies across 2024 and 2025. Q1: Find percentage increase in Company S from 2024 to 2025.',
    correctCategory: 'SOLVE_FIRST',
    rationale: 'Direct tabular lookup and single percentage increase. Fast 15-second mark.'
  }
];

export default function QuestionSelectionTrainer() {
  const [index, setIndex] = useState(0);
  const [decisions, setDecisions] = useState({});
  const [completed, setCompleted] = useState(false);

  const currentItem = SAMPLE_SELECTION_QUESTIONS[index];

  function handleCategorize(category) {
    const isCorrect = category === currentItem.correctCategory;
    setDecisions(prev => ({
      ...prev,
      [currentItem.id]: {
        userChoice: category,
        correctCategory: currentItem.correctCategory,
        isCorrect,
        rationale: currentItem.rationale
      }
    }));

    if (index + 1 < SAMPLE_SELECTION_QUESTIONS.length) {
      setIndex(index + 1);
    } else {
      setCompleted(true);
    }
  }

  function restart() {
    setIndex(0);
    setDecisions({});
    setCompleted(false);
  }

  const score = Object.values(decisions).filter(d => d.isCorrect).length;
  const tacticalAccuracy = Math.round((score / SAMPLE_SELECTION_QUESTIONS.length) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Compass className="w-4 h-4" />
            <span>Tactical Exam Conditioning</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            First 5-Minute Selection Strategy Trainer
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Learn what to solve in the first 7 minutes, what to hold for round two, and what traps to skip immediately.
          </p>
        </div>
      </div>

      {!completed && currentItem && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span className="uppercase tracking-wider">
              Question {index + 1} of {SAMPLE_SELECTION_QUESTIONS.length}
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {currentItem.topic}
            </span>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white font-medium text-base leading-relaxed whitespace-pre-line">
            {currentItem.question}
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3 text-center">
              In the real 20-minute Prelims exam, what is your strategy for this question?
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleCategorize('SOLVE_FIRST')}
                className="p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/30 hover:border-emerald-500 text-left transition-all"
              >
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                  1. Solve First (Min 1 - 7)
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Speed Math, Direct DI, Quadratic Sign Hack.
                </span>
              </button>

              <button
                onClick={() => handleCategorize('SOLVE_LATER')}
                className="p-4 rounded-xl border-2 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/30 hover:border-amber-500 text-left transition-all"
              >
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1">
                  2. Solve Later (Min 8 - 16)
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Straightforward arithmetic, ages, ratio, P&L.
                </span>
              </button>

              <button
                onClick={() => handleCategorize('SKIP_COMPLETELY')}
                className="p-4 rounded-xl border-2 border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/30 hover:border-rose-500 text-left transition-all"
              >
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block mb-1">
                  3. Skip Completely
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Time-sink traps, multi-condition P&C, long caselets.
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completed Review */}
      {completed && (
        <div className="mt-6 space-y-6">
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Selection Tactical Score: {tacticalAccuracy}%
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  You correctly classified {score} out of {SAMPLE_SELECTION_QUESTIONS.length} questions according to topper priority.
                </p>
              </div>
            </div>

            <button
              onClick={restart}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Exercise</span>
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Detailed Selection Diagnostics:
            </h4>
            {SAMPLE_SELECTION_QUESTIONS.map((q) => {
              const res = decisions[q.id];
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="max-w-xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {q.topic}
                    </span>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                      {q.question}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      <strong>Topper Rationale:</strong> {q.rationale}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs">
                      Ideal: <strong className="text-indigo-600 dark:text-indigo-400">{q.correctCategory.replace('_', ' ')}</strong>
                    </div>
                    <div className={`text-xs font-bold mt-0.5 ${res?.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Your Choice: {res?.userChoice?.replace('_', ' ')} {res?.isCorrect ? '✓' : '✗'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
