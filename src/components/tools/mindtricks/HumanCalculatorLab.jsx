import React, { useState } from 'react';
import { 
  Calculator, CheckCircle2, AlertTriangle, ArrowRight, Zap, RefreshCw, 
  ShieldCheck, HelpCircle, Layers, Split, Sparkles, Hash, Play
} from 'lucide-react';

export default function HumanCalculatorLab({ initialSimulator = 'dsVerifier' }) {
  const [activeTab, setActiveTab] = useState(initialSimulator);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Interactive Mental Calculation Sandbox</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Human Calculator Simulation Lab
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Interactive, step-by-step algorithms replicating the mental processes of the 27 calculation geniuses.
          </p>
        </div>

        {/* Simulator Switcher Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-full overflow-x-auto">
          {[
            { id: 'dsVerifier', label: 'DS & DD Dual Verifier' },
            { id: 'stemCalculator', label: 'Stem Base Multiplier' },
            { id: 'complements', label: 'Instant Complements' },
            { id: 'utCalculator', label: 'UT Pair Products' },
            { id: 'flagPoleStepper', label: 'Flag & Pole Division' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator 1: Dual DS & DD Verifier */}
      {activeTab === 'dsVerifier' && <DualVerifierTool />}

      {/* Simulator 2: Stem Multiplier */}
      {activeTab === 'stemCalculator' && <StemMethodTool />}

      {/* Simulator 3: Instant Complements */}
      {activeTab === 'complements' && <ComplementsTool />}

      {/* Simulator 4: UT Method Calculator */}
      {activeTab === 'utCalculator' && <UTMethodTool />}

      {/* Simulator 5: Flag & Pole Stepper */}
      {activeTab === 'flagPoleStepper' && <FlagPoleTool />}
    </div>
  );
}

// -------------------------------------------------------------
// 1. DUAL DS & DD VERIFIER TOOL
// -------------------------------------------------------------
function DualVerifierTool() {
  const presets = [
    { label: "Book Ex: 93 × 11 = 1023", num1: "93", op: "×", num2: "11", ans: "1023" },
    { label: "Book Ex: 23 - 17 = 6", num1: "23", op: "-", num2: "17", ans: "6" },
    { label: "Book Ex: 16.1 ÷ 7 = 2.3", num1: "16.1", op: "÷", num2: "7", ans: "2.3" },
    { label: "Book Ex: 51 ÷ 12 = 4.25", num1: "51", op: "÷", num2: "12", ans: "4.25" },
    { label: "Decimal Error Trap: 51 ÷ 12 = 42.5 (DD catches!)", num1: "51", op: "÷", num2: "12", ans: "42.5" },
    { label: "Swap Error Trap: 16 × 14 = 242 (DS misses, DD catches!)", num1: "16", op: "×", num2: "14", ans: "242" }
  ];

  const [num1, setNum1] = useState("93");
  const [op, setOp] = useState("×");
  const [num2, setNum2] = useState("11");
  const [claimedAns, setClaimedAns] = useState("1023");

  // Helper: Digit Sum (DS)
  function calcDigitSum(valStr) {
    const clean = valStr.replace(/[^0-9]/g, '');
    if (!clean) return 0;
    let sum = 0;
    for (let char of clean) {
      sum += parseInt(char, 10);
    }
    while (sum > 9) {
      let nextSum = 0;
      for (let digit of sum.toString()) {
        nextSum += parseInt(digit, 10);
      }
      sum = nextSum;
    }
    return sum === 9 ? 9 : sum; // 9 is typically 9 or 0
  }

  // Helper: Digit Difference (DD)
  // Step 1: Start counting from 1st digit LEFT of decimal as odd (pos 1), next left is even (pos 2)...
  // Digits to right of decimal: 1st is even, 2nd is odd!
  function calcDigitDiff(valStr) {
    const parts = valStr.split('.');
    const intPart = parts[0] ? parts[0].replace(/[^0-9]/g, '') : '';
    const fracPart = parts[1] ? parts[1].replace(/[^0-9]/g, '') : '';

    let oddSum = 0;
    let evenSum = 0;
    let oddDigits = [];
    let evenDigits = [];

    // Integer part from right to left
    // position 1 (odd), 2 (even), 3 (odd)...
    for (let i = 0; i < intPart.length; i++) {
      const digit = parseInt(intPart[intPart.length - 1 - i], 10);
      if (i % 2 === 0) {
        oddSum += digit;
        oddDigits.push(digit);
      } else {
        evenSum += digit;
        evenDigits.push(digit);
      }
    }

    // Fractional part from left to right
    // position 1 (even), 2 (odd), 3 (even)...
    for (let i = 0; i < fracPart.length; i++) {
      const digit = parseInt(fracPart[i], 10);
      if (i % 2 === 0) {
        evenSum += digit;
        evenDigits.push(digit);
      } else {
        oddSum += digit;
        oddDigits.push(digit);
      }
    }

    let diff = oddSum - evenSum;
    let adjusted = diff;
    while (adjusted < 0) {
      adjusted += 11;
    }
    while (adjusted >= 11) {
      adjusted -= 11;
    }

    return {
      oddSum,
      evenSum,
      oddDigits,
      evenDigits,
      rawDiff: diff,
      finalDD: adjusted
    };
  }

  // Computations
  const ds1 = calcDigitSum(num1);
  const ds2 = calcDigitSum(num2);
  const dsAns = calcDigitSum(claimedAns);

  let dsExpected = 0;
  let dsSteps = [];

  if (op === '+') {
    dsExpected = (ds1 + ds2);
    while (dsExpected > 9) dsExpected = (dsExpected % 10) + Math.floor(dsExpected / 10);
    dsSteps.push(`DS(${num1}) = ${ds1}, DS(${num2}) = ${ds2}`);
    dsSteps.push(`Sum of DS = ${ds1} + ${ds2} = ${ds1 + ds2} -> ${dsExpected}`);
    dsSteps.push(`DS of Answer (${claimedAns}) = ${dsAns}`);
  } else if (op === '-') {
    let raw = ds1 - ds2;
    dsExpected = raw;
    if (dsExpected < 0) dsExpected += 9;
    dsSteps.push(`DS(${num1}) = ${ds1}, DS(${num2}) = ${ds2}`);
    dsSteps.push(`Diff of DS = ${ds1} - ${ds2} = ${raw} ${raw < 0 ? '(Negative! Add 9 -> ' + dsExpected + ')' : ''}`);
    dsSteps.push(`DS of Answer (${claimedAns}) = ${dsAns}`);
  } else if (op === '×') {
    dsExpected = ds1 * ds2;
    while (dsExpected > 9) dsExpected = (dsExpected % 10) + Math.floor(dsExpected / 10);
    dsSteps.push(`DS(${num1}) = ${ds1}, DS(${num2}) = ${ds2}`);
    dsSteps.push(`Product of DS = ${ds1} × ${ds2} = ${ds1 * ds2} -> ${dsExpected}`);
    dsSteps.push(`DS of Answer (${claimedAns}) = ${dsAns}`);
  } else if (op === '÷') {
    // Check: Dividend = Quotient * Divisor
    // num1 = claimedAns * num2
    const checkProduct = (dsAns * ds2);
    let redCheck = checkProduct;
    while (redCheck > 9) redCheck = (redCheck % 10) + Math.floor(redCheck / 10);
    dsExpected = redCheck;
    dsSteps.push(`Rewrite as: ${num1} = ${claimedAns} × ${num2}`);
    dsSteps.push(`DS(Dividend ${num1}) = ${ds1}`);
    dsSteps.push(`DS(Quotient × Divisor) = ${dsAns} × ${ds2} = ${checkProduct} -> ${redCheck}`);
  }

  const dsMatch = (op === '÷') ? (ds1 === dsExpected) : (dsExpected === dsAns);

  // DD Analysis
  const dd1 = calcDigitDiff(num1);
  const dd2 = calcDigitDiff(num2);
  const ddAns = calcDigitDiff(claimedAns);

  let ddExpected = 0;
  let ddSteps = [];

  if (op === '+') {
    let raw = dd1.finalDD + dd2.finalDD;
    ddExpected = raw >= 11 ? raw - 11 : raw;
    ddSteps.push(`DD(${num1}) = ${dd1.finalDD}, DD(${num2}) = ${dd2.finalDD}`);
    ddSteps.push(`Sum of DD = ${dd1.finalDD} + ${dd2.finalDD} = ${raw} -> ${ddExpected}`);
    ddSteps.push(`DD of Answer (${claimedAns}) = ${ddAns.finalDD}`);
  } else if (op === '-') {
    let raw = dd1.finalDD - dd2.finalDD;
    let adj = raw;
    if (adj < 0) adj += 11;
    ddExpected = adj;
    ddSteps.push(`DD(${num1}) = ${dd1.finalDD}, DD(${num2}) = ${dd2.finalDD}`);
    ddSteps.push(`Diff = ${dd1.finalDD} - ${dd2.finalDD} = ${raw} ${raw < 0 ? '(Add 11 -> ' + adj + ')' : ''}`);
    ddSteps.push(`DD of Answer (${claimedAns}) = ${ddAns.finalDD}`);
  } else if (op === '×') {
    let raw = dd1.finalDD * dd2.finalDD;
    let adj = raw;
    while (adj >= 11) adj = calcDigitDiff(adj.toString()).finalDD;
    ddExpected = adj;
    ddSteps.push(`DD(${num1}) = ${dd1.finalDD}, DD(${num2}) = ${dd2.finalDD}`);
    ddSteps.push(`Product of DD = ${dd1.finalDD} × ${dd2.finalDD} = ${raw} -> ${adj}`);
    ddSteps.push(`DD of Answer (${claimedAns}) = ${ddAns.finalDD}`);
  } else if (op === '÷') {
    let raw = ddAns.finalDD * dd2.finalDD;
    let adj = raw;
    while (adj >= 11) adj = calcDigitDiff(adj.toString()).finalDD;
    ddExpected = adj;
    ddSteps.push(`Rewrite as: ${num1} = ${claimedAns} × ${num2}`);
    ddSteps.push(`DD(Dividend ${num1}) = ${dd1.finalDD}`);
    ddSteps.push(`DD(Quotient × Divisor) = ${ddAns.finalDD} × ${dd2.finalDD} = ${raw} -> ${adj}`);
  }

  const ddMatch = (op === '÷') ? (dd1.finalDD === ddExpected) : (ddExpected === ddAns.finalDD);

  // Exact float check
  const actualVal = op === '+' ? parseFloat(num1) + parseFloat(num2) :
                    op === '-' ? parseFloat(num1) - parseFloat(num2) :
                    op === '×' ? parseFloat(num1) * parseFloat(num2) :
                    parseFloat(num1) / parseFloat(num2);
  const claimedVal = parseFloat(claimedAns);
  const isMathematicallyCorrect = Math.abs(actualVal - claimedVal) < 0.0001;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      {/* Presets */}
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Load Book Example / Trap Case:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setNum1(p.num1);
                setOp(p.op);
                setNum2(p.num2);
                setClaimedAns(p.ans);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
        <div className="col-span-1 sm:col-span-1 space-y-1">
          <label className="text-xs font-bold text-slate-500">First Number</label>
          <input
            type="text"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold text-slate-900 dark:text-white"
          />
        </div>

        <div className="col-span-1 sm:col-span-1 space-y-1">
          <label className="text-xs font-bold text-slate-500">Operator</label>
          <select
            value={op}
            onChange={(e) => setOp(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white"
          >
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>
        </div>

        <div className="col-span-1 sm:col-span-1 space-y-1">
          <label className="text-xs font-bold text-slate-500">Second Number</label>
          <input
            type="text"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold text-slate-900 dark:text-white"
          />
        </div>

        <div className="col-span-1 sm:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-500">Claimed Answer to Test</label>
          <input
            type="text"
            value={claimedAns}
            onChange={(e) => setClaimedAns(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Dual Verdict Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isMathematicallyCorrect
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
          : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
      }`}>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 font-bold text-sm">
            {isMathematicallyCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>True Calculation: {num1} {op} {num2} = {claimedAns}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Incorrect Answer! Actual Value: {Number.isInteger(actualVal) ? actualVal : actualVal.toFixed(4)}</span>
              </>
            )}
          </div>
          <p className="text-xs opacity-80">
            DS Verdict: {dsMatch ? 'PASSED' : 'FLAGGED ERROR'} • DD Verdict: {ddMatch ? 'PASSED' : 'FLAGGED ERROR'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isMathematicallyCorrect && dsMatch && !ddMatch && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 animate-pulse">
              ⚡ DD Caught Transposition / Decimal Error! (DS Blind Spot)
            </span>
          )}
        </div>
      </div>

      {/* Side by Side: DS Engine vs DD Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DS Engine Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Chapter 2: DS Method (Casting 9s)</span>
            </h4>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
              dsMatch ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}>
              {dsMatch ? 'Matches' : 'Mismatch'}
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs text-slate-700 dark:text-slate-300">
            {dsSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">›</span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-500">
            Rule: Decimals ignored, 9s cast out. If subtraction negative, add 9.
          </div>
        </div>

        {/* DD Engine Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Chapter 3: DD Method (Casting 11s)</span>
            </h4>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
              ddMatch ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}>
              {ddMatch ? 'Matches' : 'Mismatch'}
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs text-slate-700 dark:text-slate-300">
            {ddSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">›</span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-500">
            Rule: Odd place sum - Even place sum. If negative, add 11. Catches transposed digits and decimal shifts.
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. STEM METHOD TOOL (BASE MULTIPLICATION)
// -------------------------------------------------------------
function StemMethodTool() {
  const [num1, setNum1] = useState(97);
  const [num2, setNum2] = useState(93);
  const [stem, setStem] = useState(100);

  const presets = [
    { label: "97 × 93 (Stem 100)", a: 97, b: 93, s: 100 },
    { label: "108 × 96 (Stem 100)", a: 108, b: 96, s: 100 },
    { label: "22 × 24 (Stem 20)", a: 22, b: 24, s: 20 },
    { label: "78 × 42 (Stem 50)", a: 78, b: 42, s: 50 },
    { label: "88 × 68 (Stem 100)", a: 88, b: 68, s: 100 },
    { label: "9 × 7 (Stem 10)", a: 9, b: 7, s: 10 }
  ];

  const d1 = num1 - stem;
  const d2 = num2 - stem;
  const crossAdd = num1 + d2; // equals num2 + d1
  const stemScaled = crossAdd * stem;
  const deviationProduct = d1 * d2;
  const finalAnswer = stemScaled + deviationProduct;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Load Preset from Chapter 10:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setNum1(p.a);
                setNum2(p.b);
                setStem(p.s);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all border border-slate-200/60 dark:border-slate-700/60"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">Multiplicand</label>
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">Multiplier</label>
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">Stem Number</label>
          <select
            value={stem}
            onChange={(e) => setStem(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white"
          >
            <option value={10}>Stem 10</option>
            <option value={20}>Stem 20</option>
            <option value={30}>Stem 30</option>
            <option value={40}>Stem 40</option>
            <option value={50}>Stem 50</option>
            <option value={100}>Stem 100</option>
            <option value={200}>Stem 200</option>
            <option value={1000}>Stem 1000</option>
          </select>
        </div>
      </div>

      {/* Visual Calculation Layout (Diagram from Book) */}
      <div className="p-6 rounded-2xl bg-slate-950 text-white font-mono border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between text-xs text-amber-400 font-sans font-bold border-b border-slate-800 pb-2">
          <span>Stem Method Visual Diagram</span>
          <span>Chosen Base: {stem}</span>
        </div>

        {/* Stem Cross Layout */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm py-2">
          <div className="text-right space-y-1">
            <div className="text-slate-400">Number</div>
            <div className="text-lg font-bold text-white">{num1}</div>
            <div className="text-lg font-bold text-white">{num2}</div>
          </div>
          <div className="text-left space-y-1 border-l border-slate-800 pl-4">
            <div className="text-slate-400">Deviation (N - {stem})</div>
            <div className={`text-lg font-bold ${d1 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {d1 >= 0 ? `+${d1}` : d1}
            </div>
            <div className={`text-lg font-bold ${d2 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {d2 >= 0 ? `+${d2}` : d2}
            </div>
          </div>
        </div>

        {/* Step-by-Step Walkthrough */}
        <div className="space-y-2 text-xs pt-3 border-t border-slate-800">
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">Step 1:</span>
            <span>Cross Addition: {num1} + ({d2}) = {crossAdd} (Matches {num2} + ({d1}) = {num2 + d1})</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">Step 2:</span>
            <span>Multiply by Stem: {crossAdd} × {stem} = <strong className="text-amber-400">{stemScaled}</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">Step 3:</span>
            <span>Multiply Deviations: ({d1}) × ({d2}) = <strong className="text-emerald-400">{deviationProduct >= 0 ? `+${deviationProduct}` : deviationProduct}</strong></span>
          </div>
          <div className="flex items-start gap-2 pt-2 border-t border-slate-800/80 text-sm">
            <span className="text-emerald-400 font-bold">Step 4:</span>
            <span>Final Answer: {stemScaled} {deviationProduct >= 0 ? '+' : ''} {deviationProduct} = <strong className="text-xl text-emerald-400 font-black">{finalAnswer}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. INSTANT COMPLEMENTS TOOL ("All from 9, last from 10")
// -------------------------------------------------------------
function ComplementsTool() {
  const [inputVal, setInputVal] = useState("4529");
  const presets = ["4529", "84791", "7423", "892", "27", "3898", "4998", "49898"];

  // Compute complement to next power of 10
  const clean = inputVal.replace(/[^0-9]/g, '');
  const digits = clean.split('').map(d => parseInt(d, 10));
  const numDigits = digits.length;
  const powerOf10 = Math.pow(10, numDigits);

  // All from 9, last from 10
  const complementDigits = digits.map((d, i) => {
    if (i === digits.length - 1) {
      return 10 - d;
    }
    return 9 - d;
  });
  const complementNum = parseInt(complementDigits.join(''), 10) || 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Load Book Rounding Examples:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => setInputVal(p)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 font-medium transition-all text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-xs space-y-1">
        <label className="text-xs font-bold text-slate-500">Enter Any Integer:</label>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-lg font-black text-slate-900 dark:text-white"
        />
      </div>

      {/* Visual Column Complement Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-950 text-white font-mono border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between text-xs text-amber-400 font-sans font-bold border-b border-slate-800 pb-2">
          <span>"All From 9, Last From 10" Rule Engine</span>
          <span>Target Base: {powerOf10.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-center gap-3 py-4 text-center">
          {digits.map((d, i) => {
            const isLast = i === digits.length - 1;
            const target = isLast ? 10 : 9;
            const diff = complementDigits[i];
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-indigo-400 font-sans">
                  From {target}
                </span>
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-white">
                  {d}
                </div>
                <span className="text-xs text-slate-500">↓</span>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl font-bold text-emerald-400">
                  {diff}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-sans text-slate-300 space-y-1">
          <div className="font-bold text-white text-sm">
            Instant Complement = {complementNum.toLocaleString()}
          </div>
          <p>
            Equation: {powerOf10.toLocaleString()} - {clean} = <strong>{complementNum}</strong>.
          </p>
          <p className="text-amber-400 text-[11px]">
            In mental subtraction ($53,441 - 49,898$), round $49,898$ to $50,000$, subtract ($3441$), then <strong>ADD</strong> the complement $102$ to get $3,543$ without any mental borrowing!
          </p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. UT METHOD PAIR PRODUCT CALCULATOR
// -------------------------------------------------------------
function UTMethodTool() {
  const [multiplicand, setMultiplicand] = useState("4312");
  const [multiplier, setMultiplier] = useState("42");

  const presets = [
    { m1: "4312", m2: "4", label: "4312 × 4 (1-digit)" },
    { m1: "4312", m2: "42", label: "4312 × 42 (2-digit)" },
    { m1: "9238", m2: "84", label: "9238 × 84" },
    { m1: "5743", m2: "63", label: "5743 × 63" }
  ];

  // U and T definitions
  function getUT(d, m) {
    const prod = d * m;
    const u = prod % 10;
    const t = Math.floor(prod / 10);
    return { u, t, prod, str: prod < 10 ? `0${prod}` : `${prod}` };
  }

  const m1Clean = multiplicand.replace(/[^0-9]/g, '');
  const m2Clean = multiplier.replace(/[^0-9]/g, '');
  const m1Num = parseInt(m1Clean, 10) || 0;
  const m2Num = parseInt(m2Clean, 10) || 0;
  const product = m1Num * m2Num;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Load Book Example from Chapter 15:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setMultiplicand(p.m1);
                setMultiplier(p.m2);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 font-medium transition-all text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">Multiplicand</label>
          <input
            type="text"
            value={multiplicand}
            onChange={(e) => setMultiplicand(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-base font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">Multiplier (1 or 2 Digits)</label>
          <input
            type="text"
            value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-base font-bold text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Explanatory Board */}
      <div className="p-6 rounded-2xl bg-slate-950 text-white font-mono border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between text-xs text-amber-400 font-sans font-bold border-b border-slate-800 pb-2">
          <span>UT Pair Product Architecture</span>
          <span>Target: {m1Num} × {m2Num}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-sans text-slate-300">
          <p>
            <strong>Core Concept:</strong> For single-digit product, left digit is <strong>T (Tens)</strong> and right is <strong>U (Units)</strong>.
            For pair of digits $(L, R)$ and multiplier $M$:
            <code className="block mt-1 text-emerald-400 font-mono">
              Pair Product = U(L × M) + T(R × M)
            </code>
          </p>
        </div>

        {/* Pair Products demo for 1st multiplier digit */}
        <div className="space-y-2 text-xs">
          <div className="text-indigo-400 font-bold font-sans">
            Digit Products for Multiplier: {m2Clean}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {m1Clean.split('').map((dStr, idx) => {
              const d = parseInt(dStr, 10);
              const m = parseInt(m2Clean[m2Clean.length - 1], 10) || 1;
              const { u, t, str } = getUT(d, m);
              return (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Digit {d} × {m}</span>
                  <span className="text-amber-400 font-bold text-sm block">{str}</span>
                  <span className="text-[10px] text-slate-400">T: <b className="text-white">{t}</b>, U: <b className="text-emerald-400">{u}</b></span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Final Calculated Result:</span>
          <span className="text-2xl font-black text-emerald-400">
            {product.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. FLAG & POLE DIVISION STEPPER (DHVAJANKA)
// -------------------------------------------------------------
function FlagPoleTool() {
  const presets = [
    { label: "5578 ÷ 31 (Pole 3, Flag 1)", dividend: "5578", divisor: "31" },
    { label: "601324 ÷ 73 (Pole 7, Flag 3)", dividend: "601324", divisor: "73" },
    { label: "2829 ÷ 123 -> 943 ÷ 41 (Pole 4, Flag 1)", dividend: "943", divisor: "41" }
  ];

  const [dividend, setDividend] = useState("5578");
  const [divisor, setDivisor] = useState("31");

  const pole = parseInt(divisor[0], 10) || 1;
  const flag = parseInt(divisor.slice(1), 10) || 0;

  // Real accurate division result
  const actualResult = (parseFloat(dividend) / parseFloat(divisor)) || 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Load Flag & Pole Presets from Chapter 17:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setDividend(p.dividend);
                setDivisor(p.divisor);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 font-medium transition-all text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">Dividend</label>
          <input
            type="text"
            value={dividend}
            onChange={(e) => setDividend(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-base font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">Divisor (2-digit)</label>
          <input
            type="text"
            value={divisor}
            onChange={(e) => setDivisor(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-base font-bold text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Flag Pole Stepper Board */}
      <div className="p-6 rounded-2xl bg-slate-950 text-white font-mono border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between text-xs text-amber-400 font-sans font-bold border-b border-slate-800 pb-2">
          <span>Flag & Pole Notation: {pole}<sup>{flag}</sup> | {dividend}</span>
          <span>Pole: {pole} • Flag: {flag}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">Pole (Main Divisor)</span>
            <span className="text-2xl font-black text-indigo-400">{pole}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">Flag (Subtrahend Multiplier)</span>
            <span className="text-2xl font-black text-amber-400">{flag}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">Exact Value</span>
            <span className="text-xl font-black text-emerald-400">
              {actualResult.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 5-Step Algorithm Walkthrough */}
        <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
          <div className="text-indigo-300 font-bold font-sans">Execution Sequence:</div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 space-y-1 font-sans">
            <div>1. Divide current prefix by Pole <strong>{pole}</strong> to generate next quotient digit + remainder.</div>
            <div>2. Attach remainder as prefix to next dividend digit.</div>
            <div>3. Corrected number = Attached remainder - (Last quotient digit × Flag <strong>{flag}</strong>).</div>
            <div className="text-amber-300 font-medium">⚠️ <strong>Step 3b Adjustment:</strong> If subtraction results in negative, reduce last quotient digit by 1, add Pole {pole} to remainder, re-attach, and repeat!</div>
            <div>4. Divide corrected number by Pole {pole} to get next answer digit.</div>
            <div>5. Insert decimal point when crossing the separator line!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
