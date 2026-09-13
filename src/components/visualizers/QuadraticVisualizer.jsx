import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

const SIGN_RULES = [
  { eqSigns: '(+, +)', rootSigns: '(-, -)', example: 'x² + 7x + 12 = 0', roots: 'x = -3, -4' },
  { eqSigns: '(-, +)', rootSigns: '(+, +)', example: 'x² - 7x + 12 = 0', roots: 'x = +3, +4' },
  { eqSigns: '(+, -)', rootSigns: '(-, +)', example: 'x² + 4x - 12 = 0', roots: 'x = -6, +2' },
  { eqSigns: '(-, -)', rootSigns: '(+, -)', example: 'x² - 4x - 12 = 0', roots: 'x = +6, -2' }
];

export default function QuadraticVisualizer() {
  const [selectedRule, setSelectedRule] = useState(SIGN_RULES[1]); // (-, +) -> (+, +)

  // Equation 1 & 2 simulator
  const [b1, setB1] = useState(-11);
  const [c1, setC1] = useState(30);
  const [b2, setB2] = useState(-15);
  const [c2, setC2] = useState(56);

  // Solve roots using quadratic formula
  function getRoots(b, c) {
    const disc = b * b - 4 * c;
    if (disc < 0) return null;
    const sq = Math.sqrt(disc);
    const r1 = Number(((-b + sq) / 2).toFixed(2));
    const r2 = Number(((-b - sq) / 2).toFixed(2));
    return [Math.min(r1, r2), Math.max(r1, r2)];
  }

  const rootsX = getRoots(b1, c1);
  const rootsY = getRoots(b2, c2);

  // Determine relation
  let relation = 'Calculating...';
  let isCND = false;

  if (c1 < 0 && c2 < 0) {
    relation = 'Cannot be determined (CND) — Both constant terms are negative!';
    isCND = true;
  } else if (rootsX && rootsY) {
    const [xMin, xMax] = rootsX;
    const [yMin, yMax] = rootsY;

    if (xMin > yMax) relation = 'x > y';
    else if (xMax < yMin) relation = 'x < y';
    else if (xMin >= yMax) relation = 'x ≥ y';
    else if (xMax <= yMin) relation = 'x ≤ y';
    else if (xMin === xMax && xMin === yMin && yMin === yMax) relation = 'x = y';
    else {
      relation = 'Cannot be determined (CND) — Root ranges overlap!';
      isCND = true;
    }
  } else {
    relation = 'Complex / Imaginary roots';
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Target className="w-4 h-4" />
            <span>Algebra Hack Lab</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Quadratic 5-Second Sign-Flip Visualizer
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Master the sign method to answer 2 out of 5 quadratic questions in banking prelims without factorizing!
          </p>
        </div>
      </div>

      {/* 4 Sign Rule Cards */}
      <div className="mt-6">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-3">
          Click any sign combination to inspect root signs:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SIGN_RULES.map((rule) => {
            const isSelected = selectedRule.eqSigns === rule.eqSigns;
            return (
              <button
                key={rule.eqSigns}
                onClick={() => setSelectedRule(rule)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:border-indigo-300'
                }`}
              >
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Equation Signs:</div>
                <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  {rule.eqSigns}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Roots: {rule.rootSigns}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Golden Rule Highlight */}
      <div className="mt-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
            THE 3-SECOND GOLDEN HACK (Guaranteed in almost every shift)
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-400 mt-1 leading-relaxed">
            If both equations have negative constant terms (e.g. x² − bx <strong>− c₁</strong> = 0 and y² + dy <strong>− c₂</strong> = 0),
            their roots are guaranteed to be (+, -) and (+, -). <strong>The relationship is ALWAYS CND!</strong> Mark it immediately without writing a single line.
          </p>
        </div>
      </div>

      {/* Live Quadratic Comparison Simulator */}
      <div className="mt-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60">
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Live Equation Comparison Simulator
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Eq 1 */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-2">
              Equation I (in x)
            </span>
            <div className="text-sm font-mono text-slate-800 dark:text-slate-200 mb-3">
              x² {b1 >= 0 ? `+ ${b1}` : `− ${Math.abs(b1)}`}x {c1 >= 0 ? `+ ${c1}` : `− ${Math.abs(c1)}`} = 0
            </div>
            <div className="flex items-center gap-3">
              <div>
                <label className="text-[10px] text-slate-500 block">b coefficient</label>
                <input
                  type="number"
                  value={b1}
                  onChange={(e) => setB1(Number(e.target.value))}
                  className="w-20 px-2 py-1 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">c constant</label>
                <input
                  type="number"
                  value={c1}
                  onChange={(e) => setC1(Number(e.target.value))}
                  className="w-20 px-2 py-1 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
                />
              </div>
            </div>
            <div className="mt-3 text-xs font-mono text-indigo-600 dark:text-indigo-400">
              Roots of x: <strong>{rootsX ? rootsX.join(', ') : 'None / Complex'}</strong>
            </div>
          </div>

          {/* Eq 2 */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-2">
              Equation II (in y)
            </span>
            <div className="text-sm font-mono text-slate-800 dark:text-slate-200 mb-3">
              y² {b2 >= 0 ? `+ ${b2}` : `− ${Math.abs(b2)}`}y {c2 >= 0 ? `+ ${c2}` : `− ${Math.abs(c2)}`} = 0
            </div>
            <div className="flex items-center gap-3">
              <div>
                <label className="text-[10px] text-slate-500 block">b coefficient</label>
                <input
                  type="number"
                  value={b2}
                  onChange={(e) => setB2(Number(e.target.value))}
                  className="w-20 px-2 py-1 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">c constant</label>
                <input
                  type="number"
                  value={c2}
                  onChange={(e) => setC2(Number(e.target.value))}
                  className="w-20 px-2 py-1 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
                />
              </div>
            </div>
            <div className="mt-3 text-xs font-mono text-teal-600 dark:text-teal-400">
              Roots of y: <strong>{rootsY ? rootsY.join(', ') : 'None / Complex'}</strong>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className={`mt-5 p-4 rounded-xl border flex items-center justify-between ${
          isCND
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
        }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider">Exam Answer Verdict:</span>
            <div className="text-xl font-bold font-mono mt-0.5">{relation}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
