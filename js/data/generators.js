// QUESTION GENERATORS — deterministic given a seed, so a question can be reproduced.
// Each generator returns: { question, options[], answerIndex, solution, shortcut, difficulty, topic, subtopic, targetTime }

// mulberry32: small seeded PRNG so a session's questions can be regenerated from the seed
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
function shuffle(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// build a 4-option MCQ around a correct numeric answer, with plausible distractors
function buildOptions(rng, correct, spread) {
  const distractors = new Set();
  while (distractors.size < 3) {
    const delta = randInt(rng, 1, spread) * (rng() > 0.5 ? 1 : -1);
    const val = correct + delta;
    if (val !== correct && val > 0) distractors.add(val);
  }
  const options = shuffle(rng, [correct, ...distractors]);
  return { options: options.map(String), answerIndex: options.indexOf(correct) };
}

const GENERATORS = {
  percentage(rng) {
    const base = randInt(rng, 4, 40) * 25; // clean base
    const pct = [10, 20, 25, 12.5, 5, 50, 15][randInt(rng, 0, 6)];
    const correct = Math.round((pct / 100) * base);
    const { options, answerIndex } = buildOptions(rng, correct, Math.max(5, Math.round(correct * 0.1)));
    return {
      question: `${pct}% of ${base} = ?`,
      options, answerIndex,
      solution: `${pct}% of ${base} = (${pct}/100) × ${base} = ${correct}.`,
      shortcut: `Convert ${pct}% to its fraction equivalent and cancel with ${base} directly instead of long division.`,
      difficulty: "EASY", topic: "percentage", subtopic: "Basic percentage", targetTime: 25
    };
  },

  "profit-loss"(rng) {
    const cp = randInt(rng, 20, 200) * 10;
    const profitPct = [10, 20, 25, 15, 12, 30][randInt(rng, 0, 5)];
    const sp = Math.round(cp * (1 + profitPct / 100));
    const { options, answerIndex } = buildOptions(rng, sp, Math.max(10, Math.round(sp * 0.08)));
    return {
      question: `A shopkeeper buys an article for ₹${cp} and sells it at a profit of ${profitPct}%. Find the selling price.`,
      options, answerIndex,
      solution: `SP = CP × (1 + Profit%/100) = ${cp} × ${1 + profitPct / 100} = ${sp}.`,
      shortcut: `${profitPct}% is a clean fraction of ${cp} — compute the profit amount directly and add to CP.`,
      difficulty: "MEDIUM", topic: "profit-loss", subtopic: "Basic profit", targetTime: 45
    };
  },

  average(rng) {
    const count = randInt(rng, 4, 6);
    const base = randInt(rng, 30, 90);
    const nums = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const dev = randInt(rng, -8, 8);
      nums.push(base + dev);
      sum += base + dev;
    }
    const avg = Math.round(sum / count);
    // ensure exact division for a clean answer
    const adjustedSum = avg * count;
    const diff = adjustedSum - sum;
    nums[0] += diff; // patch first value so sum divides exactly
    const { options, answerIndex } = buildOptions(rng, avg, 5);
    return {
      question: `Find the average of: ${nums.join(", ")}`,
      options, answerIndex,
      solution: `Sum = ${nums.reduce((a, b) => a + b, 0)}. Average = Sum / ${count} = ${avg}.`,
      shortcut: `Assume mean ${base}, sum the small deviations from it, then divide the deviation-sum by ${count} and add back to ${base}.`,
      difficulty: "EASY", topic: "average", subtopic: "Simple average", targetTime: 35
    };
  },

  simplification(rng) {
    const a = randInt(rng, 10, 60), b = randInt(rng, 2, 12), c = randInt(rng, 10, 100), d = randInt(rng, 2, 10);
    const correct = a * b - Math.floor(c / d);
    const { options, answerIndex } = buildOptions(rng, correct, 8);
    return {
      question: `${a} × ${b} − ${c} ÷ ${d} = ?`,
      options, answerIndex,
      solution: `${a} × ${b} = ${a * b}. ${c} ÷ ${d} = ${Math.floor(c / d)} (integer part). ${a * b} − ${Math.floor(c / d)} = ${correct}.`,
      shortcut: `Do multiplication and division first (BODMAS), then the subtraction — never left-to-right blindly.`,
      difficulty: "EASY", topic: "simplification", subtopic: "BODMAS", targetTime: 25
    };
  },

  ratio(rng) {
    const r1 = randInt(rng, 2, 7), r2 = randInt(rng, 2, 7);
    const g = (function gcd(x, y) { return y ? gcd(y, x % y) : x; })(r1, r2);
    const parts = randInt(rng, 5, 20);
    const total = (r1 + r2) * parts;
    const shareA = r1 * parts;
    const { options, answerIndex } = buildOptions(rng, shareA, Math.max(5, Math.round(shareA * 0.1)));
    return {
      question: `₹${total} is divided between A and B in the ratio ${r1}:${r2}. Find A's share.`,
      options, answerIndex,
      solution: `Total parts = ${r1}+${r2} = ${r1 + r2}. A's share = (${r1}/${r1 + r2}) × ${total} = ${shareA}.`,
      shortcut: `Skip the algebra — compute A's fraction of the ratio directly and apply it to the total.`,
      difficulty: "EASY", topic: "ratio", subtopic: "Basic ratio", targetTime: 40
    };
  },

  "time-work"(rng) {
    const dA = [8, 10, 12, 15, 18, 20][randInt(rng, 0, 5)];
    const dB = [12, 15, 18, 20, 24, 30][randInt(rng, 0, 5)];
    const lcm = (function lcm2(x, y) { const gcd = (a, b) => (b ? gcd(b, a % b) : a); return (x * y) / gcd(x, y); })(dA, dB);
    const effA = lcm / dA, effB = lcm / dB;
    const days = lcm / (effA + effB);
    const roundedDays = Math.round(days * 10) / 10; // shown answer and solution always use this same value
    const { options, answerIndex } = buildOptions(rng, roundedDays, 2);
    return {
      question: `A can complete a work in ${dA} days and B in ${dB} days. Working together, in how many days (approx.) will they finish it?`,
      options, answerIndex,
      solution: `Total work = LCM(${dA},${dB}) = ${lcm} units. A's efficiency = ${effA}/day, B's = ${effB}/day. Together = ${lcm}/${effA + effB} ≈ ${roundedDays} days.`,
      shortcut: `Set total work = LCM of the two times so both efficiencies come out as whole numbers.`,
      difficulty: "MEDIUM", topic: "time-work", subtopic: "Combined work", targetTime: 50
    };
  }
};

function generateQuestion(topicId, seed) {
  const rng = mulberry32(seed);
  const gen = GENERATORS[topicId];
  if (!gen) return null;
  const q = gen(rng);
  q.id = `${topicId.toUpperCase()}-${seed}`;
  q.sourceType = "PRACTICE";
  return validateQuestion(q) ? q : null;
}

// QUALITY CONTROL — per §37: exactly one correct answer, no contradictions
function validateQuestion(q) {
  if (!q || !Array.isArray(q.options) || q.options.length < 3) return false;
  if (typeof q.answerIndex !== "number" || q.answerIndex < 0 || q.answerIndex >= q.options.length) return false;
  const unique = new Set(q.options);
  if (unique.size !== q.options.length) return false; // duplicate options = ambiguous
  return true;
}

function generateSet(topicId, count, seedBase) {
  const out = [];
  let seed = seedBase;
  let guard = 0;
  while (out.length < count && guard < count * 5) {
    const q = generateQuestion(topicId, seed);
    seed++; guard++;
    if (q) out.push(q);
  }
  return out;
}
