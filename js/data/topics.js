// TOPICS DATA — extend this file to add new topics. No app code needs to change.
// Structure follows EXAM -> STAGE -> SECTION -> TOPIC -> SUBTOPIC hierarchy at the question level.

const TOPICS = [
  {
    id: "simplification",
    name: "Simplification",
    category: "FOUNDATION",
    why: "Simplification questions appear directly (5-10 per Prelims) and hide inside almost every DI, Arithmetic and Data Sufficiency question. Speed here compounds everywhere else.",
    concept: "Simplify an expression using BODMAS: Brackets, Of, Division, Multiplication, Addition, Subtraction — evaluated left to right within each precedence level.",
    formulas: [
      "BODMAS order: () → of/% → ÷ → × → + → −",
      "a/b + c/d = (ad + bc) / bd",
      "√(a×b) = √a × √b"
    ],
    examples: [
      { q: "45 × 8 − 120 ÷ 4 + 15 = ?", steps: ["45 × 8 = 360", "120 ÷ 4 = 30", "360 − 30 + 15 = 345"], answer: "345" }
    ],
    shortcutId: "sc-frac-percent",
    targetTimeSec: 25,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "approximation",
    name: "Approximation",
    category: "FOUNDATION",
    why: "Approximation questions ask for the 'closest value', so exact calculation wastes time — the whole point is rounding fast and safely.",
    concept: "Round each number to a value that is easy to compute with (nearest 10, 100, or a clean fraction) before calculating, keeping the rounding direction consistent so errors don't compound.",
    formulas: [
      "Round multiplicands to 1-2 significant figures before multiplying",
      "√n ≈ nearest known perfect square root, adjusted"
    ],
    examples: [
      { q: "48.7% of 599.9 + 12.02 × 7.98 = ?", steps: ["≈ 49% of 600 = 294", "≈ 12 × 8 = 96", "294 + 96 = 390"], answer: "≈ 390" }
    ],
    shortcutId: "sc-frac-percent",
    targetTimeSec: 30,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "number-series",
    name: "Number Series",
    category: "FOUNDATION",
    why: "A fixed 5-question block in most Prelims papers. Pattern recognition speed directly determines whether you can bank these marks in under 3 minutes.",
    concept: "Identify the rule connecting consecutive terms: constant difference, constant ratio, difference-of-differences, alternating operations, or squares/cubes based sequences.",
    formulas: [
      "Difference series: check 2nd-order differences if 1st order isn't constant",
      "Check ×/÷ by a growing or shrinking factor before assuming addition"
    ],
    examples: [
      { q: "2, 6, 12, 20, 30, ?", steps: ["Differences: 4, 6, 8, 10 → next diff 12", "30 + 12 = 42"], answer: "42" }
    ],
    shortcutId: "sc-series-scan",
    targetTimeSec: 35,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "percentage",
    name: "Percentage",
    category: "ARITHMETIC",
    why: "Percentage is the parent topic for Profit & Loss, SI/CI, Ratio and most DI questions — weakness here cascades through the entire arithmetic section.",
    concept: "A percentage is a fraction with denominator 100. 'x% of y' means (x/100) × y. Percentage change = (change/original) × 100.",
    formulas: [
      "x% of y = (x × y)/100",
      "% increase = (New − Old)/Old × 100",
      "Successive % change: overall = a + b + (ab/100)"
    ],
    examples: [
      { q: "A number is increased by 20% and then decreased by 10%. Net % change?", steps: ["Net = 20 + (−10) + (20×−10)/100", "= 10 − 2 = 8"], answer: "+8%" }
    ],
    shortcutId: "sc-frac-percent",
    targetTimeSec: 40,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "ratio",
    name: "Ratio & Proportion",
    category: "ARITHMETIC",
    why: "Ratio thinking is the fastest route through Partnership, Mixture, Ages and many DI comparison questions — it replaces algebra with proportional scaling.",
    concept: "A ratio a:b compares two quantities of the same kind. Proportion states two ratios are equal: a:b = c:d ⇒ ad = bc.",
    formulas: [
      "a:b = ka:kb for any k",
      "If a:b = m:n, then a = (m/(m+n)) × total"
    ],
    examples: [
      { q: "Divide ₹720 between A and B in ratio 5:4.", steps: ["Total parts = 9", "A = 5/9 × 720 = 400", "B = 4/9 × 720 = 320"], answer: "A=400, B=320" }
    ],
    shortcutId: "sc-ratio-share",
    targetTimeSec: 40,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "average",
    name: "Average",
    category: "ARITHMETIC",
    why: "Average questions are usually quick marks once you use the deviation method instead of summing and dividing.",
    concept: "Average = Sum of observations ÷ Number of observations. The deviation method finds each value's difference from an assumed average to avoid large sums.",
    formulas: [
      "Average = ΣX / n",
      "Deviation method: Actual average = assumed average + (Σ deviations / n)"
    ],
    examples: [
      { q: "Average of 42, 47, 39, 51, 46 = ?", steps: ["Assume avg 45; deviations: −3,+2,−6,+6,+1 = 0", "Actual avg = 45 + 0/5 = 45"], answer: "45" }
    ],
    shortcutId: "sc-deviation",
    targetTimeSec: 35,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "profit-loss",
    name: "Profit, Loss & Discount",
    category: "ARITHMETIC",
    why: "One of the most frequently tested standalone arithmetic topics, and its logic reappears inside DI and Data Sufficiency sets.",
    concept: "Profit = SP − CP (when SP > CP). Loss = CP − SP. Discount is calculated on Marked Price (MP), not CP.",
    formulas: [
      "Profit% = (Profit/CP) × 100",
      "SP = MP × (1 − Discount%/100)",
      "Successive discounts a%, b%: net = a + b − (ab/100) (loss to buyer)"
    ],
    examples: [
      { q: "MP = 2000, successive discounts 10% and 5%. Find SP.", steps: ["Net discount = 10+5−(10×5)/100 = 14.5%", "SP = 2000 × 0.855 = 1710"], answer: "₹1710" }
    ],
    shortcutId: "sc-successive",
    targetTimeSec: 45,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "time-work",
    name: "Time & Work",
    category: "ARITHMETIC",
    why: "The LCM/efficiency method converts every Time & Work problem into simple whole-number arithmetic and is directly reusable for Pipes & Cisterns.",
    concept: "Assume total work = LCM of the individual times. Each person's efficiency = Work ÷ their time. Combined efficiency = sum of individual efficiencies.",
    formulas: [
      "Efficiency = Total Work / Time taken",
      "Time (combined) = Total Work / Combined Efficiency"
    ],
    examples: [
      { q: "A does a job in 12 days, B in 18 days. Together?", steps: ["LCM(12,18) = 36 units", "A's efficiency = 3/day, B's = 2/day", "Combined = 5/day → 36/5 = 7.2 days"], answer: "7.2 days" }
    ],
    shortcutId: "sc-work-lcm",
    targetTimeSec: 50,
    difficultyDefault: "MEDIUM",
    hasCalculator: "work"
  },
  {
    id: "tsd",
    name: "Time, Speed & Distance",
    category: "ARITHMETIC",
    why: "TSD covers trains, boats and races — all built on one relationship, so mastering the base formula unlocks the whole cluster.",
    concept: "Distance = Speed × Time. Relative speed: add speeds when moving toward each other / crossing, subtract when moving in the same direction.",
    formulas: [
      "Speed (km/h) × 5/18 = Speed (m/s)",
      "Time to cross = (sum of lengths) / relative speed",
      "Boat: downstream = b+s, upstream = b−s"
    ],
    examples: [
      { q: "A train 150m long crosses a pole in 10s. Speed?", steps: ["Speed = 150/10 = 15 m/s", "= 15 × 18/5 = 54 km/h"], answer: "54 km/h" }
    ],
    shortcutId: "sc-unit-conv",
    targetTimeSec: 45,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "data-interpretation",
    name: "Data Interpretation",
    category: "DI",
    why: "DI sets carry 15-20 marks in Mains and reward calculation speed and clean data reading more than any other section.",
    concept: "Read the data source fully before touching a question. Identify exactly which values are needed, choose the operation, calculate, then sanity-check the answer's order of magnitude.",
    formulas: [
      "% of total = (part/whole) × 100",
      "Ratio between two categories = value A / value B"
    ],
    examples: [
      { q: "If a store sold 240 units in a category worth 30% of total sales of 800, does that check out?", steps: ["30% of 800 = 240", "Yes — consistent"], answer: "Consistent" }
    ],
    shortcutId: "sc-di-scan",
    targetTimeSec: 90,
    difficultyDefault: "MEDIUM"
  }
];

// Static, hand-verified DI set (table-based). Additional sets can be appended here.
const DI_SETS = [
  {
    id: "di-set-1",
    type: "TABLE",
    sourceType: "PRACTICE",
    title: "Number of employees in 5 companies over 2 years",
    caption: "Table shows number of employees (in hundreds) in companies P, Q, R, S, T in 2024 and 2025.",
    columns: ["Company", "2024", "2025"],
    rows: [
      ["P", 45, 54],
      ["Q", 60, 66],
      ["R", 38, 41],
      ["S", 72, 90],
      ["T", 50, 45]
    ],
    questions: [
      {
        q: "What is the percentage increase in employees of company S from 2024 to 2025?",
        options: ["20%", "22%", "25%", "18%", "30%"],
        answerIndex: 2,
        solution: "Increase = 90−72 = 18. % increase = 18/72 × 100 = 25%.",
        shortcut: "18 is exactly 1/4 of 72 → 25% directly, no long division needed."
      },
      {
        q: "What is the ratio of total employees (2024) of P and Q together to total employees (2025) of R and T together?",
        options: ["105:86", "3:2", "105:100", "21:17", "35:29"],
        answerIndex: 0,
        solution: "P+Q(2024) = 45+60 = 105. R+T(2025) = 41+45 = 86. Ratio = 105:86.",
        shortcut: "Ratio doesn't simplify cleanly — recognizing that early avoids wasted attempts to reduce it."
      },
      {
        q: "Company T's employees decreased by what percentage from 2024 to 2025?",
        options: ["8%", "10%", "12%", "9%", "15%"],
        answerIndex: 1,
        solution: "Decrease = 50−45 = 5. % decrease = 5/50 × 100 = 10%.",
        shortcut: "5 out of 50 is a clean 1/10 — read straight off as 10%."
      },
      {
        q: "Which company had the highest percentage growth from 2024 to 2025?",
        options: ["P", "Q", "R", "S", "T"],
        answerIndex: 3,
        solution: "S grew 18/72 = 25%, the highest among all companies (P≈20%, Q=10%, R≈7.9%, T=−10%).",
        shortcut: "Scan for the largest absolute increase relative to the smallest base first — S stands out on both counts."
      }
    ]
  }
];
