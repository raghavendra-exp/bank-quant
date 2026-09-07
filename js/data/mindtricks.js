// MIND TRICKS DATA
// Sourced and verified via web search (see chat), then rewritten in original wording.
// Nothing here is copied verbatim from any single source — these are standard,
// long-public techniques (finger multiplication, Vedic sutras) described in this app's own voice.

// ---------------------------------------------------------------------------
// QUESTION PATTERN RECOGNITION
// A keyword-spotting index: read the question, spot the phrase, know the topic
// before you've even finished reading. Built from this app's own topic set —
// not copied from any external "trick spotting" resource.
// ---------------------------------------------------------------------------
const QUESTION_PATTERNS = [
  { topic: "percentage", signals: ["% of", "percent of", "increased by __%", "decreased by __%", "what percent"], tip: "Any bare '% of X' or 'increase/decrease by n%' is Percentage — even if it's really a Profit & Loss or DI question wearing a percentage costume." },
  { topic: "profit-loss", signals: ["cost price", "selling price", "CP", "SP", "marked price", "discount of __%", "profit of __%", "loss of __%"], tip: "CP/SP/MP language is the tell. If a discount is mentioned alongside a marked price, it's specifically the Discount subtype." },
  { topic: "si-ci", signals: ["simple interest", "compound interest", "per annum", "compounded annually", "compounded half-yearly"], tip: "'Per annum' plus any interest word means SI/CI. 'Compounded' specifically signals CI, not SI." },
  { topic: "discount-td-bd", signals: ["due in", "present worth", "banker's discount", "true discount", "bill due"], tip: "'Due in X years/months' with a rupee amount is the TD/BD giveaway — don't confuse it with ordinary SI/CI." },
  { topic: "ratio", signals: ["ratio of", "in the ratio", "divided in the ratio"], tip: "A bare 'divided/shared in the ratio a:b' with no capital, time, or race context is plain Ratio." },
  { topic: "partnership", signals: ["invested", "for __ months", "invests", "profit share", "profit ratio"], tip: "Ratio language PLUS an investment amount and a time period together means Partnership, not plain Ratio." },
  { topic: "average", signals: ["average of", "mean of", "average is", "replaced by"], tip: "'Average of' is direct. 'One value is replaced by' is the Average-Replacement subtype specifically." },
  { topic: "ages", signals: ["present age", "years ago", "years hence", "age of", "years old"], tip: "Any question mixing a ratio of ages with a future/past year condition is Ages, even without the word 'age' itself appearing." },
  { topic: "time-work", signals: ["can do a work in", "can complete the work", "days to finish", "efficiency"], tip: "'X can do a work in N days' is the single most recognizable opening line in the entire syllabus." },
  { topic: "pipes-cisterns", signals: ["fills a tank", "empties the tank", "pipe", "cistern"], tip: "Same LCM-efficiency method as Time & Work, but the word 'tank'/'pipe'/'cistern' tells you an outlet might be draining against you." },
  { topic: "tsd", signals: ["km/h", "m/s", "crosses a pole", "crosses a platform", "upstream", "downstream", "meet each other"], tip: "Any unit conversion between km/h and m/s, or 'crosses', signals TSD — trains and boats are just TSD with props." },
  { topic: "mixture-alligation", signals: ["mixed in what ratio", "cheaper", "dearer", "mean price", "milk and water"], tip: "'Mean price' or 'mixed in what ratio' is the alligation trigger — draw the cross immediately." },
  { topic: "quadratic-equations", signals: ["x² ", "y² ", "find the relation between x and y", "I. ", "II. "], tip: "Two numbered equations (I. and II.) asking for a relation between x and y is always this topic, regardless of how the equations are dressed up." },
  { topic: "number-series", signals: ["find the next number", "find the missing number", "what comes next in the series"], tip: "A bare list of numbers ending in '?' or a blank is Number Series — check differences first, ratios second." },
  { topic: "odd-man-out-series", signals: ["find the odd one out", "which does not belong", "find the wrong number"], tip: "Same list-of-numbers shape as Number Series, but asking WHICH one breaks the pattern rather than what comes next." },
  { topic: "simplification", signals: ["simplify", "= ?", "BODMAS"], tip: "A bare arithmetic expression with no story at all is Simplification — resist the urge to overthink it." },
  { topic: "approximation", signals: ["approximately", "≈", "nearest to", "closest to"], tip: "'Approximately' or 'nearest value' is explicit permission to round early and often — don't compute the exact answer." },
  { topic: "data-interpretation", signals: ["the table shows", "the bar graph shows", "the pie chart shows", "study the following"], tip: "Any reference to a table/graph/chart above the question means read the whole data source once before touching question 1." },
  { topic: "permutation-combination", signals: ["in how many ways", "arranged", "selected", "committee of"], tip: "'In how many ways' always means P&C — ask whether order matters to pick between nPr and nCr." },
  { topic: "probability", signals: ["probability that", "probability of drawing", "a bag contains"], tip: "'Probability that/of' plus a bag/dice/card/coin setup is always favorable-over-total counting." },
  { topic: "mensuration", signals: ["area of", "volume of", "perimeter of", "surface area"], tip: "Any area/volume/perimeter word is direct formula substitution — identify the shape first, formula second." },
  { topic: "square-cube-roots", signals: ["√", "∛", "square root of", "cube root of"], tip: "A root symbol with no other context is a direct lookup — recall the nearest memorized square/cube." },
  { topic: "surds-indices", signals: ["^", "power of", "exponent"], tip: "Stacked powers of the same base signal index laws — add/subtract/multiply the exponents, never expand the power." },
  { topic: "logarithms", signals: ["log", "logarithm"], tip: "'log_a(x) = ?' is just an index equation in disguise — convert to exponent form immediately." },
  { topic: "chain-rule", signals: ["men can build", "if __ workers", "how many men are needed"], tip: "Multiple related quantities (men, days, wages) in one sentence, without an explicit ratio given, is Chain Rule — tag each as direct or inverse." },
  { topic: "calendar", signals: ["what day of the week", "January 1", "leap year"], tip: "'What day of the week' always reduces to counting odd days mod 7 — never count days one by one." },
  { topic: "clocks", signals: ["angle between the hands", "hour hand", "minute hand"], tip: "'Angle between the hands' is a direct formula substitution: |30H − 5.5M|." },
  { topic: "races-games", signals: ["gives a start of", "race of", "beats by"], tip: "'Gives a start of X meters' converts straight into a speed ratio — no time variable needed." },
  { topic: "stocks-shares", signals: ["% stock at", "face value", "market value", "dividend"], tip: "'X% stock at ₹Y' is the stocks-and-shares signature — find number of shares first, always." },
  { topic: "heights-distances", signals: ["angle of elevation", "angle of depression", "height of the tower"], tip: "'Angle of elevation/depression' means Height = Distance × tan(angle) — check for 30°/45°/60° first." },
  { topic: "problems-on-numbers", signals: ["sum of two numbers", "a number is", "twice a number"], tip: "A number described only through arithmetic relationships (sum, difference, multiplied by) with no other context is plain algebra translation." },
  { topic: "decimal-fractions", signals: [".", "decimal"], tip: "When a question is pure decimal arithmetic with no percentages or units involved, it's testing decimal-point alignment, not concept." }
];

// ---------------------------------------------------------------------------
// FINGER TRICKS
// Verified against multiple independent sources during research; explanation
// section states the underlying algebra so it's never presented as unexplained magic.
// ---------------------------------------------------------------------------
const FINGER_TRICKS = [
  {
    id: "finger-9-table",
    title: "The 9× table on ten fingers",
    setup: "Hold both hands up, palms facing you. Number your fingers 1 to 10, left pinky = 1 through right pinky = 10.",
    steps: [
      "To find 9 × n, fold down finger number n.",
      "Count the fingers still standing to the LEFT of the folded finger — that's the tens digit.",
      "Count the fingers still standing to the RIGHT of the folded finger — that's the ones digit."
    ],
    example: { q: "9 × 7", walkthrough: "Fold finger 7. Fingers to the left standing: 6 (tens digit). Fingers to the right standing: 3 (ones digit). Answer: 63.", answer: "63" },
    whyItWorks: "Folding finger n leaves (n−1) fingers to the left and (10−n) fingers to the right. Their sum is always (n−1)+(10−n) = 9 — exactly the digit sum of every multiple of 9 up to 90 — so the two counts always land on the correct two digits.",
    range: "Works for 9×1 through 9×10 only."
  },
  {
    id: "finger-6-10-table",
    title: "Multiplying two numbers from 6 to 10",
    setup: "On each hand, number your fingers 6 to 10, thumb = 6 through pinky = 10.",
    steps: [
      "Touch together the finger for the first number (left hand) and the finger for the second number (right hand).",
      "Count the two touching fingers plus every finger below them, on both hands combined. Multiply that count by 10.",
      "Count the fingers still standing above the touching fingers on the left hand, and separately on the right hand. Multiply those two counts together.",
      "Add the two results together."
    ],
    example: { q: "7 × 8", walkthrough: "Touch left finger 7 to right finger 8. Touching+below: left hand has 2 (fingers 6,7), right hand has 3 (fingers 6,7,8) → 2+3=5 → 5×10=50. Standing above: left has 3 (8,9,10), right has 2 (9,10) → 3×2=6. Total: 50+6=56.", answer: "56" },
    whyItWorks: "If x and y are the two numbers (6-10), the touching-and-below count is (x−6)+(y−6)+2 = x+y−10, and the standing-above product is (10−x)(10−y). Multiplying the first by 10 and adding the second algebraically reconstructs x×y exactly — it's the distributive law rearranged, not coincidence.",
    range: "Works for any two numbers from 6×6 through 10×10."
  }
];

// ---------------------------------------------------------------------------
// MAGIC MATH TRICKS (Vedic-style shortcuts)
// Each includes the "when this breaks" caveat per this project's rule against
// presenting a shortcut as universally applicable.
// ---------------------------------------------------------------------------
const MAGIC_TRICKS = [
  {
    id: "magic-square-5",
    title: "Squaring any number ending in 5",
    method: "Drop the 5. Multiply the remaining leading digit(s) by (itself + 1). Write 25 after that result.",
    example: { q: "65²", walkthrough: "Leading part: 6. 6×(6+1) = 6×7 = 42. Append 25 → 4225.", answer: "4225" },
    whyItWorks: "Algebraically, (10a+5)² = 100a(a+1) + 25 for any leading value a. Computing a(a+1) and appending 25 is exactly this identity — not a coincidence of any particular number.",
    whenNotToUse: "Only works for numbers ending in exactly 5 — has no version for other last digits."
  },
  {
    id: "magic-times-11",
    title: "Multiplying a 2-digit number by 11",
    method: "Add the number's two digits together. Write that sum between the original two digits. If the sum is 10 or more, carry the 1 into the left digit.",
    example: { q: "43 × 11", walkthrough: "Digits 4 and 3. Sum = 7. Insert between: 4_7_3 → 473.", answer: "473" },
    example2: { q: "68 × 11", walkthrough: "Digits 6 and 8. Sum = 14. Write 4, carry 1 into the 6 → 7. Result: 7_4_8 → 748.", answer: "748" },
    whyItWorks: "11×(10a+b) = 100a + 10(a+b) + b — placing (a+b) in the tens position between a and b is exactly this expansion; the carry handles the case where a+b exceeds 9.",
    whenNotToUse: "Extends awkwardly to 3+ digit numbers — for those, plain multiplication or the general crosswise method is more reliable."
  },
  {
    id: "magic-nikhilam",
    title: "Multiplying two numbers close to 100 (Nikhilam)",
    method: "Find how far below 100 each number is (its 'deviation'). Cross-subtract: subtract one number's deviation from the other number. That's the first part of the answer. Multiply the two deviations together — that's the last two digits.",
    example: { q: "97 × 96", walkthrough: "Deviations from 100: 97→−3, 96→−4. Cross-subtract: 97−4=93 (or 96−3=93, same result) → left part. Multiply deviations: (−3)×(−4)=12 → right part. Combine: 9312.", answer: "9312" },
    whyItWorks: "Writing each number as (100−d), the product expands to 100×(100−d1−d2) + d1×d2 — the cross-subtraction computes (100−d1−d2) and the deviation product supplies the remaining term exactly.",
    whenNotToUse: "Only efficient when both numbers are close to a clean base (10, 100, 1000) — for numbers far from any round base, it adds complexity instead of removing it."
  },
  {
    id: "magic-times-5",
    title: "Multiplying by 5",
    method: "Multiply by 10, then divide by 2 (equivalently: halve first if the number is even, then multiply by 10).",
    example: { q: "48 × 5", walkthrough: "48 × 10 = 480. 480 ÷ 2 = 240.", answer: "240" },
    whyItWorks: "5 = 10/2, so multiplying by 5 is identical to multiplying by 10 and halving — this is exact, not approximate.",
    whenNotToUse: "N/A — always exact and always at least as fast as direct multiplication by 5."
  },
  {
    id: "magic-times-9",
    title: "Multiplying by 9",
    method: "Multiply by 10, then subtract the original number.",
    example: { q: "37 × 9", walkthrough: "37 × 10 = 370. 370 − 37 = 333.", answer: "333" },
    whyItWorks: "9 = 10 − 1, so n×9 = n×10 − n×1 exactly, by the distributive law.",
    whenNotToUse: "N/A — always exact; becomes especially fast for numbers that are already easy to multiply by 10."
  }
];
