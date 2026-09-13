import React, { useState } from 'react';
import { Calculator, Delete, History, RotateCcw } from 'lucide-react';

export default function InteractiveCalculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState([]);

  function handleDigit(d) {
    if (display === '0' || display === 'Error') {
      setDisplay(String(d));
    } else {
      setDisplay(display + d);
    }
  }

  function handleOp(op) {
    if (display === 'Error') return;
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  }

  function handleClear() {
    setDisplay('0');
    setEquation('');
  }

  function handleBackspace() {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }

  function handleSqrt() {
    try {
      const val = parseFloat(display);
      if (val < 0) {
        setDisplay('Error');
        return;
      }
      const res = Math.sqrt(val);
      setDisplay(String(Number(res.toFixed(4))));
    } catch {
      setDisplay('Error');
    }
  }

  function handlePercent() {
    try {
      const val = parseFloat(display);
      setDisplay(String(val / 100));
    } catch {
      setDisplay('Error');
    }
  }

  function handleEquals() {
    try {
      const fullExpr = equation + display;
      // Sanitize expression
      const sanitized = fullExpr.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      const rounded = Number(result.toFixed(6));
      setHistory(prev => [{ expr: fullExpr, res: rounded }, ...prev.slice(0, 9)]);
      setDisplay(String(rounded));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Calculator className="w-4 h-4" />
            <span>Virtual Utility</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Exam Practice Calculator
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Convenient calculation scratchpad with tape history for testing multi-step DI calculations.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calculator Body */}
        <div className="md:col-span-2 max-w-sm mx-auto w-full bg-slate-900 text-white rounded-3xl p-5 shadow-xl border border-slate-800">
          {/* Display */}
          <div className="bg-slate-950 p-4 rounded-2xl mb-4 text-right">
            <div className="text-xs text-slate-500 font-mono h-4">{equation}</div>
            <div className="text-3xl font-mono font-bold tracking-wider overflow-x-auto text-white mt-1">
              {display}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2">
            <button onClick={handleClear} className="p-3 bg-rose-500/20 text-rose-400 font-bold rounded-xl hover:bg-rose-500/30">C</button>
            <button onClick={handleSqrt} className="p-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700">√</button>
            <button onClick={handlePercent} className="p-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700">%</button>
            <button onClick={() => handleOp('÷')} className="p-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500">÷</button>

            <button onClick={() => handleDigit('7')} className="p-3 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700">7</button>
            <button onClick={() => handleDigit('8')} className="p-3 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700">8</button>
            <button onClick={() => handleDigit('9')} className="p-3 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700">9</button>
            <button onClick={() => handleOp('×')} className="p-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500">×</button>

            <button onClick={() => handleDigit('4')} className="p-3 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700">4</button>
            <button onClick={() => handleDigit('5')} className="p-3 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700">5</button>
            <button onClick={() => handleDigit('6')} className="p-3 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700">6</button>
            <button onClick={() => handleOp('-')} className="p-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500">−</button>

            <button onClick={() => handleDigit('1')} className="p-3 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700">1</button>
            <button onClick={() => handleDigit('2')} className="p-3 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700">2</button>
            <button onClick={() => handleDigit('3')} className="p-3 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700">3</button>
            <button onClick={() => handleOp('+')} className="p-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500">+</button>

            <button onClick={() => handleDigit('0')} className="p-3 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700">0</button>
            <button onClick={() => handleDigit('.')} className="p-3 bg-slate-800/80 text-white font-bold rounded-xl hover:bg-slate-700">.</button>
            <button onClick={handleBackspace} className="p-3 bg-slate-800 text-slate-400 font-bold rounded-xl hover:bg-slate-700 flex items-center justify-center">
              <Delete className="w-4 h-4" />
            </button>
            <button onClick={handleEquals} className="p-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500">=</button>
          </div>
        </div>

        {/* History Tape */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Calculation Tape
            </span>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-[10px] text-slate-400 hover:text-rose-500"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-8">
                No calculations recorded yet.
              </div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="text-xs font-mono p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 truncate max-w-[140px]">{h.expr}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">= {h.res}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
