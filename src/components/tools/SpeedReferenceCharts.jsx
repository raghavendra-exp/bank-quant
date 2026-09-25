import React, { useState, useMemo } from 'react';
import { 
  Table, Sparkles, Search, RotateCw, Zap, Award, BookOpen, 
  HelpCircle, ArrowRight, CheckCircle2, ChevronRight, Hash, 
  Layers, ArrowUpRight, Flame, Lightbulb
} from 'lucide-react';
import { SPEED_CHARTS_DATA } from '../../data/speedChartsData';

export default function SpeedReferenceCharts() {
  // 'tables' | 'squares' | 'cubes' | 'mugup'
  const [activeTab, setActiveTab] = useState('tables');

  // Tables State
  const [selectedTableNum, setSelectedTableNum] = useState(19);
  const [tableGridRange, setTableGridRange] = useState('11-20');
  const [splitA, setSplitA] = useState(87);
  const [splitB, setSplitB] = useState(8);

  // Squares State
  const [squareSearch, setSquareSearch] = useState('');
  const [squareFilter, setSquareFilter] = useState('all');
  const [selectedSquareNum, setSelectedSquareNum] = useState(47);

  // Cubes State
  const [cubeSearch, setCubeSearch] = useState('');
  const [cubeInputRoot, setCubeInputRoot] = useState('175616');
  const [selectedCubeNum, setSelectedCubeNum] = useState(13);

  // Drill / Practice State
  const [drillMode, setDrillMode] = useState(false);
  const [drillType, setDrillType] = useState('tables'); // 'tables' | 'squares' | 'cubes'
  const [drillQuestion, setDrillQuestion] = useState(null);
  const [drillUserAnswer, setDrillUserAnswer] = useState('');
  const [drillFeedback, setDrillFeedback] = useState(null);
  const [drillScore, setDrillScore] = useState({ correct: 0, total: 0, streak: 0 });

  // Generate a drill question
  function generateDrillQuestion(type = drillType) {
    let q = null;
    if (type === 'tables') {
      const a = Math.floor(Math.random() * 88) + 12; // 12 to 99
      const b = Math.floor(Math.random() * 8) + 2;   // 2 to 9
      q = { prompt: `${a} × ${b} = ?`, answer: a * b, a, b, type: 'tables' };
    } else if (type === 'squares') {
      const n = Math.floor(Math.random() * 89) + 11; // 11 to 99
      q = { prompt: `${n}² = ?`, answer: n * n, n, type: 'squares' };
    } else if (type === 'cubes') {
      const n = Math.floor(Math.random() * 29) + 2; // 2 to 30
      q = { prompt: `${n}³ = ?`, answer: n * n * n, n, type: 'cubes' };
    }
    setDrillQuestion(q);
    setDrillUserAnswer('');
    setDrillFeedback(null);
  }

  function handleStartDrill(type) {
    setDrillType(type);
    setDrillMode(true);
    setDrillScore({ correct: 0, total: 0, streak: 0 });
    generateDrillQuestion(type);
  }

  function handleCheckDrillAnswer(e) {
    e.preventDefault();
    if (!drillQuestion || !drillUserAnswer.trim()) return;

    const userNum = parseInt(drillUserAnswer.trim(), 10);
    const isCorrect = userNum === drillQuestion.answer;

    if (isCorrect) {
      setDrillScore(prev => ({
        correct: prev.correct + 1,
        total: prev.total + 1,
        streak: prev.streak + 1
      }));
      setDrillFeedback({ correct: true, message: `Awesome! Correct answer is ${drillQuestion.answer}` });
      setTimeout(() => generateDrillQuestion(), 1200);
    } else {
      setDrillScore(prev => ({
        ...prev,
        total: prev.total + 1,
        streak: 0
      }));
      setDrillFeedback({ 
        correct: false, 
        message: `Incorrect. Correct answer is ${drillQuestion.answer}` 
      });
    }
  }

  // Filtered Squares
  const filteredSquares = useMemo(() => {
    return SPEED_CHARTS_DATA.squares.filter(item => {
      const matchesSearch = !squareSearch || 
        String(item.n).includes(squareSearch) || 
        String(item.square).includes(squareSearch);
      
      const matchesFilter = squareFilter === 'all' || 
        (squareFilter === '1-25' && item.n <= 25) ||
        (squareFilter === '26-50' && item.n > 25 && item.n <= 50) ||
        (squareFilter === '51-75' && item.n > 50 && item.n <= 75) ||
        (squareFilter === '76-100' && item.n > 75) ||
        (squareFilter === 'ending-5' && item.n % 10 === 5);

      return matchesSearch && matchesFilter;
    });
  }, [squareSearch, squareFilter]);

  // Filtered Cubes
  const filteredCubes = useMemo(() => {
    return SPEED_CHARTS_DATA.cubes.filter(item => {
      return !cubeSearch || 
        String(item.n).includes(cubeSearch) || 
        String(item.cube).includes(cubeSearch);
    });
  }, [cubeSearch]);

  // Cube Root Extractor result
  const cubeRootResult = useMemo(() => {
    return SPEED_CHARTS_DATA.extractCubeRoot(cubeInputRoot);
  }, [cubeInputRoot]);

  // Selected Square Details
  const currentSquareDetail = useMemo(() => {
    return SPEED_CHARTS_DATA.squares.find(s => s.n === Number(selectedSquareNum)) || SPEED_CHARTS_DATA.squares[46];
  }, [selectedSquareNum]);

  // Mental Split Result
  const mentalSplitResult = useMemo(() => {
    return SPEED_CHARTS_DATA.getMentalMultiplicationSplit(Number(splitA) || 1, Number(splitB) || 1);
  }, [splitA, splitB]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Master Reference Suite (1 to 100)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Tables, Squares & Cubes Master Charts
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
            Complete interactive 1–100 reference engines with split-and-merge algorithms, Base 50/100 symmetry hacks, 2-second cube root extraction, and speed conditioning drills.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {[
            { id: 'tables', label: 'Tables (1-100)', icon: Table },
            { id: 'squares', label: 'Squares (1-100)', icon: Hash },
            { id: 'cubes', label: 'Cubes (1-100)', icon: Layers },
            { id: 'mugup', label: 'Mugup Hacks & Symmetry', icon: Lightbulb }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setDrillMode(false);
                }}
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

      {/* Drill Floating Modal/Bar when Active */}
      {drillMode && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-500/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Zap className="w-4 h-4" /> Live Reflex Drill: {drillType.toUpperCase()}
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight mt-1 text-white">
                {drillQuestion?.prompt || 'Ready?'}
              </div>
            </div>

            <form onSubmit={handleCheckDrillAnswer} className="flex items-center gap-3">
              <input
                type="number"
                autoFocus
                placeholder="Enter answer"
                value={drillUserAnswer}
                onChange={(e) => setDrillUserAnswer(e.target.value)}
                className="w-36 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-white/40"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Check
              </button>
              <button
                type="button"
                onClick={() => setDrillMode(false)}
                className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-xs rounded-xl transition-all"
              >
                Exit Drill
              </button>
            </form>

            <div className="flex items-center gap-4 text-xs font-mono bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <div>
                Score: <strong className="text-emerald-400">{drillScore.correct}</strong> / {drillScore.total}
              </div>
              <div className="text-amber-300">
                Streak: <strong>{drillScore.streak} 🔥</strong>
              </div>
            </div>
          </div>

          {drillFeedback && (
            <div className={`mt-3 text-xs font-bold px-3 py-1.5 rounded-lg w-fit ${
              drillFeedback.correct ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {drillFeedback.message}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: MULTIPLICATION TABLES (1 to 100) */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {/* Quick Actions & Launchers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Single Table Deep Dive
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  Select Any Table (1 to 100)
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={selectedTableNum}
                    onChange={(e) => setSelectedTableNum(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-lg font-mono font-black text-indigo-600 dark:text-indigo-400 w-12 text-center">
                    {selectedTableNum}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-3">
                Drag slider or click any table below to view up to × 20 with factorization notes.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-1">
                  Mental Split & Merge Tool
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  Instant LR Calculation Engine
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="number"
                    min="10"
                    max="99"
                    value={splitA}
                    onChange={(e) => setSplitA(e.target.value)}
                    className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-mono font-bold"
                  />
                  <span className="font-bold">×</span>
                  <input
                    type="number"
                    min="2"
                    max="9"
                    value={splitB}
                    onChange={(e) => setSplitB(e.target.value)}
                    className="w-14 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-mono font-bold"
                  />
                  <span className="font-bold">=</span>
                  <span className="font-mono font-black text-emerald-600 text-sm">
                    {splitA * splitB}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-3">
                See how a topper computes {splitA} × {splitB} left-to-right without pen and paper.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Speed Challenge
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Timed Tables Flashcards
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Test your reflex recall for tables up to 100 under pressure.
                </p>
              </div>
              <button
                onClick={() => handleStartDrill('tables')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Start Tables Speed Drill</span>
              </button>
            </div>
          </div>

          {/* Mental Split Visualizer Card */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 p-5 rounded-3xl border border-indigo-200 dark:border-indigo-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Topper Mental Split Walkthrough: {splitA} × {splitB}
              </span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                Answer = {mentalSplitResult.product}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Method 1: Standard Left-to-Right Split (Tens + Units)
                </span>
                <div className="text-xs font-mono space-y-1 text-slate-700 dark:text-slate-300">
                  <div>• Step 1: {mentalSplitResult.standardSplit.step1}</div>
                  <div>• Step 2: {mentalSplitResult.standardSplit.step2}</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                    • Step 3: {mentalSplitResult.standardSplit.step3}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Method 2: Base Subtraction (If ending in 7, 8, 9)
                </span>
                {mentalSplitResult.altSplit ? (
                  <div className="text-xs font-mono space-y-1 text-slate-700 dark:text-slate-300">
                    <div>• Step 1: {mentalSplitResult.altSplit.step1}</div>
                    <div>• Step 2: {mentalSplitResult.altSplit.step2}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      • Step 3: {mentalSplitResult.altSplit.step3}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">
                    Standard tens split is optimal for {splitA} as it is not immediately adjacent to a decade base.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected Single Table Deep Dive */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Table of {selectedTableNum}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold">
                    {selectedTableNum <= 20 ? 'Core Exam Table' : 'Advanced Speed Table'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete multiples up to × 20. Essential for DI ratios, Simplification, and Time & Work LCMs.
                </p>
              </div>

              {/* Quick selector chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                {[12, 13, 14, 15, 16, 17, 18, 19, 23, 29, 36, 48, 72, 84, 96].map(num => (
                  <button
                    key={num}
                    onClick={() => setSelectedTableNum(num)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedTableNum === num
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Multiples Grid (1 to 20) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {Array.from({ length: 20 }, (_, idx) => {
                const multiplier = idx + 1;
                const prod = selectedTableNum * multiplier;
                return (
                  <div
                    key={multiplier}
                    className={`p-3 rounded-2xl border transition-all text-center ${
                      multiplier <= 10
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                        : 'bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {selectedTableNum} × {multiplier}
                    </span>
                    <span className="text-lg font-mono font-black text-slate-900 dark:text-white">
                      {prod}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matrix Range View: 10 Tables Side by Side */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  10-Table Panoramic Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Compare multi-table columns simultaneously for rapid pattern recognition.
                </p>
              </div>

              {/* Range Selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {['1-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTableGridRange(range)}
                    className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-all ${
                      tableGridRange === range
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              {(() => {
                const [startStr, endStr] = tableGridRange.split('-');
                const start = parseInt(startStr, 10);
                const end = parseInt(endStr, 10);
                const tableNums = Array.from({ length: end - start + 1 }, (_, i) => start + i);

                return (
                  <table className="w-full text-xs font-mono text-center border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                        <th className="p-2 text-slate-400 font-semibold">×</th>
                        {tableNums.map(n => (
                          <th key={n} className="p-2 font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline" onClick={() => setSelectedTableNum(n)}>
                            T-{n}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 10 }, (_, mIdx) => {
                        const mult = mIdx + 1;
                        return (
                          <tr key={mult} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20">
                            <td className="p-2 font-bold text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
                              × {mult}
                            </td>
                            {tableNums.map(n => (
                              <td key={n} className="p-2 font-semibold text-slate-800 dark:text-slate-200">
                                {n * mult}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SQUARES (1 to 100) */}
      {activeTab === 'squares' && (
        <div className="space-y-6">
          {/* Header Controls & Launchers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Speed Drill
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Squares Flashcard Sprint
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Recall squares up to 100 in 2 seconds or less.
                </p>
              </div>
              <button
                onClick={() => handleStartDrill('squares')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Launch Squares Drill</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-1">
                  Symmetry Explorer
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  The (50 ± x) Last-2-Digit Law
                </h3>
                <p className="text-xs text-slate-500">
                  Squares of 50-x and 50+x ALWAYS share identical last 2 digits as x²!
                </p>
              </div>
              <div className="mt-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50 p-2 rounded-xl">
                e.g. 38² (50-12) = 1444 | 62² (50+12) = 3844 (Both end in 44!)
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Quick Search & Filter
                </span>
                <div className="relative mt-1 mb-2">
                  <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search square or number..."
                    value={squareSearch}
                    onChange={(e) => setSquareSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs outline-none font-mono"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-bold">
                {['all', '1-25', '26-50', '51-75', '76-100', 'ending-5'].map(f => (
                  <button
                    key={f}
                    onClick={() => setSquareFilter(f)}
                    className={`px-2 py-0.5 rounded-lg whitespace-nowrap ${
                      squareFilter === f ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Square Visualizer Card */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 p-6 rounded-3xl border border-indigo-200 dark:border-indigo-900/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Dynamic Square Visualizer: {currentSquareDetail.n}² = {currentSquareDetail.square}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Method: <strong className="text-slate-800 dark:text-slate-200">{currentSquareDetail.method}</strong>
                </span>
              </div>

              {/* Slider for Visualizer */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-semibold">Number:</span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={selectedSquareNum}
                  onChange={(e) => setSelectedSquareNum(Number(e.target.value))}
                  className="w-32 sm:w-48 accent-indigo-600 cursor-pointer"
                />
                <span className="text-lg font-mono font-black text-indigo-600 dark:text-indigo-400 w-10 text-center">
                  {selectedSquareNum}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Speed Formula
                </span>
                <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {currentSquareDetail.rule}
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Mental Step-by-Step
                </span>
                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {currentSquareDetail.steps}
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Digit Attributes
                </span>
                <div className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-0.5">
                  <div>Last 2 Digits: <strong>{currentSquareDetail.lastTwoDigits}</strong></div>
                  <div>Digital Root: <strong>{currentSquareDetail.digitalRoot}</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Full 1 to 100 Squares Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Master 1 to 100 Squares Matrix ({filteredSquares.length} displayed)
              </h3>
              <span className="text-xs text-slate-400">
                Click any square card to inspect its mental algorithm
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
              {filteredSquares.map((item) => {
                const isSelected = selectedSquareNum === item.n;
                return (
                  <div
                    key={item.n}
                    onClick={() => setSelectedSquareNum(item.n)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all text-center select-none ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-indigo-400 text-slate-900 dark:text-white'
                    }`}
                  >
                    <span className="text-[10px] opacity-60 font-mono block">
                      {item.n}²
                    </span>
                    <span className="text-sm font-mono font-black">
                      {item.square}
                    </span>
                    <span className={`text-[9px] block mt-0.5 font-bold ${
                      isSelected ? 'text-indigo-200' : 'text-slate-400'
                    }`}>
                      ..{item.lastTwoDigits}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUBES (1 to 100) */}
      {activeTab === 'cubes' && (
        <div className="space-y-6">
          {/* Top Actions & 2-Second Cube Root Extractor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive 2-Second Cube Root Extractor */}
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> 2-Second Trick Engine
                  </span>
                  <h3 className="text-xl font-black text-white">
                    Instant Perfect Cube Root Extractor
                  </h3>
                  <p className="text-xs text-indigo-200/80">
                    Extract cube roots of perfect cubes up to 1,000,000 in 3 mental steps.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={cubeInputRoot}
                    onChange={(e) => setCubeInputRoot(e.target.value)}
                    placeholder="Enter cube"
                    className="w-36 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Sample Quick Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
                <span className="text-indigo-200 text-xs font-semibold">Try sample cubes:</span>
                {[1728, 2197, 4913, 175616, 314432, 592704, 912673].map(val => (
                  <button
                    key={val}
                    onClick={() => setCubeInputRoot(String(val))}
                    className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 font-mono text-amber-200 transition-all"
                  >
                    {val.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Extractor Result Breakdown */}
              {cubeRootResult.valid ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-300">
                      Step-by-Step Deduction:
                    </span>
                    <span className="text-xl font-mono font-black text-white bg-indigo-600 px-3 py-0.5 rounded-xl">
                      ∛{cubeRootResult.cube.toLocaleString()} = {cubeRootResult.root}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-indigo-100/90 font-mono">
                    <div>• {cubeRootResult.step1}</div>
                    <div>• {cubeRootResult.step2}</div>
                    <div>• {cubeRootResult.step3}</div>
                    <div className="text-emerald-300 font-bold pt-1">
                      ➔ {cubeRootResult.conclusion}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-rose-300 bg-rose-500/20 p-3 rounded-xl">
                  {cubeRootResult.message}
                </div>
              )}
            </div>

            {/* Cubes Speed Drill Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Speed Drill
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Cubes Reflex Sprint
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Bank exam number series frequently feature $n^3 \pm 1$ or difference of cubes. Build instant recognition.
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                <strong>Unit Digit Rule:</strong> 0,1,4,5,6,9 keep same digit! 2 ↔ 8 and 3 ↔ 7 swap with their 10-complement.
              </div>

              <button
                onClick={() => handleStartDrill('cubes')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Launch Cubes Drill</span>
              </button>
            </div>
          </div>

          {/* Master 1 to 100 Cubes Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Master 1 to 100 Cubes Table
                </h3>
                <p className="text-xs text-slate-500">
                  Observe how the unit digit pattern repeats predictably in 10-number cycles.
                </p>
              </div>

              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter cubes..."
                  value={cubeSearch}
                  onChange={(e) => setCubeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredCubes.map(item => {
                const isSelected = selectedCubeNum === item.n;
                return (
                  <div
                    key={item.n}
                    onClick={() => {
                      setSelectedCubeNum(item.n);
                      setCubeInputRoot(String(item.cube));
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-indigo-400 text-slate-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold opacity-75">
                        {item.n}³
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        Ends in {item.lastDigit}
                      </span>
                    </div>

                    <div className="text-lg font-mono font-black mt-2">
                      {item.formattedCube}
                    </div>

                    <div className="text-[10px] opacity-60 mt-1 truncate">
                      {item.unitDigitRule}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MUGUP HACKS & SYMMETRY GUIDE */}
      {activeTab === 'mugup' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Short Memory Methods & Mugup Pegs
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              How toppers commit 100 tables, squares, and cubes to memory without brute force rote learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SPEED_CHARTS_DATA.memoryHacks.map((hack, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded uppercase tracking-wider">
                      {hack.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                      {hack.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                    {hack.title}
                  </h4>

                  <p className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold mt-1">
                    {hack.principle}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {hack.explanation}
                  </p>

                  {/* Examples Table */}
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs font-mono space-y-1.5">
                    {hack.examples.map((ex, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 dark:border-slate-800 last:border-none pb-1 last:pb-0">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{ex.diff}:</span>
                        <span className="text-slate-700 dark:text-slate-300">{ex.pair1} • {ex.pair2}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ex.pair3}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
