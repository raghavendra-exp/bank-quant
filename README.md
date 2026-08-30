# Banking Quant Master

**Learn Concepts. Calculate Faster. Solve Smarter.**

An interactive, entirely browser-based Quantitative Aptitude learning and speed-training system for Indian banking exams (SBI Clerk, IBPS Clerk, IBPS RRB Office Assistant), built to extend to any future exam.

## ⚠️ If you deployed an earlier version and pages look empty/broken (v3 → v4 fix)

If you loaded this site even once before (e.g. on GitHub Pages) and pages now show only their first card with everything else missing, **this is a stale service worker, not missing content** — the underlying data (32 topics, 500+ verified questions each) is all still there. Earlier versions of `sw.js` cached files cache-first with no version bump, so a browser that visited once keeps serving the old cached JS forever regardless of what gets redeployed. This is fixed in `sw.js` (now network-first, cache version bumped to `bqm-cache-v2`), but you may need to force your browser to drop the old registration once:
- Easiest: open the site in a private/incognito window to confirm it's fixed there.
- Permanent fix on your regular browser: DevTools → Application → Service Workers → Unregister (or "Update on reload"), then hard-refresh.

A second, unrelated bug was also found and fixed in this pass: the Speed Lab topic matrix and Data Interpretation tables built their `<tr>`/`<thead>` rows by injecting HTML into a plain `<div>`, which browsers silently drop per the HTML5 fragment-parsing spec (table-section tags require an actual `<table>` context). Both now build the entire table, including rows, as one valid HTML string, which resolves this correctly.

## v5 update: two examples per topic, real DI charts

- Every one of the 32 topics' Learn pages now has 2 worked examples (was 1) covering different sub-patterns of that topic — e.g. Percentage now shows both a successive-change example and a basic "x% of y" example. All new example arithmetic was independently verified with a script, not just eyeballed.
- Data Interpretation sets tagged `BAR_GRAPH` and `PIE_CHART` now render as actual inline SVG charts (a real bar chart and a real pie chart with legend), not a plain data table. The `TABLE` type DI set still renders as a table, since that's the correct format for that data. No external chart library — plain hand-built SVG, so nothing new to load or cache.
- On sourcing this content: none of it came from any uploaded book or notes file. One uploaded file in particular ("Maths_tricks.pdf") was watermarked as paid coaching material being redistributed without authorization; it was not used for anything, including as inspiration for wording or problem selection.

## What this version actually includes (v3)

This is a real, working version, not a mockup. Included now:

- **Dashboard, Speed Lab, Shortcut Library (25 cards), Mistake Book, Progress, PYQ Trends, Sources** — same as before
- **Learn + Practice — 32 topics total.** 31 have deterministic seeded generators (each independently verified to produce 500+ unique, arithmetically-correct questions); Data Interpretation uses 3 hand-verified sets (table, bar graph, pie chart) instead, since generating self-consistent multi-part datasets safely is a different problem from generating single-answer arithmetic.

Topic list: Simplification, Approximation, Number Series, Percentage, Ratio, Average, Profit & Loss, Time & Work, Time-Speed-Distance, Quadratic Equations, Simple & Compound Interest, Mixture & Alligation, Partnership, Ages, Square Roots & Cube Roots, Decimal Fractions, Problems on Numbers, Surds and Indices, Logarithms, Chain Rule, Pipes and Cisterns, Mensuration, Races and Games, Calendar, Clocks, Stocks and Shares, Permutations & Combinations, Probability, True Discount & Banker's Discount, Heights and Distances, Odd Man Out and Series, Data Interpretation.

The last 17 of these were added to match the standard chapter list of R.S. Aggarwal's *Quantitative Aptitude* — see "On the uploaded textbooks" below for how that was done without copying the book's content.

### On the uploaded textbooks (R.S. Aggarwal, Sarvesh K. Varma)
These are copyrighted, commercially published books, and one of the uploaded copies carried clear piracy-distribution watermarks. No text, questions, or explanations were extracted or reproduced from either book anywhere in this project — personal, non-commercial use does not change that. What was used: R.S. Aggarwal's publicly-known chapter *list* (a standard table of contents, not creative content) to make sure this app's topic coverage was complete. Every formula, worked example, generator, and shortcut was then written from general, standard knowledge of these question types — the same content you'd find describing "Pipes and Cisterns" or "Heights and Distances" in any banking-exam prep resource — not copied from a specific source.

### On PYQs
SBI and IBPS **do not publish official past question papers** — see the PYQ Trends page and the note further down for what that means for this app's PYQ content.

### Question generator verification (updated)
All 31 generator-backed topics were re-tested after this expansion:
- **Uniqueness**: 4,000 seeds per topic → every topic produced 508–4,000 unique question strings (closest margins: Permutations & Combinations at 608, Number Series at 896 — still comfortably over the 500 target).
- **Correctness**: thousands of generated questions per topic were independently recomputed from the question text via regex and compared to the displayed answer. This caught **two real bugs** before shipping:
  1. A floating-point precision bug in Permutations & Combinations — computing full factorials of n up to 40 (e.g. 40!) exceeds double-precision accuracy and produced garbage answers like `1560.0000000000002`. Fixed by computing ⁿPᵣ as a direct bounded product (at most 10 multiplications) instead of a factorial ratio.
  2. A double-rounding bug in Heights & Distances — rounding the height to 1 decimal place and then rounding again to a whole number occasionally shifted the final answer by 1 compared to rounding the exact value once. Fixed by rounding exactly once, consistently, in both the option and the solution text.
- Zero mismatches remained after both fixes, across every topic checked.

### Critical rendering bug found and fixed (from real screenshots)
After the v3 expansion, real browser screenshots showed almost every page rendering only its first card — Learn pages showed the topic header but no concept/formulas/examples/shortcut, Practice showed a timer but no question or options, Speed Lab/Progress/Sources showed only their opening card. The cause: the `el()` helper (which turns an HTML template string into a DOM node) only ever returned `firstElementChild`, silently discarding every sibling element after the first. Most render functions build several stacked `.ledger-card` sections in one template string, so everything past the first was being built and then thrown away before it ever reached the page — not a data or content problem, a rendering-layer bug. This is exactly the class of bug my earlier "manual trace" of the code couldn't catch without an actual browser to render in (no browser/jsdom is available in the sandbox this app was built in). Fixed by having `el()` wrap multiple top-level elements in a plain container div instead of dropping everything but the first; single-element templates (the majority of call sites, e.g. buttons and list items) are unaffected. Verified no CSS rule targets bare `div` elements, so the added wrapper is invisible and doesn't affect layout.

### Deliberately not yet built
Timed sectional Mock Test / Exam Mode, adaptive difficulty engine, spaced-repetition flashcards, interactive calculators as standalone tools, topic dependency graph, 30-day program, gamification, generated (as opposed to hand-verified) DI sets, ability to add new exams via UI. The architecture is built so all of these can be added as data files or new modules without a rewrite.

## Why plain HTML/CSS/JS instead of React+Vite+TypeScript

The original brief suggested React/Vite/TypeScript. This build uses dependency-free static files instead, for one concrete reason: it can be verified to work with zero build step and zero risk of a broken `npm install` on your machine. It still satisfies every hard requirement in the brief — static site, GitHub Pages, no backend, client-side everything. If you want to migrate to React+Vite later, the data files in `js/data/` and `data/` are plain JSON/JS objects and can be dropped into a Vite project largely unchanged; the render functions in `js/app.js` would need to become components.

## Architecture

```
EXAM → STAGE → SECTION → TOPIC → SUBTOPIC → QUESTION
```

- `data/exams/*.json` — one file per exam, holds stage/section/question-count/timing. Edit this when a new official notification is published; the app never hard-codes these numbers.
- `data/sources.json` — verification tracker. `lastVerified` is `null` until a human confirms the numbers against an official notification.
- `data/resources.json` — curated "further reading" links per topic.
- `js/data/topics.js` — the Learn content for every topic. Add a new object to the `TOPICS` array to add a topic; no other file needs to change for it to show up in Learn/Dashboard.
- `js/data/shortcuts.js` — the Shortcut Library. Add a new object to `SHORTCUTS`.
- `js/data/generators.js` — deterministic (seeded) question generators, one function per topic id (14 topics, each with 2-4 internal "flavor" templates for variety), plus a validator (`validateQuestion`) that rejects malformed questions (duplicate options, invalid answer index, etc.) before they can be shown.
- `js/storage.js` — all persistence (localStorage), derived stats, and the Quant Speed Index formula.
- `js/app.js` — hash-based router (`#/learn/percentage`, `#/practice/ratio`, etc.) and one render function per page.

## Quant Speed Index formula (documented, not a black box)

```
score = 0.40 × accuracy
      + 0.35 × min(1, avg(target_time / actual_time))
      + 0.25 × (1 − coefficient_of_variation_of_times)
```

Weights live in `SPEED_INDEX_WEIGHTS` in `js/storage.js` — change them there if you want to re-balance what the index rewards.

## Important: exam pattern data is a placeholder, not verified fact

`data/exams/sbi-clerk.json` currently holds the SBI Clerk figures you supplied in your brief (35Q/20min Prelims, 50Q/45min Mains), tagged `"sourceType": "TREND_ANALYSIS_UNVERIFIED"` with `lastVerified: null`. The IBPS Clerk and IBPS RRB files are empty templates. **Before treating any of these as accurate, check the official notification** (linked in `data/sources.json`) and update the file, then set `lastVerified` to that date. The app's Sources page surfaces this status honestly rather than presenting an assumption as fact — do not remove that flag without actually verifying.

## Adding a new topic

1. Add an object to the `TOPICS` array in `js/data/topics.js` (id, name, category, why, concept, formulas, examples, shortcutId, targetTimeSec).
2. Optionally add a matching shortcut to `SHORTCUTS` in `js/data/shortcuts.js`.
3. Optionally add a generator function to `GENERATORS` in `js/data/generators.js`, keyed by the same `id`, returning `{ question, options, answerIndex, solution, shortcut, difficulty, topic, subtopic, targetTime }`.
4. Done — it appears automatically in Learn, Practice (if a generator exists), Speed Lab and the Dashboard.

## Adding a new exam

1. Copy `data/exams/sbi-clerk.json` to `data/exams/<new-exam>.json` and fill in real, verified numbers.
2. Add an entry to `data/sources.json`.
3. (Current UI shows exams only on the Sources page; wiring exam-specific filtering into Practice/Mock Test is on the roadmap above.)

## Local development

No build step, but you do need a local server (not `file://`) because the app `fetch()`s JSON files, which browsers block over `file://`:

```bash
cd bqm
python3 -m http.server 8000
# open http://localhost:8000
```

or `npx serve .`

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) deploys automatically on every push to `main` — no build command required, since this is a static site.
4. Because the site uses relative paths (`css/style.css`, not `/css/style.css`) it works correctly at `https://<username>.github.io/<repo-name>/` without any base-path configuration.

## Data privacy

All practice history, mistakes, and streaks are stored only in `localStorage` in your browser (`bqm_data_v1`). Nothing is sent to a server. Use **Progress → Export my data** to back up or move your progress between devices/browsers, and **Import my data** to restore it.

## Testing

No automated test suite is included in this MVP. If you add generators or calculators, the `validateQuestion` function in `js/data/generators.js` is the right place to extend quality-control checks (no division by zero, exactly one correct option, internally consistent DI values, etc.) per the project's error-prevention rules.
