import React, { useState } from 'react';
import { Calculator, Sparkles, ArrowRight, Zap } from 'lucide-react';

export default function VedicMathVisualizer() {
  const [activeTab, setActiveTab] = useState('crisscross'); // 'crisscross' | 'base100' | 'ending5' | 'mult11'

  // State for Criss-Cross
  const [numA, setNumA] = useState(43);
  const [numB, setNumB] = useState(27);

  // State for Base 100
  const [baseNum1, setBaseNum1] = useState(96);
  const [baseNum2, setBaseNum2] = useState(93);

  // State for ending in 5
  const [end5Num, setEnd5Num] = useState(75);

  // State for mult 11
  const [mult11Num, setMult11Num] = useState(354);

  // Criss-cross steps for 2-digit
  const aTens = Math.floor(numA / 10) % 10;
  const aUnits = numA % 10;
  const bTens = Math.floor(numB / 10) % 10;
  const bUnits = numB % 10;

  const step1 = aUnits * bUnits;
  const step1Unit = step1 % 10;
  const carry1 = Math.floor(step1 / 10);

  const step2 = aTens * bUnits + aUnits * bTens + carry1;
  const step2Unit = step2 % 10;
  const carry2 = Math.floor(step2 / 10);

  const step3 = aTens * bTens + carry2;
  const finalProduct = numA * numB;

  // Base 100 calculations
  const dev1 = baseNum1 - 100;
  const dev2 = baseNum2 - 100;
  const rightSide = dev1 * dev2;
  const leftSide = baseNum1 + dev2;
  const base100Product = baseNum1 * baseNum2;

  // Ending 5 calculations
  const end5Prefix = Math.floor(end5Num / 10);
  const end5Left = end5Prefix * (end5Prefix + 1);
  const end5Result = end5Num * end5Num;

  // Mult 11 calculations
  const mult11Result = mult11Num * 11;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Vedic Math Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Mental Math Sutras Visualizer
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Step-by-step interactive animations for the fastest Vedic mental calculation sutras.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {[
            { id: 'crisscross', label: 'Criss-Cross (2×2)' },
            { id: 'base100', label: 'Base 100/1000' },
            { id: 'ending5', label: 'Square Ending in 5' },
            { id: 'mult11', label: 'Multiply by 11' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Criss-Cross */}
      {activeTab === 'crisscross' && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Test Numbers:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="99"
                value={numA}
                onChange={(e) => setNumA(Math.min(99, Math.max(10, Number(e.target.value) || 10)))}
                className="w-16 px-2 py-1 font-mono text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              <span className="text-slate-400">×</span>
              <input
                type="number"
                min="10"
                max="99"
                value={numB}
                onChange={(e) => setNumB(Math.min(99, Math.max(10, Number(e.target.value) || 10)))}
                className="w-16 px-2 py-1 font-mono text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => {
                setNumA(Math.floor(Math.random() * 80 + 15));
                setNumB(Math.floor(Math.random() * 80 + 15));
              }}
              className="px-3 py-1 text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50"
            >
              Random Pair
            </button>
          </div>

          {/* 3 Step Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-2">
                Step 1: Vertical Units
              </span>
              <div className="font-mono text-sm space-y-1">
                <div className="text-slate-600 dark:text-slate-400">
                  {aUnits} × {bUnits} = <span className="font-bold text-slate-900 dark:text-white">{step1}</span>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                  Write: <strong>{step1Unit}</strong> {carry1 > 0 && `(Carry ${carry1})`}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-2">
                Step 2: Cross Multiply & Add
              </span>
              <div className="font-mono text-sm space-y-1">
                <div className="text-slate-600 dark:text-slate-400 text-xs">
                  ({aTens}×{bUnits}) + ({aUnits}×{bTens}) + {carry1}
                </div>
                <div className="text-slate-900 dark:text-white font-bold">
                  = {aTens * bUnits} + {aUnits * bTens} + {carry1} = {step2}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                  Write: <strong>{step2Unit}</strong> {carry2 > 0 && `(Carry ${carry2})`}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-2">
                Step 3: Vertical Tens
              </span>
              <div className="font-mono text-sm space-y-1">
                <div className="text-slate-600 dark:text-slate-400">
                  ({aTens} × {bTens}) + {carry2} = <span className="font-bold text-slate-900 dark:text-white">{step3}</span>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                  Write: <strong>{step3}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Final One-line result */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-5 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Instant One-Line Product:
              </span>
              <div className="text-3xl font-mono font-black text-slate-900 dark:text-white mt-1">
                {numA} × {numB} = <span className="text-emerald-600 dark:text-emerald-400">{finalProduct}</span>
              </div>
            </div>
            <div className="hidden sm:block text-right text-xs text-slate-500 dark:text-slate-400">
              Assembly: [{step3}][{step2Unit}][{step1Unit}]
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Base 100 */}
      {activeTab === 'base100' && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Numbers Near 100:</span>
            <input
              type="number"
              value={baseNum1}
              onChange={(e) => setBaseNum1(Number(e.target.value) || 100)}
              className="w-20 px-2 py-1 font-mono text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
            <span className="text-slate-400">×</span>
            <input
              type="number"
              value={baseNum2}
              onChange={(e) => setBaseNum2(Number(e.target.value) || 100)}
              className="w-20 px-2 py-1 font-mono text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-2">
                Left Side (Cross Sum)
              </span>
              <div className="font-mono text-sm space-y-1">
                <div>Deviation 1: {baseNum1} − 100 = {dev1 > 0 ? `+${dev1}` : dev1}</div>
                <div>Deviation 2: {baseNum2} − 100 = {dev2 > 0 ? `+${dev2}` : dev2}</div>
                <div className="font-bold text-slate-900 dark:text-white pt-2">
                  Left = {baseNum1} + ({dev2 > 0 ? `+${dev2}` : dev2}) = {leftSide}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-2">
                Right Side (Deviations Product)
              </span>
              <div className="font-mono text-sm space-y-1">
                <div>({dev1 > 0 ? `+${dev1}` : dev1}) × ({dev2 > 0 ? `+${dev2}` : dev2}) = {rightSide}</div>
                <div className="text-xs text-slate-500">
                  (Must be 2 digits for base 100): <strong>{String(Math.abs(rightSide)).padStart(2, '0')}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 p-5 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                Combined Result:
              </span>
              <div className="text-3xl font-mono font-black text-slate-900 dark:text-white mt-1">
                {baseNum1} × {baseNum2} = <span className="text-indigo-600 dark:text-indigo-400">{base100Product}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Square Ending in 5 */}
      {activeTab === 'ending5' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Number ending in 5:</span>
            <input
              type="number"
              step="10"
              value={end5Num}
              onChange={(e) => {
                const val = Number(e.target.value) || 5;
                setEnd5Num(Math.floor(val / 10) * 10 + 5);
              }}
              className="w-24 px-2 py-1 font-mono text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
                Left Part: n × (n + 1)
              </span>
              <div className="font-mono text-sm space-y-1">
                <div>Prefix n = {end5Prefix}</div>
                <div>Successor = {end5Prefix + 1}</div>
                <div className="font-bold text-slate-900 dark:text-white pt-1">
                  {end5Prefix} × {end5Prefix + 1} = {end5Left}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-2">
                Right Part: Always 25
              </span>
              <div className="font-mono text-sm space-y-1">
                <div>5² = 25</div>
                <div className="text-xs text-slate-500 pt-1">Always tack 25 at the end!</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-5 rounded-2xl border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Square in 2 Seconds:
              </span>
              <div className="text-3xl font-mono font-black text-slate-900 dark:text-white mt-1">
                {end5Num}² = <span className="text-amber-600 dark:text-amber-400">[{end5Left}][25] = {end5Result}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Multiply by 11 */}
      {activeTab === 'mult11' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Any Number:</span>
            <input
              type="number"
              value={mult11Num}
              onChange={(e) => setMult11Num(Number(e.target.value) || 1)}
              className="w-28 px-2 py-1 font-mono text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
            <span className="text-slate-500 font-mono">× 11</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-2">
              Ripple Sum Algorithm
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Write first and last digit, then add adjacent pairs right to left with carry:
            </p>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
              {mult11Num} × 11 = <span className="text-indigo-600 dark:text-indigo-400">{mult11Result}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
