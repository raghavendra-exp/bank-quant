import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Layers, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export default function PyqAnalytics() {
  const [pyqData, setPyqData] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState('sbi-clerk');

  useEffect(() => {
    fetch('./data/pyq.json')
      .then(res => res.json())
      .then(data => setPyqData(data))
      .catch(err => console.error('Failed to load pyq.json', err));
  }, []);

  if (!pyqData) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-slate-500 mt-3">Loading PYQ Intelligence...</p>
      </div>
    );
  }

  const currentExam = pyqData.examTrends?.find(e => e.examId === selectedExamId) || pyqData.examTrends[0];
  const matrix = pyqData.topicPriorityMatrix || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>Exam Trend Intelligence</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          2020 – 2026 PYQ Pattern Analysis
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Rigorous shift-by-shift empirical breakdown of SBI Clerk, IBPS Clerk, and RRB Office Assistant papers.
        </p>

        {/* Core Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1">
              Prelims Reality (The 65% Rule)
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {pyqData.summary.coreObservation}
            </p>
          </div>

          <div className="p-4 bg-teal-50/70 dark:bg-teal-950/30 rounded-2xl border border-teal-100 dark:border-teal-900/40">
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-1">
              Mains Reality (The DI Dominance)
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {pyqData.summary.mainsShiftObservation}
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Trends Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Shift Distribution History
            </h3>
          </div>

          <div className="flex gap-2">
            {pyqData.examTrends?.map((exam) => (
              <button
                key={exam.examId}
                onClick={() => setSelectedExamId(exam.examId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedExamId === exam.examId
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {exam.examName.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Prelims Trends Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Exam Year</th>
                <th className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">Simplification</th>
                <th className="py-2.5 px-3">Number Series</th>
                <th className="py-2.5 px-3">Quadratic Eq.</th>
                <th className="py-2.5 px-3">DI Sets</th>
                <th className="py-2.5 px-3">Arithmetic</th>
                <th className="py-2.5 px-3">Total Qs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentExam?.prelimsTrends?.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{row.year} Prelims</td>
                  <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400">{row.simplification} Qs</td>
                  <td className="py-3 px-3">{row.numberSeries} Qs</td>
                  <td className="py-3 px-3">{row.quadratic} Qs</td>
                  <td className="py-3 px-3">{row.diSets} Qs</td>
                  <td className="py-3 px-3 text-slate-500">{row.arithmetic} Qs</td>
                  <td className="py-3 px-3 font-bold">
                    {row.simplification + row.numberSeries + row.quadratic + row.diSets + row.arithmetic}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4-Tier Topic Priority ROI Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Topper Strategy Priority Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Ranked strictly by Marks Return on Time Invested (ROI).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tier 1 */}
          <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-2">
              Tier 1: Must Master (Secures ~20 Marks in 10 Mins)
            </span>
            <div className="space-y-2">
              {matrix.tier1_MustMaster?.map((item, i) => (
                <div key={i} className="text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-950 flex justify-between items-center">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.topic}</span>
                  <span className="text-emerald-600 font-mono font-bold text-[11px]">{item.roi}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 2 */}
          <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200 dark:border-indigo-900/40">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-2">
              Tier 2: High Yield Arithmetic (Clean 1-Line Setup)
            </span>
            <div className="space-y-2">
              {matrix.tier2_HighYieldArithmetic?.map((item, i) => (
                <div key={i} className="text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-950 flex justify-between items-center">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.topic}</span>
                  <span className="text-indigo-600 font-mono font-bold text-[11px]">{item.roi}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 3 */}
          <div className="p-5 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/40">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-2">
              Tier 3: Mains Rank Deciders
            </span>
            <div className="space-y-2">
              {matrix.tier3_MainsRankDeciders?.map((item, i) => (
                <div key={i} className="text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-amber-100 dark:border-amber-950 flex justify-between items-center">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.topic}</span>
                  <span className="text-amber-600 font-mono font-bold text-[11px]">{item.roi}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 4 */}
          <div className="p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Tier 4: Low ROI (Skip if Running Short on Time)
            </span>
            <div className="space-y-2">
              {matrix.tier4_LowROI_SkipIfShortOnTime?.map((item, i) => (
                <div key={i} className="text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">{item.topic}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{item.roi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
