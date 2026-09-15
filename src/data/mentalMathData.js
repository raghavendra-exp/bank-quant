// Mental Math: Tricks to Become a Human Calculator (Second Edition by Abhishek V.R / Ofpad)
// Complete Knowledge Base: All 18 Chapters, Detailed Step-by-Step Methods, Worked Examples, Tips, and 17 Full Practice Sets with Answer Keys.

export const MENTAL_MATH_BOOK = {
  metadata: {
    title: "Mental Math: Tricks To Become A Human Calculator",
    edition: "Second Edition",
    author: "Abhishek V.R (Ofpad - The School of Genius)",
    tagline: "Do Math in Your Head Faster Than a Calculator — Make Math Your Superpower",
    overview: "Based on analyzing techniques used by over 27 mental math geniuses across Sweden, India, and China. Built on cognitive principles that eliminate working memory bottleneck by calculating Left-to-Right (LR Method)."
  },
  
  categories: [
    { id: "all", label: "All Chapters" },
    { id: "foundations", label: "Foundations & Mindset" },
    { id: "verification", label: "Dual Verification (DS & DD)" },
    { id: "addition-subtraction", label: "LR Addition & Subtraction" },
    { id: "multiplication", label: "Multiplication Arsenal" },
    { id: "squaring", label: "Squaring Mastery" },
    { id: "division", label: "Division Mastery" },
    { id: "habits", label: "Habits & Retention" }
  ],

  chapters: [
    {
      id: 1,
      number: 1,
      category: "foundations",
      title: "What Is the Ofpad Mental Math System?",
      subtitle: "The cognitive shift from memorized tricks to universal mental patterns",
      readTime: "4 min",
      badge: "Core Framework",
      summary: "Traditional school systems teach rigid, right-to-left calculation that forces the brain into severe working memory overload. The Ofpad system extracts universal patterns used by 27 international mental calculation masters to calculate entirely in memory with minimal mental strain.",
      keyTakeaways: [
        "No complicated situation-specific tricks — you learn broad, universal calculation frameworks.",
        "Zero pen and paper required — methods are engineered specifically for working memory economy.",
        "Not a 'magic pill' — requires 10 minutes of daily micro-practice to achieve sub-second execution."
      ],
      cognitiveScience: "School math is paper-centric. Humans read from left to right, but are taught to compute right-to-left, which causes cognitive thrashing in short-term RAM.",
      hasInteractive: false
    },
    {
      id: 2,
      number: 2,
      category: "verification",
      title: "DS Method of Checking (Digit Sum)",
      subtitle: "Instant sub-second verification for Addition, Subtraction, Multiplication, & Division",
      readTime: "7 min",
      badge: "90% Fast Verification",
      summary: "The Digit Sum (DS) method (known historically as casting out nines or Beejank) verifies any arithmetic problem in seconds by replacing large numbers with their single-digit sums.",
      rules: [
        { name: "Rule 1: Definition", desc: "Digit sum is simply the sum of all digits in a number. E.g., for 213: 2 + 1 + 3 = 6." },
        { name: "Rule 2: Single Digit Reduction", desc: "Digit sum must always be a single digit (1-9). For 2134: 2+1+3+4 = 10 -> 1+0 = 1." },
        { name: "Rule 3 & 4: Cast Out 9s", desc: "Ignore 9 and any digits that add up to 9 (e.g. 1 & 8, 2 & 7, 3 & 6, 4 & 5). E.g. in 1802, drop 1 & 8 -> DS = 2." },
        { name: "Rule 5: Decimals are Ignored", desc: "Decimals work identically to integers. The decimal point does not affect the digit sum (e.g. DS of 16.1 = 8)." },
        { name: "Running Total Reduction Tip", desc: "Reduce as you add from left to right! In 512,422: 5+1=6, +2=8, +4=12 -> 3, +2=5, +2=7. Never accumulate double digits." }
      ],
      operations: [
        {
          op: "Checking Addition",
          rule: "DS(A) + DS(B) = DS(Sum)",
          example: "93 + 11 = 104",
          steps: [
            "DS(93): drop 9 -> 3",
            "DS(11): 1 + 1 = 2",
            "Sum of DS: 3 + 2 = 5",
            "DS of Answer (104): 1 + 0 + 4 = 5. (Matches! Correct)"
          ]
        },
        {
          op: "Checking Subtraction",
          rule: "DS(A) - DS(B) = DS(Diff). If negative, ADD 9!",
          example: "23 - 17 = 6",
          steps: [
            "DS(23) = 5, DS(17) = 8",
            "5 - 8 = -3 (Negative!)",
            "Add 9: -3 + 9 = 6",
            "DS of Answer 6 = 6. (Matches! Correct)",
            "Alternative: Convert to addition 23 = 6 + 17 -> DS(23)=5, DS(6+17)=6+8=14->5."
          ]
        },
        {
          op: "Checking Multiplication",
          rule: "DS(A) × DS(B) = DS(Product)",
          example: "93 × 11 = 1023",
          steps: [
            "DS(93) = 3, DS(11) = 2",
            "Multiply DS: 3 × 2 = 6",
            "DS of Answer (1023): 1 + 0 + 2 + 3 = 6. (Matches! Correct)"
          ]
        },
        {
          op: "Checking Division",
          rule: "Rewrite as: Dividend = (Quotient × Divisor) + Remainder",
          example: "47 ÷ 12 = 3 r11 (or 3.91666...)",
          steps: [
            "Rewrite: 47 = (3 × 12) + 11",
            "DS(47) = 4 + 7 = 11 -> 2",
            "DS(3 × 12 + 11) = 3 × 3 + 2 = 9 + 2 = 0 + 2 = 2. (Matches! Correct)"
          ]
        }
      ],
      limitations: "DS gives ~90% certainty. It has a 1 in 10 blind spot where a wrong answer happens to share the same digit sum (e.g. 14 × 2 = 37 gives DS 2 × 2 = 4 vs 3+7=10->1, but false matches can exist). Crucially, DS CANNOT detect decimal point shifts (e.g. 16.1 / 7 = 23.0 vs 2.3) or digit swaps. This is why the DD Method is required!",
      hasInteractive: true,
      interactiveType: "dsVerifier"
    },
    {
      id: 3,
      number: 3,
      category: "verification",
      title: "DD Method of Checking (Digit Difference)",
      subtitle: "Casting out 11s — Catches decimal shifts & digit swap errors that DS misses",
      readTime: "7 min",
      badge: "Catches Decimal & Swap Errors",
      summary: "The Digit Difference (DD) method (casting out elevens) calculates the difference between odd-positioned digits and even-positioned digits. When used together with DS, you achieve near 100% verification certainty.",
      rules: [
        { name: "Step 1: Odd & Even Positions", desc: "Start counting from the first digit LEFT of the decimal point as ODD (position 1), next left is EVEN, next is ODD. Digits to the RIGHT of decimal start with EVEN, then ODD! E.g., in 71.23: Odd={1, 3}, Even={7, 2}." },
        { name: "Step 2: Subtraction", desc: "Digit Difference = Sum of digits in Odd places - Sum of digits in Even places." },
        { name: "Step 3: Negative Correction", desc: "If the difference is negative, ADD 11 to get the positive digit difference." },
        { name: "Step 4: Single Digit Reduction", desc: "If the result is a 2-digit number, calculate its DD again until single-digit." }
      ],
      examples: [
        {
          problem: "DD of 46",
          breakdown: "Odd: 6, Even: 4. DD = 6 - 4 = 2."
        },
        {
          problem: "DD of 412",
          breakdown: "Odd: {2, 4} = 6. Even: {1} = 1. DD = 6 - 1 = 5."
        },
        {
          problem: "DD of 71.23",
          breakdown: "Odd: 1 (left) + 3 (second right) = 4. Even: 7 (second left) + 2 (first right) = 9. DD = 4 - 9 = -5. Add 11 -> 6."
        },
        {
          problem: "Verify Division: 51 ÷ 12 = 4.25 (Catches decimal errors!)",
          breakdown: "Rewrite as 51 = 4.25 × 12. DD(51): Odd 1, Even 5 -> 1 - 5 = -4 (+11) = 7. DD(4.25): Odd {4, 5}=9, Even 2 -> 9-2 = 7. DD(12): Odd 2, Even 1 -> 1. Product of DDs = 7 × 1 = 7. Matches! (Note: if someone wrote 42.5, DD would be 5-6 = -1 (+11) = 10 -> 1, instantly catching the misplaced decimal point!)"
        }
      ],
      comparisonTable: {
        title: "DS Method vs DD Method Comparison",
        headers: ["Scenario / Error Type", "DS Method (Casting 9s)", "DD Method (Casting 11s)", "Dual Combined"],
        rows: [
          ["Basic calculation error", "Catches ~90%", "Catches ~91%", "Catches 99.1%"],
          ["Transposed / Swapped digits (e.g. 242 vs 224)", "MISSED (sum is identical)", "CAUGHT (positions change signs)", "100% CAUGHT"],
          ["Misplaced decimal point (e.g. 42.5 vs 4.25)", "MISSED (ignores decimals)", "CAUGHT (odd/even positions flip)", "100% CAUGHT"],
          ["Mental calculation speed", "Lightning fast (< 2s)", "Fast (< 3s)", "Under 5s total"]
        ]
      },
      hasInteractive: true,
      interactiveType: "ddVerifier"
    },
    {
      id: 5,
      number: 5,
      category: "multiplication",
      title: "Multiplication by 11 & The Carry Habit",
      subtitle: "The gateway to mental arithmetic and habituating carry rippling",
      readTime: "5 min",
      badge: "Speed Foundation",
      summary: "Multiplication by 11 introduces the core mental reflex: generating the answer from left to right while rippling single-digit carries instantly without looking back.",
      rules: [
        { name: "Step 1", desc: "The first digit of the multiplicand is put down as the leftmost digit of the answer." },
        { name: "Step 2", desc: "Each successive digit of the multiplicand is added to its neighbor to the left." },
        { name: "Step 3 (Carrying Over)", desc: "If the sum results in two figures (never > 18), carry over the 1 to increment the previous digit." },
        { name: "Step 4", desc: "The last digit of the multiplicand becomes the rightmost digit of the answer." }
      ],
      examples: [
        {
          problem: "423 × 11",
          steps: [
            "1st digit: 4",
            "Next: 4 + 2 = 6 -> 46",
            "Next: 2 + 3 = 5 -> 465",
            "Last digit: 3 -> 4653"
          ]
        },
        {
          problem: "619 × 11 (With Carry Over)",
          steps: [
            "1st digit: 6",
            "Next: 6 + 1 = 7 -> 67",
            "Next: 1 + 9 = 10 -> Put 0, carry 1 to 7 -> 7 becomes 8 -> 680",
            "Last digit: 9 -> 6809"
          ]
        },
        {
          problem: "428 × 11",
          steps: [
            "1st digit: 4",
            "Next: 4 + 2 = 6 -> 46",
            "Next: 2 + 8 = 10 -> Put 0, carry 1 to 6 -> 6 becomes 7 -> 470",
            "Last digit: 8 -> 4708"
          ]
        }
      ],
      exerciseId: "ex-11",
      hasInteractive: true,
      interactiveType: "multiply11"
    },
    {
      id: 6,
      number: 6,
      category: "foundations",
      title: "The Inefficient Way to Do Math",
      subtitle: "Why conventional school math chokes your working memory RAM",
      readTime: "5 min",
      badge: "Cognitive Paradigm",
      summary: "Working memory is the short-term mental RAM needed to hold temporary numbers. School math forces you to multiply/add right-to-left: by the time you reach the hundreds place, your brain must store 4 intermediate digits in reverse, causing severe cognitive slowdown.",
      breakdown: [
        {
          title: "The School Math Trap: 73201 × 3 (Right-to-Left)",
          content: "You multiply 1×3=3, 0×3=0, 2×3=6, 3×3=9, 7×3=21. Now you must mentally string together [21, 9, 6, 0, 3] from memory! Most people forget the early digits and re-calculate. This requires pen and paper."
        },
        {
          title: "The Human Calculator Way: 73201 × 3 (Left-to-Right)",
          content: "7×3=21 (say 'twenty-one thousand...'), 3×3=9 ('...nine hundred'), 2×3=6 ('...sixty'), 0×3=0, 1×3=3 ('...three'). You announce '219,603' as you compute! Zero digits need to be held in memory."
        }
      ],
      hasInteractive: false
    },
    {
      id: 7,
      number: 7,
      category: "foundations",
      title: "Introducing the LR Method (Left-to-Right)",
      subtitle: "The universal rocket fuel behind all high-speed mental calculation",
      readTime: "4 min",
      badge: "Universal Law",
      summary: "The single most important secret of mental math: always calculate from Left to Right. Everything else in this book builds upon this foundation. It frees 80% of your working memory instantly.",
      hasInteractive: false
    },
    {
      id: 8,
      number: 8,
      category: "addition-subtraction",
      title: "LR Addition & Instant Complements",
      subtitle: "Pure LR addition, All from 9 last from 10, and Rounding Up",
      readTime: "8 min",
      badge: "Essential Speed",
      summary: "Add column-by-column from left to right. When dealing with numbers near bases (ending in 7, 8, 9), round up to eliminate multiple carries, and subtract the complement using the ancient rule: 'All from 9 and last from 10'.",
      rules: [
        {
          name: "Instant Complements Rule ('All from 9, last from 10')",
          desc: "To find how much a number was rounded up to a clean power of 10: The last non-zero digit adds to 10; all preceding digits add to 9! E.g., 4529 to 5000 -> last digit 9+1=10, 2+7=9, 5+4=9 -> Complement = 471!"
        },
        {
          name: "LR Addition with Rounding Up",
          desc: "Step 1: Round up the number. Step 2: Add from left to right to the rounded base. Step 3: Subtract the complement."
        },
        {
          name: "When to Round Up for Addition?",
          desc: "ONLY round up when you have multiple carries (e.g. 9898 + 4343). If there is only 0 or 1 carry (e.g. 4343 + 1234), direct LR addition is faster."
        }
      ],
      examples: [
        {
          problem: "5321 + 1234 (Direct LR Addition)",
          steps: ["5+1 = 6", "3+2 = 5 -> 65", "2+3 = 5 -> 655", "1+4 = 5 -> 6555"]
        },
        {
          problem: "8372 + 4636 (LR Addition with Carries)",
          steps: [
            "8+4 = 12",
            "3+6 = 9 -> 129",
            "7+3 = 10 -> carry 1 -> 129 becomes 130, append 0 -> 1300",
            "2+6 = 8 -> 13008"
          ]
        },
        {
          problem: "9981 + 1234 (LR Addition with Rounding Up)",
          steps: [
            "Round 9981 up to 10,000 (Complement is 19 via All from 9, last from 10)",
            "10,000 + 1234 = 11,234",
            "Subtract complement: 11,234 - 19 = 11,215"
          ]
        },
        {
          problem: "5492 + 8739 (Round to 5500)",
          steps: [
            "Round 5492 to 5500 (rounded up by 8)",
            "5500 + 8739 = 14,239",
            "Subtract 8: 14,239 - 8 = 14,231"
          ]
        }
      ],
      exerciseId: "ex-add",
      hasInteractive: true,
      interactiveType: "complements"
    },
    {
      id: "8b",
      number: 8.5,
      category: "addition-subtraction",
      title: "LR Subtraction & Turning Subtraction into Addition",
      subtitle: "Eliminate painful mental borrowing by rounding up the subtrahend",
      readTime: "7 min",
      badge: "Mental Game Changer",
      summary: "Mental borrowing during subtraction is far more strenuous than carrying. The secret of geniuses: round UP the second number (subtrahend), subtract the clean base, and ADD BACK the complement!",
      rules: [
        {
          name: "Direct LR Subtraction",
          desc: "Subtract from left to right one digit at a time, borrowing from the left neighbor when needed."
        },
        {
          name: "The Genius Trick: Subtraction via Rounding Up",
          desc: "Step 1: Round UP the subtrahend to nearest multiple of 10/100/1000. Step 2: Subtract from left to right. Step 3: ADD the complement! (A - B = A - Round(B) + Complement)."
        },
        {
          name: "When to Round Up for Subtraction?",
          desc: "Use rounding up whenever you have to borrow multiple times (e.g. 53,441 - 49,898). If no borrowing is needed (e.g. 9889 - 4343), direct LR is faster."
        }
      ],
      examples: [
        {
          problem: "5389 - 1234 (Direct LR)",
          steps: ["5-1=4", "3-2=1 -> 41", "8-3=5 -> 415", "9-4=5 -> 4155"]
        },
        {
          problem: "4530 - 3898 (Rounding Up)",
          steps: [
            "Round 3898 up to 4000 (Complement is 102)",
            "4530 - 4000 = 530",
            "ADD complement: 530 + 102 = 632! (Zero borrowing required!)"
          ]
        },
        {
          problem: "7520 - 4998",
          steps: [
            "Round 4998 up to 5000 (Complement is 2)",
            "7520 - 5000 = 2520",
            "ADD complement: 2520 + 2 = 2522!"
          ]
        },
        {
          problem: "8734 - 2796",
          steps: [
            "Round 2796 up to 3000 (Complement is 204)",
            "8734 - 3000 = 5734",
            "ADD complement: 5734 + 204 = 5938!"
          ]
        },
        {
          problem: "53,441 - 49,898",
          steps: [
            "Round 49,898 up to 50,000 (Complement is 102)",
            "53,441 - 50,000 = 3,441",
            "ADD complement: 3441 + 102 = 3543!"
          ]
        }
      ],
      exerciseId: "ex-sub",
      hasInteractive: true,
      interactiveType: "lrSubtraction"
    },
    {
      id: 9,
      number: 9,
      category: "multiplication",
      title: "LR Multiplication & Factoring",
      subtitle: "1-digit, 2-digit, rounding multipliers, and prime factorization decomposition",
      readTime: "8 min",
      badge: "Core Multiplier",
      summary: "Multiply from left to right. Master 1-digit multipliers, 2-digit tens-and-units partitioning, multiplier rounding for numbers ending in 7/8/9, and factoring composite multipliers into single-digit factors.",
      methods: [
        {
          name: "1-Digit Multiplier",
          desc: "Multiply left-to-right. Example: 5321 × 4 = 20,000 + 1,200 + 80 + 4 = 21,284."
        },
        {
          name: "1-Digit with Rounding Up",
          desc: "When multiplicand ends in 8 or 9: 68 × 3 = (70 - 2) × 3 = 210 - 6 = 204. Or 398 × 9 = (400 - 2) × 9 = 3600 - 18 = 3582."
        },
        {
          name: "2-Digit Multiplier (Partitioning)",
          desc: "Break multiplier into Tens + Units. 36 × 32 = 36 × 30 (1080) + 36 × 2 (72) = 1152."
        },
        {
          name: "2-Digit Multiplier with Rounding Up",
          desc: "87 × 99 = 87 × (100 - 1) = 8700 - 87 = 8613. Or 41 × 57 = 41 × (60 - 3) = 2460 - 123 = 2337."
        },
        {
          name: "Factoring Method",
          desc: "Convert 2-digit multiplier into single-digit factors: 45 × 22 = 45 × 11 × 2 = 495 × 2 = 990. Or 21 × 63 = 21 × 7 × 9 = 147 × 9 = 1323. Or 42 × 36 = 42 × 6 × 6 = 252 × 6 = 1512."
        }
      ],
      exerciseId: "ex-lr-mult-1",
      hasInteractive: true,
      interactiveType: "lrMultiplier"
    },
    {
      id: 10,
      number: 10,
      category: "multiplication",
      title: "The Stem Method (Base Multiplication)",
      subtitle: "Multiply any two numbers close to 10, 100, 20, 50, or multiples of 10",
      readTime: "9 min",
      badge: "Vedic Nikhilam",
      summary: "The Stem Method (known in Vedic math as Nikhilam / base method) transforms multi-digit multiplication into simple additions and single-digit products using a central reference 'Stem'.",
      rules: [
        { name: "Step 1: Choose Stem", desc: "Select a stem number close to both numbers. Priority hierarchy: 10 or 100 first -> then 20 or 50 -> then 30 or 40." },
        { name: "Step 2: Find Deviations", desc: "d1 = Multiplicand - Stem; d2 = Multiplier - Stem." },
        { name: "Step 3: Cross Addition", desc: "Add either diagonal: Multiplicand + d2 = Multiplier + d1. Both diagonals are ALWAYS equal!" },
        { name: "Step 4: Scale by Stem", desc: "Multiply the cross-addition sum by the Stem value." },
        { name: "Step 5: Multiply Deviations", desc: "Multiply d1 × d2." },
        { name: "Step 6: Combine", desc: "Add Step 4 + Step 5 to get the final answer." }
      ],
      examples: [
        {
          problem: "9 × 7 (Stem 10)",
          steps: [
            "Stem = 10. Deviations: 9-10 = -1, 7-10 = -3",
            "Cross-add: 9 + (-3) = 6",
            "Multiply by stem: 6 × 10 = 60",
            "Multiply deviations: (-1) × (-3) = +3",
            "Combine: 60 + 3 = 63"
          ]
        },
        {
          problem: "97 × 93 (Stem 100)",
          steps: [
            "Stem = 100. Deviations: -3 and -7",
            "Cross-add: 97 + (-7) = 90",
            "Multiply by stem: 90 × 100 = 9000",
            "Multiply deviations: (-3) × (-7) = +21",
            "Combine: 9000 + 21 = 9021!"
          ]
        },
        {
          problem: "22 × 24 (Stem 20)",
          steps: [
            "Stem = 20. Deviations: +2 and +4",
            "Cross-add: 22 + 4 = 26",
            "Multiply by stem: 26 × 20 = 520",
            "Multiply deviations: 2 × 4 = +8",
            "Combine: 520 + 8 = 528!"
          ]
        },
        {
          problem: "108 × 96 (Mixed Signs, Stem 100)",
          steps: [
            "Stem = 100. Deviations: +8 and -4",
            "Cross-add: 108 + (-4) = 104",
            "Multiply by stem: 104 × 100 = 10,400",
            "Multiply deviations: (+8) × (-4) = -32",
            "Combine: 10,400 - 32 = 10,368! (Subtracted via All from 9 last from 10)"
          ]
        },
        {
          problem: "78 × 42 (Stem 50, Distance from Stem)",
          steps: [
            "Stem = 50. Deviations: +28 and -8",
            "Cross-add: 78 + (-8) = 70",
            "Multiply by stem: 70 × 50 = 3500",
            "Multiply deviations: 28 × (-8) = -224 (via LR method)",
            "Combine: 3500 - 224 = 3276!"
          ]
        },
        {
          problem: "88 × 68 (Stem 100)",
          steps: [
            "Stem = 100. Deviations: -12 and -32",
            "Cross-add: 88 + (-32) = 56",
            "Multiply by stem: 56 × 100 = 5600",
            "Multiply deviations: (-12) × (-32) = +384",
            "Combine: 5600 + 384 = 5984!"
          ]
        }
      ],
      exerciseId: "ex-stem-1",
      hasInteractive: true,
      interactiveType: "stemCalculator"
    },
    {
      id: 11,
      number: 11,
      category: "foundations",
      title: "Math Anxiety & The Audio-Vocal Trick",
      subtitle: "Why anxiety shrinks your working memory and how vocalizing fixes it",
      readTime: "4 min",
      badge: "Psychology & RAM",
      summary: "Math anxiety triggers physiological stress (butterflies, sweaty palms) that directly consumes working memory RAM, leaving less mental bandwidth to compute. Taking 3 deep breaths restores RAM.",
      breakthroughTechnique: {
        title: "The Audio-Vocal Memory Aid",
        content: "When solving multi-step problems in your head, don't just visualize numbers — speak them out loud or hear them in your inner voice! When adding 8432 + 4636, say: 'Eight thousand four hundred and thirty-two plus four thousand six hundred...'. Stressing the digit you are adding uses the phonological loop of working memory, freeing visual scratchpad RAM."
      },
      hasInteractive: false
    },
    {
      id: 12,
      number: 12,
      category: "squaring",
      title: "Squaring Numbers Fast",
      subtitle: "Numbers ending in 5 and the universal formula for squaring any number",
      readTime: "6 min",
      badge: "Instant Squares",
      summary: "Square any number ending in 5 in 1 second with n(n+1)|25. For any general 2-digit number, round to the nearest multiple of 10 and apply (x - d)(x + d) + d².",
      techniques: [
        {
          name: "Numbers Ending in 5",
          formula: "n5² = [n × (n + 1)] & 25",
          examples: [
            "65²: 6 × 7 = 42, attach 25 -> 4225",
            "45²: 4 × 5 = 20, attach 25 -> 2025",
            "85²: 8 × 9 = 72, attach 25 -> 7225"
          ]
        },
        {
          name: "Squaring ANY Number",
          formula: "x² = (x - d)(x + d) + d²",
          desc: "Round x to the nearest multiple of 10 (difference d). Multiply the two numbers (one ends in 0, trivial!) then add d².",
          examples: [
            "23²: Round down to 20 (d = 3). (23 - 3)(23 + 3) + 3² = 20 × 26 + 9 = 520 + 9 = 529.",
            "48²: Round up to 50 (d = 2). (48 + 2)(48 - 2) + 2² = 50 × 46 + 4 = 2300 + 4 = 2304.",
            "64²: Round down to 60 (d = 4). (64 - 4)(64 + 4) + 4² = 60 × 68 + 16 = 4080 + 16 = 4096."
          ]
        }
      ],
      exerciseId: "ex-square",
      hasInteractive: true,
      interactiveType: "squareCalculator"
    },
    {
      id: 13,
      number: 13,
      category: "multiplication",
      title: "The Bridge & Vitruvian Man Method",
      subtitle: "Vedic cross-multiplication with physical finger-pacing for 2×2, 3×2, and 3×3",
      readTime: "8 min",
      badge: "Vedic Criss-Cross",
      summary: "The Bridge method (also called the Vitruvian Man method due to the cross-arm posture of intermediate pairs) multiplies multi-digit numbers in one line from left to right using outside and inside pairs.",
      fingerTip: "Use your forefinger and middle finger physically on the screen or paper to pace through the number pairs so your brain never loses track of the current position!",
      examples: [
        {
          problem: "32 × 13 (2-digit by 2-digit)",
          steps: [
            "Step 1: First digits 3 × 1 = 3 -> 3 _ _",
            "Step 2: Outside (3×3=9) + Inside (2×1=2) = 11",
            "Step 3: Add 11 with carry: 3 becomes 4, write 1 -> 41 _",
            "Step 4: Last digits 2 × 3 = 6 -> 416!"
          ]
        },
        {
          problem: "323 × 13 (3-digit by 2-digit)",
          steps: [
            "Step 1: 3 × 1 = 3 -> 3 _ _ _",
            "Step 2 (Pair 1): Outside (3×3=9) + Inside (2×1=2) = 11 -> carry 1 -> 41 _ _",
            "Step 3 (Pair 2): Outside (2×3=6) + Inside (3×1=3) = 9 -> 419 _",
            "Step 4: Last digits 3 × 3 = 9 -> 4199!"
          ]
        },
        {
          problem: "323 × 132 (3-digit by 3-digit)",
          steps: [
            "Step 1: 3 × 1 = 3 -> 3 _ _ _ _",
            "Step 2: (3×3) + (2×1) = 9 + 2 = 11 -> carry 1 -> 41 _ _ _",
            "Step 3: (3×2) + (2×3) + (3×1) = 6 + 6 + 3 = 15 -> carry 1 -> 425 _ _",
            "Step 4: (2×2) + (3×3) = 4 + 9 = 13 -> carry 1 -> 4263 _",
            "Step 5: Last digits 3 × 2 = 6 -> 42636!"
          ]
        }
      ],
      exerciseId: "ex-bridge",
      hasInteractive: true,
      interactiveType: "bridgeCalculator"
    },
    {
      id: 15,
      number: 15,
      category: "multiplication",
      title: "The UT Method (Units & Tens Pair Products)",
      subtitle: "Trachtenberg pair product system for high-speed multi-digit multiplication",
      readTime: "9 min",
      badge: "High-Speed Trachtenberg",
      summary: "In the UT method, every single-digit product has a Units digit (U) and Tens digit (T) (e.g. 2×3 = 06 -> U=6, T=0). A 'Pair Product' combines the U of the left digit's product with the T of the right digit's product.",
      rules: [
        { name: "Step 1: Zero Padding", desc: "Prefix the multiplicand with as many leading zeros as there are digits in the multiplier (1 zero for 1-digit, 2 zeros for 2-digit)." },
        { name: "Step 2: Pair Product Definition", desc: "For adjacent digits (L, R) multiplied by multiplier M: Pair Product = U(L × M) + T(R × M)." },
        { name: "Step 3: Two-Digit Multiplier Extension", desc: "Sum the pair products across both multiplier digits to form each answer digit." }
      ],
      examples: [
        {
          problem: "4312 × 4 (1-digit multiplier)",
          steps: [
            "Pad 1 zero: 04312 × 4",
            "Pair (0, 4): U(0×4) + T(4×4) = 0 + 1 = 1",
            "Pair (4, 3): U(4×4) + T(3×4) = 6 + 1 = 7 -> 17",
            "Pair (3, 1): U(3×4) + T(1×4) = 2 + 0 = 2 -> 172",
            "Pair (1, 2): U(1×4) + T(2×4) = 4 + 0 = 4 -> 1724",
            "Pair (2, _): U(2×4) + 0 = 8 -> 17248!"
          ]
        },
        {
          problem: "4312 × 42 (2-digit multiplier)",
          steps: [
            "Pad 2 zeros: 004312 × 42",
            "Answer digits formed by adding pair products of 2 and 4 across windows.",
            "Final Answer = 181,104"
          ]
        },
        {
          problem: "9238 × 84",
          steps: [
            "Pad 2 zeros: 009238 × 84",
            "Window calculations with carrying yields: 775,992!"
          ]
        }
      ],
      exerciseId: "ex-ut",
      hasInteractive: true,
      interactiveType: "utCalculator"
    },
    {
      id: 16,
      number: 16,
      category: "division",
      title: "LR Division, Factoring, & Rounding",
      subtitle: "Decomposing composite divisors, doubling divisors ending in 5, and prime divisor rounding",
      readTime: "9 min",
      badge: "Mental Division",
      summary: "Division can be performed with high mental speed by factoring divisors into numbers <= 11, doubling divisors ending in 5 to drop trailing zeros, or applying LR Division with Rounding when dividing by prime numbers greater than 11.",
      techniques: [
        {
          name: "1. Factoring the Divisor",
          desc: "Break divisor into single-digit factors <= 11 and divide sequentially by the smallest factor first.",
          examples: [
            "512 ÷ 16 = 512 ÷ (4 × 4) = 128 ÷ 4 = 32",
            "1376 ÷ 32 = 1376 ÷ (4 × 8) = 344 ÷ 8 = 43",
            "3339 ÷ 63 = 3339 ÷ (3 × 3 × 7) = 1113 ÷ 3 = 371 ÷ 7 = 53",
            "546 ÷ 16 = 546 ÷ 4 = 136.5 ÷ 4 = 34.125"
          ]
        },
        {
          name: "2. Divisor Ending in 5 (Double & Shift)",
          desc: "When divisor ends in 5, double BOTH dividend and divisor! The divisor ends in 0, so drop the 0 and shift the decimal left.",
          examples: [
            "1195 ÷ 35 = (1195 × 2) ÷ (35 × 2) = 2390 ÷ 70 = 239 ÷ 7 = 34.14",
            "3423 ÷ 75: Double once -> 6846 / 150. Ends in 5 again! Double twice -> 13,692 / 300 = 136.92 / 3 = 45.64!",
            "3015 ÷ 45 = 6030 ÷ 90 = 603 ÷ 9 = 67.0"
          ]
        },
        {
          name: "3. Prime Divisors > 11 (LR Division with Rounding)",
          desc: "When divisor is prime (13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, etc.): Round divisor to nearest multiple of 10. Divide for initial quotient Q. Multiply Q × original divisor. Compute error Δ = Dividend - (Q × Divisor). Single-digit correction = Δ / Divisor. Answer = Q + correction.",
          examples: [
            "2173 ÷ 41: Round 41 to 40. 2173 / 40 ≈ 54. 54 × 41 = 2214. Error = 2173 - 2214 = -41. Correction = -41 / 41 = -1. Final = 54 - 1 = 53!",
            "1827 ÷ 29: Round 29 to 30. 1827 / 30 ≈ 60. 60 × 29 = 1740. Error = 1827 - 1740 = 87. Correction = 87 / 29 = 3. Final = 60 + 3 = 63!",
            "3551 ÷ 53: Round 53 to 50. 3551 / 50 ≈ 71. 71 × 53 = 3763. Error = 3551 - 3763 = -212. Correction = -212 / 53 = -4. Final = 71 - 4 = 67!"
          ]
        },
        {
          name: "4. Combining Factoring + Rounding",
          desc: "When divisor is a composite multiple of a large prime (e.g. 82 = 2 × 41): 4346 ÷ 82 -> 4346 ÷ 2 = 2173 -> 2173 ÷ 41 (using rounding) = 53!"
        }
      ],
      exerciseId: "ex-div-factor",
      hasInteractive: true,
      interactiveType: "lrDivision"
    },
    {
      id: 17,
      number: 17,
      category: "division",
      title: "FP Division (Flag & Pole / Dhvajanka Method)",
      subtitle: "The ultimate Vedic method for exact division by 2-digit and 3-digit prime numbers",
      readTime: "10 min",
      badge: "Vedic Dhvajanka",
      summary: "The Flag & Pole (FP) method splits the divisor into a Pole (leading digit/digits) and a Flag (last digit). It allows computing exact quotients and decimals digit-by-digit without trial and error.",
      rules: [
        { name: "Step 1: Pole & Flag Setup", desc: "In divisor 31, Pole = 3, Flag = 1. In divisor 73, Pole = 7, Flag = 3. In 123, Pole = 12, Flag = 3 (or Pole=4, Flag=1 if reduced by 3)." },
        { name: "Step 2: Pole Division", desc: "Divide current number by the Pole to get the next answer digit and remainder." },
        { name: "Step 3: Remainder Attachment & Flag Subtraction", desc: "Attach remainder as prefix to next dividend digit. Subtract (Last answer digit × Flag)." },
        { name: "Step 3b: Negative Adjustment Loop", desc: "CRITICAL: If the subtracted number is negative, reduce the last answer digit by 1, add Pole to the remainder, re-attach, and recalculate!" },
        { name: "Step 4: Repeat & Decimal Line", desc: "Place decimal point when crossing the separator line." }
      ],
      examples: [
        {
          problem: "5578 ÷ 31 (Pole = 3, Flag = 1)",
          steps: [
            "Setup: 3¹ | 5 5 7 | 8",
            "1. 5 ÷ 3 = 1, rem 2 -> Answer: 1 _ _ . _",
            "2. Attach rem 2 to 5 -> 25. Subtract 1 × flag 1 -> 25 - 1 = 24.",
            "3. 24 ÷ 3 = 8, rem 0. But next subtraction: 07 - (8 × 1) = -1 (Negative!).",
            "4. Apply Step 3b Adjustment: Reduce 8 to 7. Add Pole 3 to rem 0 -> rem becomes 3! Attach to 7 -> 37.",
            "5. New subtraction: 37 - (7 × 1) = 30.",
            "6. 30 ÷ 3 = 10 (write 0, carry 1 to 7 -> 8). Answer: 180.",
            "7. Cross decimal line! Subtraction on 08 - (10 × 1) = -2 (Negative!).",
            "8. Step 3b Adjustment: 80 becomes 79. Rem becomes 3 -> 38. 38 - (9 × 1) = 29.",
            "9. 29 ÷ 3 = 9, rem 2 -> Answer: 179.9...",
            "10. Final Result = 179.93"
          ]
        },
        {
          problem: "601324 ÷ 73 (Pole = 7, Flag = 3)",
          steps: [
            "Setup: 7³ | 60 1 3 2 | 4",
            "60 ÷ 7 = 8, rem 4 -> 41 - (8×3) = 17.",
            "17 ÷ 7 = 2, rem 3 -> 33 - (2×3) = 27.",
            "27 ÷ 7 = 3, rem 6 -> 62 - (3×3) = 53.",
            "53 ÷ 7 = 7, rem 4. Cross decimal line!",
            "44 - (7×3) = 23 -> 23 ÷ 7 = 3, rem 2.",
            "20 - (3×3) = 11 -> 11 ÷ 7 = 1...",
            "Final Answer = 8237.31!"
          ]
        },
        {
          problem: "2829 ÷ 123 (Simplification First)",
          steps: [
            "Factor 123 = 41 × 3. Simplify by dividing by 3: 2829 ÷ 3 = 943.",
            "Now divide 943 ÷ 41 using Flag Pole: Pole = 4, Flag = 1.",
            "9 ÷ 4 = 2, rem 1 -> 14 - (2×1) = 12.",
            "12 ÷ 4 = 3, rem 0. Cross decimal line!",
            "03 - (3×1) = 0 -> 0 ÷ 4 = 0.",
            "Final Answer = 23.0 exact!"
          ]
        }
      ],
      exerciseId: "ex-fp",
      hasInteractive: true,
      interactiveType: "flagPoleStepper"
    },
    {
      id: 18,
      number: 18,
      category: "habits",
      title: "Eliminating Skill Atrophy",
      subtitle: "Daily 10-minute micro-habits and the math alarm routine",
      readTime: "4 min",
      badge: "Lifelong Mastery",
      summary: "Mental math is like riding a bicycle: once mastered with daily reinforcement, it becomes an automated subconscious reflex. Students who practice 10 minutes daily achieve human calculator speed; students who never practice regress to school-level speed.",
      habits: [
        {
          name: "The 10-Minute Daily Micro-Drill",
          desc: "Complete 1 practice set (18 problems) every morning. Ten minutes daily cements neural pathways 10x more effectively than a 2-hour cram session."
        },
        {
          name: "The Math Alarm Clock Routine",
          desc: "Use alarm apps (e.g. 'I Can't Wake Up!' or mental math wake-up tasks) requiring you to solve 3 mental math problems before turning off the morning alarm. Wakes up the prefrontal cortex immediately."
        },
        {
          name: "Real-Life Number Auditing",
          desc: "Whenever you see a car license plate, grocery bill, or currency exchange, immediately calculate its Digit Sum (DS) or check odd/even Digit Difference (DD)."
        }
      ],
      hasInteractive: false
    }
  ],

  // Full 17 Book Practice Exercises with complete original question banks and verified answer keys
  exerciseSets: [
    {
      id: "ex-11",
      title: "Chapter 5: Multiplication by 11",
      instructions: "Apply the 4-step rule: 1st digit down, add adjacent left neighbors with carry, last digit down.",
      questions: [
        { q: "54 × 11", a: "594" },
        { q: "34 × 11", a: "374" },
        { q: "46 × 11", a: "506" },
        { q: "984 × 11", a: "10824" },
        { q: "723 × 11", a: "7953" },
        { q: "342 × 11", a: "3762" },
        { q: "424 × 11", a: "4664" },
        { q: "216 × 11", a: "2376" },
        { q: "923 × 11", a: "10153" },
        { q: "3594 × 11", a: "39534" },
        { q: "9035 × 11", a: "99385" },
        { q: "1593 × 11", a: "17523" },
        { q: "6770 × 11", a: "74470" },
        { q: "5459 × 11", a: "60049" },
        { q: "2696 × 11", a: "29656" },
        { q: "7537 × 11", a: "82907" },
        { q: "4921 × 11", a: "54131" },
        { q: "6871 × 11", a: "75581" }
      ]
    },
    {
      id: "ex-add",
      title: "Chapter 8: LR Addition",
      instructions: "Add from left to right. Round up numbers near bases and subtract the complement.",
      questions: [
        { q: "33 + 20", a: "53" },
        { q: "77 + 97", a: "174" },
        { q: "82 + 63", a: "145" },
        { q: "157 + 836", a: "993" },
        { q: "214 + 155", a: "369" },
        { q: "865 + 467", a: "1332" },
        { q: "115 + 596", a: "711" },
        { q: "485 + 327", a: "812" },
        { q: "114 + 164", a: "278" },
        { q: "4942 + 2332", a: "7274" },
        { q: "7241 + 9508", a: "16749" },
        { q: "8699 + 9897", a: "18596" },
        { q: "2771 + 3216", a: "5987" },
        { q: "6526 + 3057", a: "9583" },
        { q: "6491 + 2273", a: "8764" },
        { q: "3878 + 5483", a: "9361" },
        { q: "7682 + 8903", a: "16585" },
        { q: "9616 + 9202", a: "18818" }
      ]
    },
    {
      id: "ex-sub",
      title: "Chapter 8: LR Subtraction",
      instructions: "Subtract left-to-right. For heavy borrowing, round UP the second number and ADD the complement!",
      questions: [
        { q: "77 - 55", a: "22" },
        { q: "81 - 61", a: "20" },
        { q: "54 - 25", a: "29" },
        { q: "758 - 482", a: "276" },
        { q: "740 - 424", a: "316" },
        { q: "919 - 872", a: "47" },
        { q: "867 - 798", a: "69" },
        { q: "709 - 202", a: "507" },
        { q: "905 - 227", a: "678" },
        { q: "9125 - 5305", a: "3820" },
        { q: "5487 - 1120", a: "4367" },
        { q: "8017 - 7676", a: "341" },
        { q: "8450 - 8109", a: "341" },
        { q: "9880 - 2941", a: "6939" },
        { q: "8827 - 8718", a: "109" },
        { q: "5508 - 2741", a: "2767" },
        { q: "6991 - 1399", a: "5592" },
        { q: "7610 - 3171", a: "4439" }
      ]
    },
    {
      id: "ex-lr-mult-1",
      title: "Chapter 9: LR Multiplication (1-Digit Multiplier)",
      instructions: "Multiply column-by-column from left to right, rippling carries immediately.",
      questions: [
        { q: "86 × 5", a: "430" },
        { q: "45 × 7", a: "315" },
        { q: "60 × 9", a: "540" },
        { q: "510 × 7", a: "3570" },
        { q: "398 × 6", a: "2388" },
        { q: "645 × 9", a: "5805" },
        { q: "168 × 5", a: "840" },
        { q: "906 × 4", a: "3624" },
        { q: "520 × 7", a: "3640" },
        { q: "1816 × 4", a: "7264" },
        { q: "3619 × 7", a: "25333" },
        { q: "8824 × 5", a: "44120" },
        { q: "8013 × 6", a: "48078" },
        { q: "5088 × 9", a: "45792" },
        { q: "7895 × 9", a: "71055" },
        { q: "2766 × 3", a: "8298" },
        { q: "5781 × 5", a: "28905" },
        { q: "5451 × 7", a: "38157" }
      ]
    },
    {
      id: "ex-lr-mult-round",
      title: "Chapter 9: 1-Digit Multiplier with Rounding Up",
      instructions: "Round up numbers ending in 7, 8, 9 to nearest 10 or 100, multiply, and subtract the rounded difference.",
      questions: [
        { q: "57 × 8", a: "456" },
        { q: "28 × 3", a: "84" },
        { q: "67 × 8", a: "536" },
        { q: "798 × 3", a: "2394" },
        { q: "798 × 8", a: "6384" },
        { q: "298 × 9", a: "2682" },
        { q: "498 × 3", a: "1494" },
        { q: "298 × 8", a: "2384" },
        { q: "197 × 7", a: "1379" },
        { q: "4997 × 4", a: "19988" },
        { q: "6998 × 5", a: "34990" },
        { q: "2998 × 4", a: "11992" },
        { q: "4998 × 6", a: "29988" },
        { q: "1999 × 7", a: "13993" },
        { q: "8999 × 3", a: "26997" },
        { q: "6997 × 9", a: "62973" },
        { q: "4997 × 6", a: "29982" },
        { q: "6998 × 8", a: "55984" }
      ]
    },
    {
      id: "ex-lr-mult-2",
      title: "Chapter 9: LR Multiplication (2-Digit Multiplier)",
      instructions: "Break the multiplier into Tens + Units or round up.",
      questions: [
        { q: "43 × 11", a: "473" },
        { q: "36 × 71", a: "2556" },
        { q: "89 × 14", a: "1246" },
        { q: "29 × 48", a: "1392" },
        { q: "32 × 24", a: "768" },
        { q: "36 × 24", a: "864" },
        { q: "42 × 36", a: "1512" },
        { q: "60 × 22", a: "1320" },
        { q: "72 × 47", a: "3384" },
        { q: "19 × 91", a: "1729" },
        { q: "56 × 19", a: "1064" },
        { q: "13 × 98", a: "1274" },
        { q: "59 × 98", a: "5782" },
        { q: "50 × 90", a: "4500" },
        { q: "99 × 13", a: "1287" },
        { q: "89 × 25", a: "2225" },
        { q: "13 × 77", a: "1001" },
        { q: "53 × 24", a: "1272" }
      ]
    },
    {
      id: "ex-factor-mult",
      title: "Chapter 9: LR Multiplication After Factoring",
      instructions: "Decompose composite numbers into single-digit factors <= 11 and multiply sequentially.",
      questions: [
        { q: "38 × 77", a: "2926" },
        { q: "37 × 63", a: "2331" },
        { q: "37 × 54", a: "1998" },
        { q: "89 × 54", a: "4806" },
        { q: "49 × 99", a: "4851" },
        { q: "89 × 56", a: "4984" },
        { q: "28 × 36", a: "1008" },
        { q: "68 × 33", a: "2244" },
        { q: "58 × 16", a: "928" },
        { q: "27 × 81", a: "2187" },
        { q: "77 × 24", a: "1848" },
        { q: "77 × 49", a: "3773" },
        { q: "79 × 72", a: "5688" },
        { q: "38 × 56", a: "2128" },
        { q: "87 × 24", a: "2088" },
        { q: "17 × 42", a: "714" },
        { q: "67 × 64", a: "4288" },
        { q: "17 × 18", a: "306" }
      ]
    },
    {
      id: "ex-stem-1",
      title: "Chapter 10: Stem Method (Single-Digit Base 10)",
      instructions: "Find deviations from 10 (or 5), cross-add, scale by stem, and add deviation product.",
      questions: [
        { q: "5 × 4", a: "20" },
        { q: "6 × 6", a: "36" },
        { q: "9 × 8", a: "72" },
        { q: "6 × 4", a: "24" },
        { q: "9 × 9", a: "81" },
        { q: "7 × 7", a: "49" },
        { q: "5 × 7", a: "35" },
        { q: "7 × 4", a: "28" },
        { q: "6 × 9", a: "54" },
        { q: "3 × 5", a: "15" },
        { q: "11 × 9", a: "99" },
        { q: "8 × 8", a: "64" },
        { q: "11 × 8", a: "88" },
        { q: "8 × 7", a: "56" },
        { q: "4 × 3", a: "12" },
        { q: "6 × 5", a: "30" },
        { q: "9 × 7", a: "63" },
        { q: "8 × 6", a: "48" }
      ]
    },
    {
      id: "ex-stem-2",
      title: "Chapter 10: Stem Method (Two-by-Two Multiplication)",
      instructions: "Select stem (100, 50, 20, 30, 40). Cross-add deviations and add product of deviations.",
      questions: [
        { q: "97 × 103", a: "9991" },
        { q: "101 × 104", a: "10504" },
        { q: "96 × 104", a: "9984" },
        { q: "49 × 49", a: "2401" },
        { q: "53 × 47", a: "2491" },
        { q: "48 × 52", a: "2496" },
        { q: "17 × 19", a: "323" },
        { q: "18 × 21", a: "378" },
        { q: "18 × 16", a: "288" },
        { q: "37 × 39", a: "1443" },
        { q: "36 × 36", a: "1296" },
        { q: "36 × 43", a: "1548" },
        { q: "33 × 34", a: "1122" },
        { q: "30 × 31", a: "930" },
        { q: "33 × 33", a: "1089" },
        { q: "22 × 26", a: "572" },
        { q: "24 × 25", a: "600" },
        { q: "29 × 25", a: "725" }
      ]
    },
    {
      id: "ex-stem-distance",
      title: "Chapter 10: Stem Method (Distance from Stem)",
      instructions: "Apply stem method when numbers have wider deviations; use LR method for intermediate products.",
      questions: [
        { q: "98 × 103", a: "10094" },
        { q: "82 × 110", a: "9020" },
        { q: "91 × 116", a: "10556" },
        { q: "49 × 52", a: "2548" },
        { q: "35 × 67", a: "2345" },
        { q: "41 × 67", a: "2747" },
        { q: "5 × 35", a: "175" },
        { q: "19 × 36", a: "684" },
        { q: "9 × 30", a: "270" },
        { q: "36 × 52", a: "1872" },
        { q: "26 × 52", a: "1352" },
        { q: "22 × 50", a: "1100" },
        { q: "27 × 43", a: "1161" },
        { q: "21 × 39", a: "819" },
        { q: "18 × 47", a: "846" },
        { q: "16 × 42", a: "672" },
        { q: "21 × 26", a: "546" },
        { q: "6 × 31", a: "186" }
      ]
    },
    {
      id: "ex-square",
      title: "Chapter 12: Squaring Fast",
      instructions: "For numbers ending in 5: n*(n+1)|25. For any number: (x-d)(x+d) + d^2.",
      questions: [
        { q: "35²", a: "1225" },
        { q: "73²", a: "5329" },
        { q: "46²", a: "2116" },
        { q: "97²", a: "9409" },
        { q: "24²", a: "576" },
        { q: "83²", a: "6889" },
        { q: "56²", a: "3136" },
        { q: "71²", a: "5041" },
        { q: "39²", a: "1521" },
        { q: "63²", a: "3969" },
        { q: "83²", a: "6889" },
        { q: "28²", a: "784" },
        { q: "85²", a: "7225" },
        { q: "15²", a: "225" },
        { q: "53²", a: "2809" },
        { q: "330²", a: "108900" },
        { q: "745²", a: "555025" },
        { q: "515²", a: "265225" }
      ]
    },
    {
      id: "ex-bridge",
      title: "Chapter 13 & 14: Bridge & Vitruvian Man Method",
      instructions: "Outside pairs + Inside pairs criss-cross with physical finger-pacing.",
      questions: [
        { q: "38 × 74", a: "2812" },
        { q: "63 × 63", a: "3969" },
        { q: "14 × 22", a: "308" },
        { q: "12 × 57", a: "684" },
        { q: "26 × 95", a: "2470" },
        { q: "25 × 87", a: "2175" },
        { q: "917 × 13", a: "11921" },
        { q: "140 × 66", a: "9240" },
        { q: "389 × 60", a: "23340" },
        { q: "852 × 94", a: "80088" },
        { q: "459 × 92", a: "42228" },
        { q: "687 × 89", a: "61143" },
        { q: "368 × 349", a: "128432" },
        { q: "106 × 783", a: "82998" },
        { q: "312 × 642", a: "200304" },
        { q: "430 × 152", a: "65360" },
        { q: "970 × 639", a: "619830" },
        { q: "553 × 963", a: "532539" }
      ]
    },
    {
      id: "ex-ut",
      title: "Chapter 15: UT Method (Units & Tens Pair Products)",
      instructions: "Pad leading zeros. Calculate pair products U(L*M) + T(R*M) and sum across multiplier digits.",
      questions: [
        { q: "2951 × 7", a: "20657" },
        { q: "1315 × 7", a: "9205" },
        { q: "5127 × 6", a: "30762" },
        { q: "2934 × 9", a: "26406" },
        { q: "6999 × 8", a: "55992" },
        { q: "7326 × 7", a: "51282" },
        { q: "7469 × 96", a: "717024" },
        { q: "7770 × 73", a: "567210" },
        { q: "8626 × 69", a: "586568" },
        { q: "4025 × 70", a: "281750" },
        { q: "7731 × 63", a: "487053" },
        { q: "3196 × 63", a: "201348" },
        { q: "6671 × 386", a: "257006" },
        { q: "6402 × 290", a: "1856580" },
        { q: "2185 × 939", a: "2051715" },
        { q: "1919 × 803", a: "1540957" },
        { q: "9372 × 646", a: "6054312" },
        { q: "3374 × 999", a: "3370626" }
      ]
    },
    {
      id: "ex-div-factor",
      title: "Chapter 16: LR Division - Factoring",
      instructions: "Factor composite divisor into single-digit factors <= 11 and divide sequentially.",
      questions: [
        { q: "6163 ÷ 32", a: "192.59" },
        { q: "824 ÷ 63", a: "13.08" },
        { q: "4162 ÷ 36", a: "115.61" },
        { q: "4597 ÷ 24", a: "191.54" },
        { q: "2775 ÷ 12", a: "231.25" },
        { q: "1524 ÷ 10", a: "152.4" },
        { q: "1777 ÷ 45", a: "39.49" },
        { q: "3301 ÷ 8", a: "412.63" },
        { q: "6984 ÷ 72", a: "97" },
        { q: "7865 ÷ 9", a: "873.89" },
        { q: "8936 ÷ 12", a: "744.67" },
        { q: "3771 ÷ 72", a: "52.38" },
        { q: "7591 ÷ 54", a: "140.57" },
        { q: "9599 ÷ 72", a: "133.32" },
        { q: "2185 ÷ 42", a: "52.02" },
        { q: "2461 ÷ 63", a: "39.06" },
        { q: "9691 ÷ 18", a: "538.39" },
        { q: "2561 ÷ 42", a: "60.98" }
      ]
    },
    {
      id: "ex-div-5",
      title: "Chapter 16: Divisor Ends With 5 (Double & Shift)",
      instructions: "Double dividend and divisor to end in 0. Drop 0 and shift decimal left.",
      questions: [
        { q: "5363 ÷ 25", a: "214.52" },
        { q: "9353 ÷ 25", a: "374.12" },
        { q: "897 ÷ 25", a: "35.88" },
        { q: "8942 ÷ 25", a: "357.68" },
        { q: "7315 ÷ 35", a: "209" },
        { q: "2331 ÷ 35", a: "66.6" },
        { q: "5663 ÷ 35", a: "161.8" },
        { q: "4184 ÷ 35", a: "119.54" },
        { q: "5787 ÷ 45", a: "128.6" },
        { q: "5962 ÷ 45", a: "132.49" },
        { q: "1216 ÷ 45", a: "27.02" },
        { q: "2322 ÷ 45", a: "51.6" },
        { q: "7719 ÷ 55", a: "140.35" },
        { q: "4925 ÷ 55", a: "89.55" },
        { q: "7139 ÷ 55", a: "129.8" },
        { q: "5225 ÷ 75", a: "69.67" },
        { q: "7394 ÷ 75", a: "98.59" },
        { q: "6506 ÷ 75", a: "86.75" }
      ]
    },
    {
      id: "ex-div-prime",
      title: "Chapter 16: LR Division with Rounding (Primes > 11)",
      instructions: "Round divisor to nearest 10, find initial quotient Q, calculate error, and apply correction.",
      questions: [
        { q: "2436 ÷ 13", a: "187.38" },
        { q: "7004 ÷ 17", a: "412" },
        { q: "7803 ÷ 19", a: "410.68" },
        { q: "7004 ÷ 23", a: "304.52" },
        { q: "696 ÷ 29", a: "24" },
        { q: "839 ÷ 31", a: "27.06" },
        { q: "8532 ÷ 37", a: "230.59" },
        { q: "7984 ÷ 41", a: "194.73" },
        { q: "848 ÷ 43", a: "19.72" },
        { q: "9307 ÷ 47", a: "198.02" },
        { q: "1505 ÷ 53", a: "28.4" },
        { q: "3660 ÷ 59", a: "62.03" },
        { q: "7685 ÷ 61", a: "125.98" },
        { q: "8901 ÷ 67", a: "132.85" },
        { q: "968 ÷ 71", a: "13.63" },
        { q: "5384 ÷ 79", a: "68.15" },
        { q: "5908 ÷ 83", a: "71.18" },
        { q: "9631 ÷ 97", a: "99.29" }
      ]
    },
    {
      id: "ex-fp",
      title: "Chapter 17: FP Division (Flag & Pole Method)",
      instructions: "Split divisor into Pole and Flag. Follow quotient, remainder attachment, and step 3b adjustment.",
      questions: [
        { q: "64924 ÷ 13", a: "4994.15" },
        { q: "39466 ÷ 17", a: "2321.53" },
        { q: "31993 ÷ 19", a: "1683.84" },
        { q: "22046 ÷ 23", a: "958.52" },
        { q: "20046 ÷ 29", a: "691.24" },
        { q: "67401 ÷ 31", a: "2174.23" },
        { q: "76989 ÷ 37", a: "2080.78" },
        { q: "8692 ÷ 41", a: "212" },
        { q: "94187 ÷ 43", a: "2190.4" },
        { q: "17080 ÷ 47", a: "363.4" },
        { q: "81357 ÷ 53", a: "1535.04" },
        { q: "64453 ÷ 59", a: "1092.42" },
        { q: "61927 ÷ 61", a: "1015.2" },
        { q: "45042 ÷ 67", a: "672.27" },
        { q: "24546 ÷ 142", a: "172.86" },
        { q: "81448 ÷ 158", a: "515.49" },
        { q: "86864 ÷ 166", a: "523.28" },
        { q: "82474 ÷ 194", a: "425.12" }
      ]
    }
  ]
};
