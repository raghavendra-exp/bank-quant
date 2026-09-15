import React, { useState, useEffect } from 'react';
import { 
  Award, CheckCircle2, XCircle, RotateCw, Eye, EyeOff, 
  Clock, Sparkles, Filter, ChevronRight, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MENTAL_MATH_BOOK } from '../../../data/mentalMathData';

export default function BookExercisesTrainer({ initialSetId = null }) {
  const exerciseSets = MENTAL_MATH_BOOK.exerciseSets;
  const [selectedSetId, setSelectedSetId] = useState(initialSetId || exerciseSets[0].id);
  const [userAnswers, setUserAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Update selected set if initialSetId changes
  useEffect(() => {
    if (initialSetId) {
      setSelectedSetId(initialSetId);
      resetState();
    }
  }, [initialSetId]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  function resetState() {
    setUserAnswers({});
    setShowAnswers(false);
    setIsSubmitted(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  }

  const activeSet = exerciseSets.find(s => s.id === selectedSetId) || exerciseSets[0];

  function handleInputChange(index, val) {
    setUserAnswers(prev => ({
      ...prev,
      [index]: val.trim()
    }));
  }

  function handleSubmit() {
    setIsSubmitted(true);
    setIsTimerRunning(false);

    // Calculate score
    let correct = 0;
    activeSet.questions.forEach((q, idx) => {
      const uAns = (userAnswers[idx] || '').replace(/,/g, '').replace(/\s/g, '');
      const expected = q.a.replace(/,/g, '').replace(/\s/g, '');
      if (uAns === expected) {
        correct++;
      }
    });

    if (correct >= activeSet.questions.length * 0.8) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  // Scoring
  let correctCount = 0;
  activeSet.questions.forEach((q, idx) => {
    const uAns = (userAnswers[idx] || '').replace(/,/g, '').replace(/\s/g, '');
    const expected = q.a.replace(/,/g, '').replace(/\s/g, '');
    if (uAns === expected) {
      correctCount++;
    }
  });

  const totalQuestions = activeSet.questions.length;
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Official Book Practice Workbooks • 17 Exercise Sets</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {activeSet.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {activeSet.instructions}
          </p>
        </div>

        {/* Action Controls & Timer */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
          >
            {showAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showAnswers ? 'Hide Answers' : 'Reveal Answers'}</span>
          </button>

          <button
            onClick={resetState}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
            title="Reset Exercise"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Set Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {exerciseSets.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedSetId(s.id);
              resetState();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSetId === s.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {s.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Questions Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSet.questions.map((item, idx) => {
            const userVal = userAnswers[idx] || '';
            const isCorrect = isSubmitted && (userVal.replace(/,/g, '').replace(/\s/g, '') === item.a.replace(/,/g, '').replace(/\s/g, ''));
            const isWrong = isSubmitted && !isCorrect && userVal !== '';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : isWrong
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  {isSubmitted && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500" />
                      )}
                    </span>
                  )}
                </div>

                <div className="text-base font-black font-mono text-slate-900 dark:text-white mb-2">
                  {item.q}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Answer"
                    disabled={isSubmitted}
                    value={userVal}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isSubmitted) {
                        handleSubmit();
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  {(showAnswers || isSubmitted) && (
                    <span className="shrink-0 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-500/20">
                      {item.a}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit & Scoring Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {isSubmitted ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Score: <span className="text-emerald-500">{correctCount}</span> / {totalQuestions}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                  {Math.round((correctCount / totalQuestions) * 100)}% Accuracy
                </span>
                <span className="text-xs text-slate-400">
                  Time: {formatTime(timerSeconds)}
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-500">
                18 questions. Press Submit when finished to calculate speed and accuracy score.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & Check All</span>
              </button>
            ) : (
              <button
                onClick={resetState}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
