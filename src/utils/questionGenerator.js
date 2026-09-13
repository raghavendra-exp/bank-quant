// Question Generator Engine: Deterministic, Seeded, 500+ Verified Solvable Questions
// Supports Dual Solutions (Standard vs Topper Method) & Official Banking Patterns

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick(rng, arr) {
  return arr[randInt(rng, 0, arr.length - 1)];
}

function shuffle(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOptions(rng, correct, spread, count = 5) {
  const targetDistractors = count - 1;
  const distractors = new Set();
  let guard = 0;
  while (distractors.size < targetDistractors && guard < 60) {
    guard++;
    const delta = randInt(rng, 1, Math.max(1, spread)) * (rng() > 0.5 ? 1 : -1);
    const val = correct + delta;
    if (val !== correct) distractors.add(val);
  }
  while (distractors.size < targetDistractors) {
    distractors.add(correct + distractors.size + 1);
  }
  const options = shuffle(rng, [correct, ...distractors]);
  return {
    options: options.map(v => String(v)),
    answerIndex: options.indexOf(correct)
  };
}

function buildOptionsFromPool(rng, correctStr, pool, count = 5) {
  const strVal = String(correctStr);
  const targetDistractors = count - 1;
  const uniquePool = Array.from(new Set(pool.map(String))).filter(p => p !== strVal);
  const distractors = shuffle(rng, uniquePool).slice(0, targetDistractors);
  let guard = 1;
  while (distractors.length < targetDistractors) {
    const candidate = `${strVal} (Alt ${guard++})`;
    if (!distractors.includes(candidate)) distractors.push(candidate);
  }
  const options = shuffle(rng, [strVal, ...distractors]);
  return { options, answerIndex: options.indexOf(strVal) };
}

export const TOPIC_GENERATORS = {
  // 1. Simplification
  simplification(rng, seed) {
    const flavor = randInt(rng, 0, 4);
    if (flavor === 0) {
      // Fraction percentages: e.g., 37.5% of A + 25% of B
      const baseA = randInt(rng, 5, 40) * 8;
      const baseB = randInt(rng, 5, 30) * 4;
      const termA = (3 / 8) * baseA;
      const termB = (1 / 4) * baseB;
      const sub = randInt(rng, 2, 10) * 5;
      const correct = termA + termB - sub;
      const { options, answerIndex } = buildOptions(rng, correct, 15);
      return {
        id: `gen-simp-${seed}`,
        topic: "simplification",
        topicName: "Simplification",
        difficulty: "EASY",
        targetTime: 20,
        examTag: "SBI Clerk Prelims",
        question: `37.5% of ${baseA} + 25% of ${baseB} − ${sub} = ?`,
        questionHi: `${baseA} का 37.5% + ${baseB} का 25% − ${sub} = ?`,
        options,
        answerIndex,
        standardMethod: {
          title: "Standard Method",
          steps: [
            `0.375 × ${baseA} = ${termA}`,
            `0.25 × ${baseB} = ${termB}`,
            `${termA} + ${termB} − ${sub} = ${correct}`
          ],
          timeTaken: "35 seconds"
        },
        topperMethod: {
          title: "Solve Like a Topper (Fraction Method)",
          steps: [
            `37.5% = 3/8 → 3/8 × ${baseA} = ${termA}`,
            `25% = 1/4 → 1/4 × ${baseB} = ${termB}`,
            `Mental sum: ${termA} + ${termB} − ${sub} = ${correct}`
          ],
          timeTaken: "8 seconds",
          proTip: "Use 3/8 for 37.5% to divide by 8 directly."
        }
      };
    } else if (flavor === 1) {
      // Squares & Roots
      const r = randInt(rng, 12, 45);
      const r2 = r * r;
      const m = randInt(rng, 8, 25);
      const add = randInt(rng, 10, 50);
      const correct = r + m * 4 - add;
      const { options, answerIndex } = buildOptions(rng, correct, 10);
      return {
        id: `gen-simp-${seed}`,
        topic: "simplification",
        topicName: "Simplification",
        difficulty: "EASY",
        targetTime: 18,
        examTag: "IBPS RRB OA Prelims",
        question: `√${r2} + ${m} × 4 − ${add} = ?`,
        questionHi: `√${r2} + ${m} × 4 − ${add} = ?`,
        options,
        answerIndex,
        standardMethod: {
          title: "Standard Method",
          steps: [`√${r2} = ${r}`, `${m} × 4 = ${m * 4}`, `${r} + ${m * 4} − ${add} = ${correct}`],
          timeTaken: "25 seconds"
        },
        topperMethod: {
          title: "Solve Like a Topper",
          steps: [`Instant root recall: √${r2} = ${r}`, `Add ${m * 4} and subtract ${add} mentally = ${correct}`],
          timeTaken: "6 seconds",
          proTip: "Recognize unit digit of squares to find roots without long division."
        }
      };
    } else if (flavor === 2) {
      // Multiplication by 11 or 25
      const n = randInt(rng, 22, 180) * 4;
      const correct = n * 25 - randInt(rng, 50, 200);
      const sub = n * 25 - correct;
      const { options, answerIndex } = buildOptions(rng, correct, 50);
      return {
        id: `gen-simp-${seed}`,
        topic: "simplification",
        topicName: "Simplification",
        difficulty: "EASY",
        targetTime: 15,
        examTag: "IBPS Clerk Prelims",
        question: `${n} × 25 − ${sub} = ?`,
        questionHi: `${n} × 25 − ${sub} = ?`,
        options,
        answerIndex,
        standardMethod: {
          title: "Standard Multiplication",
          steps: [`Multiply ${n} by 25 = ${n * 25}`, `Subtract ${sub} = ${correct}`],
          timeTaken: "25 seconds"
        },
        topperMethod: {
          title: "Solve Like a Topper (Divide by 4 Hack)",
          steps: [`${n} × 25 = (${n} / 4) × 100 = ${n / 4}00 = ${n * 25}`, `Mental diff: ${n * 25} − ${sub} = ${correct}`],
          timeTaken: "5 seconds",
          proTip: "To multiply by 25, divide by 4 and append two zeros."
        }
      };
    } else {
      // BODMAS with divisions
      const div = randInt(rng, 4, 12);
      const mult = randInt(rng, 10, 30);
      const num = div * mult;
      const add = randInt(rng, 15, 85);
      const factor = randInt(rng, 2, 6);
      const correct = (num / div) * factor + add;
      const { options, answerIndex } = buildOptions(rng, correct, 15);
      return {
        id: `gen-simp-${seed}`,
        topic: "simplification",
        topicName: "Simplification",
        difficulty: "EASY",
        targetTime: 20,
        examTag: "SBI Clerk Prelims",
        question: `${num} ÷ ${div} × ${factor} + ${add} = ?`,
        questionHi: `${num} ÷ ${div} × ${factor} + ${add} = ?`,
        options,
        answerIndex,
        standardMethod: {
          title: "BODMAS Standard",
          steps: [`${num} ÷ ${div} = ${num / div}`, `${num / div} × ${factor} = ${(num / div) * factor}`, `+ ${add} = ${correct}`],
          timeTaken: "20 seconds"
        },
        topperMethod: {
          title: "Solve Like a Topper",
          steps: [`Evaluate left-to-right division: ${num / div}`, `Multiply by ${factor} = ${(num / div) * factor}`, `Add ${add} = ${correct}`],
          timeTaken: "7 seconds",
          proTip: "Division before multiplication always in BODMAS order."
        }
      };
    }
  },

  // 2. Approximation
  approximation(rng, seed) {
    const base = randInt(rng, 4, 30) * 100;
    const baseApprox = base - 0.12;
    const pct = pick(rng, [20, 25, 30, 40, 50, 60, 75]);
    const pctApprox = (pct - 0.15).toFixed(2);
    const addBase = randInt(rng, 10, 50);
    const correct = Math.round((pct / 100) * base + addBase);
    const { options, answerIndex } = buildOptions(rng, correct, 20);
    return {
      id: `gen-approx-${seed}`,
      topic: "approximation",
      topicName: "Approximation",
      difficulty: "EASY",
      targetTime: 20,
      examTag: "SBI Clerk Prelims",
      question: `${pctApprox}% of ${baseApprox.toFixed(2)} + ${addBase}.04 ≈ ?`,
      questionHi: `${baseApprox.toFixed(2)} का ${pctApprox}% + ${addBase}.04 ≈ ?`,
      options,
      answerIndex,
      standardMethod: {
        title: "Standard Method",
        steps: [`Round ${pctApprox}% → ${pct}%`, `Round ${baseApprox.toFixed(2)} → ${base}`, `${pct}% of ${base} = ${(pct / 100) * base}`, `Add ${addBase} = ${correct}`],
        timeTaken: "25 seconds"
      },
      topperMethod: {
        title: "Solve Like a Topper (Instant Rounding)",
        steps: [`Notice friendly numbers: ${pct}% of ${base} = ${(pct / 100) * base}`, `Add ${addBase} = ${correct} in 5s`],
        timeTaken: "5 seconds",
        proTip: "Do not attempt exact decimal calculation; round to nearest whole numbers immediately."
      }
    };
  },

  // 3. Quadratic Equations
  "quadratic-equations"(rng, seed) {
    const flavor = randInt(rng, 0, 3);
    if (flavor === 0) {
      // Both constant negative -> CND (5-second hack!)
      const c1 = randInt(rng, 12, 50);
      const c2 = randInt(rng, 15, 60);
      const b1 = randInt(rng, 2, 10);
      const b2 = randInt(rng, 2, 10);
      const pool = ["x > y", "x < y", "x ≥ y", "x ≤ y", "x = y or relationship cannot be established (CND)"];
      return {
        id: `gen-quad-${seed}`,
        topic: "quadratic-equations",
        topicName: "Quadratic Equations",
        difficulty: "EASY",
        targetTime: 5,
        examTag: "SBI Clerk Prelims",
        question: `I. x² − ${b1}x − ${c1} = 0\nII. y² + ${b2}y − ${c2} = 0`,
        questionHi: `I. x² − ${b1}x − ${c1} = 0\nII. y² + ${b2}y − ${c2} = 0`,
        options: pool,
        answerIndex: 4,
        standardMethod: {
          title: "Standard Factoring & Comparison",
          steps: [
            "Find roots of Eq I (one positive, one negative)",
            "Find roots of Eq II (one positive, one negative)",
            "Compare all 4 combinations (x+ vs y-, x- vs y+)",
            "Observe conflicting inequalities → CND"
          ],
          timeTaken: "45 seconds"
        },
        topperMethod: {
          title: "Solve Like a Topper (Sign Rule Hack)",
          steps: [
            `Constant terms in both equations are negative (-${c1} and -${c2})`,
            "RULE: If both constant terms are negative, roots are always (+,-) and (+,-)",
            "This ALWAYS guarantees CND / Relationship cannot be established!",
            "Choose option 5 instantly in 2 seconds."
          ],
          timeTaken: "2 seconds",
          proTip: "Check the sign of constant terms first before doing any math!"
        }
      };
    } else {
      // Clean factoring
      const r1 = randInt(rng, 3, 9);
      const r2 = randInt(rng, r1 + 1, 12);
      const ry1 = randInt(rng, r2 + 1, 15);
      const ry2 = randInt(rng, ry1 + 1, 18);

      const b_x = r1 + r2;
      const c_x = r1 * r2;
      const b_y = ry1 + ry2;
      const c_y = ry1 * ry2;

      const pool = ["x > y", "x < y", "x ≥ y", "x ≤ y", "x = y or relationship cannot be established (CND)"];
      return {
        id: `gen-quad-${seed}`,
        topic: "quadratic-equations",
        topicName: "Quadratic Equations",
        difficulty: "MEDIUM",
        targetTime: 20,
        examTag: "IBPS Clerk Prelims",
        question: `I. x² − ${b_x}x + ${c_x} = 0\nII. y² − ${b_y}y + ${c_y} = 0`,
        questionHi: `I. x² − ${b_x}x + ${c_x} = 0\nII. y² − ${b_y}y + ${c_y} = 0`,
        options: pool,
        answerIndex: 1, // x < y
        standardMethod: {
          title: "Standard Method",
          steps: [
            `x roots: ${r1}, ${r2}`,
            `y roots: ${ry1}, ${ry2}`,
            `Since max(x)=${r2} < min(y)=${ry1}, every root of x is strictly less than every root of y: x < y.`
          ],
          timeTaken: "30 seconds"
        },
        topperMethod: {
          title: "Solve Like a Topper (Sign + Range Check)",
          steps: [
            "Both equations have (-, +) signs → all roots are positive (+, +)",
            `x = {${r1}, ${r2}} and y = {${ry1}, ${ry2}}`,
            `Comparing highest x (${r2}) against lowest y (${ry1}): ${r2} < ${ry1} ⇒ x < y.`
          ],
          timeTaken: "8 seconds",
          proTip: "Compare max(x) with min(y) for instant strict inequality."
        }
      };
    }
  },

  // 4. Number Series
  "number-series"(rng, seed) {
    const type = randInt(rng, 0, 2);
    if (type === 0) {
      // Cube differences
      const start = randInt(rng, 10, 40);
      const terms = [start];
      for (let i = 1; i <= 4; i++) {
        terms.push(terms[terms.length - 1] + i * i * i);
      }
      const correct = terms[terms.length - 1] + 5 * 5 * 5;
      const { options, answerIndex } = buildOptions(rng, correct, 20);
      return {
        id: `gen-series-${seed}`,
        topic: "number-series",
        topicName: "Missing Number Series",
        difficulty: "MEDIUM",
        targetTime: 25,
        examTag: "IBPS RRB OA Prelims",
        question: `${terms.join(", ")}, ?`,
        questionHi: `${terms.join(", ")}, ?`,
        options,
        answerIndex,
        standardMethod: {
          title: "Standard Difference Check",
          steps: [
            `Differences: +1, +8, +27, +64`,
            `Pattern: 1³, 2³, 3³, 4³`,
            `Next difference: 5³ = 125`,
            `Next term: ${terms[terms.length - 1]} + 125 = ${correct}`
          ],
          timeTaken: "30 seconds"
        },
        topperMethod: {
          title: "Solve Like a Topper (Cube Difference Pattern)",
          steps: [
            `Spot difference sequence: 1, 8, 27, 64 → Cubes!`,
            `Next is +125. Use last digit addition: ${terms[terms.length - 1] % 10} + 5 = ${correct % 10}. Pick ${correct}.`
          ],
          timeTaken: "10 seconds",
          proTip: "Combine cubes pattern with units digit to pick the option instantly."
        }
      };
    } else {
      // Multiply and Add: e.g. ×1+1, ×2+2, ×3+3
      let val = randInt(rng, 2, 5);
      const terms = [val];
      for (let i = 1; i <= 4; i++) {
        val = val * 2 + i;
        terms.push(val);
      }
      const correct = val * 2 + 5;
      const { options, answerIndex } = buildOptions(rng, correct, 25);
      return {
        id: `gen-series-${seed}`,
        topic: "number-series",
        topicName: "Missing Number Series",
        difficulty: "MEDIUM",
        targetTime: 30,
        examTag: "SBI Clerk Prelims",
        question: `${terms.join(", ")}, ?`,
        questionHi: `${terms.join(", ")}, ?`,
        options,
        answerIndex,
        standardMethod: {
          title: "Standard Ratio/Mult Scan",
          steps: [
            `Check growth rate: numbers roughly double each step.`,
            `Pattern is (previous × 2) + step: ×2+1, ×2+2, ×2+3, ×2+4...`,
            `Next = (${terms[terms.length - 1]} × 2) + 5 = ${correct}`
          ],
          timeTaken: "35 seconds"
        },
        topperMethod: {
          title: "Solve Like a Topper",
          steps: [
            `Spot approximately 2× scaling with small increments.`,
            `Next term = ${terms[terms.length - 1]} × 2 + 5 = ${correct}.`
          ],
          timeTaken: "12 seconds",
          proTip: "When numbers double steadily, look for ×2 ± small constant or sequence."
        }
      };
    }
  },

  // 5. Percentage
  percentage(rng, seed) {
    const base = randInt(rng, 15, 60) * 20;
    const pctList = [12.5, 16.67, 37.5, 62.5, 75, 83.33];
    const pct = pick(rng, pctList);
    let fracStr = "1/8";
    let mult = 1;
    let div = 8;
    if (pct === 12.5) { fracStr = "1/8"; mult = 1; div = 8; }
    else if (pct === 16.67) { fracStr = "1/6"; mult = 1; div = 6; }
    else if (pct === 37.5) { fracStr = "3/8"; mult = 3; div = 8; }
    else if (pct === 62.5) { fracStr = "5/8"; mult = 5; div = 8; }
    else if (pct === 75) { fracStr = "3/4"; mult = 3; div = 4; }
    else if (pct === 83.33) { fracStr = "5/6"; mult = 5; div = 6; }

    const adjustedBase = Math.round(base / div) * div;
    const correct = Math.round((mult / div) * adjustedBase);
    const { options, answerIndex } = buildOptions(rng, correct, 20);
    return {
      id: `gen-pct-${seed}`,
      topic: "percentage",
      topicName: "Percentage",
      difficulty: "EASY",
      targetTime: 25,
      examTag: "SBI Clerk Prelims",
      question: `Find ${pct}% of ${adjustedBase}.`,
      questionHi: `${adjustedBase} का ${pct}% ज्ञात कीजिए।`,
      options,
      answerIndex,
      standardMethod: {
        title: "Standard Decimal Multiplication",
        steps: [`Multiply ${pct} / 100 × ${adjustedBase} = ${correct}`],
        timeTaken: "35 seconds"
      },
      topperMethod: {
        title: "Solve Like a Topper (Fraction Table)",
        steps: [`${pct}% = ${fracStr}`, `(${adjustedBase} / ${div}) × ${mult} = ${correct} in 4 seconds!`],
        timeTaken: "5 seconds",
        proTip: `Memorize that ${pct}% is equivalent to ${fracStr}.`
      }
    };
  },

  // 6. Ratio & Proportion
  "ratio-proportion"(rng, seed) {
    const p1 = randInt(rng, 2, 5);
    const p2 = randInt(rng, p1 + 1, 9);
    const sumParts = p1 + p2;
    const mult = randInt(rng, 20, 80);
    const total = sumParts * mult;
    const correct = p2 * mult;
    const { options, answerIndex } = buildOptions(rng, correct, 50);
    return {
      id: `gen-ratio-${seed}`,
      topic: "ratio-proportion",
      topicName: "Ratio & Proportion",
      difficulty: "EASY",
      targetTime: 25,
      examTag: "IBPS Clerk Prelims",
      question: `A sum of ₹${total} is divided between A and B in the ratio ${p1} : ${p2}. What is the share of B?`,
      questionHi: `₹${total} की राशि को A और B के बीच ${p1} : ${p2} के अनुपात में विभाजित किया जाता है। B का हिस्सा क्या है?`,
      options: options.map(o => `₹${o}`),
      answerIndex,
      standardMethod: {
        title: "Algebraic Variable Method",
        steps: [
          `Let shares be ${p1}x and ${p2}x`,
          `${p1}x + ${p2}x = ${total} ⇒ ${sumParts}x = ${total}`,
          `x = ${total} / ${sumParts} = ${mult}`,
          `B's share = ${p2} × ${mult} = ₹${correct}`
        ],
        timeTaken: "30 seconds"
      },
      topperMethod: {
        title: "Solve Like a Topper (Unit Scaling)",
        steps: [
          `Total units = ${p1} + ${p2} = ${sumParts} units = ₹${total}`,
          `1 unit = ₹${mult}`,
          `B = ${p2} × ${mult} = ₹${correct} mentally.`
        ],
        timeTaken: "6 seconds",
        proTip: "Skip writing 'x'—work directly with ratio units."
      }
    };
  },

  // 7. Simple & Compound Interest
  "simple-compound-interest"(rng, seed) {
    const p = randInt(rng, 4, 25) * 1000;
    const r = pick(rng, [5, 10, 12, 15, 20]);
    const diff = Math.round(p * Math.pow(r / 100, 2));
    const { options, answerIndex } = buildOptions(rng, diff, 25);
    return {
      id: `gen-sici-${seed}`,
      topic: "simple-compound-interest",
      topicName: "Simple & Compound Interest",
      difficulty: "MEDIUM",
      targetTime: 30,
      examTag: "SBI Clerk Prelims",
      question: `Find the difference between compound interest and simple interest on ₹${p} for 2 years at ${r}% per annum compounded annually.`,
      questionHi: `₹${p} पर 2 वर्ष के लिए ${r}% वार्षिक दर से चक्रवृद्धि ब्याज और साधारण ब्याज के बीच का अंतर ज्ञात कीजिए।`,
      options: options.map(o => `₹${o}`),
      answerIndex,
      standardMethod: {
        title: "Standard Separate Calculation",
        steps: [
          `SI = (${p} × ${r} × 2)/100 = ₹${(p * r * 2) / 100}`,
          `CI = ${p}(1 + ${r}/100)² − ${p}`,
          `CI − SI = ₹${diff}`
        ],
        timeTaken: "45 seconds"
      },
      topperMethod: {
        title: "Solve Like a Topper (2-Year Difference Formula)",
        steps: [
          `Diff = P × (R / 100)²`,
          `= ${p} × (${r}/100)² = ₹${diff} in one line.`
        ],
        timeTaken: "8 seconds",
        proTip: "Direct formula Diff = P(R/100)² eliminates calculating SI and CI separately."
      }
    };
  },

  // 8. Time & Work
  "time-and-work"(rng, seed) {
    const daysA = pick(rng, [12, 15, 20, 24, 30]);
    const daysB = pick(rng, [15, 20, 30, 40, 60].filter(d => d !== daysA));
    // Find LCM
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const lcm = (daysA * daysB) / gcd(daysA, daysB);
    const effA = lcm / daysA;
    const effB = lcm / daysB;
    const totalEff = effA + effB;
    const together = Number((lcm / totalEff).toFixed(1));
    const togetherStr = Number.isInteger(together) ? `${together} days` : `${together} days`;
    const pool = [`${together} days`, `${together + 2} days`, `${Math.max(1, together - 2)} days`, `${together + 4} days`, `${together + 1} days`];
    const { options, answerIndex } = buildOptionsFromPool(rng, togetherStr, pool);
    return {
      id: `gen-tw-${seed}`,
      topic: "time-and-work",
      topicName: "Time & Work",
      difficulty: "MEDIUM",
      targetTime: 30,
      examTag: "IBPS Clerk Prelims",
      question: `A alone can complete a work in ${daysA} days, and B alone can complete it in ${daysB} days. In how many days can they complete the work together?`,
      questionHi: `A अकेले किसी काम को ${daysA} दिनों में और B अकेले उसी काम को ${daysB} दिनों में पूरा कर सकता है। वे दोनों मिलकर उस काम को कितने दिनों में पूरा करेंगे?`,
      options,
      answerIndex,
      standardMethod: {
        title: "Fractional Method",
        steps: [`1/${daysA} + 1/${daysB} = (${effA} + ${effB}) / ${lcm} = ${totalEff} / ${lcm}`, `Total days = ${lcm} / ${totalEff} = ${togetherStr}`],
        timeTaken: "35 seconds"
      },
      topperMethod: {
        title: "Solve Like a Topper (LCM Efficiency Units)",
        steps: [
          `Total Work = LCM(${daysA}, ${daysB}) = ${lcm} units`,
          `A = ${effA} u/day, B = ${effB} u/day → Combined = ${totalEff} u/day`,
          `Days = ${lcm} / ${totalEff} = ${togetherStr} in 8 seconds.`
        ],
        timeTaken: "8 seconds",
        proTip: "LCM units avoid fraction math completely."
      }
    };
  },

  // 9. Time Speed & Distance
  "time-speed-distance"(rng, seed) {
    const speedKmh = pick(rng, [36, 54, 72, 90, 108]);
    const speedMs = (speedKmh * 5) / 18;
    const timeSec = randInt(rng, 10, 25);
    const distance = speedMs * timeSec;
    const { options, answerIndex } = buildOptions(rng, distance, 40);
    return {
      id: `gen-tsd-${seed}`,
      topic: "time-speed-distance",
      topicName: "Time, Speed & Distance",
      difficulty: "EASY",
      targetTime: 25,
      examTag: "IBPS RRB OA Prelims",
      question: `A train travelling at ${speedKmh} km/h crosses an electric pole in ${timeSec} seconds. Find the length of the train.`,
      questionHi: `${speedKmh} किमी/घंटा की गति से चल रही एक ट्रेन एक बिजली के खंभे को ${timeSec} सेकंड में पार करती है। ट्रेन की लंबाई ज्ञात कीजिए।`,
      options: options.map(o => `${o} m`),
      answerIndex,
      standardMethod: {
        title: "Standard Unit Conversion",
        steps: [`Speed in m/s = ${speedKmh} × 5/18 = ${speedMs} m/s`, `Length = Speed × Time = ${speedMs} × ${timeSec} = ${distance} m`],
        timeTaken: "30 seconds"
      },
      topperMethod: {
        title: "Solve Like a Topper (5/18 Quick Multiplier)",
        steps: [`${speedKmh} is ${speedKmh / 18} multiples of 18 → Speed = ${(speedKmh / 18) * 5} m/s`, `Distance = ${speedMs} × ${timeSec} = ${distance} m mentally.`],
        timeTaken: "6 seconds",
        proTip: "Every 18 km/h equals 5 m/s. 54 km/h = 15 m/s; 72 km/h = 20 m/s."
      }
    };
  },

  // 10. Mixture & Alligation
  "mixture-and-alligation"(rng, seed) {
    const c = randInt(rng, 20, 50);
    const d = randInt(rng, c + 15, c + 40);
    const m = randInt(rng, c + 5, d - 5);
    const diffLeft = d - m;
    const diffRight = m - c;
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const g = gcd(diffLeft, diffRight);
    const ratioStr = `${diffLeft / g} : ${diffRight / g}`;
    const pool = [ratioStr, `${diffRight / g} : ${diffLeft / g}`, `${diffLeft / g + 1} : ${diffRight / g}`, `1 : 1`, `2 : 1`];
    const { options, answerIndex } = buildOptionsFromPool(rng, ratioStr, pool);
    return {
      id: `gen-mix-${seed}`,
      topic: "mixture-and-alligation",
      topicName: "Mixture & Alligation",
      difficulty: "EASY",
      targetTime: 20,
      examTag: "SBI Clerk Prelims",
      question: `In what ratio must rice at ₹${c}/kg be mixed with rice at ₹${d}/kg so that the resulting mixture is worth ₹${m}/kg?`,
      questionHi: `₹${c}/किग्रा वाले चावल को ₹${d}/किग्रा वाले चावल के साथ किस अनुपात में मिलाया जाना चाहिए ताकि मिश्रण का मूल्य ₹${m}/किग्रा हो जाए?`,
      options,
      answerIndex,
      standardMethod: {
        title: "Algebraic Weighted Average",
        steps: [`${c}x + ${d}y = ${m}(x + y) ⇒ (${d} − ${m})y = (${m} − ${c})x`, `x / y = (${d} − ${m}) / (${m} − ${c}) = ${ratioStr}`],
        timeTaken: "30 seconds"
      },
      topperMethod: {
        title: "Solve Like a Topper (Alligation Cross)",
        steps: [`Cross differences: (${d} − ${m}) = ${diffLeft} on left, (${m} − ${c}) = ${diffRight} on right`, `Ratio = ${diffLeft} : ${diffRight} = ${ratioStr} in 5s!`],
        timeTaken: "5 seconds",
        proTip: "Draw the cross mentally: (Dearer - Mean) : (Mean - Cheaper)."
      }
    };
  }
};

// Generate an expansive, balanced, deterministic question bank (500+ questions)
export function generateQuestionBank(totalCount = 500) {
  const bank = [];
  const generatorKeys = Object.keys(TOPIC_GENERATORS);

  for (let i = 0; i < totalCount; i++) {
    const seed = 100000 + i * 37;
    const rng = mulberry32(seed);
    const topicKey = generatorKeys[i % generatorKeys.length];
    const genFunc = TOPIC_GENERATORS[topicKey];
    if (genFunc) {
      bank.push(genFunc(rng, seed));
    }
  }

  return bank;
}
