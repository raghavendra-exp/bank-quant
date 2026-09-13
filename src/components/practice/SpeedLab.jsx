import React, { useState, useEffect, useRef } from 'react';
import { Zap, Flame, Trophy, RotateCcw, ArrowRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordQuestionAttempt } from '../../utils/dataManager';

const SPEED_TIERS = [
  { id: '15s', name: '15s Lightning Sprint', targetSec: 15, topics: ['simplification', 'percentage', 'square-cube-roots'], desc: 'Simplification & instant fraction recalls' },
  { id: '25s', name: '25s Speed Drill', targetSec: 25, topics: ['quadratic-equations', 'number-series', 'approximation'], desc: 'Quadratic sign method & series patterns' },
  { id: '35s', name: '35s Arithmetic Drill', targetSec: 35, topics: ['ratio-proportion', 'ages', 'partnership', 'average'], desc: 'Straightforward high-yield arithmetic' },
  { id: '45s', name: '45s Problem Solving', targetSec: 45, topics: ['time-and-work', 'profit-loss', 'simple-compound-interest', 'mixture-and-alligation'], desc: 'Multi-step core arithmetic' },
  { id: '60s', name: '60s Data Interpretation', targetSec: 60, topics: ['data-interpretation-tables', 'data-interpretation-bar-line', 'data-interpretation-pie'], desc: 'Table, bar, and pie chart reading' }
];

export default function SpeedLab({ questions = [] }) {
  const [selectedTier, setSelectedTier] = useState(SPEED_TIERS[0]);
  const [drillActive, setDrillActive] = useState(false);
  const [drillQuestions, setDrillQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | 'timeout'
  const [roundComplete, setRoundComplete] = useState(false);

  const timerRef = useRef(null);

  // Start Drill
  function startDrill(tier) {
    setSelectedTier(tier);
    // Filter questions by tier topics
    let pool = questions.filter(q => tier.topics.includes(q.topic));
    if (pool.length < 10) pool = questions; // fallback
    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    setDrillQuestions(shuffled);
    setQIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setAnsweredCount(0);
    setSelectedOption(null);
    setFeedback(null);
    setRoundComplete(false);
    setTimeLeft(tier.targetSec);
    setDrillActive(true);
  }

  // Timer effect
  useEffect(() => {
    if (!drillActive || roundComplete || feedback) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [drillActive, roundComplete, feedback, qIndex]);

  function handleTimeout() {
    clearInterval(timerRef.current);
    setFeedback('timeout');
    setStreak(0);
    setAnsweredCount(c => c + 1);

    const currentQ = drillQuestions[qIndex];
    if (currentQ) {
      recordQuestionAttempt(currentQ.id, currentQ.topic, false, selectedTier.targetSec);
    }

    setTimeout(() => {
      proceedToNext();
    }, 1500);
  }

  function handleAnswer(optIdx) {
    if (feedback) return;
    clearInterval(timerRef.current);
    setSelectedOption(optIdx);
    setAnsweredCount(c => c + 1);

    const currentQ = drillQuestions[qIndex];
    const isCorrect = optIdx === currentQ.answerIndex;
    const timeSpent = selectedTier.targetSec - timeLeft;

    recordQuestionAttempt(currentQ.id, currentQ.topic, isCorrect, timeSpent);

    if (isCorrect) {
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      const points = 100 + newStreak * 20 + Math.round((timeLeft / selectedTier.targetSec) * 50);
      setScore(s => s + points);
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }

    setTimeout(() => {
      proceedToNext();
    }, 1200);
  }

  function proceedToNext() {
    if (qIndex + 1 < drillQuestions.length) {
      setQIndex(qIndex + 1);
      setSelectedOption(null);
      setFeedback(null);
      setTimeLeft(selectedTier.targetSec);
    } else {
      setRoundComplete(true);
      setDrillActive(false);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  }

  const currentQ = drillQuestions[qIndex] || null;

  return (
    <div className="space-y-6">
      {!drillActive && !roundComplete && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
            <Zap className="w-4 h-4" />
            <span>High-Intensity Conditioning</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Quant Speed Lab
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Replicate the pressure of SBI & IBPS Clerk 20-minute timer. Pick a sprint tier to condition lightning reflex calculations.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPEED_TIERS.map((tier) => (
              <div
                key={tier.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      {tier.targetSec}s / Question
                    </span>
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1">
                    {tier.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{tier.desc}</p>
                </div>

                <button
                  onClick={() => startDrill(tier)}
                  className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Start 10-Q Sprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Drill Screen */}
      {drillActive && currentQ && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          {/* Header Stats */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">
                Question {qIndex + 1} / {drillQuestions.length}
              </span>
              {streak > 1 && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full animate-bounce">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{streak}x Streak!</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Score</span>
                <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{score}</span>
              </div>

              {/* Circular or Countdown Time */}
              <div className={`px-3 py-1 rounded-xl font-mono text-lg font-bold border ${
                timeLeft <= 5
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-600 animate-pulse-fast'
                  : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-600'
              }`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-rose-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${(timeLeft / selectedTier.targetSec) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="py-8">
            <div className="text-lg sm:text-xl font-medium text-slate-900 dark:text-white leading-relaxed text-center">
              {currentQ.question}
            </div>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className={`mb-6 p-3 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2 ${
              feedback === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600'
                : feedback === 'timeout'
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600'
            }`}>
              {feedback === 'correct' && <><CheckCircle2 className="w-4 h-4" /> Correct! Streak +1</>}
              {feedback === 'incorrect' && <><XCircle className="w-4 h-4" /> Incorrect!</>}
              {feedback === 'timeout' && <><Clock className="w-4 h-4" /> Time's up!</>}
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              let btnStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400';

              if (selectedOption === idx) {
                btnStyle = idx === currentQ.answerIndex
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-rose-500 bg-rose-500 text-white';
              } else if (feedback && idx === currentQ.answerIndex) {
                btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={feedback !== null}
                  onClick={() => handleAnswer(idx)}
                  className={`p-4 rounded-xl text-left border font-mono text-sm sm:text-base font-semibold flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <span>{opt}</span>
                  <span className="text-xs opacity-50 font-sans">#{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Round Complete Screen */}
      {roundComplete && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Sprint Complete!
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Excellent reflexes! Here is your drill breakdown:
          </p>

          <div className="grid grid-cols-3 gap-3 my-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Final Score</span>
              <span className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{score}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Accuracy</span>
              <span className="text-xl font-mono font-bold text-emerald-600">
                {Math.round((score / (drillQuestions.length * 150)) * 100)}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Max Streak</span>
              <span className="text-xl font-mono font-bold text-amber-500">{maxStreak}🔥</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={() => startDrill(selectedTier)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry This Sprint</span>
            </button>
            <button
              onClick={() => { setRoundComplete(false); setDrillActive(false); }}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-200"
            >
              Choose Another Tier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
