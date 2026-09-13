import React, { useState } from 'react';
import { Scale, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AlligationVisualizer() {
  const [cheaper, setCheaper] = useState(45);
  const [dearer, setDearer] = useState(75);
  const [mean, setMean] = useState(55);
  const [totalBatch, setTotalBatch] = useState(60);

  // Validation
  const isValid = cheaper < mean && mean < dearer;

  // Cross differences
  const diffCheaper = Math.max(0, dearer - mean); // left part
  const diffDearer = Math.max(0, mean - cheaper);  // right part

  // GCD for reduction
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const g = (diffCheaper > 0 && diffDearer > 0) ? gcd(diffCheaper, diffDearer) : 1;
  const reducedLeft = diffCheaper / g;
  const reducedRight = diffDearer / g;

  // Total batch split
  const totalParts = reducedLeft + reducedRight;
  const cheaperWeight = totalParts > 0 ? ((reducedLeft / totalParts) * totalBatch).toFixed(1) : 0;
  const dearerWeight = totalParts > 0 ? ((reducedRight / totalParts) * totalBatch).toFixed(1) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Scale className="w-4 h-4" />
            <span>Mixture Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Alligation Cross Visualizer
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Solve weighted averages, mixtures, and price combinations in 5 seconds without setting up algebraic equations.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">
            Cheaper Price / % (C):
          </label>
          <input
            type="number"
            value={cheaper}
            onChange={(e) => setCheaper(Number(e.target.value))}
            className="w-full px-3 py-1.5 font-mono text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">
            Mean Price / % (M):
          </label>
          <input
            type="number"
            value={mean}
            onChange={(e) => setMean(Number(e.target.value))}
            className="w-full px-3 py-1.5 font-mono text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">
            Dearer Price / % (D):
          </label>
          <input
            type="number"
            value={dearer}
            onChange={(e) => setDearer(Number(e.target.value))}
            className="w-full px-3 py-1.5 font-mono text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
      </div>

      {!isValid && (
        <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl border border-rose-200 dark:border-rose-900">
          Condition required: Cheaper ({cheaper}) &lt; Mean ({mean}) &lt; Dearer ({dearer}). Adjust values so Mean lies between Cheaper and Dearer.
        </div>
      )}

      {/* Cross Diagram */}
      <div className="mt-8 flex flex-col items-center">
        <div className="relative w-72 h-64 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4">
          {/* Top labels */}
          <div className="absolute top-4 left-6 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Cheaper (C)</span>
            <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">{cheaper}</span>
          </div>

          <div className="absolute top-4 right-6 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Dearer (D)</span>
            <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">{dearer}</span>
          </div>

          {/* Center Mean */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-indigo-600 text-white px-3 py-1.5 rounded-xl shadow-md">
            <span className="text-[9px] block uppercase opacity-80">Mean (M)</span>
            <span className="text-base font-mono font-bold">{mean}</span>
          </div>

          {/* Diagonal SVG Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 288 256">
            {/* Top-Right (D) to Bottom-Left (D - M) */}
            <line x1="220" y1="50" x2="68" y2="200" stroke="#6366f1" strokeWidth="2" strokeDasharray="3 3" />
            {/* Top-Left (C) to Bottom-Right (M - C) */}
            <line x1="68" y1="50" x2="220" y2="200" stroke="#6366f1" strokeWidth="2" strokeDasharray="3 3" />
          </svg>

          {/* Bottom labels */}
          <div className="absolute bottom-4 left-6 text-center">
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block uppercase font-bold">D − M</span>
            <span className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {dearer} − {mean} = {diffCheaper}
            </span>
          </div>

          <div className="absolute bottom-4 right-6 text-center">
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block uppercase font-bold">M − C</span>
            <span className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {mean} − {cheaper} = {diffDearer}
            </span>
          </div>
        </div>

        {/* Ratio Verdict */}
        <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-center w-full max-w-md">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Quantity Cheaper : Quantity Dearer
          </span>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-1">
            {diffCheaper} : {diffDearer} {g > 1 && ` = ${reducedLeft} : ${reducedRight}`}
          </div>
        </div>

        {/* Batch split calculator */}
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <span>For a total batch of</span>
          <input
            type="number"
            value={totalBatch}
            onChange={(e) => setTotalBatch(Number(e.target.value))}
            className="w-16 px-2 py-0.5 text-center font-mono border rounded bg-white dark:bg-slate-800"
          />
          <span>kg: Cheaper = <strong>{cheaperWeight} kg</strong>, Dearer = <strong>{dearerWeight} kg</strong></span>
        </div>
      </div>
    </div>
  );
}
