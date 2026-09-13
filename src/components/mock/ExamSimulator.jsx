import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, CheckCircle2, XCircle, AlertTriangle, Trophy, 
  RotateCcw, Award, ChevronRight, ChevronLeft, Eye, Languages, 
  BarChart2, FileText, Check, HelpCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordQuestionAttempt } from '../../utils/dataManager';

const MOCK_PRESETS = [
  {
    id: 'sbi-clerk-pre',
    name: 'SBI Clerk Prelims Full Mock',
    examBadge: 'SBI JA',
    questionsCount: 35,
    durationMin: 20,
    marksPerQ: 1,
    negativeMark: 0.25,
    cutoffEstimate: 28.5,
    desc: '35 Questions | 20 Minutes Sectional Timer | 0.25 Negative Marking'
  },
  {
    id: 'ibps-clerk-pre',
    name: 'IBPS Clerk / CSA Full Mock',
    examBadge: 'IBPS CSA',
    questionsCount: 35,
    durationMin: 20,
    marksPerQ: 1,
    negativeMark: 0.25,
    cutoffEstimate: 29.0,
    desc: '35 Questions | 20 Minutes Sectional Timer | 0.25 Negative Marking'
  },
  {
    id: 'rrb-oa-pre',
    name: 'IBPS RRB Office Assistant Mock',
    examBadge: 'RRB OA',
    questionsCount: 40,
    durationMin: 23, // 23 min allocated for quant in 45 min composite
    marksPerQ: 1,
    negativeMark: 0.25,
    cutoffEstimate: 36.5,
    desc: '40 Questions | 23 Min Allocated Quant Split | 0.25 Negative Marking'
  },
  {
    id: 'mini-speed-mock',
    name: '15-Question Speed Sprint Mock',
    examBadge: 'Mini Mock',
    questionsCount: 15,
    durationMin: 10,
    marksPerQ: 1,
    negativeMark: 0.25,
    cutoffEstimate: 13.0,
    desc: '15 Rapid Questions | 10 Minutes | Great for daily check'
  }
];

export default function ExamSimulator({ questions = [] }) {
  const [selectedPreset, setSelectedPreset] = useState(MOCK_PRESETS[0]);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  // Mock State
  const [mockQuestions, setMockQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // qId -> optIndex
  const [reviewStatus, setReviewStatus] = useState({}); // qId -> boolean
  const [visitedStatus, setVisitedStatus] = useState({}); // qId -> boolean
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [bilingual, setBilingual] = useState(false);

  const timerRef = useRef(null);

  // Start Test
  function handleStartTest(preset) {
    setSelectedPreset(preset);
    // Build balanced mock: Simplification, Series, Quadratic, Arithmetic, DI
    let pool = [...questions].sort(() => Math.random() - 0.5);
    if (pool.length < preset.questionsCount) pool = questions;
    const testSet = pool.slice(0, preset.questionsCount);

    setMockQuestions(testSet);
    setCurrentIdx(0);
    setUserAnswers({});
    setReviewStatus({});
    setVisitedStatus({ [testSet[0]?.id]: true });
    setSecondsLeft(preset.durationMin * 60);
    setIsTestSubmitted(false);
    setIsTestActive(true);
  }

  // Timer countdown
  useEffect(() => {
    if (!isTestActive || isTestSubmitted) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft(sec => {
        if (sec <= 1) {
          submitTest();
          return 0;
        }
        return sec - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isTestActive, isTestSubmitted]);

  function submitTest() {
    clearInterval(timerRef.current);
    setIsTestSubmitted(true);
    setIsTestActive(false);

    // Record attempts
    mockQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans !== undefined) {
        const isCorrect = ans === q.answerIndex;
        recordQuestionAttempt(q.id, q.topic, isCorrect, 30);
      }
    });

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  }

  function handleSelectOption(optIdx) {
    if (isTestSubmitted) return;
    const qId = mockQuestions[currentIdx]?.id;
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  }

  function handleClearResponse() {
    const qId = mockQuestions[currentIdx]?.id;
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  }

  function handleToggleMarkForReview() {
    const qId = mockQuestions[currentIdx]?.id;
    setReviewStatus(prev => ({ ...prev, [qId]: !prev[qId] }));
  }

  function navigateTo(idx) {
    if (idx >= 0 && idx < mockQuestions.length) {
      setCurrentIdx(idx);
      const nextQ = mockQuestions[idx];
      setVisitedStatus(prev => ({ ...prev, [nextQ.id]: true }));
    }
  }

  const currentQ = mockQuestions[currentIdx] || null;

  // Scorecard calculations
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  if (isTestSubmitted) {
    mockQuestions.forEach(q => {
      const userAns = userAnswers[q.id];
      if (userAns === undefined) {
        unattemptedCount++;
      } else if (userAns === q.answerIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });
  }

  const totalMarksScored = Math.max(0, Number((correctCount * selectedPreset.marksPerQ - wrongCount * selectedPreset.negativeMark).toFixed(2)));
  const accuracyPct = (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;
  const isCutoffCleared = totalMarksScored >= selectedPreset.cutoffEstimate;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Preset Selection Screen */}
      {!isTestActive && !isTestSubmitted && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Trophy className="w-4 h-4" />
            <span>Full Exam Simulation</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Real Exam Mocks & Sectional Simulators
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Official exam interface with strict sectional timing, 5-option format, and negative marking (-0.25).
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-indigo-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                      {preset.examBadge}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {preset.durationMin} Mins
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{preset.desc}</p>
                </div>

                <button
                  onClick={() => handleStartTest(preset)}
                  className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                >
                  Launch Full Mock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Exam Interface */}
      {isTestActive && currentQ && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Panel (3 cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md flex flex-col justify-between min-h-[560px]">
            <div>
              {/* Question bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Question {currentIdx + 1}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    [+{selectedPreset.marksPerQ}, -{selectedPreset.negativeMark}]
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setBilingual(!bilingual)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 px-2 py-1 rounded border border-slate-200 dark:border-slate-700"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>{bilingual ? 'HI' : 'EN'}</span>
                  </button>
                </div>
              </div>

              {/* Statement */}
              <div className="py-6">
                <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                  {currentQ.question}
                </div>
                {bilingual && currentQ.questionHi && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300">
                    {currentQ.questionHi}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3.5 rounded-xl text-left border flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-mono text-sm">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMarkForReview}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    reviewStatus[currentQ.id]
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {reviewStatus[currentQ.id] ? 'Marked for Review ✓' : 'Mark for Review'}
                </button>
                <button
                  onClick={handleClearResponse}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Clear Response
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => navigateTo(currentIdx - 1)}
                  className="px-4 py-2 disabled:opacity-40 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (currentIdx + 1 < mockQuestions.length) {
                      navigateTo(currentIdx + 1);
                    }
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>

          {/* Side Palette & Timer (1 col) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-6">
            {/* Live Countdown */}
            <div className="p-4 bg-slate-900 text-white rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                Time Remaining
              </span>
              <div className="text-3xl font-mono font-bold text-amber-400 mt-1">
                {timerStr}
              </div>
            </div>

            {/* Question Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500" />
                <span>Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                <span>Not Visited</span>
              </div>
            </div>

            {/* Number Palette */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Question Palette:
              </span>
              <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
                {mockQuestions.map((q, idx) => {
                  const isCurrent = currentIdx === idx;
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isMarked = reviewStatus[q.id];
                  const isVisited = visitedStatus[q.id];

                  let color = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
                  if (isMarked) color = 'bg-purple-600 text-white';
                  else if (isAnswered) color = 'bg-emerald-600 text-white';
                  else if (isVisited) color = 'bg-rose-500 text-white';

                  return (
                    <button
                      key={q.id}
                      onClick={() => navigateTo(idx)}
                      className={`h-8 rounded-lg font-mono text-xs font-bold transition-all ${color} ${
                        isCurrent ? 'ring-2 ring-indigo-500 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={submitTest}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all uppercase tracking-wider"
            >
              Submit Mock Exam
            </button>
          </div>
        </div>
      )}

      {/* Post-Test Scorecard Screen */}
      {isTestSubmitted && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="text-center max-w-md mx-auto">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isCutoffCleared ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                <Trophy className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isCutoffCleared ? 'Cutoff Cleared! 🎉' : 'Mock Completed!'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Estimated Exam Cutoff: <strong>{selectedPreset.cutoffEstimate} Marks</strong>
              </p>

              <div className="text-4xl font-mono font-black text-indigo-600 dark:text-indigo-400 my-4">
                {totalMarksScored} <span className="text-lg text-slate-400">/ {selectedPreset.questionsCount}</span>
              </div>
            </div>

            {/* Scorecard Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Correct</span>
                <span className="text-xl font-mono font-bold text-emerald-600">+{correctCount}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Incorrect</span>
                <span className="text-xl font-mono font-bold text-rose-600">-{wrongCount}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Accuracy</span>
                <span className="text-xl font-mono font-bold text-slate-900 dark:text-white">{accuracyPct}%</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Unattempted</span>
                <span className="text-xl font-mono font-bold text-slate-500">{unattemptedCount}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => handleStartTest(selectedPreset)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake This Mock</span>
              </button>
              <button
                onClick={() => { setIsTestSubmitted(false); setIsTestActive(false); }}
                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-200"
              >
                Choose Another Mock
              </button>
            </div>
          </div>

          {/* Question-by-Question Detailed Solutions Review */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Detailed Solutions & Topper Review
            </h3>

            {mockQuestions.map((q, idx) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns === q.answerIndex;
              const isSkipped = userAns === undefined;

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Question {idx + 1} • {q.topicName || q.topic}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isCorrect
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                        : isSkipped
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700'
                    }`}>
                      {isCorrect ? 'Correct (+1)' : isSkipped ? 'Skipped (0)' : 'Incorrect (-0.25)'}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </p>

                  <div className="text-xs space-y-1 font-mono">
                    <div>Correct Answer: <strong className="text-emerald-600">{q.options[q.answerIndex]}</strong></div>
                    {!isSkipped && !isCorrect && (
                      <div>Your Choice: <strong className="text-rose-600">{q.options[userAns]}</strong></div>
                    )}
                  </div>

                  {q.topperMethod && (
                    <div className="mt-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300">
                      <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">
                        ⚡ Topper Solution:
                      </strong>
                      <p>{q.topperMethod.steps?.join(' → ')}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
