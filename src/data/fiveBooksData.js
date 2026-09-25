// Five Books Speed & Concepts Master Compendium
// Synthesized from:
// 1. Magical Book on Quicker Maths - M. Tyra
// 2. Fast Track Objective Arithmetic - Rajesh Verma
// 3. Quantitative Aptitude for Competitive Examinations - R.S. Aggarwal
// 4. Daksh Quant Speed Math - Shantanu Shukla
// 5. PW Banking Game Changer Quantitative Aptitude - Sumit Sir

export const FIVE_BOOKS_DATA = [
  {
    id: "m-tyra",
    name: "Magical Book on Quicker Maths",
    author: "M. Tyra (BSC Publishing)",
    tagline: "Direct Shortcut Formulas & High-Speed Mental Arithmetic",
    badge: "Quicker Maths Pioneer",
    color: "from-amber-600 to-orange-700",
    themeColor: "amber",
    overview: "M. Tyra's seminal work revolutionized competitive arithmetic by converting multi-step algebraic problems into single-line direct formulas and Alligation cross-methods. Highly revered for cutting calculation steps by 60% in banking exams.",
    coreStrengths: [
      "Universal Alligation cross-difference method applicable across 6 arithmetic chapters.",
      "Direct closed-form formulas for CI-SI 2-year and 3-year differences.",
      "Base surplus/deficit mental multiplication for rapid calculation.",
      "Unitary time & work shortcuts that eliminate fraction addition.",
      "Relative speed formulas for single and double train crossings."
    ],
    signatureFormulas: [
      {
        title: "Universal Alligation Rule",
        formula: "(Cheaper Quantity) / (Dearer Quantity) = (d - m) / (m - c)",
        application: "Mixtures, Averages, Profit & Loss, Simple Interest, Speed & Time",
        example: "Tea at ₹60/kg and ₹85/kg mixed to get ₹75/kg. (85-75) / (75-60) = 10/15 = 2:3 ratio!",
        timeSaved: "25 seconds"
      },
      {
        title: "2-Year and 3-Year CI-SI Difference Formulas",
        formula: "2-Yr Diff = P × (R/100)² | 3-Yr Diff = P × (R/100)² × (3 + R/100)",
        application: "Compound vs Simple Interest comparison in Prelims & Mains",
        example: "P = ₹10,000, R = 10%, 3 years. Diff = 10,000 × (1/100) × (3.1) = ₹310 directly!",
        timeSaved: "45 seconds"
      },
      {
        title: "Time & Work Direct Pairs",
        formula: "Two workers: (A × B) / (A + B) | Three workers: (A × B × C) / (AB + BC + CA)",
        application: "Pipes & Cisterns, Work Efficiency",
        example: "A does in 12 days, B in 24 days. Combined = (12 × 24) / (12 + 24) = 288 / 36 = 8 days.",
        timeSaved: "20 seconds"
      },
      {
        title: "Two Trains Crossing Each Other",
        formula: "Opposite: T = (L₁ + L₂) / (S₁ + S₂) | Same Direction: T = (L₁ + L₂) / (S₁ - S₂)",
        application: "Time, Speed & Distance",
        example: "Two 150m trains at 40 km/h and 50 km/h opposite. T = 300m / (90 × 5/18 m/s) = 300 / 25 = 12 seconds!",
        timeSaved: "30 seconds"
      },
      {
        title: "Dishonest Dealer Gain Percentage",
        formula: "Gain% = [Error / (True Value - Error)] × 100%",
        application: "Profit & Loss faulty weights",
        example: "Uses 900g weight instead of 1kg. Gain% = [100 / (1000 - 100)] × 100% = 100/900 × 100% = 11.11%",
        timeSaved: "25 seconds"
      }
    ]
  },
  {
    id: "rajesh-verma",
    name: "Fast Track Objective Arithmetic",
    author: "Rajesh Verma (Arihant Publications)",
    tagline: "Extensive Practice, Shortcut Techniques & Core Arithmetic Basics",
    badge: "Practice Powerhouse",
    color: "from-blue-600 to-indigo-700",
    themeColor: "blue",
    overview: "Rajesh Verma's Fast Track Objective Arithmetic provides an extensive taxonomy of arithmetic question variations. Renowned for its foundational breakdowns, successive percentage algorithms, and Vedic Duplex squaring methodology.",
    coreStrengths: [
      "Duplex Method (Dwandwa Yoga) for squaring any 2-digit, 3-digit, or 4-digit number.",
      "Successive percentage change and equivalent discount formulas.",
      "Comprehensive fraction-to-percentage continuum (1/1 through 1/30).",
      "Prime factorization shortcuts for LCM and HCF.",
      "Exhaustive graded exercises from Level 1 (Clerk) to Level 2 (PO/Mains)."
    ],
    signatureFormulas: [
      {
        title: "Duplex Method for Squaring (Dwandwa Yoga)",
        formula: "D(a) = a² | D(ab) = 2ab | D(abc) = 2ac + b²",
        application: "Squaring any number mentally",
        example: "64²: D(6) | D(6,4) | D(4) = 36 | 48 | 16 = 4096 in one line.",
        timeSaved: "20 seconds"
      },
      {
        title: "Successive Percentage Formula",
        formula: "Net Change% = A + B + (A × B) / 100",
        application: "Discounts, Population Growth, Compound Interest, Area changes",
        example: "Lengths increased by 20% and breadth decreased by 10%. Net = 20 - 10 - 200/100 = +8% increase.",
        timeSaved: "15 seconds"
      },
      {
        title: "Successive Discount Equivalence",
        formula: "Single Equivalent Discount = D₁ + D₂ - (D₁ × D₂) / 100",
        application: "Marked price and discount problems",
        example: "Two successive discounts of 20% and 15%. Single = 20 + 15 - 300/100 = 32% discount.",
        timeSaved: "15 seconds"
      },
      {
        title: "LCM of Fractions Shortcut",
        formula: "LCM of Fractions = LCM(Numerators) / HCF(Denominators)",
        application: "Number Systems, Cyclic bells, Circular tracks",
        example: "LCM(2/3, 4/9, 5/6) = LCM(2,4,5) / HCF(3,9,6) = 20 / 3.",
        timeSaved: "18 seconds"
      }
    ]
  },
  {
    id: "rs-aggarwal",
    name: "Quantitative Aptitude for Competitive Examinations",
    author: "Dr. R.S. Aggarwal (S. Chand)",
    tagline: "Foundational Clarity & Universal Arithmetic Reference",
    badge: "Absolute Beginner to Master",
    color: "from-emerald-600 to-teal-700",
    themeColor: "emerald",
    overview: "The uncontested gold standard for foundational mathematical clarity in India. Dr. R.S. Aggarwal's text systematically deconstructs every arithmetic and number system concept, establishing bulletproof conceptual fundamentals.",
    coreStrengths: [
      "Rigorous number system foundations: divisibility rules (2 through 19), prime factors.",
      "Unit digit cyclicity law for powers (cyclicity 4 for 2, 3, 7, 8).",
      "Surds, indices, and rationalizing denominators.",
      "Algebraic simplification identities and remainder theorem.",
      "Step-by-step logical clarity that guarantees zero conceptual confusion."
    ],
    signatureFormulas: [
      {
        title: "Unit Digit Cyclicity Law",
        formula: "Power mod 4 determines unit digit for 2, 3, 7, 8 | Cyclicity 2 for 4, 9 | Cyclicity 1 for 0, 1, 5, 6",
        application: "Simplification and Number System unit digits",
        example: "Unit digit of 7⁹⁵: 95 mod 4 = 3 → 7³ = 343 → Unit digit is 3!",
        timeSaved: "30 seconds"
      },
      {
        title: "Cubic Algebraic Simplification Identity",
        formula: "If a + b + c = 0, then a³ + b³ + c³ = 3abc",
        application: "Simplification & Algebraic identities",
        example: "(28)³ + (-15)³ + (-13)³ = 3 × 28 × (-15) × (-13) = 16,380 instantly!",
        timeSaved: "40 seconds"
      },
      {
        title: "Sum of First n Natural Numbers, Squares & Cubes",
        formula: "Σn = n(n+1)/2 | Σn² = n(n+1)(2n+1)/6 | Σn³ = [n(n+1)/2]²",
        application: "Series, Progressions, Averages",
        example: "Sum of squares from 1 to 10: 10 × 11 × 21 / 6 = 385.",
        timeSaved: "30 seconds"
      },
      {
        title: "Remainder Theorem & Fermat's Little Theorem",
        formula: "(a^p - a) is divisible by p (if p is prime), or a^(p-1) ≡ 1 (mod p)",
        application: "Advanced remainder questions",
        example: "Remainder when 2³¹ is divided by 31: by Fermat's theorem, 2³⁰ ≡ 1 mod 31, so 2³¹ leaves remainder 2!",
        timeSaved: "35 seconds"
      }
    ]
  },
  {
    id: "shantanu-shukla",
    name: "Daksh Quant Speed Math",
    author: "Shantanu Shukla (Adda247)",
    tagline: "Modern Banking Exam Speed Math, 20-Min Prelims Strategy & DI",
    badge: "Speed Math Specialist",
    color: "from-purple-600 to-pink-700",
    themeColor: "purple",
    overview: "Specifically engineered for modern SBI Clerk, IBPS PO, and RRB Prelims. Shantanu Shukla's Daksh system teaches zero-to-hero speed techniques, option elimination, 2-second quadratic sign rules, and split percentage methods.",
    coreStrengths: [
      "The 20-Minute Prelims Paper Blueprint: question selection order for 35/35 attempts.",
      "Quadratic sign-flip rule: solve quadratic pairs in 3 to 5 seconds.",
      "Percentage Split & Interchange Law (x% of y = y% of x).",
      "Layered difference pattern recognition for Missing and Wrong number series.",
      "Approximation techniques that round strategically to avoid traps."
    ],
    signatureFormulas: [
      {
        title: "Quadratic Equation Sign-Flip 3-Second Rule",
        formula: "Eq (+, +) → Roots (-, -) | Eq (-, +) → Roots (+, +) | Eq (+, -) → (-, +) | If both c < 0 → CND!",
        application: "5 marks in 2 minutes in all Bank Prelims",
        example: "x² - 18x + 77 = 0 and y² - 13y + 42 = 0. Both eq (-, +) so all roots positive. x = (11, 7), y = (7, 6) → x ≥ y.",
        timeSaved: "40 seconds"
      },
      {
        title: "Percentage Interchange Law",
        formula: "x% of y = y% of x = (x × y) / 100",
        application: "Converting difficult percentages into friendly fractions",
        example: "84% of 250 = 250% of 84 = 2.5 × 84 = 210 in 3 seconds!",
        timeSaved: "20 seconds"
      },
      {
        title: "Percentage Split Method",
        formula: "Break awkward percentages into 50% ± 10% ± 1% ± 0.5%",
        application: "Simplification and DI calculations",
        example: "47.5% of 640 = 50% (320) - 2.5% (16) = 304.",
        timeSaved: "25 seconds"
      },
      {
        title: "Number Series Tiered Difference Protocol",
        formula: "Diff 1 → Diff 2 → Check Primes / Squares / (× N + M)",
        application: "Missing and Wrong Number Series",
        example: "12, 14, 18, 26, 42, ?: Diff = 2, 4, 8, 16 → next diff is 32 → 42 + 32 = 74.",
        timeSaved: "20 seconds"
      }
    ]
  },
  {
    id: "sumit-sir",
    name: "PW Banking Game Changer Quantitative Aptitude",
    author: "Sumit Sir (Physics Wallah Banking Wallah)",
    tagline: "3000+ PYQ Patterns, Prelims to Mains Transition & Exam Simulator",
    badge: "Mains & DI Maestro",
    color: "from-rose-600 to-red-800",
    themeColor: "rose",
    overview: "Authored by Physics Wallah's lead banking quant faculty, Sumit Sir's Game Changer bridges the chasm between Prelims speed math and high-complexity Mains DI. Known for its ratio-based CI approach and multi-step arithmetic modeling.",
    coreStrengths: [
      "Ratio method for Compound Interest: eliminating the exponential formula entirely.",
      "Profit & Loss chain multipliers (CP → MP → SP) in a single equation.",
      "Mixture replacement formula for repeated withdrawals.",
      "High-weightage Mains DI decoding: Radar, Missing Table, Funnel, and Caselet DI.",
      "Data Sufficiency and Quantity Comparison (Q1 vs Q2) frameworks."
    ],
    signatureFormulas: [
      {
        title: "Ratio Method for Compound Interest",
        formula: "Rate = 1/x → Principal : Amount = x^t : (x+1)^t | CI = (x+1)^t - x^t",
        application: "Compound Interest without calculation strain",
        example: "16 2/3% = 1/6 for 3 years. P : A = 6³ : 7³ = 216 : 343. If CI = ₹1270, 1 unit = 10, P = ₹2,160!",
        timeSaved: "50 seconds"
      },
      {
        title: "Profit, Markup & Discount Chain Multiplier",
        formula: "SP = CP × (1 + Markup%) × (1 - Discount%)",
        application: "Profit & Loss multi-step problems",
        example: "Marked up by 40%, discount of 20%. SP = CP × 1.4 × 0.8 = CP × 1.12 → Profit = 12% directly.",
        timeSaved: "25 seconds"
      },
      {
        title: "Mixture Repeated Replacement Formula",
        formula: "Remaining Liquid = Initial × [1 - (Removed / Total)]^n",
        application: "Mixtures with repeated milk/water withdrawals",
        example: "80L pure milk. 8L replaced with water twice. Milk left = 80 × (1 - 8/80)² = 80 × 0.81 = 64.8L!",
        timeSaved: "35 seconds"
      },
      {
        title: "Arithmetic to Caselet DI Decoding Framework",
        formula: "Translate word statements into Venn or 2-way contingency table first before solving questions",
        application: "Caselet DI in SBI & IBPS Clerk Mains",
        example: "Populate total, then intersections, then single-variable remainders. Cuts reading time by half.",
        timeSaved: "120 seconds"
      }
    ]
  }
];
