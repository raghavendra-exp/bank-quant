import React, { useState, useMemo } from 'react';
import { 
  Sparkles, ArrowRight, Zap, CheckCircle2, RotateCw, 
  HelpCircle, Calculator, ChevronRight, Layers, Lightbulb,
  ShieldCheck, Eye, Compass
} from 'lucide-react';

export default function VedicMathSuite() {
  // 'urdhva' | 'nikhilam' | 'ekadhikena' | 'anurupyena' | 'vinculum' | 'beejank' | 'paravartya'
  const [activeSutra, setActiveSutra] = useState('urdhva');

  // Urdhva Tiryagbhyam state
  const [urdhvaA, setUrdhvaA] = useState(43);
  const [urdhvaB, setUrdhvaB] = useState(27);

  // Nikhilam state
  const [nikhilamA, setNikhilamA] = useState(96);
  const [nikhilamB, setNikhilamB] = useState(93);
  const [nikhilamBase, setNikhilamBase] = useState(100);

  // Ekadhikena state
  const [ekadhikenaNum, setEkadhikenaNum] = useState(75);
  const [ekadhikenaPairA, setEkadhikenaPairA] = useState(64);
  const [ekadhikenaPairB, setEkadhikenaPairB] = useState(66);

  // Vinculum state
  const [vinculumInput, setVinculumInput] = useState(289);

  // Beejank state
  const [beejankOp, setBeejankOp] = useState('mul'); // 'add', 'sub', 'mul'
  const [beejankA, setBeejankA] = useState(487);
  const [beejankB, setBeejankB] = useState(69);
  const [beejankOptions, setBeejankOptions] = useState(['33603', '33613', '33503', '33605', '33703']);

  // Paravartya state
  const [paravartyaDividend, setParavartyaDividend] = useState(1234);
  const [paravartyaDivisor, setParavartyaDivisor] = useState(89);

  // Helper for Digital Root (Beejank)
  function getBeejank(num) {
    if (!num || isNaN(num)) return 0;
    let n = Math.abs(parseInt(num, 10));
    if (n === 0) return 0;
    return ((n - 1) % 9) + 1;
  }

  // Urdhva 2x2 Calculation Walkthrough
  const urdhvaSteps = useMemo(() => {
    const a = Number(urdhvaA) || 0;
    const b = Number(urdhvaB) || 0;
    const a1 = Math.floor(a / 10);
    const a0 = a % 10;
    const b1 = Math.floor(b / 10);
    const b0 = b % 10;

    // Step 1: Vertical right: a0 * b0
    const step1Prod = a0 * b0;
    const unitDigit = step1Prod % 10;
    const carry1 = Math.floor(step1Prod / 10);

    // Step 2: Cross: (a1 * b0) + (a0 * b1) + carry1
    const crossProd = (a1 * b0) + (a0 * b1);
    const step2Sum = crossProd + carry1;
    const tensDigit = step2Sum % 10;
    const carry2 = Math.floor(step2Sum / 10);

    // Step 3: Vertical left: (a1 * b1) + carry2
    const step3Sum = (a1 * b1) + carry2;

    const finalAnswer = a * b;

    return {
      a, b, a1, a0, b1, b0,
      step1Prod, unitDigit, carry1,
      crossProd, step2Sum, tensDigit, carry2,
      step3Sum, finalAnswer
    };
  }, [urdhvaA, urdhvaB]);

  // Nikhilam Calculation Walkthrough
  const nikhilamSteps = useMemo(() => {
    const a = Number(nikhilamA) || 0;
    const b = Number(nikhilamB) || 0;
    const base = Number(nikhilamBase) || 100;
    const devA = a - base;
    const devB = b - base;

    const crossLeft = a + devB; // same as b + devA
    const rightProd = devA * devB;
    const finalAnswer = a * b;

    const isBothDeficit = devA < 0 && devB < 0;
    const isBothSurplus = devA > 0 && devB > 0;
    const isMixed = (devA > 0 && devB < 0) || (devA < 0 && devB > 0);

    return {
      a, b, base, devA, devB,
      crossLeft, rightProd, finalAnswer,
      isBothDeficit, isBothSurplus, isMixed
    };
  }, [nikhilamA, nikhilamB, nikhilamBase]);

  // Ekadhikena Walkthrough (Squaring ending in 5)
  const ekadhikenaSquareSteps = useMemo(() => {
    const n = Number(ekadhikenaNum) || 0;
    const tens = Math.floor(n / 10);
    const leftPart = tens * (tens + 1);
    const finalSquare = n * n;
    return { n, tens, leftPart, finalSquare };
  }, [ekadhikenaNum]);

  // Ekadhikena Complementary Units Walkthrough (e.g. 64 x 66)
  const ekadhikenaPairSteps = useMemo(() => {
    const a = Number(ekadhikenaPairA) || 0;
    const b = Number(ekadhikenaPairB) || 0;
    const tensA = Math.floor(a / 10);
    const unitsA = a % 10;
    const tensB = Math.floor(b / 10);
    const unitsB = b % 10;

    const isValid = tensA === tensB && (unitsA + unitsB === 10);
    const leftPart = tensA * (tensA + 1);
    const rightPart = unitsA * unitsB;
    const rightFormatted = rightPart < 10 ? `0${rightPart}` : `${rightPart}`;
    const finalAns = a * b;

    return { a, b, tensA, unitsA, tensB, unitsB, isValid, leftPart, rightPart, rightFormatted, finalAns };
  }, [ekadhikenaPairA, ekadhikenaPairB]);

  // Vinculum Walkthrough
  const vinculumSteps = useMemo(() => {
    const n = Number(vinculumInput) || 0;
    const digits = String(n).split('').map(Number);
    // Convert digits > 5 to bar numbers
    // e.g. 289 -> 9 is 10-1 (bar 1, carry 1 to 8 -> 9 -> 10-1 bar 1, carry 1 to 2 -> 3) => 3 1_bar 1_bar
    let carry = 0;
    let vinculumDigits = [];
    for (let i = digits.length - 1; i >= 0; i--) {
      let d = digits[i] + carry;
      if (d > 5) {
        vinculumDigits.unshift(`\\bar{${10 - d}}`);
        carry = 1;
      } else {
        vinculumDigits.unshift(`${d}`);
        carry = 0;
      }
    }
    if (carry > 0) {
      vinculumDigits.unshift(`${carry}`);
    }

    return {
      original: n,
      representation: vinculumDigits.join(' '),
      equivalent: `Normal digits > 5 are converted to negative bar digits so multiplication requires only tables up to 5 with zero carry confusion!`
    };
  }, [vinculumInput]);

  // Beejank Verification
  const beejankResult = useMemo(() => {
    const a = Number(beejankA) || 0;
    const b = Number(beejankB) || 0;
    let expected = 0;
    let opSymbol = '';
    if (beejankOp === 'add') {
      expected = a + b;
      opSymbol = '+';
    } else if (beejankOp === 'sub') {
      expected = a - b;
      opSymbol = '−';
    } else {
      expected = a * b;
      opSymbol = '×';
    }

    const dsA = getBeejank(a);
    const dsB = getBeejank(b);
    let targetDS = 0;
    if (beejankOp === 'add') targetDS = getBeejank(dsA + dsB);
    else if (beejankOp === 'sub') targetDS = getBeejank(dsA - dsB + 9);
    else targetDS = getBeejank(dsA * dsB);

    const verifiedOptions = beejankOptions.map(optStr => {
      const optNum = parseInt(optStr, 10);
      const optDS = getBeejank(optNum);
      const isMatch = optDS === targetDS;
      const isActualAnswer = optNum === expected;
      return { optStr, optNum, optDS, isMatch, isActualAnswer };
    });

    return {
      a, b, expected, opSymbol,
      dsA, dsB, targetDS,
      verifiedOptions
    };
  }, [beejankOp, beejankA, beejankB, beejankOptions]);

  const sutrasList = [
    { id: 'urdhva', name: 'Urdhva Tiryagbhyam', hindi: 'ऊर्ध्व तिर्यग्भ्याम्', subtitle: 'Vertically and Crosswise (Universal Multiplication)' },
    { id: 'nikhilam', name: 'Nikhilam Navatashcaramam', hindi: 'निखिलं नवतश्चरमं दशतः', subtitle: 'All from 9 and Last from 10 (Base Multiplication)' },
    { id: 'ekadhikena', name: 'Ekadhikena Purvena', hindi: 'एकाधिकेन पूर्वेण', subtitle: 'By One More than the Previous (Squares & Ending in 5)' },
    { id: 'anurupyena', name: 'Anurupyena', hindi: 'आनुरूप्येण', subtitle: 'Proportionately (Working / Sub-Base Operations)' },
    { id: 'vinculum', name: 'Vinculum Method', hindi: 'विनकुलम (ऋणांक पद्धति)', subtitle: 'Negative Digits / Zero-Carry Arithmetic' },
    { id: 'beejank', name: 'Beejank / Digital Root', hindi: 'बीजांक (Casting Out 9s)', subtitle: '3-Second Option Elimination in Bank Exams' },
    { id: 'paravartya', name: 'Paravartya Yojayet', hindi: 'परावर्त्य योजयेत्', subtitle: 'Transpose and Apply (High-Speed Mental Division)' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Ancient Vedic Calculation Acceleration Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Vedic Maths Acceleration Suite
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
            Interactive, step-by-step visualizers for all major Vedic Sutras used by banking exam toppers for instant mental calculation and sub-second answer verification.
          </p>
        </div>

        {/* Quick Nav Chips */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-xl">
          {sutrasList.map(s => {
            const isActive = activeSutra === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSutra(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUTRA 1: URDHVA TIRYAGBHYAM (VERTICALLY & CROSSWISE) */}
      {activeSutra === 'urdhva' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                ऊर्ध्व तिर्यग्भ्याम् • Sutra 1
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Urdhva Tiryagbhyam (Vertically and Crosswise)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The universal algorithm for multiplying any 2-digit or 3-digit numbers in a single horizontal line.
              </p>
            </div>

            {/* Input Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Test Numbers:</span>
              <input
                type="number"
                min="10"
                max="99"
                value={urdhvaA}
                onChange={(e) => setUrdhvaA(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-mono font-bold text-xs"
              />
              <span className="font-bold">×</span>
              <input
                type="number"
                min="10"
                max="99"
                value={urdhvaB}
                onChange={(e) => setUrdhvaB(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-mono font-bold text-xs"
              />
              <span className="font-bold">=</span>
              <span className="font-mono font-black text-emerald-600 text-sm">
                {urdhvaSteps.finalAnswer}
              </span>
            </div>
          </div>

          {/* 3 Visual Steps Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Vertical Units */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  Step 1: Vertical Units
                </span>
                <span className="text-xs font-mono font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-sm">
                  ↓ Units
                </span>
              </div>
              <div className="text-center py-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/40 font-mono text-sm">
                <div>{urdhvaSteps.a1} <strong className="text-indigo-600 text-base">{urdhvaSteps.a0}</strong></div>
                <div>{urdhvaSteps.b1} <strong className="text-indigo-600 text-base">{urdhvaSteps.b0}</strong></div>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 font-mono">
                <div>Multiply units: {urdhvaSteps.a0} × {urdhvaSteps.b0} = {urdhvaSteps.step1Prod}</div>
                <div>Write Unit Digit: <strong className="text-emerald-600">{urdhvaSteps.unitDigit}</strong></div>
                <div>Carry Over: <strong>{urdhvaSteps.carry1}</strong></div>
              </div>
            </div>

            {/* Step 2: Crosswise Middle */}
            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                  Step 2: Crosswise & Add
                </span>
                <span className="text-xs font-mono font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-sm">
                  ✕ Cross
                </span>
              </div>
              <div className="text-center py-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900/40 font-mono text-sm">
                <div><strong className="text-purple-600">{urdhvaSteps.a1}</strong> ✕ <strong className="text-purple-600">{urdhvaSteps.a0}</strong></div>
                <div><strong className="text-purple-600">{urdhvaSteps.b1}</strong> ✕ <strong className="text-purple-600">{urdhvaSteps.b0}</strong></div>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 font-mono">
                <div>Cross sum: ({urdhvaSteps.a1}×{urdhvaSteps.b0}) + ({urdhvaSteps.a0}×{urdhvaSteps.b1}) = {urdhvaSteps.crossProd}</div>
                <div>Add Carry ({urdhvaSteps.carry1}): {urdhvaSteps.crossProd} + {urdhvaSteps.carry1} = {urdhvaSteps.step2Sum}</div>
                <div>Write Tens Digit: <strong className="text-emerald-600">{urdhvaSteps.tensDigit}</strong> (Carry {urdhvaSteps.carry2})</div>
              </div>
            </div>

            {/* Step 3: Vertical Left */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Step 3: Vertical Tens
                </span>
                <span className="text-xs font-mono font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-sm">
                  ↓ Tens
                </span>
              </div>
              <div className="text-center py-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-900/40 font-mono text-sm">
                <div><strong className="text-emerald-600 text-base">{urdhvaSteps.a1}</strong> {urdhvaSteps.a0}</div>
                <div><strong className="text-emerald-600 text-base">{urdhvaSteps.b1}</strong> {urdhvaSteps.b0}</div>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 font-mono">
                <div>Multiply tens: {urdhvaSteps.a1} × {urdhvaSteps.b1} = {urdhvaSteps.a1 * urdhvaSteps.b1}</div>
                <div>Add Carry ({urdhvaSteps.carry2}): {urdhvaSteps.a1 * urdhvaSteps.b1} + {urdhvaSteps.carry2} = {urdhvaSteps.step3Sum}</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Final Assembled: {urdhvaSteps.step3Sum}{urdhvaSteps.tensDigit}{urdhvaSteps.unitDigit} = {urdhvaSteps.finalAnswer}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUTRA 2: NIKHILAM (BASE MULTIPLICATION) */}
      {activeSutra === 'nikhilam' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                निखिलं नवतश्चरमं दशतः • Sutra 2
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Nikhilam Navatashcaramam Dashatah (Base Multiplication)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                "All from 9 and last from 10" — Lightning-fast multiplication for numbers near powers of 10 (10, 100, 1000).
              </p>
            </div>

            {/* Inputs & Presets */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={nikhilamA}
                onChange={(e) => setNikhilamA(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-mono font-bold text-xs"
              />
              <span className="font-bold">×</span>
              <input
                type="number"
                value={nikhilamB}
                onChange={(e) => setNikhilamB(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-mono font-bold text-xs"
              />
              <select
                value={nikhilamBase}
                onChange={(e) => setNikhilamBase(Number(e.target.value))}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono font-bold text-xs"
              >
                <option value={100}>Base 100</option>
                <option value={1000}>Base 1000</option>
                <option value={50}>Base 50</option>
                <option value={10}>Base 10</option>
              </select>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
            <span className="text-slate-400 font-semibold">Try Exam Presets:</span>
            {[
              { a: 96, b: 93, base: 100, label: 'Both Below (96 × 93)' },
              { a: 106, b: 108, base: 100, label: 'Both Above (106 × 108)' },
              { a: 108, b: 96, base: 100, label: 'One Above, One Below (108 × 96)' },
              { a: 994, b: 988, base: 1000, label: 'Base 1000 (994 × 988)' }
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setNikhilamA(p.a);
                  setNikhilamB(p.b);
                  setNikhilamBase(p.base);
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold whitespace-nowrap hover:bg-indigo-100"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Visual Deduction Box */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700/60 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Deviation Analysis (Base = {nikhilamSteps.base})
                </span>
                <div className="font-mono text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Number 1: {nikhilamSteps.a}</span>
                    <span className={`font-bold ${nikhilamSteps.devA < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                      Deviation = {nikhilamSteps.devA > 0 ? `+${nikhilamSteps.devA}` : nikhilamSteps.devA}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number 2: {nikhilamSteps.b}</span>
                    <span className={`font-bold ${nikhilamSteps.devB < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                      Deviation = {nikhilamSteps.devB > 0 ? `+${nikhilamSteps.devB}` : nikhilamSteps.devB}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Left & Right Sides
                </span>
                <div className="font-mono text-xs space-y-1 text-slate-700 dark:text-slate-300">
                  <div>
                    <strong>Left Side (Cross-Add):</strong> {nikhilamSteps.a} + ({nikhilamSteps.devB}) = <strong className="text-indigo-600">{nikhilamSteps.crossLeft}</strong>
                  </div>
                  <div>
                    <strong>Right Side (Product of Deviations):</strong> ({nikhilamSteps.devA}) × ({nikhilamSteps.devB}) = <strong className="text-emerald-600">{nikhilamSteps.rightProd}</strong>
                  </div>
                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    Combined Result: {nikhilamSteps.finalAnswer.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUTRA 3: EKADHIKENA PURVENA */}
      {activeSutra === 'ekadhikena' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              एकाधिकेन पूर्वेण • Sutra 3
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Ekadhikena Purvena (By One More than the Previous)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The fastest way to square any number ending in 5, and multiply numbers with identical tens digits whose units sum to 10.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case A: Squaring Numbers Ending in 5 */}
            <div className="p-5 rounded-3xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-200">
                  Case 1: Squaring Ending in 5
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold">Number:</span>
                  <input
                    type="number"
                    step="10"
                    value={ekadhikenaNum}
                    onChange={(e) => setEkadhikenaNum(e.target.value)}
                    className="w-16 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg text-center font-mono font-bold text-xs"
                  />
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 font-mono text-xs space-y-2">
                <div>• Number: {ekadhikenaSquareSteps.n}²</div>
                <div>• Preceding integer (tens): {ekadhikenaSquareSteps.tens}</div>
                <div>• Multiply by one more: {ekadhikenaSquareSteps.tens} × ({ekadhikenaSquareSteps.tens} + 1) = <strong className="text-indigo-600">{ekadhikenaSquareSteps.leftPart}</strong></div>
                <div>• Right side is ALWAYS: <strong className="text-amber-500">25</strong></div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm pt-1 border-t border-slate-100 dark:border-slate-800">
                  ➔ Final Answer: {ekadhikenaSquareSteps.leftPart}25 = {ekadhikenaSquareSteps.finalSquare}
                </div>
              </div>
            </div>

            {/* Case B: Units Sum to 10, Tens Same */}
            <div className="p-5 rounded-3xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  Case 2: Units Sum to 10 (Tens Same)
                </h4>
                <div className="flex items-center gap-1 text-xs">
                  <input
                    type="number"
                    value={ekadhikenaPairA}
                    onChange={(e) => setEkadhikenaPairA(e.target.value)}
                    className="w-14 px-1.5 py-1 bg-white dark:bg-slate-900 rounded-lg text-center font-mono font-bold"
                  />
                  <span>×</span>
                  <input
                    type="number"
                    value={ekadhikenaPairB}
                    onChange={(e) => setEkadhikenaPairB(e.target.value)}
                    className="w-14 px-1.5 py-1 bg-white dark:bg-slate-900 rounded-lg text-center font-mono font-bold"
                  />
                </div>
              </div>

              {ekadhikenaPairSteps.isValid ? (
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 font-mono text-xs space-y-2">
                  <div>• Tens are equal ({ekadhikenaPairSteps.tensA}) and Units ({ekadhikenaPairSteps.unitsA} + {ekadhikenaPairSteps.unitsB} = 10) ✓</div>
                  <div>• Left part: {ekadhikenaPairSteps.tensA} × ({ekadhikenaPairSteps.tensA} + 1) = <strong className="text-indigo-600">{ekadhikenaPairSteps.leftPart}</strong></div>
                  <div>• Right part: {ekadhikenaPairSteps.unitsA} × {ekadhikenaPairSteps.unitsB} = <strong className="text-amber-500">{ekadhikenaPairSteps.rightFormatted}</strong></div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm pt-1 border-t border-slate-100 dark:border-slate-800">
                    ➔ Final Answer: {ekadhikenaPairSteps.leftPart}{ekadhikenaPairSteps.rightFormatted} = {ekadhikenaPairSteps.finalAns}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl text-xs text-amber-700 dark:text-amber-400">
                  ⚠️ Note: Condition not met! Tens must be identical and units must sum to 10. E.g. try 64 × 66 or 83 × 87.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUTRA 4: ANURUPYENA (PROPORTIONATE SUB-BASE) */}
      {activeSutra === 'anurupyena' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              आनुरूप्येण • Sutra 4
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Anurupyena (Proportionately - Sub-Base Method)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Extends Nikhilam base method to any working base (e.g. 50 = 100/2, 200 = 100×2, 250 = 1000/4).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-3xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-3">
              <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-200">
                Example: 46 × 48 (Working Base = 50 = 100 / 2)
              </h4>
              <div className="text-xs font-mono space-y-2 text-slate-700 dark:text-slate-300">
                <div>• Working Base = 50. Deviations: 46 is -4, 48 is -2.</div>
                <div>• Cross-add: 46 + (-2) = 44.</div>
                <div>• <strong>Crucial Sub-base Adjustment:</strong> Since Base 50 = 100 / 2, divide cross-sum by 2: 44 ÷ 2 = <strong className="text-indigo-600">22</strong>.</div>
                <div>• Product of deviations: (-4) × (-2) = <strong className="text-emerald-600">08</strong>.</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                  Combined Answer = 2208!
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-3">
              <h4 className="font-bold text-sm text-purple-900 dark:text-purple-200">
                Example: 196 × 194 (Working Base = 200 = 100 × 2)
              </h4>
              <div className="text-xs font-mono space-y-2 text-slate-700 dark:text-slate-300">
                <div>• Working Base = 200. Deviations: 196 is -4, 194 is -6.</div>
                <div>• Cross-add: 196 + (-6) = 190.</div>
                <div>• <strong>Sub-base Adjustment:</strong> Since Base 200 = 100 × 2, multiply cross-sum by 2: 190 × 2 = <strong className="text-indigo-600">380</strong>.</div>
                <div>• Product of deviations: (-4) × (-6) = <strong className="text-emerald-600">24</strong>.</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                  Combined Answer = 38024!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUTRA 5: VINCULUM METHOD */}
      {activeSutra === 'vinculum' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                विनकुलम (ऋणांक पद्धति) • Sutra 5
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Vinculum Method (Negative Digits / Bar Numbers)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Eliminates numbers with heavy digits (6, 7, 8, 9) by converting them into smaller bar numbers with zero carries.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Test Number:</span>
              <input
                type="number"
                value={vinculumInput}
                onChange={(e) => setVinculumInput(e.target.value)}
                className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-mono font-bold text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-3">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                Vinculum Transformation
              </span>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-2">
                <div>Original Number: <strong className="text-slate-900 dark:text-white">{vinculumSteps.original}</strong></div>
                <div>Vinculum Form: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{vinculumSteps.representation}</strong></div>
                <p className="text-slate-500 text-[11px] leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                  {vinculumSteps.equivalent}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-3">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                Why Toppers Use Vinculum in Banking Exams
              </span>
              <div className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Zero Mental Overload:</strong> You only ever need tables of 1, 2, 3, 4, 5.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Division Ease:</strong> When dividing by numbers ending in 8 or 9 (like 79, 89, 99), convert to $8\bar{1}, 9\bar{1}, 10\bar{1}$.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Subtraction Abolition:</strong> Subtraction becomes direct addition of bar digits.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUTRA 6: BEEJANK (DIGITAL ROOT 3-SEC ELIMINATOR) */}
      {activeSutra === 'beejank' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                बीजांक (Digital Root) • Sutra 6
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Beejank 3-Second Option Eliminator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The single most powerful trick in Bank Clerk & PO Prelims: verify equations and eliminate 4 out of 5 options in 3 seconds!
              </p>
            </div>

            {/* Inputs */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={beejankA}
                onChange={(e) => setBeejankA(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-mono font-bold text-xs"
              />
              <select
                value={beejankOp}
                onChange={(e) => setBeejankOp(e.target.value)}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono font-bold text-xs"
              >
                <option value="mul">×</option>
                <option value="add">+</option>
                <option value="sub">−</option>
              </select>
              <input
                type="number"
                value={beejankB}
                onChange={(e) => setBeejankB(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-mono font-bold text-xs"
              />
            </div>
          </div>

          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 text-xs font-mono space-y-1">
            <div className="flex justify-between items-center">
              <span>LHS Beejank: DS({beejankResult.a}) = <strong>{beejankResult.dsA}</strong>, DS({beejankResult.b}) = <strong>{beejankResult.dsB}</strong></span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                Target Beejank = {beejankResult.targetDS}
              </span>
            </div>
            <div className="text-slate-500">
              Only the option whose digit sum equals <strong>{beejankResult.targetDS}</strong> can be mathematically correct!
            </div>
          </div>

          {/* Options Elimination Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {beejankResult.verifiedOptions.map((opt, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  opt.isMatch
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-sm'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 opacity-60'
                }`}
              >
                <span className="text-[10px] font-mono block opacity-70">
                  Option {String.fromCharCode(65 + i)}
                </span>
                <span className="text-base font-mono font-black block my-1">
                  {opt.optStr}
                </span>
                <span className={`text-[11px] font-bold block ${
                  opt.isMatch ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                }`}>
                  DS = {opt.optDS} {opt.isMatch ? '✓ MATCH' : '✗ ELIMINATED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUTRA 7: PARAVARTYA YOJAYET */}
      {activeSutra === 'paravartya' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              परावर्त्य योजयेत् • Sutra 7
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Paravartya Yojayet (Transpose and Apply - Mental Division)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rapid mental division where the divisor's deviation from base is transposed (inverted) to convert division into addition.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-3">
            <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-200">
              Division by Divisors Near 100 (e.g. ÷ 89 or ÷ 112)
            </h4>
            <div className="text-xs font-mono space-y-2 text-slate-700 dark:text-slate-300">
              <div>• Divisor: 89 (Base 100, Deficit = -11).</div>
              <div>• <strong>Transpose Rule:</strong> Invert deficit: -11 becomes <strong className="text-indigo-600">+11</strong>.</div>
              <div>• Now perform synthetic addition with +11 instead of tedious multi-digit long division.</div>
              <div>• Result: Quotient and Remainder drop down directly in 5 seconds with zero scrap paper!</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
