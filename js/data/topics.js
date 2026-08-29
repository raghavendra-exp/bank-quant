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
    id: "quadratic-equations",
    name: "Quadratic Equations",
    category: "ALGEBRA",
    why: "A fixed 5-question block in most Prelims papers (IBPS RRB analysis shows Quadratic Equations appearing consistently). These are pure speed marks once the comparison method is automatic.",
    concept: "Two equations in x and y are given. Solve each for its roots, then compare every root of x against every root of y to decide the relationship (x>y, x<y, x=y, x≥y, x≤y, or no fixed relation).",
    formulas: [
      "For ax²+bx+c=0: roots multiply to c/a and add to −b/a",
      "Factor by finding two numbers that multiply to c and add to b (for a=1)"
    ],
    examples: [
      { q: "I. x² − 7x + 12 = 0  II. y² − 9y + 20 = 0. Find relation.", steps: ["x: (x−3)(x−4)=0 → x=3,4", "y: (y−4)(y−5)=0 → y=4,5", "Every y ≥ every x in the worst case → x ≤ y"], answer: "x ≤ y" }
    ],
    shortcutId: "sc-quad-compare",
    targetTimeSec: 40,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "si-ci",
    name: "Simple & Compound Interest",
    category: "ARITHMETIC",
    why: "SI/CI questions are a direct extension of percentage, and the CI-vs-SI difference formula is a favorite Prelims trap that rewards a memorized shortcut.",
    concept: "Simple Interest is calculated on the original principal every year. Compound Interest is calculated on the accumulating amount (principal + previous interest).",
    formulas: [
      "SI = (P × R × T) / 100",
      "CI (n years) = P × (1 + R/100)ⁿ − P",
      "Difference between CI and SI for 2 years = P × (R/100)²"
    ],
    examples: [
      { q: "Find SI on ₹5000 at 8% for 3 years.", steps: ["SI = 5000×8×3/100", "= 1200"], answer: "₹1200" }
    ],
    shortcutId: "sc-ci-diff",
    targetTimeSec: 45,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "mixture-alligation",
    name: "Mixture & Alligation",
    category: "ARITHMETIC",
    why: "The alligation rule collapses a two-variable mixture problem into a single ratio read directly off the cheaper/dearer/mean prices — one of the fastest tricks in the whole syllabus once trusted.",
    concept: "When two ingredients of different prices are mixed to get a mean price, the ratio in which they're mixed equals (Dearer − Mean) : (Mean − Cheaper).",
    formulas: [
      "Cheaper : Dearer = (Dearer − Mean) : (Mean − Cheaper)"
    ],
    examples: [
      { q: "Mix tea at ₹20/kg and ₹32/kg to get a mean price of ₹26/kg. Find the ratio.", steps: ["Ratio = (32−26):(26−20) = 6:6 = 1:1"], answer: "1:1" }
    ],
    shortcutId: "sc-alligation",
    targetTimeSec: 40,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "partnership",
    name: "Partnership",
    category: "ARITHMETIC",
    why: "Partnership is ratio-thinking applied to capital and time together, and reuses the direct-share ratio shortcut once the capital×time products are found.",
    concept: "When partners invest different amounts for different durations, profit is shared in the ratio of (Capital × Time) for each partner.",
    formulas: [
      "Profit share ratio = C₁T₁ : C₂T₂ : ..."
    ],
    examples: [
      { q: "A invests ₹50,000 for 12 months, B invests ₹80,000 for 6 months. Find the profit ratio.", steps: ["A: 50000×12 = 600000", "B: 80000×6 = 480000", "Ratio = 600000:480000 = 5:4"], answer: "5:4" }
    ],
    shortcutId: "sc-ratio-share",
    targetTimeSec: 45,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "ages",
    name: "Ages",
    category: "ARITHMETIC",
    why: "Age problems are ratio and linear-equation thinking in a familiar wrapper — fast once you set up 'present age = x' and read the future/past condition directly into an equation.",
    concept: "Represent unknown present ages using a common variable (often tied to a given ratio), then convert the word condition (X years ago/hence) into a linear equation.",
    formulas: [
      "If present ages are in ratio m:n, take them as mk and nk",
      "'x years hence' → add x to every age; 'x years ago' → subtract x"
    ],
    examples: [
      { q: "Present ages of A and B are in ratio 3:4. After 6 years, ratio becomes 4:5. Find A's present age.", steps: ["Ages = 3k, 4k", "(3k+6)/(4k+6) = 4/5 → 15k+30 = 16k+24 → k=6", "A's age = 3×6 = 18"], answer: "18 years" }
    ],
    shortcutId: "sc-ratio-share",
    targetTimeSec: 45,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "square-cube-roots",
    name: "Square Roots & Cube Roots",
    category: "FOUNDATION",
    why: "Exact recall of squares up to 30² and cubes up to 15² turns root-extraction questions into instant lookups instead of trial division, and directly speeds up the Approximation and Mensuration topics too.",
    concept: "The square root of n is the number which, multiplied by itself, gives n. The cube root of n is the number which, multiplied by itself three times, gives n.",
    formulas: ["√(a×b) = √a × √b", "∛(a×b) = ∛a × ∛b", "Memorize squares 1–30 and cubes 1–15 cold"],
    examples: [{ q: "√1024 = ?", steps: ["32² = 1024"], answer: "32" }],
    shortcutId: "sc-square-cube-memo",
    targetTimeSec: 20,
    difficultyDefault: "EASY"
  },
  {
    id: "decimal-fractions",
    name: "Decimal Fractions",
    category: "FOUNDATION",
    why: "Decimal arithmetic hides inside DI, SI/CI and approximation questions — aligning decimal points correctly and fast is a prerequisite speed skill, not a standalone topic to skip.",
    concept: "Decimals are fractions with denominator a power of 10. Align decimal points before adding/subtracting; count total decimal places when multiplying.",
    formulas: ["To multiply decimals, multiply as whole numbers then place the decimal point by counting total decimal digits from both numbers"],
    examples: [{ q: "12.5 + 7.25 − 3.75 = ?", steps: ["12.5 + 7.25 = 19.75", "19.75 − 3.75 = 16"], answer: "16" }],
    shortcutId: "sc-decimal-align",
    targetTimeSec: 25,
    difficultyDefault: "EASY"
  },
  {
    id: "problems-on-numbers",
    name: "Problems on Numbers",
    category: "FOUNDATION",
    why: "These translate a word description directly into a one-variable linear equation — the same translation skill used throughout Ages, Partnership and Time & Work word problems.",
    concept: "Represent the unknown number as x, translate the word conditions into an equation, and solve.",
    formulas: ["'Sum of two numbers is S, difference is D' → larger = (S+D)/2, smaller = (S−D)/2"],
    examples: [{ q: "The sum of two numbers is 48 and their difference is 12. Find the larger number.", steps: ["Larger = (48+12)/2 = 30"], answer: "30" }],
    shortcutId: "sc-sum-diff",
    targetTimeSec: 30,
    difficultyDefault: "EASY"
  },
  {
    id: "surds-indices",
    name: "Surds and Indices",
    category: "FOUNDATION",
    why: "Index laws let you simplify large powers without ever multiplying the full numbers out — a direct speed multiplier for anything with exponents.",
    concept: "Indices (exponents) follow fixed laws for multiplication, division and powers of powers.",
    formulas: ["aᵐ × aⁿ = aᵐ⁺ⁿ", "aᵐ ÷ aⁿ = aᵐ⁻ⁿ", "(aᵐ)ⁿ = aᵐⁿ", "a⁰ = 1"],
    examples: [{ q: "2³ × 2⁴ = ?", steps: ["2³⁺⁴ = 2⁷ = 128"], answer: "128" }],
    shortcutId: "sc-index-laws",
    targetTimeSec: 30,
    difficultyDefault: "EASY"
  },
  {
    id: "logarithms",
    name: "Logarithms",
    category: "FOUNDATION",
    why: "Logarithm questions in banking exams are almost always a direct inverse of the index laws you already use — recognizing that connection makes them free marks.",
    concept: "logₐ(x) = n means aⁿ = x. Logarithms convert multiplication into addition: log(xy) = log(x) + log(y).",
    formulas: ["logₐ(aⁿ) = n", "logₐ(xy) = logₐ(x) + logₐ(y)", "logₐ(x/y) = logₐ(x) − logₐ(y)"],
    examples: [{ q: "log₂(32) = ?", steps: ["2⁵ = 32, so log₂(32) = 5"], answer: "5" }],
    shortcutId: "sc-index-laws",
    targetTimeSec: 35,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "chain-rule",
    name: "Chain Rule",
    category: "ARITHMETIC",
    why: "Chain rule questions are the general form behind Time & Work and Partnership — recognizing direct vs inverse proportion between more than two quantities at once is the whole skill.",
    concept: "When multiple quantities vary together, decide whether each pair is directly proportional (both increase together) or inversely proportional (one increases as the other decreases), then set up one combined ratio.",
    formulas: ["Direct proportion: more of one means more of the other, ratios stay equal", "Inverse proportion: more of one means less of the other, product stays constant"],
    examples: [{ q: "If 6 men can build a wall in 10 days, how many men are needed to build it in 4 days?", steps: ["Men × Days is constant (inverse proportion): 6×10 = 15×4", "Men needed = 60/4 = 15"], answer: "15 men" }],
    shortcutId: "sc-chain-rule",
    targetTimeSec: 40,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "pipes-cisterns",
    name: "Pipes and Cisterns",
    category: "ARITHMETIC",
    why: "This is Time & Work with a twist — an outlet pipe works against the inlet pipes — so the same LCM-efficiency method applies with one efficiency subtracted instead of added.",
    concept: "An inlet pipe fills a tank (positive efficiency); an outlet pipe empties it (negative efficiency). Net efficiency is the sum of all efficiencies, inlets positive and outlets negative.",
    formulas: ["Net efficiency = Σ(inlet efficiencies) − Σ(outlet efficiencies)", "Time to fill = Total capacity / Net efficiency"],
    examples: [{ q: "Pipe A fills a tank in 12 hours, pipe B empties it in 20 hours. Both opened together, how long to fill?", steps: ["LCM(12,20)=60 units", "A fills 5/hr, B empties 3/hr → net = 2/hr", "Time = 60/2 = 30 hours"], answer: "30 hours" }],
    shortcutId: "sc-work-lcm",
    targetTimeSec: 45,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "mensuration",
    name: "Mensuration",
    category: "GEOMETRY",
    why: "Mensuration questions are direct formula substitution — the only real skill is keeping the right formula paired with the right shape under time pressure.",
    concept: "Area measures 2D surface, perimeter measures the boundary length, and volume measures 3D space enclosed.",
    formulas: ["Rectangle: Area = l×b, Perimeter = 2(l+b)", "Circle: Area = πr², Circumference = 2πr", "Cube: Volume = a³, Surface area = 6a²"],
    examples: [{ q: "Find the area of a rectangle with length 15 m and breadth 8 m.", steps: ["Area = 15×8 = 120 m²"], answer: "120 m²" }],
    shortcutId: "sc-mensuration-clean",
    targetTimeSec: 35,
    difficultyDefault: "EASY"
  },
  {
    id: "races-games",
    name: "Races and Games of Skill",
    category: "ARITHMETIC",
    why: "A 'head start' problem is really a ratio-of-speeds problem in disguise — once you see that, it reuses the same ratio thinking as Partnership and Time & Work.",
    concept: "If A gives B a head start of h meters in a race of d meters and they finish together, then in the time A covers d meters, B covers only (d−h) meters — so their speed ratio equals d : (d−h).",
    formulas: ["Speed ratio (A:B) = d : (d − head start)"],
    examples: [{ q: "In a 200 m race, A gives B a start of 40 m and they finish together. Find the ratio of their speeds.", steps: ["A:B = 200 : (200−40) = 200:160 = 5:4"], answer: "5:4" }],
    shortcutId: "sc-race-ratio",
    targetTimeSec: 40,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "calendar",
    name: "Calendar",
    category: "MISC",
    why: "Calendar questions reduce to one clean rule (odd days mod 7) once you stop trying to count days on your fingers — a rare topic where memorizing one rule solves 100% of questions.",
    concept: "Each ordinary year contributes 1 'odd day' and each leap year contributes 2, because 365 = 52×7 + 1. Adding total odd days and taking mod 7 tells you how many days of the week have shifted.",
    formulas: ["Ordinary year → 1 odd day. Leap year → 2 odd days.", "Shift in day of week = (total odd days) mod 7"],
    examples: [{ q: "January 1, 2023 was a Sunday. What day was January 1, 2024?", steps: ["2023 is not a leap year → 1 odd day", "Sunday + 1 = Monday"], answer: "Monday" }],
    shortcutId: "sc-odd-days",
    targetTimeSec: 35,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "clocks",
    name: "Clocks",
    category: "MISC",
    why: "The angle-between-hands formula collapses what looks like a geometry problem into one substitution — no diagram needed once the formula is memorized.",
    concept: "The minute hand moves 6° per minute; the hour hand moves 0.5° per minute. The angle between them can be found directly from the time.",
    formulas: ["Angle = |30H − 5.5M| degrees, where H is the hour (0-11) and M is minutes"],
    examples: [{ q: "Find the angle between the hands at 3:00.", steps: ["Angle = |30×3 − 5.5×0| = 90°"], answer: "90°" }],
    shortcutId: "sc-clock-angle",
    targetTimeSec: 35,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "stocks-shares",
    name: "Stocks and Shares",
    category: "ARITHMETIC",
    why: "This is percentage and ratio thinking applied to investment income — once you see market value and face value as just another cheaper/dearer pair, the calculation is routine.",
    concept: "Face value is a share's nominal (printed) value, usually ₹100. Market value is what it actually costs to buy. Dividend is paid as a percentage of face value, not market value.",
    formulas: ["Annual income = (Investment / Market Value) × (Face Value × Rate/100)"],
    examples: [{ q: "Find the annual income from ₹4000 invested in 8% stock at ₹80 (face value ₹100).", steps: ["Number of shares = 4000/80 = 50", "Income = 50 × (100×8/100) = 50×8 = 400"], answer: "₹400" }],
    shortcutId: "sc-stock-income",
    targetTimeSec: 40,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "permutation-combination",
    name: "Permutations & Combinations",
    category: "ALGEBRA",
    why: "Recognizing whether order matters (permutation) or doesn't (combination) is the entire skill — the formulas themselves are direct substitution once that call is made.",
    concept: "A permutation counts arrangements where order matters. A combination counts selections where order doesn't matter.",
    formulas: ["ⁿPᵣ = n!/(n−r)!", "ⁿCᵣ = n!/(r!(n−r)!)"],
    examples: [{ q: "In how many ways can 3 letters be chosen from 5 distinct letters (order doesn't matter)?", steps: ["⁵C₃ = 5!/(3!2!) = 10"], answer: "10" }],
    shortcutId: "sc-choose-vs-arrange",
    targetTimeSec: 35,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "probability",
    name: "Probability",
    category: "ALGEBRA",
    why: "Banking-exam probability rarely goes beyond favorable outcomes ÷ total outcomes — the challenge is counting each side correctly, not advanced theory.",
    concept: "Probability of an event = (Number of favorable outcomes) / (Total number of possible outcomes).",
    formulas: ["P(event) = Favorable outcomes / Total outcomes", "P(not event) = 1 − P(event)"],
    examples: [{ q: "A bag has 4 red and 6 blue balls. Find the probability of drawing a red ball.", steps: ["Total balls = 10", "P(red) = 4/10 = 2/5"], answer: "2/5" }],
    shortcutId: "sc-fav-total",
    targetTimeSec: 35,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "discount-td-bd",
    name: "True Discount & Banker's Discount",
    category: "ARITHMETIC",
    why: "These formalize the difference between the interest a lender actually loses (True Discount) and what a bank charges upfront (Banker's Discount) — a classic banking-exam pairing precisely because it's bank-relevant.",
    concept: "True Discount (TD) is the interest on the present worth (PW) of a bill due in the future. Banker's Discount (BD) is the interest on the full face amount, so BD is always ≥ TD.",
    formulas: ["TD = (Amount × R × T) / (100 + R×T)", "BD = (Amount × R × T) / 100", "BD − TD = (TD × R × T)/100"],
    examples: [{ q: "Find the True Discount on ₹1200 due in 1 year at 10% per annum.", steps: ["TD = (1200×10×1)/(100+10×1) = 12000/110 ≈ 109.09"], answer: "≈ ₹109" }],
    shortcutId: "sc-td-bd",
    targetTimeSec: 45,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "heights-distances",
    name: "Heights and Distances",
    category: "GEOMETRY",
    why: "Every question in this topic uses exactly one relationship (height = distance × tan(angle)) with one of three standard angles — memorizing three tan values solves the whole topic.",
    concept: "The angle of elevation from an observer to a point above is measured from the horizontal. Right-triangle trigonometry connects height, horizontal distance and this angle.",
    formulas: ["tan(angle) = Height / Distance", "tan30°=1/√3, tan45°=1, tan60°=√3"],
    examples: [{ q: "A tower's angle of elevation from a point 50 m away is 45°. Find the height.", steps: ["tan45° = Height/50 = 1", "Height = 50 m"], answer: "50 m" }],
    shortcutId: "sc-standard-angles",
    targetTimeSec: 40,
    difficultyDefault: "MEDIUM"
  },
  {
    id: "odd-man-out-series",
    name: "Odd Man Out and Series",
    category: "FOUNDATION",
    why: "This is Number Series in reverse — instead of finding the next term, you find which of five given terms breaks an otherwise-consistent pattern, which is often faster to spot than to compute.",
    concept: "Four of five given numbers follow a common rule (a pattern of differences, ratios, or a arithmetic operation); the odd one out is the exception.",
    formulas: ["Test the same pattern families as Number Series: constant difference, constant ratio, or a per-term arithmetic rule"],
    examples: [{ q: "Find the odd one: 2, 5, 10, 17, 27, 37", steps: ["Differences: 3,5,7,10,10 — should be 3,5,7,9,11 (odd numbers)", "27 should be 26 instead — 27 is the odd one out"], answer: "27" }],
    shortcutId: "sc-series-scan",
    targetTimeSec: 40,
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
  },
  {
    id: "di-set-2",
    type: "BAR_GRAPH",
    sourceType: "PRACTICE",
    title: "Runs scored by a batsman in 5 matches",
    caption: "Bar graph shows runs scored by a batsman across 5 ODI matches.",
    columns: ["Match", "Runs"],
    rows: [["M1", 45], ["M2", 78], ["M3", 32], ["M4", 91], ["M5", 64]],
    questions: [
      {
        q: "What is the batsman's average runs across all 5 matches?",
        options: ["62", "60", "64", "58", "66"],
        answerIndex: 0,
        solution: "Total = 45+78+32+91+64 = 310. Average = 310/5 = 62.",
        shortcut: "Assume mean 60: deviations −15,+18,−28,+31,+4 = +10 → average = 60+10/5 = 62."
      },
      {
        q: "By what percentage were the runs in M4 more than the runs in M3?",
        options: ["184.4%", "175%", "190%", "168%", "200%"],
        answerIndex: 0,
        solution: "Difference = 91−32 = 59. % more = 59/32 × 100 ≈ 184.4%.",
        shortcut: "59 is nearly double 32 (which would be 200%) — check the exact value only when options are close together, as here."
      },
      {
        q: "What fraction of the total runs were scored in M2 and M5 combined?",
        options: ["71/155", "71/310", "142/310", "1/2", "71/300"],
        answerIndex: 2,
        solution: "M2+M5 = 78+64 = 142. Fraction of total 310 = 142/310.",
        shortcut: "Leave as an unreduced fraction when the options are also unreduced — reducing wastes time the question doesn't reward."
      }
    ]
  },
  {
    id: "di-set-3",
    type: "PIE_CHART",
    sourceType: "PRACTICE",
    title: "Distribution of monthly household expenditure (₹36,000 total)",
    caption: "Pie chart shows percentage of a ₹36,000 monthly budget spent across 5 categories.",
    columns: ["Category", "% of budget"],
    rows: [["Rent", 30], ["Food", 25], ["Transport", 15], ["Savings", 20], ["Other", 10]],
    questions: [
      {
        q: "How much is spent on Food?",
        options: ["₹9,000", "₹8,000", "₹9,500", "₹7,500", "₹10,000"],
        answerIndex: 0,
        solution: "25% of 36000 = 9000.",
        shortcut: "25% = 1/4, so 36000/4 = 9000 directly."
      },
      {
        q: "What is the ratio of amount spent on Rent to amount spent on Savings?",
        options: ["3:2", "2:3", "5:4", "3:1", "4:3"],
        answerIndex: 0,
        solution: "Rent% : Savings% = 30:20 = 3:2 — the ratio of amounts equals the ratio of percentages since both are of the same total.",
        shortcut: "When two slices share the same total, their ratio is just the ratio of their percentages — no need to compute actual rupee amounts."
      },
      {
        q: "How much more is spent on Rent than on Transport?",
        options: ["₹5,400", "₹5,000", "₹6,000", "₹4,800", "₹5,800"],
        answerIndex: 0,
        solution: "Difference in % = 30−15 = 15%. 15% of 36000 = 5400.",
        shortcut: "Subtract percentages first, then apply to the total once — avoids computing both rupee amounts separately."
      }
    ]
  }
];
