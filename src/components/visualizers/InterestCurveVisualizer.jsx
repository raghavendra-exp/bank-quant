import React, { useState } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

export default function InterestCurveVisualizer() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);

  // Generate data points
  const points = [];
  for (let t = 0; t <= years; t++) {
    const si = (principal * rate * t) / 100;
    const ci = principal * (Math.pow(1 + rate / 100, t) - 1);
    points.push({ year: t, si: Math.round(si), ci: Math.round(ci), diff: Math.round(ci - si) });
  }

  // 2-Year Diff Formula
  const diff2Years = Math.round(principal * Math.pow(rate / 100, 2));
  const diff3Years = Math.round(principal * Math.pow(rate / 100, 2) * (3 + rate / 100));
  const effective2YrRate = (2 * rate + (rate * rate) / 100).toFixed(2);

  const maxVal = Math.max(...points.map(p => p.ci), 1000);
  const svgWidth = 500;
  const svgHeight = 220;
  const padding = 40;

  // Map to SVG coordinates
  const getX = (t) => padding + (t / years) * (svgWidth - 2 * padding);
  const getY = (val) => svgHeight - padding - (val / maxVal) * (svgHeight - 2 * padding);

  const siPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.si)}`).join(' ');
  const ciPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.ci)}`).join(' ');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Growth Visualizer</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Compound vs Simple Interest Curve
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Compare linear simple interest growth against exponential compounding, and visualize the 2-year difference formula.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">
            Principal Amount (₹): {principal.toLocaleString()}
          </label>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">
            Annual Interest Rate: {rate}%
          </label>
          <input
            type="range"
            min="2"
            max="25"
            step="1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">
            Duration: {years} Years
          </label>
          <input
            type="range"
            min="2"
            max="10"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="mt-6 flex flex-col items-center">
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-xl mx-auto">
            {/* Grid lines */}
            <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#cbd5e1" strokeWidth="1" />
            <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#cbd5e1" strokeWidth="1" />

            {/* SI Line (Emerald) */}
            <path d={siPath} fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="4 2" />

            {/* CI Curve (Indigo) */}
            <path d={ciPath} fill="none" stroke="#6366f1" strokeWidth="3" />

            {/* Data dots */}
            {points.map((p) => (
              <g key={p.year}>
                <circle cx={getX(p.year)} cy={getY(p.si)} r="4" fill="#10b981" />
                <circle cx={getX(p.year)} cy={getY(p.ci)} r="4" fill="#6366f1" />
                <text x={getX(p.year)} y={svgHeight - padding + 16} fontSize="10" textAnchor="middle" fill="#64748b">
                  Yr {p.year}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-3 text-xs font-semibold">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <div className="w-4 h-0.5 bg-emerald-500 border-dashed" />
            <span>Simple Interest (Linear)</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <div className="w-4 h-1 bg-indigo-500 rounded" />
            <span>Compound Interest (Exponential)</span>
          </div>
        </div>
      </div>

      {/* 2-Year & 3-Year Difference Formulas */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1">
            2-Year CI − SI Difference Formula
          </span>
          <div className="text-sm font-mono text-slate-800 dark:text-slate-200">
            Diff = P × (R / 100)²
          </div>
          <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-2">
            ₹{diff2Years.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Effective 2-Yr CI Rate: <strong>{effective2YrRate}%</strong> (vs SI: {rate * 2}%)
          </div>
        </div>

        <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-xl border border-teal-100 dark:border-teal-900/40">
          <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-1">
            3-Year CI − SI Difference Formula
          </span>
          <div className="text-sm font-mono text-slate-800 dark:text-slate-200">
            Diff = P × (R / 100)² × (3 + R / 100)
          </div>
          <div className="text-lg font-bold font-mono text-teal-600 dark:text-teal-400 mt-2">
            ₹{diff3Years.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Frequently tested in SBI & IBPS Clerk Mains
          </div>
        </div>
      </div>
    </div>
  );
}
