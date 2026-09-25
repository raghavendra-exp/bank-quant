import React from 'react';
import { 
  Trophy, Zap, Target, BookOpen, Compass, Sparkles, 
  ArrowRight, Activity, TrendingUp, CheckCircle2, Clock, AlertCircle, Table
} from 'lucide-react';
import { getQuantReadinessScore, getUserProgress } from '../../utils/dataManager';

export default function Dashboard({ onNavigate, topics = [] }) {
  const readiness = getQuantReadinessScore();
  const progress = getUserProgress();

  const totalAttempted = progress.totalAttempted || 0;
  const totalCorrect = progress.totalCorrect || 0;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const avgTimePerQ = totalAttempted > 0 ? Math.round(progress.totalTimeSpentSec / totalAttempted) : 0;

  // Identify lowest accuracy topics (Weakness Detector)
  const topicStatsArray = Object.entries(progress.topicStats || {}).map(([topicId, stat]) => {
    const topicObj = topics.find(t => t.id === topicId) || { name: topicId };
    const acc = stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0;
    return { id: topicId, name: topicObj.name, attempted: stat.attempted, accuracy: acc };
  }).sort((a, b) => a.accuracy - b.accuracy);

  const weakestTopic = topicStatsArray.length > 0 ? topicStatsArray[0] : null;

  return (
    <div className="space-y-6">
      {/* Top Banner with Quant Readiness Score */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SBI • IBPS • RRB Clerk Ready</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Bank Quant Master
            </h1>
            <p className="text-sm sm:text-base text-indigo-200/90 mt-2 leading-relaxed">
              From Zero to Concept Clear to 20-Minute Exam Conditioning. Master dual solutions (Textbook vs Topper Speed Hacks) and official notification patterns.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onNavigate('practice')}
                className="px-5 py-2.5 bg-white text-indigo-950 font-bold text-xs rounded-xl shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <span>Start Practice Arena</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('visualizers')}
                className="px-5 py-2.5 bg-indigo-700/50 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl border border-indigo-500/30 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Interactive Visualizers</span>
              </button>
            </div>
          </div>

          {/* Readiness Gauge Meter */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 text-center min-w-[240px] shrink-0">
            <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block">
              Quant Readiness Index
            </span>
            <div className="text-5xl font-mono font-black text-amber-300 my-2">
              {readiness.score}<span className="text-lg text-indigo-200 font-sans">/100</span>
            </div>
            <div className="space-y-1.5 text-xs text-indigo-200/80 text-left mt-3">
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <strong className="text-white font-mono">{readiness.accuracyFactor}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Speed Index:</span>
                <strong className="text-white font-mono">{readiness.speedFactor}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Syllabus Coverage:</span>
                <strong className="text-white font-mono">{readiness.syllabusCoverageFactor}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Attempted</span>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
            {totalAttempted} Qs
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Accuracy</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-600">
            {overallAccuracy}%
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Avg Speed / Q</span>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
            {avgTimePerQ > 0 ? `${avgTimePerQ}s` : '--'}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Syllabus Topics</span>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
            32 Topics
          </div>
        </div>
      </div>

      {/* Smart Daily Recommendation */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-5 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Smart Daily Focus: {weakestTopic ? weakestTopic.name : 'Simplification & Fractional Speed'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {weakestTopic
                ? `Your accuracy in ${weakestTopic.name} is currently ${weakestTopic.accuracy}%. Take a 10-Q focused sprint today.`
                : 'Prelims exams allocate 10-15 marks to Simplification. Drill the 15-second Speed Lab to build reflex speed.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('speedlab')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shrink-0 shadow-sm"
        >
          Launch 15s Drill
        </button>
      </div>

      {/* Feature Tiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Speed Lab */}
        <div
          onClick={() => onNavigate('speedlab')}
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 shadow-sm cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Speed Conditioning Lab
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              15s, 25s, 35s, 45s, and 60s rapid-fire drills with sound pulse, combo multipliers, and reflex timers.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 gap-1">
            <span>Enter Speed Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Question Selection Trainer */}
        <div
          onClick={() => onNavigate('selection')}
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 shadow-sm cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              First 5-Min Strategy Trainer
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Learn what questions to solve in the first 7 minutes, what to hold for round 2, and what traps to skip immediately.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 gap-1">
            <span>Train Selection Tactics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Exam Simulator */}
        <div
          onClick={() => onNavigate('mock')}
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 shadow-sm cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Full Mock Exam Simulator
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Real 20-minute SBI & IBPS Clerk mocks with question palette, -0.25 negative marking, and cutoff diagnostic.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 gap-1">
            <span>Launch Mock Exam</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Speed Calculation Arsenal & Canonical Books */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
              Speed Math Arsenal & Canonical Quant Books
            </h3>
          </div>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full">
            SBI • IBPS • RRB Topper Suite
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Master Reference Charts (1-100) */}
          <div
            onClick={() => onNavigate('charts')}
            className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/40 to-white dark:from-slate-900 dark:to-indigo-950/20 hover:border-indigo-500 shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                <Table className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                Tables • Squares • Cubes
              </span>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Master Speed Charts (1 to 100)
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Full 1–100 tables, Base 50/100 symmetry laws, 2-sec cube root extractor, and mental split-and-merge algorithms.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 gap-1">
              <span>Open 1-100 Reference Charts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Vedic Maths Suite */}
          <div
            onClick={() => onNavigate('vedic')}
            className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/40 to-white dark:from-slate-900 dark:to-amber-950/20 hover:border-amber-500 shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                7 Ancient Mathematical Sutras
              </span>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Vedic Maths Acceleration Suite
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Interactive visualizers for Urdhva Tiryagbhyam, Nikhilam base, Ekadhikena, Vinculum, and 3-second Beejank elimination.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 gap-1">
              <span>Launch Vedic Suite</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: 5 Quant Books Compendium */}
          <div
            onClick={() => onNavigate('books')}
            className="p-6 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-50/40 to-white dark:from-slate-900 dark:to-purple-950/20 hover:border-purple-500 shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">
                Tyra • Verma • Aggarwal • Shukla • Sumit Sir
              </span>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                5 Quant Books Compendium
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Complete synthesis of direct shortcuts, alligation rules, duplex squaring, 20-min prelims blueprints, and ratio-based CI.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 gap-1">
              <span>Explore 5 Books Compendium</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Weakness Detector Heatmap */}
      {topicStatsArray.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Weakness Detector Matrix
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {topicStatsArray.slice(0, 6).map((stat) => (
              <div
                key={stat.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    {stat.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {stat.attempted} Attempted
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  stat.accuracy >= 80
                    ? 'bg-emerald-100 text-emerald-700'
                    : stat.accuracy >= 50
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {stat.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
