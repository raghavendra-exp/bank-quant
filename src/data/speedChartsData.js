// Master Speed Charts Data: Tables 1-100, Squares 1-100, Cubes 1-100, and Memory Pegs
// Grounded in M. Tyra, Rajesh Verma, Shantanu Shukla, Sumit Sir, and Vedic Mathematics

export const SPEED_CHARTS_DATA = {
  // SQUARES 1 to 100 with exact mental shortcut, method name, and explanation
  squares: Array.from({ length: 100 }, (_, i) => {
    const n = i + 1;
    const sq = n * n;
    let method = 'Base Memory (1-25)';
    let rule = 'Direct Recall';
    let steps = `${n}² = ${sq}`;
    let category = '1-25';

    if (n === 1) {
      steps = '1² = 1';
    } else if (n <= 25) {
      category = '1-25';
      method = 'Core 25 Anchor';
      rule = 'Memorize by reflex: foundational anchor for all squares up to 100!';
      if (n % 5 === 0) {
        steps = `${n} ending in 5: ${n / 10 | 0} × ${(n / 10 | 0) + 1} | 25 = ${sq}`;
      } else {
        steps = `Direct memory benchmark: ${n}² = ${sq}`;
      }
    } else if (n % 10 === 5) {
      category = 'ending-5';
      const tens = Math.floor(n / 10);
      method = 'Ekadhikena Purvena (Ending in 5)';
      rule = 'Multiply tens digit (N) by next integer (N+1), then append 25.';
      steps = `${n}² → Step 1: ${tens} × ${tens + 1} = ${tens * (tens + 1)}. Step 2: Append 25 → ${sq}`;
    } else if (n > 25 && n <= 50) {
      category = '26-50';
      const d = 50 - n;
      method = 'Base 50 Deficit Method';
      rule = `(50 - d)² = (25 - d) × 100 + d²`;
      const basePart = 25 - d;
      const dSq = d * d;
      const dSqFormatted = dSq < 10 ? `0${dSq}` : `${dSq}`;
      steps = `${n} = 50 - ${d} → Left: (25 - ${d}) = ${basePart}, Right: ${d}² = ${dSqFormatted} → Combine: ${sq}`;
    } else if (n > 50 && n <= 75) {
      category = '51-75';
      const d = n - 50;
      method = 'Base 50 Surplus Method';
      rule = `(50 + d)² = (25 + d) × 100 + d²`;
      const basePart = 25 + d;
      const dSq = d * d;
      const dSqFormatted = dSq < 10 ? `0${dSq}` : `${dSq}`;
      steps = `${n} = 50 + ${d} → Left: (25 + ${d}) = ${basePart}, Right: ${d}² = ${dSqFormatted} → Combine: ${sq}`;
    } else if (n > 75 && n <= 100) {
      category = '76-100';
      const d = 100 - n;
      method = 'Base 100 Deficit Method';
      rule = `(100 - d)² = (100 - 2d) × 100 + d² = (N - d) | d²`;
      const leftPart = n - d;
      const dSq = d * d;
      const dSqFormatted = dSq < 10 ? `0${dSq}` : `${dSq}`;
      steps = `${n} = 100 - ${d} → Left: (${n} - ${d}) = ${leftPart}, Right: ${d}² = ${dSqFormatted} → Combine: ${sq}`;
    }

    const lastTwo = sq % 100;
    const lastTwoStr = lastTwo < 10 ? `0${lastTwo}` : `${lastTwo}`;

    return {
      n,
      square: sq,
      category,
      method,
      rule,
      steps,
      lastDigit: sq % 10,
      lastTwoDigits: lastTwoStr,
      digitalRoot: ((sq - 1) % 9) + 1
    };
  }),

  // CUBES 1 to 100 with unit digit rules, ratio method, and digital roots
  cubes: Array.from({ length: 100 }, (_, i) => {
    const n = i + 1;
    const cb = n * n * n;
    const lastDigit = cb % 10;
    
    // Unit digit rule:
    // 0->0, 1->1, 4->4, 5->5, 6->6, 9->9 (invariants)
    // 2->8, 8->2, 3->7, 7->3 (complements of 10)
    let unitDigitRule = 'Self-Preserving (Identity)';
    if ([2, 8, 3, 7].includes(n % 10)) {
      unitDigitRule = `Complement of 10 (${n % 10} ↔ ${10 - (n % 10)})`;
    }

    // 4-column ratio method breakdown:
    // (a + b)³ = a³ | 3a²b | 3ab² | b³
    const tens = Math.floor(n / 10);
    const units = n % 10;
    let ratioBreakdown = '';
    if (n >= 10) {
      const c1 = tens * tens * tens;
      const c2 = tens * tens * units;
      const c3 = tens * units * units;
      const c4 = units * units * units;
      ratioBreakdown = `Ratio method for ${n}: Columns = [${c1}, ${c2}, ${c3}, ${c4}]. Double middle: [${2 * c2}, ${2 * c3}]. Add with column carries → ${cb.toLocaleString('en-IN')}`;
    } else {
      ratioBreakdown = `Single-digit cube: ${n}³ = ${cb}`;
    }

    return {
      n,
      cube: cb,
      formattedCube: cb.toLocaleString('en-IN'),
      lastDigit,
      unitDigitRule,
      ratioBreakdown,
      digitalRoot: ((cb - 1) % 9) + 1,
      orderOfMagnitude: cb >= 100000 ? '6-Digit' : cb >= 10000 ? '5-Digit' : cb >= 1000 ? '4-Digit' : cb >= 100 ? '3-Digit' : '1-2 Digit'
    };
  }),

  // Multiplication Table Helpers: Split & Merge formula generator
  getMentalMultiplicationSplit(a, b) {
    // Calculates rapid mental split for a x b
    // e.g. 87 x 8 = 80 x 8 + 7 x 8 = 640 + 56 = 696
    const tens = Math.floor(a / 10) * 10;
    const units = a % 10;
    const prod = a * b;

    const split1 = tens * b;
    const split2 = units * b;

    // Alternative base 100 or nearest 10
    const nextTen = Math.ceil(a / 10) * 10;
    const deficit = nextTen - a;
    let altSplit = null;
    if (deficit <= 3 && a > 10) {
      altSplit = {
        base: nextTen,
        deficit,
        step1: `${nextTen} × ${b} = ${nextTen * b}`,
        step2: `${deficit} × ${b} = ${deficit * b}`,
        step3: `${nextTen * b} − ${deficit * b} = ${prod}`
      };
    }

    return {
      a,
      b,
      product: prod,
      standardSplit: {
        tens,
        units,
        step1: `${tens} × ${b} = ${split1}`,
        step2: `${units} × ${b} = ${split2}`,
        step3: `${split1} + ${split2} = ${prod}`
      },
      altSplit
    };
  },

  // 2-Second Perfect Cube Root Extractor (Up to 1,000,000)
  extractCubeRoot(perfectCube) {
    if (!perfectCube || perfectCube < 1 || perfectCube > 1000000) {
      return { valid: false, message: 'Please enter a valid perfect cube between 1 and 1,000,000.' };
    }

    const cube = Number(perfectCube);
    const lastDigit = cube % 10;

    // Unit digit determination
    const unitMap = { 0: 0, 1: 1, 2: 8, 3: 7, 4: 4, 5: 5, 6: 6, 7: 3, 8: 2, 9: 9 };
    const rootUnits = unitMap[lastDigit];

    // Strike off last 3 digits
    const prefix = Math.floor(cube / 1000);
    let rootTens = 0;

    if (prefix === 0) {
      rootTens = 0;
    } else {
      // Find largest integer whose cube <= prefix
      for (let t = 1; t <= 10; t++) {
        if (t * t * t <= prefix) {
          rootTens = t;
        } else {
          break;
        }
      }
    }

    const calculatedRoot = rootTens * 10 + rootUnits;
    const isExact = calculatedRoot * calculatedRoot * calculatedRoot === cube;

    return {
      valid: true,
      cube,
      isExact,
      root: calculatedRoot,
      step1: `Look at the last digit: '${lastDigit}'. By unit digit cyclicity, the cube root MUST end in '${rootUnits}' (${[2,8,3,7].includes(lastDigit) ? '10-complement' : 'identity digit'}).`,
      step2: `Strike off the last three digits (${String(cube).slice(-3)}). Remaining prefix = ${prefix === 0 ? '0 (none)' : prefix}.`,
      step3: prefix === 0 
        ? `No prefix left. Root is single digit: ${rootUnits}.`
        : `Find largest integer whose cube ≤ ${prefix}: Since ${rootTens}³ = ${rootTens * rootTens * rootTens} ≤ ${prefix} < ${(rootTens + 1)}³ = ${(rootTens + 1) * (rootTens + 1) * (rootTens + 1)}, tens digit = ${rootTens}.`,
      conclusion: `Combine Tens (${rootTens}) and Units (${rootUnits}) → Cube Root = ${calculatedRoot}!`
    };
  },

  // Legendary Memory Pegs & Mugup Hacks
  memoryHacks: [
    {
      title: "The 'Learn Only 25, Master All 100' Symmetry Law",
      category: "Squares",
      badge: "Topper Secret",
      principle: "Every number in the range (50 ± x) and (100 ± x) produces the EXACT same last two digits as x²!",
      explanation: "You do not need to memorize 100 separate numbers. Once you know squares from 1 to 25, the last two digits of ANY square up to 100 are automatically fixed by symmetry around 50 and 100.",
      examples: [
        { diff: "x = 1", pair1: "49² (50 - 1) = 2401", pair2: "51² (50 + 1) = 2601", pair3: "99² (100 - 1) = 9801", note: "All end in 01 (1²)" },
        { diff: "x = 6", pair1: "44² (50 - 6) = 1936", pair2: "56² (50 + 6) = 3136", pair3: "94² (100 - 6) = 8836", note: "All end in 36 (6²)" },
        { diff: "x = 12", pair1: "38² (50 - 12) = 1444", pair2: "62² (50 + 12) = 3844", pair3: "88² (100 - 12) = 7744", note: "All end in 44 (12² = 144)" },
        { diff: "x = 24", pair1: "26² (50 - 24) = 676", pair2: "74² (50 + 24) = 5476", pair3: "76² (100 - 24) = 5776", note: "All end in 76 (24² = 576)" }
      ]
    },
    {
      title: "Base 50 Mental Formula: 25 ± Deviation",
      category: "Squares",
      badge: "Sub-Second Speed",
      principle: "For any number near 50: Left part = 25 ± d, Right part = d² (2 digits).",
      explanation: "Take 47: d = 50 - 47 = 3. Left = 25 - 3 = 22. Right = 3² = 09 → 2209 in 1 second! Take 58: d = 58 - 50 = 8. Left = 25 + 8 = 33. Right = 8² = 64 → 3364.",
      examples: [
        { diff: "41²", pair1: "50 - 9", pair2: "(25 - 9) | 9²", pair3: "16 | 81 = 1681", note: "1 second calculation" },
        { diff: "63²", pair1: "50 + 13", pair2: "(25 + 13) + 1 carry | 69", pair3: "38 + 1 | 69 = 3969", note: "13² = 169 (carry 1)" }
      ]
    },
    {
      title: "Base 100 Mental Formula: Number ± Deviation",
      category: "Squares",
      badge: "Sub-Second Speed",
      principle: "For any number near 100: Left part = N - d, Right part = d² (2 digits).",
      explanation: "Take 96: d = 100 - 96 = 4. Left = 96 - 4 = 92. Right = 4² = 16 → 9216. Take 107: d = +7. Left = 107 + 7 = 114. Right = 7² = 49 → 11449.",
      examples: [
        { diff: "93²", pair1: "100 - 7", pair2: "(93 - 7) | 7²", pair3: "86 | 49 = 8649", note: "Zero pen-paper required" },
        { diff: "88²", pair1: "100 - 12", pair2: "(88 - 12) + 1 carry | 44", pair3: "76 + 1 | 44 = 7744", note: "12² = 144 (carry 1)" }
      ]
    },
    {
      title: "Cube Last Digit Invariance & Swapping Rule",
      category: "Cubes",
      badge: "Instant Elimination",
      principle: "6 digits keep their EXACT unit digit when cubed: 0, 1, 4, 5, 6, 9. Exactly 4 digits swap with their 10-complement: 2 ↔ 8 and 3 ↔ 7.",
      explanation: "When you see the last digit of any cube in a bank exam, you know its root's unit digit with 100% certainty in 0.1 seconds.",
      examples: [
        { diff: "Ends in 7?", pair1: "Cube root MUST end in 3", pair2: "3³ = 27", pair3: "13³ = 2197", note: "7 swaps with 3" },
        { diff: "Ends in 8?", pair1: "Cube root MUST end in 2", pair2: "2³ = 8", pair3: "12³ = 1728", note: "8 swaps with 2" },
        { diff: "Ends in 4?", pair1: "Cube root MUST end in 4", pair2: "4³ = 64", pair3: "14³ = 2744", note: "Identity digit" }
      ]
    },
    {
      title: "Multiplication Table Mugup: The Split & Merge Rule",
      category: "Tables",
      badge: "Mental Reflex",
      principle: "Never recite tables right-to-left. Break the 2-digit number into Tens + Units, multiply from Left-to-Right.",
      explanation: "To calculate 78 × 7: see it as (70 × 7) + (8 × 7) = 490 + 56 = 546. Or using nearest base 80: (80 × 7) - (2 × 7) = 560 - 14 = 546.",
      examples: [
        { diff: "67 × 8", pair1: "(60 × 8) = 480", pair2: "(7 × 8) = 56", pair3: "480 + 56 = 536", note: "Done in 2 seconds" },
        { diff: "98 × 9", pair1: "(100 × 9) = 900", pair2: "(2 × 9) = 18", pair3: "900 - 18 = 882", note: "Base subtraction method" }
      ]
    },
    {
      title: "High-Frequency Banking Exam Benchmark Pegs",
      category: "Benchmarks",
      badge: "Must Mug Up",
      principle: "These exact squares and cubes appear in 80% of banking simplification and number series questions:",
      explanation: "Commit these exact numbers to muscle memory for immediate pattern recognition in missing/wrong number series:",
      examples: [
        { diff: "Squares Pegs", pair1: "17² = 289", pair2: "19² = 361", pair3: "23² = 529", note: "Prime squares" },
        { diff: "Squares Pegs", pair1: "27² = 729", pair2: "28² = 784", pair3: "29² = 841", note: "High-confusion trio" },
        { diff: "Special Bridge", pair1: "729 = 27² = 9³", pair2: "4096 = 64² = 16³", pair3: "1024 = 32² = 2¹⁰", note: "Dual square-cube bridges" },
        { diff: "Cubes Pegs", pair1: "11³ = 1331", pair2: "12³ = 1728", pair3: "13³ = 2197", note: "Most frequent in Series" },
        { diff: "Cubes Pegs", pair1: "17³ = 4913", pair2: "19³ = 6859", pair3: "21³ = 9261", note: "Mains exam interest benchmarks" }
      ]
    }
  ]
};
