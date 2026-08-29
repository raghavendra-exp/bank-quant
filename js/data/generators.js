// QUESTION GENERATORS v2 — deterministic (seeded) given a seed, reproducible.
// Each topic generator picks one of several "flavors" (question templates) using the
// seeded RNG, then fills it with a wide numeric range. This combinatorial spread is what
// lets each topic produce 500+ genuinely distinct questions rather than a fixed hand-written set,
// per the architecture decision in README ("data-driven, not hundreds of hard-coded questions").

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function randInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
function pick(rng, arr) { return arr[randInt(rng, 0, arr.length - 1)]; }
function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function lcm2(a, b) { return (a * b) / gcd(a, b); }
function shuffle(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Build MCQ options around a correct numeric answer.
function buildOptions(rng, correct, spread) {
  const distractors = new Set();
  let guard = 0;
  while (distractors.size < 3 && guard < 50) {
    guard++;
    const delta = randInt(rng, 1, Math.max(1, spread)) * (rng() > 0.5 ? 1 : -1);
    const val = correct + delta;
    if (val !== correct) distractors.add(val);
  }
  while (distractors.size < 3) distractors.add(correct + distractors.size + 1); // fallback, never leaves <3
  const options = shuffle(rng, [correct, ...distractors]);
  return { options: options.map(v => String(v)), answerIndex: options.indexOf(correct) };
}

// Build MCQ options around a correct string answer (e.g. ratios like "3:2"), given a pool of alternates.
function buildOptionsFromPool(rng, correctStr, pool) {
  const distractors = shuffle(rng, pool.filter(p => p !== correctStr)).slice(0, 3);
  while (distractors.length < 3) distractors.push(correctStr + "*"); // degenerate fallback, kept unique
  const options = shuffle(rng, [correctStr, ...distractors]);
  return { options, answerIndex: options.indexOf(correctStr) };
}

const GENERATORS = {

  // ---------------------------------------------------------------- PERCENTAGE
  percentage(rng) {
    const flavor = randInt(rng, 0, 3);
    const pctList = [10, 20, 25, 12.5, 5, 50, 15, 40, 8, 4, 75, 30, 60, 16, 6.25, 35, 45, 70, 90, 2.5];
    if (flavor === 0) {
      const base = randInt(rng, 4, 400) * 25;
      const pct = pick(rng, pctList);
      const correct = Math.round((pct / 100) * base);
      const { options, answerIndex } = buildOptions(rng, correct, Math.max(5, Math.round(correct * 0.1)));
      return { question: `${pct}% of ${base} = ?`, options, answerIndex,
        solution: `${pct}% of ${base} = (${pct}/100) × ${base} = ${correct}.`,
        shortcut: `Convert ${pct}% to its fraction equivalent and cancel with ${base} directly.`,
        difficulty: "EASY", topic: "percentage", subtopic: "Basic percentage", targetTime: 25 };
    }
    if (flavor === 1) {
      const base = randInt(rng, 4, 300) * 20;
      const pct = pick(rng, pctList);
      const correct = Math.round(base * (1 + pct / 100));
      const { options, answerIndex } = buildOptions(rng, correct, Math.max(5, Math.round(correct * 0.08)));
      return { question: `A number ${base} is increased by ${pct}%. Find the new value.`, options, answerIndex,
        solution: `New value = ${base} × (1 + ${pct}/100) = ${correct}.`,
        shortcut: `Compute ${pct}% of ${base} as an addend, then add to ${base} — faster than multiplying the full factor.`,
        difficulty: "EASY", topic: "percentage", subtopic: "Percentage increase", targetTime: 30 };
    }
    if (flavor === 2) {
      const base = randInt(rng, 4, 300) * 20;
      const pct = pick(rng, pctList);
      const correct = Math.round(base * (1 - pct / 100));
      const { options, answerIndex } = buildOptions(rng, correct, Math.max(5, Math.round(correct * 0.08)));
      return { question: `A number ${base} is decreased by ${pct}%. Find the new value.`, options, answerIndex,
        solution: `New value = ${base} × (1 − ${pct}/100) = ${correct}.`,
        shortcut: `Compute ${pct}% of ${base} as the amount removed, then subtract from ${base}.`,
        difficulty: "EASY", topic: "percentage", subtopic: "Percentage decrease", targetTime: 30 };
    }
    const a = pick(rng, [10, 20, -10, -20, 25, -25, 5, -5, 15, -15, 30, -30]);
    const b = pick(rng, [10, 20, -10, -20, 25, -25, 5, -5, 15, -15, 30, -30]);
    const correct = Math.round((a + b + (a * b) / 100) * 100) / 100;
    const { options, answerIndex } = buildOptions(rng, correct, 6);
    return { question: `A quantity is changed by ${a}% and then by ${b}% (successively). Find the net percentage change.`, options, answerIndex,
      solution: `Net % change = ${a} + (${b}) + (${a}×${b})/100 = ${correct}%.`,
      shortcut: `Use net = a + b + ab/100 directly — never apply the two changes step by step under time pressure.`,
      difficulty: "MEDIUM", topic: "percentage", subtopic: "Successive percentage", targetTime: 40 };
  },

  // ---------------------------------------------------------------- PROFIT & LOSS
  "profit-loss"(rng) {
    const flavor = randInt(rng, 0, 3);
    const pctList = [10, 20, 25, 15, 12, 30, 5, 8, 40, 50, 16, 24];
    if (flavor === 0) {
      const cp = randInt(rng, 20, 500) * 10;
      const pct = pick(rng, pctList);
      const sp = Math.round(cp * (1 + pct / 100));
      const { options, answerIndex } = buildOptions(rng, sp, Math.max(10, Math.round(sp * 0.08)));
      return { question: `A shopkeeper buys an article for ₹${cp} and sells it at a profit of ${pct}%. Find the selling price.`, options, answerIndex,
        solution: `SP = CP × (1 + Profit%/100) = ${cp} × ${1 + pct / 100} = ${sp}.`,
        shortcut: `Compute ${pct}% of ${cp} as the profit amount and add to CP directly.`,
        difficulty: "MEDIUM", topic: "profit-loss", subtopic: "Basic profit", targetTime: 45 };
    }
    if (flavor === 1) {
      const cp = randInt(rng, 20, 500) * 10;
      const pct = pick(rng, pctList);
      const sp = Math.round(cp * (1 - pct / 100));
      const { options, answerIndex } = buildOptions(rng, sp, Math.max(10, Math.round(sp * 0.08)));
      return { question: `An article bought for ₹${cp} is sold at a loss of ${pct}%. Find the selling price.`, options, answerIndex,
        solution: `SP = CP × (1 − Loss%/100) = ${cp} × ${1 - pct / 100} = ${sp}.`,
        shortcut: `Compute ${pct}% of ${cp} as the loss amount and subtract from CP directly.`,
        difficulty: "MEDIUM", topic: "profit-loss", subtopic: "Basic loss", targetTime: 45 };
    }
    if (flavor === 2) {
      const pct = pick(rng, pctList);
      const sp = randInt(rng, 20, 500) * 10;
      const cp = Math.round(sp / (1 + pct / 100));
      const { options, answerIndex } = buildOptions(rng, cp, Math.max(10, Math.round(cp * 0.08)));
      return { question: `An article is sold for ₹${sp}, making a profit of ${pct}%. Find the cost price.`, options, answerIndex,
        solution: `CP = SP / (1 + Profit%/100) = ${sp} / ${1 + pct / 100} ≈ ${cp}.`,
        shortcut: `Treat SP as (100+profit%) parts of CP; CP = SP × 100/(100+${pct}).`,
        difficulty: "MEDIUM", topic: "profit-loss", subtopic: "Reverse — find CP", targetTime: 50 };
    }
    const mp = randInt(rng, 20, 500) * 10;
    const disc = pick(rng, [5, 10, 15, 20, 25, 12, 8]);
    const sp = Math.round(mp * (1 - disc / 100));
    const { options, answerIndex } = buildOptions(rng, sp, Math.max(10, Math.round(sp * 0.08)));
    return { question: `Marked price of an article is ₹${mp}. It is sold after a discount of ${disc}%. Find the selling price.`, options, answerIndex,
      solution: `SP = MP × (1 − Discount%/100) = ${mp} × ${1 - disc / 100} = ${sp}.`,
      shortcut: `${disc}% of ${mp} is the discount amount — subtract it directly from MP.`,
      difficulty: "EASY", topic: "profit-loss", subtopic: "Discount", targetTime: 35 };
  },

  // ---------------------------------------------------------------- AVERAGE
  average(rng) {
    const flavor = randInt(rng, 0, 2);
    if (flavor === 0) {
      const count = randInt(rng, 4, 7);
      const base = randInt(rng, 30, 90);
      const nums = []; let sum = 0;
      for (let i = 0; i < count; i++) { const dev = randInt(rng, -9, 9); nums.push(base + dev); sum += base + dev; }
      const avg = Math.round(sum / count);
      const diff = avg * count - sum;
      nums[0] += diff; // patch so the sum divides exactly
      const { options, answerIndex } = buildOptions(rng, avg, 5);
      return { question: `Find the average of: ${nums.join(", ")}`, options, answerIndex,
        solution: `Sum = ${nums.reduce((a, b) => a + b, 0)}. Average = Sum / ${count} = ${avg}.`,
        shortcut: `Assume mean ${base}; sum the small deviations and divide by ${count}, then add back to ${base}.`,
        difficulty: "EASY", topic: "average", subtopic: "Simple average", targetTime: 35 };
    }
    if (flavor === 1) {
      const count = randInt(rng, 5, 10);
      const oldAvg = randInt(rng, 20, 60);
      const oldValue = randInt(rng, 10, 90);
      const newValue = oldValue + randInt(rng, 4, 30) * (rng() > 0.5 ? 1 : -1);
      const newAvg = Math.round(oldAvg + (newValue - oldValue) / count);
      const { options, answerIndex } = buildOptions(rng, newAvg, 3);
      return { question: `The average of ${count} numbers is ${oldAvg}. If one number, ${oldValue}, is replaced by ${newValue}, find the new average.`, options, answerIndex,
        solution: `Change in sum = ${newValue} − ${oldValue} = ${newValue - oldValue}. New average = ${oldAvg} + (${newValue - oldValue})/${count} ≈ ${newAvg}.`,
        shortcut: `Only the difference between the old and new value affects the average — no need to recompute the full sum.`,
        difficulty: "MEDIUM", topic: "average", subtopic: "Average replacement", targetTime: 40 };
    }
    const count = randInt(rng, 4, 6);
    const target = randInt(rng, 30, 80);
    const knownCount = count - 1;
    const known = [];
    let sum = 0;
    for (let i = 0; i < knownCount; i++) { const v = target + randInt(rng, -12, 12); known.push(v); sum += v; }
    const missing = target * count - sum;
    if (missing <= 0) return GENERATORS.average(mulberry32(Math.floor(rng() * 1e9))); // resample degenerate case
    const { options, answerIndex } = buildOptions(rng, missing, 6);
    return { question: `The average of ${count} numbers is ${target}. ${knownCount} of the numbers are ${known.join(", ")}. Find the missing number.`, options, answerIndex,
      solution: `Required total = ${target} × ${count} = ${target * count}. Sum of known numbers = ${sum}. Missing number = ${target * count} − ${sum} = ${missing}.`,
      shortcut: `Compute the required total first (average × count) — the missing value is just what's left after subtracting the known sum.`,
      difficulty: "MEDIUM", topic: "average", subtopic: "Missing value", targetTime: 45 };
  },

  // ---------------------------------------------------------------- SIMPLIFICATION
  simplification(rng) {
    const flavor = randInt(rng, 0, 2);
    if (flavor === 0) {
      const a = randInt(rng, 10, 80), b = randInt(rng, 2, 15), c = randInt(rng, 10, 150), d = randInt(rng, 2, 12);
      const correct = a * b - Math.floor(c / d);
      const { options, answerIndex } = buildOptions(rng, correct, 8);
      return { question: `${a} × ${b} − ${c} ÷ ${d} = ?`, options, answerIndex,
        solution: `${a} × ${b} = ${a * b}. ${c} ÷ ${d} = ${Math.floor(c / d)} (integer part). ${a * b} − ${Math.floor(c / d)} = ${correct}.`,
        shortcut: `Do multiplication and division before subtraction (BODMAS) — never left to right.`,
        difficulty: "EASY", topic: "simplification", subtopic: "BODMAS", targetTime: 25 };
    }
    if (flavor === 1) {
      const a = randInt(rng, 5, 40), b = randInt(rng, 2, 20), c = randInt(rng, 2, 20), d = randInt(rng, 2, 20);
      const correct = (a + b) * c - d;
      const { options, answerIndex } = buildOptions(rng, correct, 10);
      return { question: `(${a} + ${b}) × ${c} − ${d} = ?`, options, answerIndex,
        solution: `${a} + ${b} = ${a + b}. ${a + b} × ${c} = ${(a + b) * c}. ${(a + b) * c} − ${d} = ${correct}.`,
        shortcut: `Resolve the bracket first, always, regardless of what operations follow.`,
        difficulty: "EASY", topic: "simplification", subtopic: "Brackets", targetTime: 25 };
    }
    const d1 = pick(rng, [2, 3, 4, 5, 6]);
    const d2 = pick(rng, [2, 3, 4, 5, 6]);
    const L = lcm2(d1, d2);
    const n1 = randInt(rng, 1, d1 - 1) * (L / d1);
    const n2 = randInt(rng, 1, d2 - 1) * (L / d2);
    const wholeMultiplier = randInt(rng, 2, 12);
    const rawResult = ((n1 + n2) / L) * wholeMultiplier;
    if (!Number.isInteger(rawResult)) return GENERATORS.simplification(mulberry32(Math.floor(rng() * 1e9)));
    const correct = rawResult;
    const { options, answerIndex } = buildOptions(rng, correct, 4);
    return { question: `(${n1}/${L} + ${n2}/${L}) × ${wholeMultiplier} = ?`, options, answerIndex,
      solution: `${n1}/${L} + ${n2}/${L} = ${n1 + n2}/${L}. × ${wholeMultiplier} = ${correct}.`,
      shortcut: `Same-denominator fractions add directly on top — combine before multiplying out.`,
      difficulty: "EASY", topic: "simplification", subtopic: "Fractions", targetTime: 25 };
  },

  // ---------------------------------------------------------------- APPROXIMATION
  approximation(rng) {
    const flavor = randInt(rng, 0, 2);
    if (flavor === 0) {
      const perfectRoots = [12, 15, 18, 21, 24, 27, 30, 35, 40, 45, 50, 55, 60];
      const base = pick(rng, perfectRoots);
      const n = base * base + randInt(rng, -8, 8);
      const correct = base;
      const { options, answerIndex } = buildOptions(rng, correct, 2);
      return { question: `√${n} ≈ ?`, options, answerIndex,
        solution: `${base}² = ${base * base}, which is very close to ${n}, so √${n} ≈ ${base}.`,
        shortcut: `Find the nearest perfect square instead of computing the root exactly.`,
        difficulty: "MEDIUM", topic: "approximation", subtopic: "Square roots", targetTime: 30 };
    }
    if (flavor === 1) {
      const pct = pick(rng, [49, 51, 24, 26, 74, 76, 33, 67, 19, 81, 9, 91]);
      const base = randInt(rng, 40, 900) + 0.5;
      const roundedPct = Math.round(pct / 5) * 5;
      const roundedBase = Math.round(base / 10) * 10;
      const correct = Math.round((roundedPct / 100) * roundedBase);
      const { options, answerIndex } = buildOptions(rng, correct, Math.max(5, Math.round(correct * 0.12)));
      return { question: `${pct}% of ${base} ≈ ?`, options, answerIndex,
        solution: `Round to ${roundedPct}% of ${roundedBase} = ${correct} (closest option).`,
        shortcut: `Round both the percentage and the base to the nearest clean multiple before multiplying.`,
        difficulty: "MEDIUM", topic: "approximation", subtopic: "Percentage approximation", targetTime: 30 };
    }
    const a = randInt(rng, 8, 60) + 0.9;
    const b = randInt(rng, 8, 60) + 0.1;
    const roundedA = Math.round(a);
    const roundedB = Math.round(b);
    const correct = roundedA * roundedB;
    const { options, answerIndex } = buildOptions(rng, correct, Math.max(8, Math.round(correct * 0.1)));
    return { question: `${a.toFixed(2)} × ${b.toFixed(2)} ≈ ?`, options, answerIndex,
      solution: `Round to ${roundedA} × ${roundedB} = ${correct} (closest option).`,
      shortcut: `Round each multiplicand to the nearest whole number before multiplying — that's the entire point of an approximation question.`,
      difficulty: "MEDIUM", topic: "approximation", subtopic: "Multiplication approximation", targetTime: 30 };
  },

  // ---------------------------------------------------------------- NUMBER SERIES
  "number-series"(rng) {
    const flavor = randInt(rng, 0, 2);
    if (flavor === 0) {
      const start = randInt(rng, 2, 40);
      const step = randInt(rng, 2, 12);
      const growing = rng() > 0.5;
      const growStep = randInt(rng, 1, 4);
      const terms = [start];
      let d = step;
      for (let i = 0; i < 4; i++) { terms.push(terms[terms.length - 1] + d); d += growing ? growStep : 0; }
      const next = terms[terms.length - 1] + d;
      const { options, answerIndex } = buildOptions(rng, next, Math.max(4, Math.round(next * 0.1)));
      return { question: `${terms.join(", ")}, ?`, options, answerIndex,
        solution: `Differences: ${terms.slice(1).map((t, i) => t - terms[i]).join(", ")}${growing ? ", increasing by " + growStep + " each time" : " (constant)"}. Next difference gives ${next}.`,
        shortcut: `Check first-order differences before anything else — most series in this exam resolve here.`,
        difficulty: "MEDIUM", topic: "number-series", subtopic: "Difference series", targetTime: 35 };
    }
    if (flavor === 1) {
      const start = randInt(rng, 2, 6);
      const ratio = pick(rng, [2, 3]);
      const terms = [start];
      for (let i = 0; i < 4; i++) terms.push(terms[terms.length - 1] * ratio);
      const next = terms[terms.length - 1] * ratio;
      const { options, answerIndex } = buildOptions(rng, next, Math.max(4, Math.round(next * 0.15)));
      return { question: `${terms.join(", ")}, ?`, options, answerIndex,
        solution: `Each term is multiplied by ${ratio}. ${terms[terms.length - 1]} × ${ratio} = ${next}.`,
        shortcut: `If differences aren't constant, check for a constant ratio next — multiplicative series are the second most common family.`,
        difficulty: "MEDIUM", topic: "number-series", subtopic: "Ratio series", targetTime: 35 };
    }
    const start = randInt(rng, 2, 10);
    const terms = [start * start];
    for (let i = 1; i < 5; i++) terms.push((start + i) * (start + i));
    const next = (start + 5) * (start + 5);
    const { options, answerIndex } = buildOptions(rng, next, Math.max(6, Math.round(next * 0.08)));
    return { question: `${terms.join(", ")}, ?`, options, answerIndex,
      solution: `These are consecutive squares: ${start}², ${start + 1}², ... The next term is ${start + 5}² = ${next}.`,
      shortcut: `If numbers look like they're growing faster than any constant ratio, check whether they're perfect squares or cubes.`,
      difficulty: "MEDIUM", topic: "number-series", subtopic: "Square-based series", targetTime: 40 };
  },

  // ---------------------------------------------------------------- RATIO
  ratio(rng) {
    const flavor = randInt(rng, 0, 2);
    if (flavor === 0) {
      const r1 = randInt(rng, 2, 9), r2 = randInt(rng, 2, 9);
      const parts = randInt(rng, 5, 40);
      const total = (r1 + r2) * parts;
      const shareA = r1 * parts;
      const { options, answerIndex } = buildOptions(rng, shareA, Math.max(5, Math.round(shareA * 0.1)));
      return { question: `₹${total} is divided between A and B in the ratio ${r1}:${r2}. Find A's share.`, options, answerIndex,
        solution: `Total parts = ${r1}+${r2} = ${r1 + r2}. A's share = (${r1}/${r1 + r2}) × ${total} = ${shareA}.`,
        shortcut: `Compute A's fraction of the ratio directly and apply it to the total — skip the algebra.`,
        difficulty: "EASY", topic: "ratio", subtopic: "Two-part ratio", targetTime: 40 };
    }
    if (flavor === 1) {
      const r1 = randInt(rng, 2, 6), r2 = randInt(rng, 2, 6), r3 = randInt(rng, 2, 6);
      const parts = randInt(rng, 4, 25);
      const total = (r1 + r2 + r3) * parts;
      const shareB = r2 * parts;
      const { options, answerIndex } = buildOptions(rng, shareB, Math.max(5, Math.round(shareB * 0.1)));
      return { question: `₹${total} is divided among A, B and C in the ratio ${r1}:${r2}:${r3}. Find B's share.`, options, answerIndex,
        solution: `Total parts = ${r1}+${r2}+${r3} = ${r1 + r2 + r3}. B's share = (${r2}/${r1 + r2 + r3}) × ${total} = ${shareB}.`,
        shortcut: `Add all three ratio numbers first — a common error is forgetting the third part when computing the denominator.`,
        difficulty: "MEDIUM", topic: "ratio", subtopic: "Three-part ratio", targetTime: 45 };
    }
    const ab1 = randInt(rng, 2, 6), ab2 = randInt(rng, 2, 6);
    const bc1 = randInt(rng, 2, 6), bc2 = randInt(rng, 2, 6);
    const a = ab1 * bc1, b = ab2 * bc1, c = ab2 * bc2;
    const g = gcd(gcd(a, b), c);
    const A = a / g, B = b / g, C = c / g;
    const correctStr = `${A}:${C}`;
    const pool = [`${A}:${C}`, `${C}:${A}`, `${A + 1}:${C}`, `${A}:${C + 1}`, `${B}:${C}`, `${A}:${B}`];
    const { options, answerIndex } = buildOptionsFromPool(rng, correctStr, pool);
    return { question: `If A:B = ${ab1}:${ab2} and B:C = ${bc1}:${bc2}, find A:C.`, options, answerIndex,
      solution: `A:B:C = ${ab1}×${bc1} : ${ab2}×${bc1} : ${ab2}×${bc2} = ${a}:${b}:${c} = ${A}:${B}:${C}. So A:C = ${A}:${C}.`,
      shortcut: `Multiply straight across (A:B numerators by bc1, B:C by ab2's partner) to chain the ratios in one step.`,
      difficulty: "MEDIUM", topic: "ratio", subtopic: "Chained ratio", targetTime: 45 };
  },

  // ---------------------------------------------------------------- TIME & WORK
  "time-work"(rng) {
    const flavor = randInt(rng, 0, 2);
    const dayPool = [6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 36, 40, 45];
    if (flavor === 0) {
      const dA = pick(rng, dayPool), dB = pick(rng, dayPool);
      const lcm = lcm2(dA, dB);
      const effA = lcm / dA, effB = lcm / dB;
      const days = Math.round((lcm / (effA + effB)) * 10) / 10;
      const { options, answerIndex } = buildOptions(rng, days, 2);
      return { question: `A can complete a work in ${dA} days and B in ${dB} days. Working together, in how many days (approx.) will they finish it?`, options, answerIndex,
        solution: `Total work = LCM(${dA},${dB}) = ${lcm} units. A's efficiency = ${effA}/day, B's = ${effB}/day. Together = ${lcm}/${effA + effB} ≈ ${days} days.`,
        shortcut: `Set total work = LCM of the two times so both efficiencies come out as whole numbers.`,
        difficulty: "MEDIUM", topic: "time-work", subtopic: "Combined work", targetTime: 50 };
    }
    if (flavor === 1) {
      const dA = pick(rng, dayPool), dB = pick(rng, dayPool), dC = pick(rng, dayPool);
      const lcm = lcm2(lcm2(dA, dB), dC);
      const effA = lcm / dA, effB = lcm / dB, effC = lcm / dC;
      const days = Math.round((lcm / (effA + effB + effC)) * 10) / 10;
      const { options, answerIndex } = buildOptions(rng, days, 2);
      return { question: `A, B and C can complete a work in ${dA}, ${dB} and ${dC} days respectively. Working together, in how many days (approx.) will they finish it?`, options, answerIndex,
        solution: `Total work = LCM(${dA},${dB},${dC}) = ${lcm} units. Efficiencies: A=${effA}, B=${effB}, C=${effC} per day. Together = ${lcm}/${effA + effB + effC} ≈ ${days} days.`,
        shortcut: `LCM of three numbers still gives whole-number efficiencies for all three workers — same method, one more term.`,
        difficulty: "MEDIUM", topic: "time-work", subtopic: "Three-worker combined", targetTime: 55 };
    }
    const dA = pick(rng, dayPool), dB = pick(rng, dayPool);
    const lcm = lcm2(dA, dB);
    const effA = lcm / dA, effB = lcm / dB;
    const daysA = randInt(rng, 1, Math.max(1, Math.floor(dA / 3)));
    const workDoneByA = effA * daysA;
    const remaining = lcm - workDoneByA;
    if (remaining <= 0) return GENERATORS["time-work"](mulberry32(Math.floor(rng() * 1e9)));
    const daysB = Math.round((remaining / effB) * 10) / 10;
    const { options, answerIndex } = buildOptions(rng, daysB, 2);
    return { question: `A can do a work in ${dA} days and B in ${dB} days. A works alone for ${daysA} day(s), then leaves. In how many more days will B finish the remaining work?`, options, answerIndex,
      solution: `Total work = LCM(${dA},${dB}) = ${lcm} units. A's efficiency = ${effA}/day, does ${workDoneByA} units in ${daysA} day(s). Remaining = ${lcm}−${workDoneByA} = ${remaining} units. B finishes in ${remaining}/${effB} ≈ ${daysB} days.`,
      shortcut: `Work in "units" throughout — convert A's partial contribution to units immediately rather than tracking fractions of the job.`,
      difficulty: "HARD", topic: "time-work", subtopic: "Partial work handover", targetTime: 60 };
  },

  // ---------------------------------------------------------------- TIME, SPEED & DISTANCE
  tsd(rng) {
    const flavor = randInt(rng, 0, 2);
    if (flavor === 0) {
      const speedKmh = pick(rng, [30, 36, 40, 45, 48, 54, 60, 63, 72, 80, 90]);
      const timeHr = randInt(rng, 2, 8);
      const dist = speedKmh * timeHr;
      const { options, answerIndex } = buildOptions(rng, dist, Math.max(10, Math.round(dist * 0.1)));
      return { question: `A car travels at ${speedKmh} km/h for ${timeHr} hours. Find the distance covered.`, options, answerIndex,
        solution: `Distance = Speed × Time = ${speedKmh} × ${timeHr} = ${dist} km.`,
        shortcut: `Direct application of Distance = Speed × Time — no conversion needed since both units already match.`,
        difficulty: "EASY", topic: "tsd", subtopic: "Basic speed", targetTime: 30 };
    }
    if (flavor === 1) {
      const lengthM = randInt(rng, 10, 30) * 10;
      const speedKmh = pick(rng, [36, 45, 54, 60, 72, 90, 108]);
      const speedMs = speedKmh * 5 / 18;
      const time = Math.round((lengthM / speedMs) * 10) / 10;
      const { options, answerIndex } = buildOptions(rng, time, 3);
      return { question: `A train ${lengthM} m long is running at ${speedKmh} km/h. How long will it take to cross a stationary pole?`, options, answerIndex,
        solution: `Speed = ${speedKmh} × 5/18 = ${speedMs} m/s. Time = Length/Speed = ${lengthM}/${speedMs} ≈ ${time} s.`,
        shortcut: `km/h → m/s: multiply by 5/18. Crossing a pole means the train covers exactly its own length.`,
        difficulty: "MEDIUM", topic: "tsd", subtopic: "Train crossing a pole", targetTime: 40 };
    }
    const speedA = pick(rng, [40, 45, 50, 55, 60, 65]);
    const speedB = pick(rng, [30, 35, 40, 45, 50]);
    const distApart = randInt(rng, 5, 40) * 10;
    const relSpeed = speedA + speedB;
    const time = Math.round((distApart / relSpeed) * 10) / 10;
    const { options, answerIndex } = buildOptions(rng, time, 1);
    return { question: `Two trains ${distApart} km apart move toward each other at ${speedA} km/h and ${speedB} km/h. In how many hours (approx.) will they meet?`, options, answerIndex,
      solution: `Relative speed (opposite directions) = ${speedA}+${speedB} = ${relSpeed} km/h. Time = ${distApart}/${relSpeed} ≈ ${time} h.`,
      shortcut: `Moving toward each other → add the speeds. Moving the same direction would instead subtract them.`,
      difficulty: "MEDIUM", topic: "tsd", subtopic: "Relative speed — meeting", targetTime: 45 };
  },

  // ---------------------------------------------------------------- QUADRATIC EQUATIONS
  "quadratic-equations"(rng) {
    function makeEq(r1, r2) { return { b: -(r1 + r2), c: r1 * r2, roots: [r1, r2] }; }
    const rPoolX = [randInt(rng, -9, 9), randInt(rng, -9, 9)].sort((a, b) => a - b);
    let rPoolY = [randInt(rng, -9, 9), randInt(rng, -9, 9)].sort((a, b) => a - b);
    let guard = 0;
    while (rPoolY[0] <= rPoolX[1] && rPoolY[1] >= rPoolX[0] && guard < 30) {
      rPoolY = [randInt(rng, -9, 9), randInt(rng, -9, 9)].sort((a, b) => a - b);
      guard++;
    }
    if (rPoolY[0] <= rPoolX[1] && rPoolY[1] >= rPoolX[0]) rPoolY = [rPoolX[1] + 1, rPoolX[1] + 5]; // guaranteed non-overlap fallback
    const eqX = makeEq(rPoolX[0], rPoolX[1]);
    const eqY = makeEq(rPoolY[0], rPoolY[1]);
    const fmtEq = (v, eq) => `${v}²${eq.b >= 0 ? "+" : ""}${eq.b}${v}${eq.c >= 0 ? "+" : ""}${eq.c}=0`;
    const relation = rPoolX[1] < rPoolY[0] ? "x < y" : "x > y";
    const pool = ["x < y", "x > y", "x = y", "x ≤ y", "x ≥ y", "Relation cannot be determined"];
    const { options, answerIndex } = buildOptionsFromPool(rng, relation, pool);
    return { question: `I. ${fmtEq("x", eqX)}  II. ${fmtEq("y", eqY)}. Find the relation between x and y.`, options, answerIndex,
      solution: `Roots of I: x = ${eqX.roots.join(", ")}. Roots of II: y = ${eqY.roots.join(", ")}. Since every value of x is ${relation === "x < y" ? "less" : "greater"} than every value of y, ${relation}.`,
      shortcut: `Compare only the boundary roots — if the ranges don't overlap, that single comparison decides the whole relation.`,
      difficulty: "MEDIUM", topic: "quadratic-equations", subtopic: "Root comparison", targetTime: 40 };
  },

  // ---------------------------------------------------------------- SIMPLE & COMPOUND INTEREST
  "si-ci"(rng) {
    const flavor = randInt(rng, 0, 2);
    if (flavor === 0) {
      const p = randInt(rng, 20, 500) * 100;
      const r = pick(rng, [4, 5, 6, 8, 10, 12, 15, 20]);
      const t = randInt(rng, 2, 6);
      const si = Math.round(p * r * t / 100);
      const { options, answerIndex } = buildOptions(rng, si, Math.max(20, Math.round(si * 0.1)));
      return { question: `Find the Simple Interest on ₹${p} at ${r}% per annum for ${t} years.`, options, answerIndex,
        solution: `SI = (P×R×T)/100 = (${p}×${r}×${t})/100 = ${si}.`,
        shortcut: `Compute R×T first as a single multiplier percentage, then apply once to P.`,
        difficulty: "EASY", topic: "si-ci", subtopic: "Simple Interest", targetTime: 35 };
    }
    if (flavor === 1) {
      const p = randInt(rng, 10, 300) * 100;
      const r = pick(rng, [5, 10, 20, 4, 8]);
      const ci = Math.round(p * Math.pow(1 + r / 100, 2) - p);
      const { options, answerIndex } = buildOptions(rng, ci, Math.max(15, Math.round(ci * 0.1)));
      return { question: `Find the Compound Interest on ₹${p} at ${r}% per annum for 2 years (compounded annually).`, options, answerIndex,
        solution: `CI = P×(1+R/100)² − P = ${p}×${(1 + r / 100).toFixed(2)}² − ${p} ≈ ${ci}.`,
        shortcut: `Year 1 interest = ${r}% of P. Year 2 interest = ${r}% of (P + year-1 interest) — compute year by year rather than the full power formula if R is clean.`,
        difficulty: "MEDIUM", topic: "si-ci", subtopic: "Compound Interest", targetTime: 45 };
    }
    const p = randInt(rng, 10, 300) * 100;
    const r = pick(rng, [4, 5, 6, 8, 10, 12, 15, 20]);
    const diff = Math.round(p * Math.pow(r / 100, 2)) || 1;
    const { options, answerIndex } = buildOptions(rng, diff, Math.max(5, Math.round(diff * 0.15)));
    return { question: `Find the difference between Compound Interest and Simple Interest on ₹${p} at ${r}% per annum for 2 years.`, options, answerIndex,
      solution: `Difference (2 years) = P × (R/100)² = ${p} × (${r}/100)² = ${diff}.`,
      shortcut: `Use the direct formula P×(R/100)² for 2-year CI−SI difference — never compute both interests separately.`,
      difficulty: "MEDIUM", topic: "si-ci", subtopic: "CI-SI difference", targetTime: 35 };
  },

  // ---------------------------------------------------------------- MIXTURE & ALLIGATION
  "mixture-alligation"(rng) {
    const cheaper = randInt(rng, 10, 40);
    const dearer = cheaper + randInt(rng, 5, 40);
    const mean = cheaper + randInt(rng, 1, dearer - cheaper - 1);
    const rC = dearer - mean, rD = mean - cheaper;
    const g = gcd(rC, rD);
    const A = rC / g, B = rD / g;
    const correctStr = `${A}:${B}`;
    const pool = [`${A}:${B}`, `${B}:${A}`, `${A + 1}:${B}`, `${A}:${B + 1}`, `${A + 1}:${B + 1}`, `${Math.max(1, A - 1)}:${B}`];
    const { options, answerIndex } = buildOptionsFromPool(rng, correctStr, pool);
    return { question: `In what ratio should a cheaper variety costing ₹${cheaper}/kg be mixed with a dearer variety costing ₹${dearer}/kg to get a mixture worth ₹${mean}/kg?`, options, answerIndex,
      solution: `Ratio (cheaper:dearer) = (Dearer−Mean):(Mean−Cheaper) = (${dearer}−${mean}):(${mean}−${cheaper}) = ${rC}:${rD} = ${A}:${B}.`,
      shortcut: `Draw the alligation cross: cheaper pairs with (Dearer−Mean), dearer pairs with (Mean−Cheaper) — read the ratio straight off.`,
      difficulty: "MEDIUM", topic: "mixture-alligation", subtopic: "Alligation ratio", targetTime: 40 };
  },

  // ---------------------------------------------------------------- PARTNERSHIP
  partnership(rng) {
    const capA = randInt(rng, 5, 50) * 1000;
    const capB = randInt(rng, 5, 50) * 1000;
    const monthsA = pick(rng, [12, 6, 8, 9, 10, 4, 3]);
    const monthsB = pick(rng, [12, 6, 8, 9, 10, 4, 3]);
    const totalProfit = randInt(rng, 10, 200) * 100;
    const prodA = capA * monthsA, prodB = capB * monthsB;
    const shareA = Math.round((prodA / (prodA + prodB)) * totalProfit);
    const { options, answerIndex } = buildOptions(rng, shareA, Math.max(20, Math.round(shareA * 0.1)));
    return { question: `A invests ₹${capA} for ${monthsA} months and B invests ₹${capB} for ${monthsB} months. If the total profit is ₹${totalProfit}, find A's share.`, options, answerIndex,
      solution: `A's capital×time = ${capA}×${monthsA} = ${prodA}. B's = ${capB}×${monthsB} = ${prodB}. A's share = [${prodA}/(${prodA}+${prodB})] × ${totalProfit} ≈ ${shareA}.`,
      shortcut: `Reduce the capital×time ratio to its simplest form first — smaller numbers make the final fraction of the total much faster to compute.`,
      difficulty: "MEDIUM", topic: "partnership", subtopic: "Capital × time", targetTime: 45 };
  },

  // ---------------------------------------------------------------- AGES
  ages(rng) {
    const flavor = randInt(rng, 0, 1);
    if (flavor === 0) {
      const r1 = randInt(rng, 2, 6), r2 = randInt(rng, r1 + 1, r1 + 6);
      const k = randInt(rng, 2, 10);
      const ageA = r1 * k;
      const yearsHence = randInt(rng, 3, 10);
      const { options, answerIndex } = buildOptions(rng, ageA, Math.max(2, Math.round(ageA * 0.15) || 1));
      return { question: `The present ages of A and B are in the ratio ${r1}:${r2}. After ${yearsHence} years, A's age will be ${ageA + yearsHence} years. Find A's present age.`, options, answerIndex,
        solution: `A's present age = ${r1}k. Given ${r1}k + ${yearsHence} = ${ageA + yearsHence}, so k = ${k}. A's present age = ${r1}×${k} = ${ageA}.`,
        shortcut: `Set present ages as ${r1}k and ${r2}k directly from the ratio — one equation from the extra condition solves for k immediately.`,
        difficulty: "MEDIUM", topic: "ages", subtopic: "Ratio-based ages", targetTime: 45 };
    }
    const ageB = randInt(rng, 15, 45);
    const diff = randInt(rng, 3, 20);
    const ageA = ageB + diff;
    const yearsAgo = randInt(rng, 2, 8);
    const { options, answerIndex } = buildOptions(rng, ageA - yearsAgo, Math.max(2, Math.round(ageA * 0.1)));
    return { question: `A is ${diff} years older than B. B's present age is ${ageB} years. Find A's age ${yearsAgo} years ago.`, options, answerIndex,
      solution: `A's present age = ${ageB} + ${diff} = ${ageA}. A's age ${yearsAgo} years ago = ${ageA} − ${yearsAgo} = ${ageA - yearsAgo}.`,
      shortcut: `Find A's present age first from the age difference, then apply the years-ago condition — don't combine both steps in your head at once.`,
      difficulty: "EASY", topic: "ages", subtopic: "Age difference", targetTime: 35 };
  }
};

function generateQuestion(topicId, seed) {
  const rng = mulberry32(seed);
  const gen = GENERATORS[topicId];
  if (!gen) return null;
  let q;
  try { q = gen(rng); } catch (e) { return null; }
  if (!q) return null;
  q.id = `${topicId.toUpperCase()}-${seed}`;
  q.sourceType = "PRACTICE";
  return validateQuestion(q) ? q : null;
}

// QUALITY CONTROL — exactly one correct answer, no duplicate/degenerate options.
function validateQuestion(q) {
  if (!q || !Array.isArray(q.options) || q.options.length < 3) return false;
  if (typeof q.answerIndex !== "number" || q.answerIndex < 0 || q.answerIndex >= q.options.length) return false;
  const unique = new Set(q.options);
  if (unique.size !== q.options.length) return false;
  return true;
}

function generateSet(topicId, count, seedBase) {
  const out = [];
  let seed = seedBase;
  let guard = 0;
  while (out.length < count && guard < count * 8) {
    const q = generateQuestion(topicId, seed);
    seed++; guard++;
    if (q) out.push(q);
  }
  return out;
}
