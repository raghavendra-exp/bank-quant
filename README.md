# Banking Quant Master

**Learn Concepts. Calculate Faster. Solve Smarter.**

An interactive, entirely browser-based Quantitative Aptitude learning and speed-training system for Indian banking exams (SBI Clerk, IBPS Clerk, IBPS RRB Office Assistant), built to extend to any future exam.

## What this version actually includes (v2)

This is a real, working version, not a mockup — but it is still a scoped subset of the full 100-section spec. Included now:

- **Dashboard** — today's stats, Quant Speed Index, weak/strong areas, today's mission checklist
- **Learn** — full topic pages (why it matters → concept → formulas → worked example → shortcut → practice → further reading) for **15 topics**: Simplification, Approximation, Number Series, Percentage, Ratio, Average, Profit & Loss, Time & Work, Time-Speed-Distance, Quadratic Equations, Simple & Compound Interest, Mixture & Alligation, Partnership, Ages, Data Interpretation
- **Practice** — a deterministic (seeded), multi-template question generator for **14 of those 15 topics**, each independently verified to produce **500+ unique, arithmetically-correct questions** (see "Question generator verification" below) — plus 3 hand-verified Data Interpretation sets (table, bar graph, pie chart)
- **PYQ Trends** — a new page summarizing real, sourced topic-weightage research (see "On PYQs" below) — paraphrased and clearly labeled as memory-based trend analysis, never presented as an official past paper
- **Speed Lab** — Quant Speed Index (documented formula, see below), topic speed matrix with target-vs-actual times and status stamps
- **Shortcut Library** — 11 shortcut cards, each with the mathematical justification for *why* the trick works, not just the trick
- **Mistake Book** — every wrong answer is auto-saved with the correct method and shortcut
- **Progress** — overall stats, export/import your data as JSON, reset
- **Sources** — exam-pattern verification tracker
- Offline-first via a service worker; all data stored in `localStorage`, nothing sent to any server

### On the uploaded textbooks (R.S. Aggarwal, Sarvesh K. Varma)
These are copyrighted, commercially published books. No text or questions were extracted or reproduced from them anywhere in this project — that would be copyright infringement regardless of the intended educational use. Everything here (formulas, worked examples, generator logic, shortcuts) was written from general, standard knowledge of these exact question types, which is well-established across the banking-exam prep space and not specific to any one book.

### On PYQs
SBI and IBPS **do not publish official past question papers**. Every "PYQ" resource that exists (including the new PYQ Trends page in this app) is a memory-based reconstruction compiled by candidates and coaching analysts after the fact. This app's PYQ Trends page reflects that honestly: it paraphrases publicly reported topic-weightage patterns (e.g. Quadratic Equations and Simplification appearing consistently in IBPS RRB analyses) with sources linked, and never claims to reproduce or represent an actual past paper.

### Question generator verification
Every generator-backed topic was tested with a Node script before shipping:
- **Uniqueness**: generating 4,000 seeds per topic, all 14 topics produced well over 500 unique question strings (range: 896–4,000; see git history / re-run the check yourself with the snippet in `js/data/generators.js`'s header comment logic).
- **Correctness**: for topics where the answer could be independently re-derived from the question text via regex (percentage, profit-loss, average, simplification-adjacent, TSD, SI/CI, ratio, quadratic-equations, mixture-alligation, partnership, ages), thousands of generated questions were cross-checked against an independent calculation — zero mismatches found. One real bug (a rounding inconsistency between the displayed answer and the solution text in the Time & Work generator) was caught this way and fixed before shipping.

### Deliberately not yet built (see the original 100-section spec for the full roadmap)
Timed sectional Mock Test / Exam Mode, adaptive difficulty engine, spaced-repetition flashcards, interactive calculators (work/alligation/partnership/mensuration as standalone tools), topic dependency graph, 30-day program, gamification, mensuration/probability/permutation-combination/data-sufficiency generators, ability to add new exams via UI, generated (as opposed to hand-verified) DI sets. The architecture is built so all of these can be added as data files or new modules without a rewrite.

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
