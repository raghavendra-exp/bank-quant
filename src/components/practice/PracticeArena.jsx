import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Clock, Bookmark, BookmarkCheck, 
  Lightbulb, ChevronRight, Filter, RotateCcw, AlertCircle, 
  Sparkles, Languages, Eye 
} from 'lucide-react';
import { 
  recordQuestionAttempt, addMistake, toggleBookmark, isBookmarked 
} from '../../utils/dataManager';

export default function PracticeArena({ questions = [], topics = [] }) {
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [solutionTab, setSolutionTab] = useState('topper'); // 'topper' | 'standard'
  const [bilingual, setBilingual] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Filters
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Mistake modal state
  const [showMistakeModal, setShowMistakeModal] = useState(false);
  const [mistakeType, setMistakeType] = useState('calculation_error');
  const [mistakeNote, setMistakeNote] = useState('');

  // Apply filters
  useEffect(() => {
    let list = [...questions];
    if (selectedTopic !== 'all') {
      list = list.filter(q => q.topic === selectedTopic);
    }
    if (selectedDifficulty !== 'all') {
      list = list.filter(q => q.difficulty === selectedDifficulty);
    }
    setFilteredQuestions(list);
    setCurrentIndex(0);
    resetQuestionState();
  }, [questions, selectedTopic, selectedDifficulty]);

  // Per-question timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !hasSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, hasSubmitted]);

  const currentQ = filteredQuestions[currentIndex] || null;
  const bookmarked = currentQ ? isBookmarked(currentQ.id) : false;

  function resetQuestionState() {
    setSelectedOption(null);
    setHasSubmitted(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setSolutionTab('topper');
    setShowMistakeModal(false);
    setMistakeNote('');
  }

  function handleSelectOption(index) {
    if (hasSubmitted) return;
    setSelectedOption(index);
  }

  function handleSubmit() {
    if (selectedOption === null || hasSubmitted || !currentQ) return;
    setHasSubmitted(true);
    setIsTimerRunning(false);

    const isCorrect = selectedOption === currentQ.answerIndex;
    recordQuestionAttempt(currentQ.id, currentQ.topic, isCorrect, timerSeconds);

    if (!isCorrect) {
      setShowMistakeModal(true);
    }
  }

  function handleNext() {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetQuestionState();
    }
  }

  function handleSaveMistake() {
    if (currentQ) {
      addMistake(currentQ, selectedOption, mistakeType, mistakeNote);
    }
    setShowMistakeModal(false);
  }

  if (!currentQ) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">No questions found matching criteria</h3>
        <p className="text-sm text-slate-500 mt-1">Try resetting the topic or difficulty filter.</p>
        <button
          onClick={() => { setSelectedTopic('all'); setSelectedDifficulty('all'); }}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  const isCorrect = selectedOption === currentQ.answerIndex;
  const targetTime = currentQ.targetTime || 30;
  const timerColor = timerSeconds <= targetTime ? 'text-emerald-500' : timerSeconds <= targetTime * 1.5 ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-white"
          >
            <option value="all">All 32 Topics ({questions.length} Qs)</option>
            {topics.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-white"
          >
            <option value="all">All Difficulties</option>
            <option value="EASY">Easy (Speed)</option>
            <option value="MEDIUM">Medium (Exam Level)</option>
            <option value="HARD">Hard (Mains Level)</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBilingual(!bilingual)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              bilingual
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{bilingual ? 'Bilingual (HI)' : 'English'}</span>
          </button>

          <button
            onClick={() => toggleBookmark(currentQ)}
            className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            title="Bookmark this question"
          >
            {bookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-amber-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        {/* Header: Topic tag, Target time, Timer */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider">
              {currentQ.topicName || currentQ.topic}
            </span>
            <span className="text-xs text-slate-400">
              Q {currentIndex + 1} of {filteredQuestions.length}
            </span>
            {currentQ.examTag && (
              <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {currentQ.examTag}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <span>Target:</span>
              <strong className="text-slate-700 dark:text-slate-300 font-mono">{targetTime}s</strong>
            </div>

            <div className={`flex items-center gap-1 font-mono font-bold text-sm ${timerColor}`}>
              <Clock className="w-4 h-4" />
              <span>{timerSeconds}s</span>
            </div>
          </div>
        </div>

        {/* Question Statement */}
        <div className="py-6">
          <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
            {currentQ.question}
          </div>

          {bilingual && currentQ.questionHi && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {currentQ.questionHi}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let optionStyles = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-700';

            if (selectedOption === idx && !hasSubmitted) {
              optionStyles = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20';
            }

            if (hasSubmitted) {
              if (idx === currentQ.answerIndex) {
                optionStyles = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/20';
              } else if (selectedOption === idx) {
                optionStyles = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20';
              } else {
                optionStyles = 'opacity-50 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-mono text-sm sm:text-base">{option}</span>
                </div>

                {hasSubmitted && idx === currentQ.answerIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {hasSubmitted && selectedOption === idx && idx !== currentQ.answerIndex && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit or Next footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            {hasSubmitted && (
              <span className={`text-sm font-bold flex items-center gap-1.5 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Correct Answer! (+1 Mark)
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" /> Incorrect (−0.25 Negative Marking)
                  </>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!hasSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-indigo-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dual Solutions Section (Reveals upon Submit) */}
        {hasSubmitted && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Comprehensive Dual Solution
                </h4>
              </div>

              {/* Solution Tab Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setSolutionTab('topper')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    solutionTab === 'topper'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Solve Like Topper (Hack)</span>
                </button>
                <button
                  onClick={() => setSolutionTab('standard')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    solutionTab === 'standard'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Conventional Method
                </button>
              </div>
            </div>

            {/* Content of selected solution */}
            {solutionTab === 'topper' && currentQ.topperMethod && (
              <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-purple-50/50 dark:from-slate-800/70 dark:to-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                    {currentQ.topperMethod.title || 'Speed Hack'}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    ⚡ Typical Time: {currentQ.topperMethod.timeTaken || '8 seconds'}
                  </span>
                </div>

                <ul className="space-y-2 text-sm text-slate-800 dark:text-slate-200">
                  {currentQ.topperMethod.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>

                {currentQ.topperMethod.proTip && (
                  <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
                    <span className="font-bold shrink-0">💡 Pro-Tip:</span>
                    <span>{currentQ.topperMethod.proTip}</span>
                  </div>
                )}
              </div>
            )}

            {solutionTab === 'standard' && currentQ.standardMethod && (
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {currentQ.standardMethod.title || 'Step-by-Step Textbook Method'}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Typical Time: {currentQ.standardMethod.timeTaken || '40 seconds'}
                  </span>
                </div>

                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {currentQ.standardMethod.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mistake Classification Modal */}
      {showMistakeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <span>Log Mistake for Revision</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Categorizing where you stumbled helps the Weakness Detector isolate your failure modes.
            </p>

            <div className="mt-4 space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                Primary Reason for Mistake:
              </label>
              {[
                { id: 'calculation_error', label: 'Calculation / Arithmetic Slip' },
                { id: 'formula_forgot', label: 'Forgot / Confused Formula' },
                { id: 'question_misread', label: 'Misread Question or Conditions' },
                { id: 'time_panic', label: 'Rushed under Timer Pressure' },
                { id: 'concept_gap', label: 'Concept Gap / Never Learned Method' }
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    mistakeType === opt.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="mistakeType"
                    checked={mistakeType === opt.id}
                    onChange={() => setMistakeType(opt.id)}
                    className="text-indigo-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Personal Note / Lesson (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Remember to check if constant terms are both negative first!"
                value={mistakeNote}
                onChange={(e) => setMistakeNote(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowMistakeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Skip
              </button>
              <button
                onClick={handleSaveMistake}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm"
              >
                Save to Mistake Notebook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
