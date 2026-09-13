import React, { useState } from 'react';
import { Percent, ArrowRight, Zap, RefreshCw } from 'lucide-react';

const FRACTION_DATA = [
  { frac: '1/2', pct: '50%', dec: 0.5 },
  { frac: '1/3', pct: '33.33%', dec: 0.3333 },
  { frac: '2/3', pct: '66.67%', dec: 0.6667 },
  { frac: '1/4', pct: '25%', dec: 0.25 },
  { frac: '3/4', pct: '75%', dec: 0.75 },
  { frac: '1/5', pct: '20%', dec: 0.2 },
  { frac: '2/5', pct: '40%', dec: 0.4 },
  { frac: '3/5', pct: '60%', dec: 0.6 },
  { frac: '4/5', pct: '80%', dec: 0.8 },
  { frac: '1/6', pct: '16.67%', dec: 0.1667 },
  { frac: '5/6', pct: '83.33%', dec: 0.8333 },
  { frac: '1/7', pct: '14.28%', dec: 0.1428 },
  { frac: '2/7', pct: '28.57%', dec: 0.2857 },
  { frac: '3/7', pct: '42.86%', dec: 0.4286 },
  { frac: '4/7', pct: '57.14%', dec: 0.5714 },
  { frac: '1/8', pct: '12.5%', dec: 0.125 },
  { frac: '3/8', pct: '37.5%', dec: 0.375 },
  { frac: '5/8', pct: '62.5%', dec: 0.625 },
  { frac: '7/8', pct: '87.5%', dec: 0.875 },
  { frac: '1/9', pct: '11.11%', dec: 0.1111 },
  { frac: '1/10', pct: '10%', dec: 0.1 },
  { frac: '1/11', pct: '9.09%', dec: 0.0909 },
  { frac: '1/12', pct: '8.33%', dec: 0.0833 },
  { frac: '1/15', pct: '6.67%', dec: 0.0667 },
  { frac: '1/16', pct: '6.25%', dec: 0.0625 },
  { frac: '1/20', pct: '5%', dec: 0.05 },
  { frac: '1/25', pct: '4%', dec: 0.04 }
];

export default function FractionPercentVisualizer() {
  const [selectedFrac, setSelectedFrac] = useState(FRACTION_DATA[16]); // 3/8 = 37.5%
  const [testBase, setTestBase] = useState(640);
  const [searchFilter, setSearchFilter] = useState('');

  const filtered = FRACTION_DATA.filter(item => 
    item.frac.includes(searchFilter) || item.pct.includes(searchFilter)
  );

  // Calculate values
  const fractionResult = (selectedFrac.dec * testBase).toFixed(2);
  const cleanResult = Math.round(selectedFrac.dec * testBase);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Percent className="w-4 h-4" />
            <span>Interactive Speed Lab</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Fraction ↔ Percentage Mastery Wheel
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Convert standard banking percentages into fractions to cancel numbers in under 5 seconds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search e.g. 1/8 or 37.5%"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid of fractions */}
      <div className="mt-6">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-3">
          Select Fraction / Percentage:
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 max-h-48 overflow-y-auto p-1">
          {filtered.map((item) => {
            const isSelected = selectedFrac.frac === item.frac;
            return (
              <button
                key={item.frac}
                onClick={() => setSelectedFrac(item)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-600'
                }`}
              >
                <span className="text-sm font-mono font-bold">{item.frac}</span>
                <span className={`text-xs mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {item.pct}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live calculation comparison */}
      <div className="mt-8 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-indigo-950/30 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/2">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Live Speed Multiplier Drill
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Enter any test base number to compare conventional decimal arithmetic vs topper fractional cancellation:
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Base Number:</span>
              <input
                type="number"
                value={testBase}
                onChange={(e) => setTestBase(Number(e.target.value) || 0)}
                className="w-32 px-3 py-1.5 font-mono text-base bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setTestBase(Math.floor(Math.random() * 20 + 5) * 40)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
                title="Pick random friendly base"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Conventional */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-900/40">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">
                Conventional Method
              </span>
              <div className="font-mono text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <div>{selectedFrac.pct} × {testBase}</div>
                <div className="text-xs text-rose-500">Long decimal multiplication</div>
                <div className="text-xs text-slate-500 mt-2">Time: ~30 - 45s</div>
              </div>
            </div>

            {/* Topper */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <span>Topper Method</span>
                <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">5s</span>
              </span>
              <div className="font-mono text-sm text-slate-800 dark:text-slate-200 space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedFrac.frac} × {testBase} = {cleanResult}
                </div>
                <div className="text-xs text-slate-500">Direct integer cancellation!</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">Saved: ~35 seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
