// APP — hash-based router + page renderers. Vanilla JS, no build step required.

const NAV_ITEMS = [
  ["home", "Home"], ["learn", "Learn"], ["practice", "Practice"],
  ["speedlab", "Speed Lab"], ["shortcuts", "Shortcuts"], ["pyq", "PYQ Trends"],
  ["mistakebook", "Mistake Book"], ["progress", "Progress"], ["sources", "Sources"]
];

function el(html) {
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  // Most render functions build several stacked cards in one template string.
  // Returning only firstElementChild silently drops every sibling after it —
  // wrap in the container div itself when there's more than one root element.
  if (d.children.length === 1) return d.firstElementChild;
  return d;
}
function fmtSec(n) { return (n === null || n === undefined) ? "—" : `${n}s`; }
function fmtPct(n) { return (n === null || n === undefined) ? "—" : `${n}%`; }
function statusStamp(accuracy, avgTime, target) {
  if (accuracy === null) return `<span class="stamp average">Not practiced</span>`;
  if (accuracy >= 85 && avgTime <= target) return `<span class="stamp strong">Strong</span>`;
  if (accuracy < 60 || avgTime > target * 1.6) return `<span class="stamp weak">Weak</span>`;
  return `<span class="stamp improve">Improve</span>`;
}

function route() {
  const hash = location.hash.replace("#/", "") || "home";
  const [page, ...rest] = hash.split("/");
  renderNav(page);
  const content = document.getElementById("app-content");
  content.innerHTML = "";
  const renderers = {
    home: renderHome, speedlab: renderSpeedLab, shortcuts: renderShortcuts, pyq: renderPYQ,
    mistakebook: renderMistakeBook, progress: renderProgress, sources: renderSources
  };
  if (page === "practice") renderPractice(rest[0], rest[1]);
  else if (page === "learn") renderLearn(rest[0]);
  else (renderers[page] || renderHome)(content);
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);

function renderNav(active) {
  const nav = document.getElementById("mainnav-inner");
  nav.innerHTML = NAV_ITEMS.map(([id, label]) =>
    `<button data-nav="${id}" class="${active === id ? "active" : ""}">${label}</button>`).join("");
  nav.querySelectorAll("button").forEach(b => b.onclick = () => location.hash = `#/${b.dataset.nav}`);
}

// ============================================================ HOME
function renderHome(content) {
  const today = todayStats();
  const overall = overallStats();
  const idx = speedIndex();
  const topicRows = TOPICS.map(t => ({ t, s: statsForTopic(t.id) }));
  const strong = topicRows.filter(r => r.s.accuracy !== null && r.s.accuracy >= 85 && r.s.avgTimeSec <= t_target(r.t));
  const weak = topicRows.filter(r => r.s.accuracy !== null && (r.s.accuracy < 60 || r.s.avgTimeSec > t_target(r.t) * 1.6));

  content.append(el(`
    <section class="ledger-card">
      <div class="eyebrow">Banking Quant Master</div>
      <h1 class="mt0">Learn concepts. Calculate faster. Solve smarter.</h1>
      <p class="muted">Your quant practice ledger — everything below is computed live from your own attempts, stored only in this browser.</p>
    </section>

    <div class="grid cols-4">
      <div class="ledger-card stat-block"><div class="label">Quant Speed Index</div><div class="value">${idx === null ? "—" : idx + "/100"}</div></div>
      <div class="ledger-card stat-block"><div class="label">Today — Solved</div><div class="value">${today.count}</div></div>
      <div class="ledger-card stat-block"><div class="label">Today — Accuracy</div><div class="value">${fmtPct(today.accuracy)}</div></div>
      <div class="ledger-card stat-block"><div class="label">Current Streak</div><div class="value">${STATE.streak.count} d</div></div>
    </div>

    <div class="grid cols-2">
      <div class="ledger-card">
        <h3>Weak areas</h3>
        ${weak.length ? weak.map(r => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--rule)"><span>${r.t.name}</span><span class="stamp weak">Weak</span></div>`).join("") : `<p class="muted">Not enough data yet — complete a few practice sets per topic.</p>`}
      </div>
      <div class="ledger-card">
        <h3>Strong areas</h3>
        ${strong.length ? strong.map(r => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--rule)"><span>${r.t.name}</span><span class="stamp strong">Strong</span></div>`).join("") : `<p class="muted">Not enough data yet.</p>`}
      </div>
    </div>

    <div class="ledger-card">
      <h3>Today's mission</h3>
      <ul class="checklist" id="mission-list"></ul>
    </div>

    <div class="ledger-card">
      <h3>Jump into a topic</h3>
      <ul class="topic-list" id="home-topic-list"></ul>
    </div>
  `));

  const mission = [
    "10 Calculation / Simplification questions",
    "10 Percentage questions",
    "1 Data Interpretation set",
    "5 Speed-mode questions in your weakest topic"
  ];
  const missionEl = content.querySelector("#mission-list");
  mission.forEach((m, i) => missionEl.append(el(`<li><input type="checkbox" id="m${i}"><label for="m${i}">${m}</label></li>`)));

  const list = content.querySelector("#home-topic-list");
  TOPICS.forEach(t => {
    const li = el(`<li><div><div class="t-name">${t.name}</div><div class="t-cat">${t.category}</div></div><span class="btn small ghost">Learn →</span></li>`);
    li.onclick = () => location.hash = `#/learn/${t.id}`;
    list.append(li);
  });
}
function t_target(t) { return t.targetTimeSec || 45; }

// ============================================================ LEARN
function renderLearn(topicId) {
  const content = document.getElementById("app-content");
  if (!topicId) {
    const byCat = {};
    TOPICS.forEach(t => { (byCat[t.category] = byCat[t.category] || []).push(t); });
    content.append(el(`<div class="ledger-card"><div class="eyebrow">Learn</div><h1 class="mt0">Topic library</h1><p class="muted">Concept → formula → worked example → shortcut → practice, for every topic.</p></div>`));
    Object.entries(byCat).forEach(([cat, topics]) => {
      const card = el(`<div class="ledger-card"><h3>${cat}</h3><ul class="topic-list"></ul></div>`);
      const ul = card.querySelector("ul");
      topics.forEach(t => {
        const li = el(`<li><div class="t-name">${t.name}</div><span class="btn small ghost">Open →</span></li>`);
        li.onclick = () => location.hash = `#/learn/${t.id}`;
        ul.append(li);
      });
      content.append(card);
    });
    return;
  }
  const t = TOPICS.find(x => x.id === topicId);
  if (!t) { content.append(el(`<p>Topic not found.</p>`)); return; }
  const sc = SHORTCUTS.find(s => s.id === t.shortcutId);
  const stat = statsForTopic(t.id);
  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">${t.category}</div>
      <h1 class="mt0">${t.name}</h1>
      <div class="pill-row">
        <span class="pill">Target: ${t.targetTimeSec}s / question</span>
        <span class="pill">Your avg: ${fmtSec(stat.avgTimeSec)}</span>
        <span class="pill">Your accuracy: ${fmtPct(stat.accuracy)}</span>
      </div>
    </div>
    <div class="ledger-card"><h3>1. Why this topic matters</h3><p>${t.why}</p></div>
    <div class="ledger-card"><h3>2. Concept</h3><p>${t.concept}</p></div>
    <div class="ledger-card"><h3>3. Core formulas</h3><ul>${t.formulas.map(f => `<li class="num">${f}</li>`).join("")}</ul></div>
    <div class="ledger-card"><h3>4-5. Worked example (standard approach)</h3>
      ${t.examples.map(e => `<p><strong>${e.q}</strong></p><ol>${e.steps.map(s => `<li>${s}</li>`).join("")}</ol><p>Answer: <span class="num">${e.answer}</span></p>`).join("")}
    </div>
    ${sc ? `<div class="ledger-card"><h3>6. Short trick</h3><p><strong>${sc.title}</strong> — ${sc.shortMethod}</p><p class="muted"><em>Why it works:</em> ${sc.why}</p><a class="btn small ghost" href="#/shortcuts">View full shortcut card →</a></div>` : ""}
    <div class="ledger-card"><h3>9-10. Practice this topic</h3><p class="muted">Generate a fresh, deterministic practice set for ${t.name}.</p><a class="btn gold" href="#/practice/${t.id}">Start practice →</a></div>
    <div class="ledger-card"><h3>13. Further reading</h3><div id="resources-${t.id}"></div></div>
  `));
  const resDiv = content.querySelector(`#resources-${t.id}`);
  const relevant = (window.RESOURCES || []).filter(r => r.topic === t.id);
  if (relevant.length) {
    relevant.forEach(r => resDiv.append(el(`<p>→ <a href="${r.url}" target="_blank" rel="noopener">${r.title}</a> <span class="muted">(${r.source})</span><br><span class="muted">${r.description}</span></p>`)));
  } else {
    resDiv.append(el(`<p class="muted">No curated external links for this topic yet.</p>`));
  }
}

// ============================================================ PRACTICE
let practiceSession = null;

function renderPractice(topicId, diSetId) {
  const content = document.getElementById("app-content");
  if (!topicId) {
    content.append(el(`<div class="ledger-card"><div class="eyebrow">Practice</div><h1 class="mt0">Choose a topic</h1></div>`));
    const grid = el(`<div class="grid cols-3"></div>`);
    TOPICS.forEach(t => {
      const card = el(`<div class="ledger-card"><h3>${t.name}</h3><p class="muted" style="font-size:.85rem">${t.category}</p><a class="btn small gold" href="#/practice/${t.id}">Practice →</a></div>`);
      grid.append(card);
    });
    content.append(grid);
    return;
  }

  if (topicId === "data-interpretation") { renderDIPractice(content, diSetId); return; }

  if (!GENERATORS[topicId]) {
    content.append(el(`<div class="ledger-card"><p>No question generator is wired up for this topic yet — add one in <span class="num">js/data/generators.js</span>.</p></div>`));
    return;
  }

  const t = TOPICS.find(x => x.id === topicId);
  const seedBase = Date.now() % 100000;
  const questions = generateSet(topicId, 10, seedBase);
  practiceSession = { topicId, questions, idx: 0, results: [], qStart: performance.now() };
  content.append(el(`<div id="practice-root"></div>`));
  drawPracticeQuestion(t);
}

function drawPracticeQuestion(t) {
  const root = document.getElementById("practice-root");
  root.innerHTML = "";
  const s = practiceSession;
  if (s.idx >= s.questions.length) { drawPracticeSummary(t); return; }
  const q = s.questions[s.idx];
  s.qStart = performance.now();

  root.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">${t.name} — Question ${s.idx + 1} / ${s.questions.length}</div>
      <div class="timer-box" id="timer">00:00</div>
    </div>
    <div class="ledger-card">
      <h3 style="text-transform:none;border:none;font-size:1.1rem">${q.question}</h3>
      <div id="opts"></div>
      <div id="afterAnswer"></div>
    </div>
  `));

  const timerEl = root.querySelector("#timer");
  const warnAt = (q.targetTime || 45) * 1.5;
  const interval = setInterval(() => {
    const elapsed = (performance.now() - s.qStart) / 1000;
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(Math.floor(elapsed % 60)).padStart(2, "0");
    timerEl.textContent = `${mm}:${ss}`;
    timerEl.classList.toggle("warn", elapsed > warnAt);
  }, 250);

  const optsDiv = root.querySelector("#opts");
  q.options.forEach((opt, i) => {
    const btn = el(`<button class="option-btn">${opt}</button>`);
    btn.onclick = () => {
      clearInterval(interval);
      const timeMs = performance.now() - s.qStart;
      const correct = i === q.answerIndex;
      optsDiv.querySelectorAll("button").forEach((b, bi) => {
        b.disabled = true;
        if (bi === q.answerIndex) b.classList.add("correct");
        else if (bi === i) b.classList.add("wrong");
      });
      recordAttempt({
        topic: q.topic || t.id, difficulty: q.difficulty || "MEDIUM", correct, timeMs,
        question: q.question, options: q.options, answerIndex: q.answerIndex, chosenIndex: i,
        solution: q.solution, shortcut: q.shortcut, targetTime: q.targetTime || t.targetTimeSec
      });
      s.results.push({ correct, timeMs });
      root.querySelector("#afterAnswer").append(el(`
        <div class="solution-box">
          <strong>${correct ? "Correct." : "Not quite."}</strong> ${q.solution}<br>
          <em>Shortcut:</em> ${q.shortcut}
        </div>
        <button class="btn mt16" id="nextBtn">Next question →</button>
      `));
      root.querySelector("#nextBtn").onclick = () => { s.idx++; drawPracticeQuestion(t); };
    };
    optsDiv.append(btn);
  });
}

function drawPracticeSummary(t) {
  const root = document.getElementById("practice-root");
  const s = practiceSession;
  const correct = s.results.filter(r => r.correct).length;
  const avgSec = Math.round(s.results.reduce((a, r) => a + r.timeMs, 0) / s.results.length / 100) / 10;
  root.innerHTML = "";
  root.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Session complete — ${t.name}</div>
      <h1 class="mt0">${correct} / ${s.results.length} correct</h1>
      <div class="pill-row">
        <span class="pill">Accuracy: ${Math.round(correct / s.results.length * 100)}%</span>
        <span class="pill">Avg time: ${avgSec}s (target ${t.targetTimeSec}s)</span>
      </div>
      <a class="btn gold" href="#/practice/${t.id}">Practice again</a>
      <a class="btn ghost" href="#/speedlab">View Speed Lab →</a>
    </div>
  `));
}

function renderDIPractice(content, setId) {
  if (!setId) {
    content.append(el(`<div class="ledger-card"><div class="eyebrow">Data Interpretation</div><h1 class="mt0">Choose a set</h1><p class="muted">Each set is hand-verified for internal consistency (no generated DI yet — see README on why).</p></div>`));
    const grid = el(`<div class="grid cols-3"></div>`);
    DI_SETS.forEach(s => {
      const card = el(`<div class="ledger-card"><h3 style="text-transform:none;border:none;font-size:1rem">${s.title}</h3><p class="muted" style="font-size:.82rem">${s.type.replace("_", " ")} · ${s.questions.length} questions</p><a class="btn small gold" href="#/practice/data-interpretation/${s.id}">Open →</a></div>`);
      grid.append(card);
    });
    content.append(grid);
    return;
  }
  const set = DI_SETS.find(s => s.id === setId) || DI_SETS[0];
  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Data Interpretation — ${set.sourceType === "OFFICIAL" ? "Official" : "Practice"} set</div>
      <h1 class="mt0">${set.title}</h1>
      <p class="muted">${set.caption}</p>
      <table class="ledger" id="di-table"></table>
    </div>
    <div id="di-questions"></div>
  `));
  const table = content.querySelector("#di-table");
  table.append(el(`<thead><tr>${set.columns.map(c => `<th>${c}</th>`).join("")}</tr></thead>`));
  const tbody = el(`<tbody></tbody>`);
  set.rows.forEach(r => tbody.append(el(`<tr>${r.map((v, i) => `<td class="${i === 0 ? "" : "num"}">${v}</td>`).join("")}</tr>`)));
  table.append(tbody);

  const qDiv = content.querySelector("#di-questions");
  const qStartTimes = [];
  set.questions.forEach((q, qi) => {
    qStartTimes[qi] = performance.now();
    const card = el(`<div class="ledger-card"><h3 style="text-transform:none;border:none;font-size:1rem">Q${qi + 1}. ${q.q}</h3><div class="opts"></div><div class="after"></div></div>`);
    const optsDiv = card.querySelector(".opts");
    q.options.forEach((opt, i) => {
      const btn = el(`<button class="option-btn">${opt}</button>`);
      btn.onclick = () => {
        const timeMs = performance.now() - qStartTimes[qi];
        const correct = i === q.answerIndex;
        optsDiv.querySelectorAll("button").forEach((b, bi) => {
          b.disabled = true;
          if (bi === q.answerIndex) b.classList.add("correct"); else if (bi === i) b.classList.add("wrong");
        });
        recordAttempt({
          topic: "data-interpretation", difficulty: "MEDIUM", correct, timeMs,
          question: q.q, options: q.options, answerIndex: q.answerIndex, chosenIndex: i,
          solution: q.solution, shortcut: q.shortcut, targetTime: 90
        });
        card.querySelector(".after").append(el(`<div class="solution-box"><strong>${correct ? "Correct." : "Not quite."}</strong> ${q.solution}<br><em>Shortcut:</em> ${q.shortcut}</div>`));
      };
      optsDiv.append(btn);
    });
    qDiv.append(card);
  });
}

// ============================================================ SPEED LAB
function renderSpeedLab(content) {
  const overall = overallStats();
  const idx = speedIndex();
  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Speed Lab</div>
      <h1 class="mt0">Quant Speed Index: ${idx === null ? "Not enough data yet" : idx + " / 100"}</h1>
      <p class="muted">Formula: 40% accuracy + 35% speed-vs-target + 25% consistency across all recorded attempts. Weights are configurable in <span class="num">js/storage.js</span>.</p>
    </div>
    <div class="grid cols-4">
      <div class="ledger-card stat-block"><div class="label">Questions solved</div><div class="value">${overall.count}</div></div>
      <div class="ledger-card stat-block"><div class="label">Accuracy</div><div class="value">${fmtPct(overall.accuracy)}</div></div>
      <div class="ledger-card stat-block"><div class="label">Fastest</div><div class="value small">${fmtSec(overall.fastestSec)}</div></div>
      <div class="ledger-card stat-block"><div class="label">Slowest</div><div class="value small">${fmtSec(overall.slowestSec)}</div></div>
    </div>
    <div class="ledger-card">
      <h3>Topic speed matrix</h3>
      <table class="ledger">
        <thead><tr><th>Topic</th><th class="num">Accuracy</th><th class="num">Avg time</th><th class="num">Target</th><th>Status</th></tr></thead>
        <tbody id="matrix-body"></tbody>
      </table>
    </div>
  `));
  const body = content.querySelector("#matrix-body");
  TOPICS.forEach(t => {
    const s = statsForTopic(t.id);
    body.append(el(`<tr>
      <td>${t.name}</td>
      <td class="num">${fmtPct(s.accuracy)}</td>
      <td class="num">${fmtSec(s.avgTimeSec)}</td>
      <td class="num">${t.targetTimeSec}s</td>
      <td>${statusStamp(s.accuracy, s.avgTimeSec, t.targetTimeSec)}</td>
    </tr>`));
  });
}

// ============================================================ SHORTCUTS
function renderShortcuts(content) {
  content.append(el(`<div class="ledger-card"><div class="eyebrow">Shortcut Library</div><h1 class="mt0">Every trick, with the math behind it</h1></div>`));
  const byCat = {};
  SHORTCUTS.forEach(s => { (byCat[s.category] = byCat[s.category] || []).push(s); });
  Object.entries(byCat).forEach(([cat, cards]) => {
    content.append(el(`<h3 style="margin-top:24px">${cat}</h3>`));
    cards.forEach(s => {
      content.append(el(`
        <div class="ledger-card">
          <h3 style="text-transform:none;border:none">${s.title}</h3>
          <p><strong>When to use:</strong> ${s.whenToUse}</p>
          <div class="grid cols-2">
            <div><p class="muted" style="margin-bottom:4px"><strong>Normal method</strong></p><p>${s.normalMethod}</p></div>
            <div><p class="muted" style="margin-bottom:4px"><strong>Short method</strong></p><p>${s.shortMethod}</p></div>
          </div>
          <p><strong>Why it works:</strong> ${s.why}</p>
          <div class="solution-box"><strong>Example:</strong> ${s.example.q}<ol>${s.example.steps.map(x => `<li>${x}</li>`).join("")}</ol>Answer: <span class="num">${s.example.answer}</span></div>
          <p><strong>Time saved:</strong> ${s.timeSaved}</p>
          <p><strong>Common mistake:</strong> ${s.commonMistake}</p>
          <p><strong>When not to use:</strong> ${s.whenNotToUse}</p>
        </div>
      `));
    });
  });
}

// ============================================================ MISTAKE BOOK
function renderMistakeBook(content) {
  content.append(el(`<div class="ledger-card"><div class="eyebrow">Mistake Book</div><h1 class="mt0">${STATE.mistakes.length} recorded mistakes</h1><p class="muted">Every wrong answer is saved automatically with the correct method and shortcut.</p></div>`));
  if (STATE.mistakes.length === 0) {
    content.append(el(`<div class="ledger-card"><p class="muted">No mistakes recorded yet — they'll appear here the moment you answer something incorrectly in Practice.</p></div>`));
    return;
  }
  [...STATE.mistakes].reverse().forEach((m, i) => {
    content.append(el(`
      <div class="ledger-card">
        <div class="pill-row"><span class="pill">${m.topic}</span><span class="pill">${new Date(m.ts).toLocaleDateString()}</span></div>
        <p><strong>${m.question}</strong></p>
        <p>Your answer: <span class="stamp wrong">${m.options[m.chosenIndex]}</span> &nbsp; Correct: <span class="stamp correct">${m.options[m.answerIndex]}</span></p>
        <div class="solution-box">${m.solution}<br><em>Shortcut:</em> ${m.shortcut}</div>
      </div>
    `));
  });
}

// ============================================================ PROGRESS
function renderProgress(content) {
  const overall = overallStats();
  content.append(el(`
    <div class="ledger-card"><div class="eyebrow">Progress</div><h1 class="mt0">Your full record</h1></div>
    <div class="grid cols-3">
      <div class="ledger-card stat-block"><div class="label">Total attempts</div><div class="value">${overall.count}</div></div>
      <div class="ledger-card stat-block"><div class="label">Overall accuracy</div><div class="value">${fmtPct(overall.accuracy)}</div></div>
      <div class="ledger-card stat-block"><div class="label">Avg time / question</div><div class="value small">${fmtSec(overall.avgTimeSec)}</div></div>
    </div>
    <div class="ledger-card">
      <h3>Your data belongs to you</h3>
      <p class="muted">Everything is stored only in this browser's local storage. Export it to move devices, or reset if you want a clean slate.</p>
      <button class="btn" id="btn-export">Export my data</button>
      <label class="btn ghost" style="margin-left:8px">Import my data<input type="file" id="file-import" accept="application/json" style="display:none"></label>
      <button class="btn" style="margin-left:8px;background:var(--red)" id="btn-reset">Reset all data</button>
      <span id="import-status" class="muted" style="margin-left:8px"></span>
    </div>
  `));
  content.querySelector("#btn-export").onclick = exportData;
  content.querySelector("#file-import").onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    importData(f, (ok) => {
      content.querySelector("#import-status").textContent = ok ? "Import successful." : "Import failed — not a valid file.";
      if (ok) setTimeout(() => location.reload(), 800);
    });
  };
  content.querySelector("#btn-reset").onclick = () => {
    if (confirm("This clears all local progress permanently. Continue?")) { resetData(); location.reload(); }
  };
}

// ============================================================ PYQ TRENDS
function renderPYQ(content) {
  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Previous Year Questions — Trend Analysis</div>
      <h1 class="mt0">There is no official SBI/IBPS question bank</h1>
      <p class="muted">SBI and IBPS do not publish official past papers. Every "PYQ" resource online — including this page — is a memory-based reconstruction from candidates and coaching analysts, never verbatim official text. This page summarizes publicly reported topic trends, paraphrased from coaching-site analyses, with sources linked. Treat every number here as an analyst estimate, not a guaranteed count.</p>
    </div>
    <div class="ledger-card">
      <h3>IBPS RRB Office Assistant — Prelims Numerical Ability (memory-based analysis)</h3>
      <table class="ledger">
        <thead><tr><th>Topic</th><th class="num">Typical Qs</th><th>Reported difficulty</th></tr></thead>
        <tbody>
          <tr><td>Simplification</td><td class="num">≈10</td><td>Easy</td></tr>
          <tr><td>Data Interpretation</td><td class="num">≈10</td><td>Easy</td></tr>
          <tr><td>Arithmetic word problems</td><td class="num">≈10</td><td>Easy–Moderate</td></tr>
          <tr><td>Quadratic Equations</td><td class="num">≈5</td><td>Easy</td></tr>
          <tr><td>Wrong Number Series</td><td class="num">≈5</td><td>Easy–Moderate</td></tr>
        </tbody>
      </table>
      <p class="muted" style="margin-top:10px">Source: <a href="https://competition.careers360.com/articles/ibps-rrb-clerk-exam-analysis" target="_blank" rel="noopener">Careers360 IBPS RRB Clerk exam analysis</a> — candidate-feedback based, paraphrased here, not an official IBPS document.</p>
    </div>
    <div class="ledger-card">
      <h3>SBI Clerk Prelims — reported difficulty pattern</h3>
      <p>Coaching-site analyses consistently describe Numerical Ability as easy-to-moderate across recent cycles, with BODMAS/simplification-style questions and puzzle-heavy reasoning called out as the highest-weightage areas overall.</p>
      <p class="muted" style="margin-top:10px">Source: <a href="https://testbook.com/sbi-clerk/previous-year-papers" target="_blank" rel="noopener">Testbook SBI Clerk previous year papers page</a>.</p>
    </div>
    <div class="ledger-card">
      <h3>IBPS Clerk Prelims — recent shift-wise difficulty (2022 cycle, illustrative)</h3>
      <table class="ledger">
        <thead><tr><th>Shift</th><th class="num">Numerical Ability Qs</th><th class="num">Reported good attempts</th><th>Difficulty</th></tr></thead>
        <tbody>
          <tr><td>Shift 1</td><td class="num">35</td><td class="num">25–26</td><td>Easy–Moderate</td></tr>
          <tr><td>Shift 3</td><td class="num">35</td><td class="num">27–28</td><td>Moderate</td></tr>
          <tr><td>Shift 4</td><td class="num">35</td><td class="num">26–28</td><td>Moderate</td></tr>
        </tbody>
      </table>
      <p class="muted" style="margin-top:10px">Source: <a href="https://news.careers360.com/ibps-clerk-2022-prelims-exam-concludes-check-paper-analysis-for-september-4" target="_blank" rel="noopener">Careers360 IBPS Clerk 2022 shift analysis</a>. Included as a historical illustration of shift-to-shift variance, not a prediction for future cycles.</p>
    </div>
    <div class="ledger-card">
      <h3>What this means for your practice mix</h3>
      <p>Across these analyses, three things show up repeatedly: Simplification/BODMAS carries real, consistent weight; Quadratic Equations shows up as a fast, learnable block; and DI + Arithmetic word problems together dominate the section. That roughly matches the topic weighting already reflected in this app's Practice and Speed Lab modules.</p>
    </div>
  `));
}

// ============================================================ SOURCES
function renderSources(content) {
  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Sources</div>
      <h1 class="mt0">Verify latest pattern</h1>
      <p class="muted">This app never presents a coaching-site estimate as an official exam pattern. Every exam profile below is labeled by its actual verification status.</p>
    </div>
    <div id="sources-list"></div>
  `));
  const list = content.querySelector("#sources-list");
  (window.SOURCES_JSON?.exams || []).forEach(s => {
    list.append(el(`
      <div class="ledger-card">
        <h3 style="text-transform:none;border:none">${s.examId.replace(/_/g, " ")}</h3>
        <p><span class="stamp trend">${s.verificationStatus.replace(/_/g, " ")}</span></p>
        <p>Official site: <a href="${s.officialSite}" target="_blank" rel="noopener">${s.officialSite}</a></p>
        <p class="muted">Last verified: ${s.lastVerified || "Never — update data/sources.json after checking the official notification."}</p>
        <p class="muted">${s.instructions}</p>
      </div>
    `));
  });
}

// ============================================================ boot
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/sources.json");
    window.SOURCES_JSON = await res.json();
  } catch (e) { window.SOURCES_JSON = { exams: [] }; }
  try {
    const res2 = await fetch("data/resources.json");
    window.RESOURCES = await res2.json();
  } catch (e) { window.RESOURCES = []; }
  route();
});
