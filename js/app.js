// APP — hash-based router + page renderers. Vanilla JS, no build step required.

const NAV_ITEMS = [
  ["home", "Home"], ["learn", "Learn"], ["practice", "Practice"], ["mocktest", "Mock Test"],
  ["speedlab", "Speed Lab"], ["shortcuts", "Shortcuts"], ["mindtricks", "Mind Tricks"], ["pyq", "PYQ Trends"],
  ["mistakebook", "Mistake Book"], ["progress", "Progress"], ["sources", "Sources"]
];

function el(html) {
  // Use <template> rather than a plain <div> to parse the HTML string. This matters for
  // more than multi-root fragments: browsers apply special parsing rules to table markup
  // (<thead>, <tbody>, <tr>, <td>) that only create real table elements when parsed inside
  // an actual <table> or inside <template> content — parsing them via div.innerHTML silently
  // drops the table structure and keeps only the text. <template>.content is specifically
  // exempt from that restriction, so this one change fixes every table built this way.
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  const frag = tpl.content;
  // Most render functions build several stacked cards in one template string.
  // Returning only firstElementChild would silently drop every sibling after it,
  // so for multi-root fragments we return the DocumentFragment itself — appending
  // a fragment moves all of its children into the target in one call.
  if (frag.children.length === 1) return frag.firstElementChild;
  return frag;
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
  // A mock-test countdown keeps running via setInterval even after navigating away from its
  // page; if left uncleared, it would eventually auto-submit and force-redirect the user to
  // results while they're on a completely different page. Only the live exam page should have
  // an active interval — every other route clears it (the session itself is untouched, so the
  // true elapsed time is still recovered correctly if the user navigates back to the exam).
  if (!(page === "mocktest" && rest[0] === "exam") && typeof mockTimerInterval !== "undefined" && mockTimerInterval) {
    clearInterval(mockTimerInterval);
    mockTimerInterval = null;
  }
  if (!(page === "practice" && rest[0]) && typeof window.practiceTimerInterval !== "undefined" && window.practiceTimerInterval) {
    clearInterval(window.practiceTimerInterval);
    window.practiceTimerInterval = null;
  }
  renderNav(page);
  const content = document.getElementById("app-content");
  content.innerHTML = "";
  const renderers = {
    home: renderHome, speedlab: renderSpeedLab, shortcuts: renderShortcuts, pyq: renderPYQ,
    mistakebook: renderMistakeBook, progress: renderProgress, sources: renderSources
  };
  if (page === "practice") renderPractice(rest[0], rest[1]);
  else if (page === "learn") renderLearn(rest[0]);
  else if (page === "mocktest") renderMockTest(content, rest[0]);
  else if (page === "mindtricks") renderMindTricks(content, rest[0], rest[1]);
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
  if (window.practiceTimerInterval) clearInterval(window.practiceTimerInterval);
  window.practiceTimerInterval = setInterval(() => {
    const elapsed = (performance.now() - s.qStart) / 1000;
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(Math.floor(elapsed % 60)).padStart(2, "0");
    if (timerEl) {
      timerEl.textContent = `${mm}:${ss}`;
      timerEl.classList.toggle("warn", elapsed > warnAt);
    }
  }, 250);

  const optsDiv = root.querySelector("#opts");
  q.options.forEach((opt, i) => {
    const btn = el(`<button class="option-btn">${opt}</button>`);
    btn.onclick = () => {
      if (window.practiceTimerInterval) {
        clearInterval(window.practiceTimerInterval);
        window.practiceTimerInterval = null;
      }
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

// ============================================================ DI CHART BUILDERS (inline SVG, no external library)
function buildBarChartSVG(rows) {
  const width = 560, height = 260, padTop = 24, padBottom = 42, padSide = 44;
  const maxVal = Math.max(...rows.map(r => r[1]));
  const niceMax = Math.ceil((maxVal * 1.15) / 10) * 10;
  const plotW = width - padSide * 2, plotH = height - padTop - padBottom;
  const gap = plotW / rows.length;
  const barWidth = gap * 0.5;
  let bars = "";
  rows.forEach((r, i) => {
    const [label, val] = r;
    const barH = (val / niceMax) * plotH;
    const x = padSide + i * gap + (gap - barWidth) / 2;
    const y = height - padBottom - barH;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barH.toFixed(1)}" fill="#16233F" rx="2"></rect>
      <text x="${(x + barWidth / 2).toFixed(1)}" y="${(y - 8).toFixed(1)}" text-anchor="middle" font-size="13" font-family="IBM Plex Mono, monospace" fill="#1A2233">${val}</text>
      <text x="${(x + barWidth / 2).toFixed(1)}" y="${(height - padBottom + 20).toFixed(1)}" text-anchor="middle" font-size="12" fill="#4A5568">${label}</text>`;
  });
  let grid = "";
  const steps = 4;
  for (let s = 0; s <= steps; s++) {
    const val = (niceMax / steps) * s;
    const y = height - padBottom - (val / niceMax) * plotH;
    grid += `<line x1="${padSide}" y1="${y.toFixed(1)}" x2="${width - padSide}" y2="${y.toFixed(1)}" stroke="#D8CFB8" stroke-width="1"></line>
      <text x="${padSide - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#4A5568">${Math.round(val)}</text>`;
  }
  return `<svg viewBox="0 0 ${width} ${height}" style="width:100%;max-width:560px;height:auto;display:block;margin:0 auto" role="img" aria-label="Bar chart of ${rows.map(r => r[0]).join(", ")}">${grid}<line x1="${padSide}" y1="${height - padBottom}" x2="${width - padSide}" y2="${height - padBottom}" stroke="#16233F" stroke-width="1.5"></line>${bars}</svg>`;
}

function buildPieChartSVG(rows) {
  const total = rows.reduce((s, r) => s + r[1], 0);
  const colors = ["#16233F", "#B8863E", "#2E7D4F", "#A6392F", "#4A5568", "#8AA0C8", "#A9762E"];
  const cx = 130, cy = 130, r = 110;
  let cumulative = 0, slices = "", legend = "";
  rows.forEach((row, i) => {
    const [label, val] = row;
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += val;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
    const path = `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${largeArc} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`;
    const color = colors[i % colors.length];
    slices += `<path d="${path}" fill="${color}" stroke="#F3EFE4" stroke-width="2"></path>`;
    legend += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="width:13px;height:13px;background:${color};display:inline-block;border-radius:3px;flex-shrink:0"></span><span style="font-size:.88rem">${label} — <span class="num">${val}%</span></span></div>`;
  });
  return `<div style="display:flex;gap:28px;align-items:center;flex-wrap:wrap;justify-content:center;padding:10px 0"><svg viewBox="0 0 260 260" style="width:220px;height:220px;flex-shrink:0" role="img" aria-label="Pie chart of ${rows.map(r => r[0]).join(", ")}">${slices}</svg><div>${legend}</div></div>`;
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
  let visualHtml;
  if (set.type === "BAR_GRAPH") {
    visualHtml = buildBarChartSVG(set.rows);
  } else if (set.type === "PIE_CHART") {
    visualHtml = buildPieChartSVG(set.rows);
  } else {
    const theadHtml = `<tr>${set.columns.map(c => `<th>${c}</th>`).join("")}</tr>`;
    const tbodyHtml = set.rows.map(r => `<tr>${r.map((v, i) => `<td class="${i === 0 ? "" : "num"}">${v}</td>`).join("")}</tr>`).join("");
    visualHtml = `<table class="ledger"><thead>${theadHtml}</thead><tbody>${tbodyHtml}</tbody></table>`;
  }
  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Data Interpretation — ${set.sourceType === "OFFICIAL" ? "Official" : "Practice"} set</div>
      <h1 class="mt0">${set.title}</h1>
      <p class="muted">${set.caption}</p>
      ${visualHtml}
    </div>
    <div id="di-questions"></div>
  `));

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
let speedLabSubTab = "matrix"; // "matrix" | "vault" | "drills"
let speedVaultCategory = "tables"; // "tables" | "squares" | "cubes" | "fractions"
let selectedTableNum = 19;
let activeDrill = null; // { type: 'unit'|'digsum', questions: [], idx: 0, score: 0 }

function renderSpeedLab(content) {
  const overall = overallStats();
  const idx = speedIndex();

  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Speed Lab</div>
      <h1 class="mt0">Quant Speed Gym & Reference Vault</h1>
      <p class="muted">Master calculation speed through real-time metrics, rapid flash drills, and verified speed-math charts.</p>
      <div class="pill-row" style="margin-top:14px">
        <button class="btn small ${speedLabSubTab === 'matrix' ? 'gold' : 'ghost'}" id="sl-tab-matrix">Speed Matrix & Metrics</button>
        <button class="btn small ${speedLabSubTab === 'vault' ? 'gold' : 'ghost'}" id="sl-tab-vault">Reference Vault (Tables, Squares, Cubes)</button>
        <button class="btn small ${speedLabSubTab === 'drills' ? 'gold' : 'ghost'}" id="sl-tab-drills">⚡ Rapid Flash Drills</button>
      </div>
    </div>
  `));

  content.querySelector("#sl-tab-matrix").onclick = () => { speedLabSubTab = "matrix"; renderSpeedLab(content); };
  content.querySelector("#sl-tab-vault").onclick = () => { speedLabSubTab = "vault"; renderSpeedLab(content); };
  content.querySelector("#sl-tab-drills").onclick = () => { speedLabSubTab = "drills"; renderSpeedLab(content); };

  if (speedLabSubTab === "matrix") {
    renderSpeedMatrix(content, overall, idx);
  } else if (speedLabSubTab === "vault") {
    renderSpeedVault(content);
  } else if (speedLabSubTab === "drills") {
    renderSpeedDrills(content);
  }
}

function renderSpeedMatrix(content, overall, idx) {
  const rowsHtml = TOPICS.map(t => {
    const s = statsForTopic(t.id);
    return `<tr>
      <td>${t.name}</td>
      <td class="num">${fmtPct(s.accuracy)}</td>
      <td class="num">${fmtSec(s.avgTimeSec)}</td>
      <td class="num">${t.targetTimeSec}s</td>
      <td>${statusStamp(s.accuracy, s.avgTimeSec, t.targetTimeSec)}</td>
    </tr>`;
  }).join("");

  content.append(el(`
    <div class="ledger-card">
      <h3 class="mt0">Quant Speed Index: ${idx === null ? "Not enough data yet" : idx + " / 100"}</h3>
      <p class="muted">Formula: 40% accuracy + 35% speed-vs-target + 25% consistency across all recorded attempts. Weights are configurable in <span class="num">js/storage.js</span>.</p>
    </div>
    <div class="grid cols-4">
      <div class="ledger-card stat-block"><div class="label">Questions solved</div><div class="value">${overall.count}</div></div>
      <div class="ledger-card stat-block"><div class="label">Accuracy</div><div class="value">${fmtPct(overall.accuracy)}</div></div>
      <div class="ledger-card stat-block"><div class="label">Fastest</div><div class="value small">${fmtSec(overall.fastestSec)}</div></div>
      <div class="ledger-card stat-block"><div class="label">Slowest</div><div class="value small">${fmtSec(overall.slowestSec)}</div></div>
    </div>
    <div class="ledger-card">
      <h3>Topic speed matrix (${TOPICS.length} topics)</h3>
      <table class="ledger">
        <thead><tr><th>Topic</th><th class="num">Accuracy</th><th class="num">Avg time</th><th class="num">Target</th><th>Status</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  `));
}

function renderSpeedVault(content) {
  content.append(el(`
    <div class="ledger-card">
      <div class="pill-row" style="margin-bottom:16px">
        <button class="btn small ${speedVaultCategory === 'tables' ? 'gold' : 'ghost'}" id="sv-tab-tables">Tables (1 to 30)</button>
        <button class="btn small ${speedVaultCategory === 'squares' ? 'gold' : 'ghost'}" id="sv-tab-squares">Squares (1² to 60²)</button>
        <button class="btn small ${speedVaultCategory === 'cubes' ? 'gold' : 'ghost'}" id="sv-tab-cubes">Cubes (1³ to 30³)</button>
        <button class="btn small ${speedVaultCategory === 'fractions' ? 'gold' : 'ghost'}" id="sv-tab-fractions">Fractions ↔ % Chart</button>
      </div>
      <div id="vault-display"></div>
    </div>
  `));

  content.querySelector("#sv-tab-tables").onclick = () => { speedVaultCategory = "tables"; renderSpeedLab(content); };
  content.querySelector("#sv-tab-squares").onclick = () => { speedVaultCategory = "squares"; renderSpeedLab(content); };
  content.querySelector("#sv-tab-cubes").onclick = () => { speedVaultCategory = "cubes"; renderSpeedLab(content); };
  content.querySelector("#sv-tab-fractions").onclick = () => { speedVaultCategory = "fractions"; renderSpeedLab(content); };

  const display = content.querySelector("#vault-display");

  if (speedVaultCategory === "tables") {
    const tableButtons = Array.from({ length: 29 }, (_, i) => i + 2).map(n =>
      `<button class="btn small ${selectedTableNum === n ? 'gold' : 'ghost'}" data-tablenum="${n}">${n}</button>`
    ).join(" ");

    const rows = Array.from({ length: 10 }, (_, i) => i + 1).map(m =>
      `<div class="vault-card"><div class="v-num">${selectedTableNum} × ${m}</div><div class="v-val">${selectedTableNum * m}</div></div>`
    ).join("");

    display.append(el(`
      <div>
        <p class="muted">Select a multiplication table to practice or review:</p>
        <div class="pill-row" style="margin-bottom:14px">${tableButtons}</div>
        <div class="vault-grid">${rows}</div>
      </div>
    `));

    display.querySelectorAll("button[data-tablenum]").forEach(btn => {
      btn.onclick = () => {
        selectedTableNum = parseInt(btn.dataset.tablenum, 10);
        renderSpeedLab(content);
      };
    });
  } else if (speedVaultCategory === "squares") {
    const squares = Array.from({ length: 60 }, (_, i) => i + 1).map(n =>
      `<div class="vault-card"><div class="v-num">${n}²</div><div class="v-val">${n * n}</div></div>`
    ).join("");

    display.append(el(`
      <div>
        <p class="muted">Squares from 1² to 60² (Mental Anchor: Any number ending in 5 has square ending in 25 with prefix N×(N+1)):</p>
        <div class="vault-grid">${squares}</div>
      </div>
    `));
  } else if (speedVaultCategory === "cubes") {
    const cubes = Array.from({ length: 30 }, (_, i) => i + 1).map(n =>
      `<div class="vault-card"><div class="v-num">${n}³</div><div class="v-val">${n * n * n}</div></div>`
    ).join("");

    display.append(el(`
      <div>
        <p class="muted">Cubes from 1³ to 30³ (Notice: 2↔8 and 3↔7 end-digit reciprocal symmetry; 1, 4, 5, 6, 9, 0 retain their units digit):</p>
        <div class="vault-grid">${cubes}</div>
      </div>
    `));
  } else if (speedVaultCategory === "fractions") {
    const fractions = [
      ["1/1", "100%", "1.00", "Base unit"],
      ["1/2", "50%", "0.50", "Half"],
      ["1/3", "33.33%", "0.333", "2/3 = 66.67%"],
      ["1/4", "25%", "0.25", "3/4 = 75%"],
      ["1/5", "20%", "0.20", "2/5 = 40%, 3/5 = 60%, 4/5 = 80%"],
      ["1/6", "16.67%", "0.166", "5/6 = 83.33%"],
      ["1/7", "14.28%", "0.1428", "2/7=28.57%, 3/7=42.85%, 4/7=57.14%"],
      ["1/8", "12.50%", "0.125", "3/8 = 37.5%, 5/8 = 62.5%, 7/8 = 87.5%"],
      ["1/9", "11.11%", "0.111", "Repeating double digit: 2/9 = 22.22%"],
      ["1/10", "10%", "0.10", "Tenth"],
      ["1/11", "9.09%", "0.0909", "Table of 9: 2/11 = 18.18%, 3/11 = 27.27%"],
      ["1/12", "8.33%", "0.0833", "5/12 = 41.67%, 7/12 = 58.33%"],
      ["1/13", "7.69%", "0.0769", "2/13 = 15.38%"],
      ["1/14", "7.14%", "0.0714", "Half of 1/7"],
      ["1/15", "6.67%", "0.0667", "2/15 = 13.33%, 4/15 = 26.67%"],
      ["1/16", "6.25%", "0.0625", "3/16 = 18.75%, 5/16 = 31.25%"],
      ["1/20", "5.00%", "0.05", "Twentieth"],
      ["1/25", "4.00%", "0.04", "Twenty-fifth"]
    ].map(([f, pct, dec, tip]) =>
      `<tr><td class="num"><strong>${f}</strong></td><td class="num" style="color:var(--gold)">${pct}</td><td class="num">${dec}</td><td class="muted">${tip}</td></tr>`
    ).join("");

    display.append(el(`
      <div>
        <p class="muted">Essential Fraction ↔ Percentage equivalents for Banking Simplification & DI:</p>
        <table class="ledger" style="margin-top:12px">
          <thead><tr><th class="num">Fraction</th><th class="num">Percentage</th><th class="num">Decimal</th><th>Key Multiples & Trick</th></tr></thead>
          <tbody>${fractions}</tbody>
        </table>
      </div>
    `));
  }
}

function renderSpeedDrills(content) {
  content.append(el(`
    <div class="ledger-card">
      <h3 class="mt0">⚡ Rapid Speed Drills (Inspired by Numerical Ability)</h3>
      <p class="muted">Train your brain to spot Unit Digits and Digital Sums in under 3 seconds.</p>
      <div class="pill-row" style="margin:14px 0">
        <button class="btn small ${(!activeDrill || activeDrill.type === 'unit') ? 'gold' : 'ghost'}" id="start-unit-drill">Start Unit Digit Sprint (10 Qs)</button>
        <button class="btn small ${(activeDrill && activeDrill.type === 'digsum') ? 'gold' : 'ghost'}" id="start-digsum-drill">Start Digital Sum Sprint (10 Qs)</button>
      </div>
      <div id="drill-area"></div>
    </div>
  `));

  content.querySelector("#start-unit-drill").onclick = () => startFlashDrill("unit", content);
  content.querySelector("#start-digsum-drill").onclick = () => startFlashDrill("digsum", content);

  if (activeDrill) {
    drawActiveDrill(content);
  } else {
    content.querySelector("#drill-area").append(el(`
      <p class="muted">Select a sprint above to begin. Answer each question before moving to the next!</p>
    `));
  }
}

function startFlashDrill(type, content) {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    if (type === "unit") {
      const a = Math.floor(Math.random() * 890) + 110;
      const b = Math.floor(Math.random() * 890) + 110;
      const c = Math.floor(Math.random() * 89) + 11;
      const op = Math.random() > 0.5 ? "+" : "×";
      let ans = 0;
      let text = "";
      if (op === "+") {
        text = `${a} + ${b} + ${c}`;
        ans = (a + b + c) % 10;
      } else {
        text = `${a} × ${c}`;
        ans = (a * c) % 10;
      }
      const opts = [ans];
      while (opts.length < 4) {
        const r = Math.floor(Math.random() * 10);
        if (!opts.includes(r)) opts.push(r);
      }
      opts.sort(() => Math.random() - 0.5);
      questions.push({ text: `Unit digit of: ${text} = ?`, ans, options: opts });
    } else {
      const num = Math.floor(Math.random() * 89990) + 10010;
      let s = num;
      while (s > 9) {
        s = String(s).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
      }
      const ans = s;
      const opts = [ans];
      while (opts.length < 4) {
        const r = Math.floor(Math.random() * 9) + 1;
        if (!opts.includes(r)) opts.push(r);
      }
      opts.sort(() => Math.random() - 0.5);
      questions.push({ text: `Digital Root (mod 9) of: ${num}`, ans, options: opts });
    }
  }

  activeDrill = {
    type,
    questions,
    idx: 0,
    score: 0
  };

  renderSpeedLab(content);
}

function drawActiveDrill(content) {
  const area = content.querySelector("#drill-area");
  if (!area) return;
  area.innerHTML = "";

  if (activeDrill.idx >= activeDrill.questions.length) {
    area.append(el(`
      <div class="drill-box" style="text-align:center">
        <h2>🎉 Drill Completed!</h2>
        <p class="lead">Your Score: <strong>${activeDrill.score} / ${activeDrill.questions.length}</strong> (${Math.round((activeDrill.score / activeDrill.questions.length) * 100)}%)</p>
        <button class="btn gold" style="margin-top:14px" id="drill-restart">Play Again</button>
      </div>
    `));
    area.querySelector("#drill-restart").onclick = () => {
      startFlashDrill(activeDrill.type, content);
    };
    return;
  }

  const q = activeDrill.questions[activeDrill.idx];
  const card = el(`
    <div class="drill-box">
      <div class="flex-between">
        <span class="muted">Question ${activeDrill.idx + 1} of ${activeDrill.questions.length}</span>
        <span class="num" style="color:var(--gold)">Score: ${activeDrill.score}</span>
      </div>
      <div class="drill-question-text">${q.text}</div>
      <div class="drill-options-grid">
        ${q.options.map(opt => `<button class="drill-btn" data-opt="${opt}">${opt}</button>`).join("")}
      </div>
      <div id="drill-feedback" class="muted" style="text-align:center;min-height:24px"></div>
    </div>
  `);

  area.append(card);

  card.querySelectorAll(".drill-btn").forEach(btn => {
    btn.onclick = () => {
      const chosen = parseInt(btn.dataset.opt, 10);
      const isCorrect = chosen === q.ans;
      if (isCorrect) {
        btn.classList.add("correct");
        activeDrill.score++;
        card.querySelector("#drill-feedback").innerHTML = `<span style="color:#22c55e">✓ Correct! Spotting unit digit / digital sum saves precious seconds.</span>`;
      } else {
        btn.classList.add("wrong");
        card.querySelectorAll(`.drill-btn[data-opt="${q.ans}"]`)[0]?.classList.add("correct");
        card.querySelector("#drill-feedback").innerHTML = `<span style="color:#ef4444">✕ Incorrect. Correct answer is ${q.ans}.</span>`;
      }
      card.querySelectorAll(".drill-btn").forEach(b => b.disabled = true);
      setTimeout(() => {
        activeDrill.idx++;
        drawActiveDrill(content);
      }, 1000);
    };
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
let mistakeFilter = "active"; // "all" | "active" | "mastered"

function renderMistakeBook(content) {
  const total = STATE.mistakes.length;
  const activeCount = STATE.mistakes.filter(m => !m.mastered).length;
  const masteredCount = STATE.mistakes.filter(m => m.mastered).length;

  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Mistake Book</div>
      <h1 class="mt0">${total} recorded mistakes</h1>
      <p class="muted">Every wrong answer is logged here with its solution and shortcut. Re-attempt any question until you master it.</p>
      <div class="pill-row" style="margin-top:14px">
        <button class="btn small ${mistakeFilter === 'active' ? 'gold' : 'ghost'}" id="filter-active">Active (${activeCount})</button>
        <button class="btn small ${mistakeFilter === 'all' ? 'gold' : 'ghost'}" id="filter-all">All (${total})</button>
        <button class="btn small ${mistakeFilter === 'mastered' ? 'gold' : 'ghost'}" id="filter-mastered">Mastered (${masteredCount})</button>
      </div>
    </div>
    <div id="mistake-list"></div>
  `));

  content.querySelector("#filter-active").onclick = () => { mistakeFilter = "active"; renderMistakeBook(content); };
  content.querySelector("#filter-all").onclick = () => { mistakeFilter = "all"; renderMistakeBook(content); };
  content.querySelector("#filter-mastered").onclick = () => { mistakeFilter = "mastered"; renderMistakeBook(content); };

  const listContainer = content.querySelector("#mistake-list");
  const filtered = STATE.mistakes.filter(m => {
    if (mistakeFilter === "active") return !m.mastered;
    if (mistakeFilter === "mastered") return m.mastered;
    return true;
  });

  if (filtered.length === 0) {
    listContainer.append(el(`
      <div class="ledger-card">
        <p class="muted">${mistakeFilter === 'active' && total > 0 ? "🎉 Amazing work! All recorded mistakes have been mastered." : "No mistakes found in this category."}</p>
      </div>
    `));
    return;
  }

  [...filtered].reverse().forEach((m, idx) => {
    const isMastered = Boolean(m.mastered);
    const card = el(`
      <div class="ledger-card" id="mcard-${idx}">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div class="pill-row" style="margin:0">
            <span class="pill">${TOPICS.find(t => t.id === m.topic)?.name || m.topic}</span>
            <span class="pill">${new Date(m.ts).toLocaleDateString()}</span>
            <span class="stamp ${isMastered ? "mastered" : "weak"}">${isMastered ? "Mastered" : "Needs Review"}</span>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn small gold btn-reattempt">Re-attempt</button>
            <button class="btn small ghost btn-toggle-mastered">${isMastered ? "Mark Active" : "Mark Mastered"}</button>
            <button class="btn small ghost btn-del-mistake" style="color:var(--red);border-color:var(--red)" title="Remove">✕</button>
          </div>
        </div>
        <p style="margin-top:14px"><strong>${m.question}</strong></p>
        <div class="m-review-view">
          <p>Your previous answer: <span class="stamp wrong">${m.options && m.chosenIndex !== null ? m.options[m.chosenIndex] : "None"}</span> &nbsp; Correct: <span class="stamp correct">${m.options ? m.options[m.answerIndex] : ""}</span></p>
          <div class="solution-box">${m.solution}<br><em>Shortcut:</em> ${m.shortcut}</div>
        </div>
        <div class="m-quiz-view" style="display:none;margin-top:14px">
          <div class="m-opts"></div>
          <div class="m-feedback" style="margin-top:10px"></div>
        </div>
      </div>
    `);

    // Toggle Re-attempt Mode
    const reviewView = card.querySelector(".m-review-view");
    const quizView = card.querySelector(".m-quiz-view");
    const optsContainer = card.querySelector(".m-opts");
    const feedbackDiv = card.querySelector(".m-feedback");

    card.querySelector(".btn-reattempt").onclick = () => {
      reviewView.style.display = "none";
      quizView.style.display = "block";
      optsContainer.innerHTML = "";
      feedbackDiv.innerHTML = "";

      m.options.forEach((opt, oi) => {
        const obtn = el(`<button class="option-btn">${opt}</button>`);
        obtn.onclick = () => {
          optsContainer.querySelectorAll("button").forEach((b, bi) => {
            b.disabled = true;
            if (bi === m.answerIndex) b.classList.add("correct");
            else if (bi === oi) b.classList.add("wrong");
          });

          if (oi === m.answerIndex) {
            markMistakeMastered(m.id || m.ts);
            feedbackDiv.innerHTML = `<span class="stamp correct">✓ Mastered! Solved correctly.</span>`;
          } else {
            feedbackDiv.innerHTML = `<div class="solution-box" style="margin-top:8px">${m.solution}<br><em>Shortcut:</em> ${m.shortcut}</div>`;
          }
        };
        optsContainer.append(obtn);
      });
    };

    // Toggle Mastered
    card.querySelector(".btn-toggle-mastered").onclick = () => {
      m.mastered = !m.mastered;
      saveState(STATE);
      renderMistakeBook(content);
    };

    // Delete Mistake
    card.querySelector(".btn-del-mistake").onclick = () => {
      if (confirm("Remove this mistake from your book?")) {
        removeMistake(m.id || m.ts);
        renderMistakeBook(content);
      }
    };

    listContainer.append(card);
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

// ============================================================ MIND TRICKS
function renderMindTricks(content, section, chartId) {
  if (section === "patterns") return renderPatternRecognition(content);
  if (section === "finger") return renderFingerTricks(content);
  if (section === "magic") return renderMagicTricks(content);
  if (section === "charts") return renderCharts(content, chartId);
  renderMindTricksHome(content);
}

function renderMindTricksHome(content) {
  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Mind Tricks</div>
      <h1 class="mt0">Recognize it. Calculate it. Look it up.</h1>
      <p class="muted">Four tools for raw speed: spot a topic from the question's wording before you finish reading it, calculate on your fingers with zero written work, apply a handful of genuine algebraic shortcuts, and look up any reference chart instantly instead of recomputing it.</p>
    </div>
    <div class="grid cols-2" id="mt-links"></div>
  `));
  const links = [
    ["patterns", "Question Pattern Recognition", `${QUESTION_PATTERNS.length} keyword signals mapped to the topic they mean — read the phrase, know the chapter.`],
    ["finger", "Finger Tricks", `${FINGER_TRICKS.length} hand-calculation methods for multiplication tables, with the algebra behind each one.`],
    ["magic", "Magic Math Tricks", `${MAGIC_TRICKS.length} genuine Vedic-style shortcuts (squaring, ×11, Nikhilam) — each with a stated limit, not sold as universal.`],
    ["charts", "Reference Charts", "Percentage-fraction chart, multiplication tables, squares and cubes — generated live, always exact."]
  ];
  const grid = content.querySelector("#mt-links");
  links.forEach(([id, title, desc]) => {
    const card = el(`<div class="ledger-card"><h3 style="text-transform:none;border:none">${title}</h3><p class="muted">${desc}</p><a class="btn small gold" href="#/mindtricks/${id}">Open →</a></div>`);
    grid.append(card);
  });
}

function renderPatternRecognition(content) {
  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Mind Tricks — Pattern Recognition</div>
      <h1 class="mt0">Identify the topic before you finish reading</h1>
      <p class="muted">Every banking-exam question telegraphs its topic through a handful of recurring phrases. Scan for these signals and you'll often know which method to reach for by the time you finish the first sentence.</p>
    </div>
    <div id="pattern-list"></div>
  `));
  const list = content.querySelector("#pattern-list");
  QUESTION_PATTERNS.forEach(p => {
    const t = TOPICS.find(x => x.id === p.topic);
    list.append(el(`
      <div class="ledger-card">
        <div class="pill-row">${p.signals.map(s => `<span class="pill">"${s}"</span>`).join("")}</div>
        <p><strong>→ ${t ? t.name : p.topic}</strong></p>
        <p class="muted">${p.tip}</p>
        ${t ? `<a class="btn small ghost" href="#/learn/${t.id}">Open ${t.name} →</a>` : ""}
      </div>
    `));
  });
}

function renderFingerTricks(content) {
  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Mind Tricks — Finger Tricks</div>
      <h1 class="mt0">Multiplication tables on two hands</h1>
      <p class="muted">Zero written work, zero memorization required — just your fingers and the pattern behind each method.</p>
    </div>
    <div id="finger-list"></div>
  `));
  const list = content.querySelector("#finger-list");
  FINGER_TRICKS.forEach(f => {
    list.append(el(`
      <div class="ledger-card">
        <h3 style="text-transform:none;border:none">${f.title}</h3>
        <p><strong>Setup:</strong> ${f.setup}</p>
        <ol>${f.steps.map(s => `<li>${s}</li>`).join("")}</ol>
        <div class="solution-box"><strong>Example: ${f.example.q}</strong><br>${f.example.walkthrough}<br>Answer: <span class="num">${f.example.answer}</span></div>
        <p><strong>Why it works:</strong> ${f.whyItWorks}</p>
        <p class="muted"><strong>Range:</strong> ${f.range}</p>
      </div>
    `));
  });
}

function renderMagicTricks(content) {
  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Mind Tricks — Magic Math Tricks</div>
      <h1 class="mt0">Vedic-style shortcuts, with the algebra shown</h1>
      <p class="muted">Each of these is a real, derivable identity — not an unexplained "trick." Every card also states exactly where it stops working, because a shortcut presented as universal is how careless mistakes get made under exam pressure.</p>
    </div>
    <div id="magic-list"></div>
  `));
  const list = content.querySelector("#magic-list");
  MAGIC_TRICKS.forEach(m => {
    list.append(el(`
      <div class="ledger-card">
        <h3 style="text-transform:none;border:none">${m.title}</h3>
        <p><strong>Method:</strong> ${m.method}</p>
        <div class="solution-box"><strong>Example: ${m.example.q}</strong><br>${m.example.walkthrough}<br>Answer: <span class="num">${m.example.answer}</span></div>
        ${m.example2 ? `<div class="solution-box"><strong>Example: ${m.example2.q}</strong><br>${m.example2.walkthrough}<br>Answer: <span class="num">${m.example2.answer}</span></div>` : ""}
        <p><strong>Why it works:</strong> ${m.whyItWorks}</p>
        <p class="muted"><strong>When it doesn't apply:</strong> ${m.whenNotToUse}</p>
      </div>
    `));
  });
}

// Charts are computed live in JS rather than stored as data — they're pure arithmetic,
// so generating them guarantees correctness and means there's nothing to keep in sync.
function renderCharts(content, chartId) {
  if (!chartId) {
    content.append(el(`
      <div class="ledger-card">
        <div class="eyebrow">Mind Tricks — Reference Charts</div>
        <h1 class="mt0">Choose a chart</h1>
        <p class="muted">Every value below is computed on load, not hand-typed, so there's no risk of a transcription error anywhere in the chart.</p>
      </div>
      <div class="grid cols-2" id="chart-links"></div>
    `));
    const links = [
      ["percentage", "Percentage ↔ Fraction Chart", "1/2 through 1/20, with the halving/doubling trick that lets you derive most of them instead of memorizing all 19."],
      ["tables", "Multiplication Chart (up to 100)", "The classic 1-10 × 1-10 grid, plus full extended tables for 11 through 30."],
      ["squares", "Squares Chart (1-50)", "n² for every integer from 1 to 50, one clean row each."],
      ["cubes", "Cube / Cube-Root Chart (1-30)", "n³ for every integer from 1 to 30 — read left-to-right for cubes, right-to-left for cube roots."]
    ];
    const grid = content.querySelector("#chart-links");
    links.forEach(([id, title, desc]) => {
      const card = el(`<div class="ledger-card"><h3 style="text-transform:none;border:none">${title}</h3><p class="muted">${desc}</p><a class="btn small gold" href="#/mindtricks/charts/${id}">Open →</a></div>`);
      grid.append(card);
    });
    return;
  }

  // ---------------- PERCENTAGE CHART WITH TRICKS ----------------
  if (chartId === "percentage") {
    const hints = {
      2: "Anchor — memorize.", 3: "Anchor — memorize (repeating 3s).", 4: "Anchor — memorize.",
      5: "Anchor — memorize.", 10: "Anchor — memorize.",
      6: "Half of 1/3 (33.33% ÷ 2)", 7: "Repeating block 142857 — memorize ≈14.29%",
      8: "Half of 1/4 (25% ÷ 2)", 9: "Repeating 1s — memorize ≈11.11%",
      11: "Repeating '09' pattern — memorize ≈9.09%", 12: "Half of 1/6, or a third of 1/4 (25% ÷ 3)",
      13: "No clean shortcut — memorize ≈7.69% if needed", 14: "Half of 1/7 (14.29% ÷ 2)",
      15: "A third of 1/5 (20% ÷ 3)", 16: "Half of 1/8 (12.5% ÷ 2)",
      17: "No clean shortcut — memorize ≈5.88% if needed", 18: "Half of 1/9 (11.11% ÷ 2)",
      19: "No clean shortcut — memorize ≈5.26% if needed", 20: "Anchor — memorize."
    };
    let rows = "";
    for (let n = 2; n <= 20; n++) {
      const pct = 100 / n;
      const pctStr = Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(2)}%`;
      rows += `<tr><td>1/${n}</td><td class="num">${pctStr}</td><td class="muted">${hints[n]}</td></tr>`;
    }
    const fullTable = `<table class="ledger"><thead><tr><th>Fraction</th><th class="num">Percentage</th><th>How to get it fast</th></tr></thead><tbody>${rows}</tbody></table>`;
    content.append(el(`
      <div class="ledger-card">
        <div class="eyebrow">Reference Chart</div>
        <h1 class="mt0">Percentage ↔ Fraction Chart</h1>
        <p class="muted">Don't memorize 19 separate numbers — memorize the 5 anchors below, then use two tricks to derive everything else on the spot.</p>
      </div>
      <div class="ledger-card">
        <h3>Step 1 — Memorize these 5 anchors cold</h3>
        <table class="ledger"><thead><tr><th>Fraction</th><th class="num">Percentage</th></tr></thead><tbody>
          <tr><td>1/2</td><td class="num">50%</td></tr>
          <tr><td>1/3</td><td class="num">33.33%</td></tr>
          <tr><td>1/4</td><td class="num">25%</td></tr>
          <tr><td>1/5</td><td class="num">20%</td></tr>
          <tr><td>1/10</td><td class="num">10%</td></tr>
        </tbody></table>
      </div>
      <div class="ledger-card">
        <h3>Step 2 — The halving trick</h3>
        <p>Doubling the denominator exactly halves the percentage: <strong>1/(2n) is always half of 1/n's percentage.</strong></p>
        <div class="solution-box">1/4 = 25% → 1/8 = 12.5% → 1/16 = 6.25% (each step: halve the denominator, halve the %)</div>
        <div class="solution-box">1/3 = 33.33% → 1/6 = 16.67% → 1/12 = 8.33% (same trick, starting from a different anchor)</div>
      </div>
      <div class="ledger-card">
        <h3>Step 3 — The multiply-the-numerator trick</h3>
        <p>Once you know 1/n, any a/n is just a × (1/n's percentage) — no new division needed.</p>
        <div class="solution-box">Know 1/8 = 12.5%? Then 3/8 = 3 × 12.5% = 37.5%, instantly.</div>
      </div>
      <div class="ledger-card">
        <h3>Full chart (1/2 to 1/20)</h3>
        ${fullTable}
      </div>
    `));
    return;
  }

  // ---------------- MULTIPLICATION CHART ----------------
  if (chartId === "tables") {
    let headRow = `<tr><th>×</th>`;
    for (let c = 1; c <= 10; c++) headRow += `<th class="num">${c}</th>`;
    headRow += `</tr>`;
    let gridRows = "";
    for (let r = 1; r <= 10; r++) {
      let row = `<tr><td class="rowhead">${r}</td>`;
      for (let c = 1; c <= 10; c++) row += `<td class="gridcell">${r * c}</td>`;
      row += `</tr>`;
      gridRows += row;
    }
    const gridTable = `<table class="ledger grid-chart"><thead>${headRow}</thead><tbody>${gridRows}</tbody></table>`;

    let extendedHtml = "";
    for (let n = 11; n <= 30; n++) {
      const headCells = Array.from({ length: 10 }, (_, i) => `<th class="num">×${i + 1}</th>`).join("");
      let row = `<tr><td class="rowhead">${n}</td>`;
      for (let m = 1; m <= 10; m++) row += `<td class="gridcell">${n * m}</td>`;
      row += `</tr>`;
      extendedHtml += `<table class="ledger" style="margin-bottom:14px"><thead><tr><th>Table of ${n}</th>${headCells}</tr></thead><tbody>${row}</tbody></table>`;
    }

    content.append(el(`
      <div class="ledger-card">
        <div class="eyebrow">Reference Chart</div>
        <h1 class="mt0">Multiplication Chart (up to 100)</h1>
        <p class="muted">Read it like a coordinate grid: pick a row number and a column number, and their product is where the row and column meet.</p>
        ${gridTable}
      </div>
      <div class="ledger-card">
        <h3>Extended tables (11 to 30)</h3>
        <p class="muted">Same idea, one full table per number — useful once the 1-10 grid above is second nature.</p>
        ${extendedHtml}
      </div>
    `));
    return;
  }

  // ---------------- SQUARES CHART ----------------
  if (chartId === "squares") {
    let rows = "";
    for (let n = 1; n <= 50; n++) rows += `<tr><td class="num">${n}</td><td class="num">${n * n}</td></tr>`;
    const fullTable = `<table class="ledger"><thead><tr><th class="num">n</th><th class="num">n²</th></tr></thead><tbody>${rows}</tbody></table>`;
    content.append(el(`
      <div class="ledger-card">
        <div class="eyebrow">Reference Chart</div>
        <h1 class="mt0">Squares Chart (1-50)</h1>
        <p class="muted">Memorizing these turns every exact-square-root question into instant recall instead of a calculation.</p>
        ${fullTable}
      </div>
    `));
    return;
  }

  // ---------------- CUBES / CUBE ROOTS CHART ----------------
  if (chartId === "cubes") {
    let rows = "";
    for (let n = 1; n <= 30; n++) rows += `<tr><td class="num">${n}</td><td class="num">${n * n * n}</td></tr>`;
    const fullTable = `<table class="ledger"><thead><tr><th class="num">n</th><th class="num">n³ (cube)</th></tr></thead><tbody>${rows}</tbody></table>`;
    content.append(el(`
      <div class="ledger-card">
        <div class="eyebrow">Reference Chart</div>
        <h1 class="mt0">Cube / Cube-Root Chart (1-30)</h1>
        <p class="muted">Read n → n³ to find a cube. Spot a number in the n³ column and read n back to instantly find its cube root — the same table works both directions.</p>
        ${fullTable}
      </div>
    `));
    return;
  }

  content.append(el(`<p>Chart not found.</p>`));
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

// ============================================================ MOCK TEST / EXAM MODE
// Curated pool of topics that actually resemble Prelims/Mains Numerical Ability question mix.
const MOCK_TEST_TOPIC_POOL = [
  "simplification", "approximation", "number-series", "quadratic-equations",
  "percentage", "ratio", "average", "profit-loss", "time-work", "tsd",
  "si-ci", "mixture-alligation", "partnership", "ages"
];

const MOCK_TEST_PRESETS = [
  { id: "mini10", label: "10-question mini test", count: 10, minutes: 8 },
  { id: "quick20", label: "20-question test", count: 20, minutes: 16 },
  { id: "prelims35", label: "35-question Prelims-style test", count: 35, minutes: 20 },
  { id: "mains50", label: "50-question Mains-style test", count: 50, minutes: 35 }
];

let mockSession = null;
let mockTimerInterval = null;

// Session persistence for mock tests (prevents data loss on reload / accidental navigation)
function saveActiveMock(session) {
  try {
    if (session && !session.submitted) {
      sessionStorage.setItem("bqm_active_mock", JSON.stringify(session));
    }
  } catch (e) {}
}

function getActiveMock() {
  try {
    const raw = sessionStorage.getItem("bqm_active_mock");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearActiveMock() {
  try {
    sessionStorage.removeItem("bqm_active_mock");
  } catch (e) {}
}

// Realistic 35-question Banking Prelims paper distribution
function buildPrelims35QuestionSet(seedBase) {
  const spec = [
    { topics: ["simplification", "approximation"], count: 10 },
    { topics: ["number-series"], count: 5 },
    { topics: ["quadratic-equations"], count: 5 },
    { topics: ["percentage", "ratio", "average", "profit-loss", "ages"], count: 8 },
    { topics: ["time-work", "tsd", "si-ci", "partnership", "mixture-alligation"], count: 7 }
  ];
  const questions = [];
  let seed = seedBase;
  spec.forEach(group => {
    let tIdx = 0;
    for (let i = 0; i < group.count; i++) {
      const tid = group.topics[tIdx % group.topics.length];
      tIdx++;
      const q = generateQuestion(tid, seed++);
      if (q) questions.push(q);
    }
  });
  return shuffle(mulberry32(seedBase), questions);
}

function buildMockQuestionSet(count, seedBase) {
  if (count === 35) return buildPrelims35QuestionSet(seedBase);

  const out = [];
  let seed = seedBase;
  let topicIdx = 0;
  let guard = 0;
  while (out.length < count && guard < count * 10) {
    const topicId = MOCK_TEST_TOPIC_POOL[topicIdx % MOCK_TEST_TOPIC_POOL.length];
    const q = generateQuestion(topicId, seed);
    seed++; guard++; topicIdx++;
    if (q) out.push(q);
  }
  return out;
}

function renderMockTest(content, sub) {
  if (sub === "exam") {
    if (!mockSession) {
      const saved = getActiveMock();
      if (saved && !saved.submitted) {
        mockSession = saved;
      }
    }
    if (mockSession && !mockSession.submitted) {
      const totalMs = mockSession.totalSeconds * 1000;
      const elapsed = Date.now() - mockSession.startedAt;
      if (elapsed >= totalMs) {
        submitMockTest();
        return;
      }
      drawMockExam(content);
      return;
    }
    location.hash = "#/mocktest";
    return;
  }
  if (sub === "results" && mockSession && mockSession.submitted) {
    drawMockResults(content);
    return;
  }
  renderMockTestSetup(content);
}

function renderMockTestSetup(content) {
  const existing = getActiveMock();
  let resumeBanner = "";
  if (existing && !existing.submitted) {
    const totalMs = existing.totalSeconds * 1000;
    const elapsed = Date.now() - existing.startedAt;
    const remainingSec = Math.max(0, Math.floor((totalMs - elapsed) / 1000));
    if (remainingSec > 0) {
      const attempted = existing.answers.filter(a => a !== null).length;
      resumeBanner = `
        <div class="alert-banner">
          <div>
            <strong>⚠️ In-progress mock test found:</strong>
            ${attempted} of ${existing.questions.length} questions attempted · ~${Math.ceil(remainingSec / 60)} min remaining
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn gold small" id="btn-resume-mock">Resume test →</button>
            <button class="btn ghost small" id="btn-discard-mock" style="border-color:var(--red);color:var(--red)">Discard</button>
          </div>
        </div>
      `;
    } else {
      clearActiveMock();
    }
  }

  content.append(el(`
    ${resumeBanner}
    <div class="ledger-card">
      <div class="eyebrow">Mock Test</div>
      <h1 class="mt0">Timed exam simulation</h1>
      <p class="muted">Sectional timing, TCS iON palette colors, mark for review, and negative marking — replicates real exam conditions. 35Q Prelims tests use official SBI/IBPS section weightage.</p>
    </div>
    <div class="grid cols-2" id="preset-grid"></div>
    <div class="ledger-card">
      <h3>Custom test</h3>
      <div class="pill-row" style="margin-bottom:14px">
        <label>Questions: <input type="number" id="custom-count" value="15" min="5" max="100" style="width:70px"></label>
        <label>Minutes: <input type="number" id="custom-minutes" value="12" min="2" max="120" style="width:70px"></label>
      </div>
      <button class="btn gold" id="start-custom">Start custom test</button>
    </div>
    <div class="ledger-card">
      <h3>Settings</h3>
      <label><input type="checkbox" id="negative-marking" checked> Apply negative marking (−0.25 per wrong answer)</label>
    </div>
  `));

  if (content.querySelector("#btn-resume-mock")) {
    content.querySelector("#btn-resume-mock").onclick = () => {
      mockSession = existing;
      location.hash = "#/mocktest/exam";
    };
    content.querySelector("#btn-discard-mock").onclick = () => {
      if (confirm("Discard this in-progress mock test?")) {
        clearActiveMock();
        mockSession = null;
        renderMockTestSetup(content);
      }
    };
  }

  const grid = content.querySelector("#preset-grid");
  MOCK_TEST_PRESETS.forEach(p => {
    const card = el(`<div class="ledger-card"><h3 style="text-transform:none;border:none;font-size:1.05rem">${p.label}</h3><p class="muted">${p.count} questions · ${p.minutes} minutes</p><button class="btn gold small">Start</button></div>`);
    card.querySelector("button").onclick = () => startMockTest(p.count, p.minutes);
    grid.append(card);
  });
  content.querySelector("#start-custom").onclick = () => {
    const count = Math.max(5, Math.min(100, parseInt(content.querySelector("#custom-count").value) || 15));
    const minutes = Math.max(2, Math.min(120, parseInt(content.querySelector("#custom-minutes").value) || 12));
    startMockTest(count, minutes);
  };
}

function startMockTest(count, minutes) {
  const negMarking = document.getElementById("negative-marking")?.checked ?? true;
  const seedBase = Date.now() % 100000;
  const questions = buildMockQuestionSet(count, seedBase);
  mockSession = {
    questions,
    answers: new Array(questions.length).fill(null),
    marked: new Array(questions.length).fill(false),
    visited: new Array(questions.length).fill(false),
    questionTimeMs: new Array(questions.length).fill(0),
    current: 0,
    lastSwitchTs: performance.now(),
    totalSeconds: minutes * 60,
    negMarking,
    submitted: false,
    startedAt: Date.now()
  };
  saveActiveMock(mockSession);
  location.hash = "#/mocktest/exam";
}

function mockSwitchTo(newIndex) {
  const s = mockSession;
  const now = performance.now();
  s.questionTimeMs[s.current] += now - s.lastSwitchTs;
  s.lastSwitchTs = now;
  s.current = newIndex;
  s.visited[newIndex] = true;
  saveActiveMock(s);
}

function drawMockExam(content) {
  const s = mockSession;
  s.visited[s.current] = true;
  saveActiveMock(s);

  content.append(el(`
    <div class="ledger-card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div class="eyebrow">Mock Test — Question ${s.current + 1} / ${s.questions.length}</div>
        <div class="timer-box" id="exam-timer">00:00</div>
      </div>
    </div>
    <div class="grid cols-3" style="align-items:start">
      <div class="ledger-card" style="grid-column: span 2">
        <h3 style="text-transform:none;border:none;font-size:1.1rem" id="exam-question"></h3>
        <div id="exam-opts"></div>
        <div class="pill-row" style="margin-top:16px">
          <button class="btn ghost small" id="btn-prev">← Previous</button>
          <button class="btn ghost small" id="btn-mark">Mark for review</button>
          <button class="btn ghost small" id="btn-clear">Clear answer</button>
          <button class="btn small" id="btn-next">Next →</button>
        </div>
      </div>
      <div class="ledger-card">
        <h3>Question palette (TCS iON)</h3>
        <div id="palette" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px"></div>
        <div style="margin-top:14px;font-size:.75rem" class="muted">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px"><span class="ion-palette-btn ans" style="width:16px;height:16px;padding:0"></span> Answered</div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px"><span class="ion-palette-btn not-ans" style="width:16px;height:16px;padding:0"></span> Not answered</div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px"><span class="ion-palette-btn marked-only" style="width:16px;height:16px;padding:0"></span> Marked for review</div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px"><span class="ion-palette-btn marked-ans" style="width:16px;height:16px;padding:0"></span> Answered &amp; Marked</div>
          <div style="display:flex;align-items:center;gap:6px"><span class="ion-palette-btn not-visited" style="width:16px;height:16px;padding:0"></span> Not visited</div>
        </div>
        <button class="btn gold" id="btn-submit" style="width:100%;margin-top:16px">Submit test</button>
      </div>
    </div>
  `));

  function drawQuestion() {
    const q = s.questions[s.current];
    content.querySelector("#exam-question").textContent = q.question;
    const optsDiv = content.querySelector("#exam-opts");
    optsDiv.innerHTML = "";
    q.options.forEach((opt, i) => {
      const btn = el(`<button class="option-btn${s.answers[s.current] === i ? " selected" : ""}">${opt}</button>`);
      btn.onclick = () => {
        s.answers[s.current] = i;
        saveActiveMock(s);
        drawQuestion();
        drawPalette();
      };
      optsDiv.append(btn);
    });
    content.querySelector("#btn-mark").textContent = s.marked[s.current] ? "Unmark review" : "Mark for review";
    content.querySelector("#btn-prev").disabled = s.current === 0;
  }

  function drawPalette() {
    const palette = content.querySelector("#palette");
    palette.innerHTML = "";
    s.questions.forEach((q, i) => {
      let stateClass = "not-visited";
      if (s.marked[i] && s.answers[i] !== null) stateClass = "marked-ans";
      else if (s.marked[i]) stateClass = "marked-only";
      else if (s.answers[i] !== null) stateClass = "ans";
      else if (s.visited[i]) stateClass = "not-ans";

      const btn = el(`<button class="ion-palette-btn ${stateClass} ${i === s.current ? "current" : ""}">${i + 1}</button>`);
      btn.onclick = () => { mockSwitchTo(i); drawQuestion(); drawPalette(); };
      palette.append(btn);
    });
  }

  content.querySelector("#btn-next").onclick = () => {
    if (s.current < s.questions.length - 1) { mockSwitchTo(s.current + 1); drawQuestion(); drawPalette(); }
  };
  content.querySelector("#btn-prev").onclick = () => {
    if (s.current > 0) { mockSwitchTo(s.current - 1); drawQuestion(); drawPalette(); }
  };
  content.querySelector("#btn-mark").onclick = () => {
    s.marked[s.current] = !s.marked[s.current];
    saveActiveMock(s);
    drawQuestion();
    drawPalette();
  };
  content.querySelector("#btn-clear").onclick = () => {
    s.answers[s.current] = null;
    saveActiveMock(s);
    drawQuestion();
    drawPalette();
  };
  content.querySelector("#btn-submit").onclick = () => {
    if (confirm("Submit the test? You can't change answers after this.")) submitMockTest();
  };

  drawQuestion();
  drawPalette();

  const timerEl = content.querySelector("#exam-timer");
  const totalMs = s.totalSeconds * 1000;
  const alreadyElapsed = Date.now() - s.startedAt;
  if (alreadyElapsed >= totalMs) { submitMockTest(); return; }
  clearInterval(mockTimerInterval);
  mockTimerInterval = setInterval(() => {
    const elapsed = Date.now() - s.startedAt;
    const remaining = Math.max(0, totalMs - elapsed);
    const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
    const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
    if (timerEl) { timerEl.textContent = `${mm}:${ss}`; timerEl.classList.toggle("warn", remaining < 60000); }
    if (remaining <= 0) { clearInterval(mockTimerInterval); submitMockTest(); }
  }, 250);
}

function submitMockTest() {
  clearInterval(mockTimerInterval);
  mockTimerInterval = null;
  const s = mockSession;
  const now = performance.now();
  s.questionTimeMs[s.current] += now - s.lastSwitchTs;
  s.submitted = true;
  clearActiveMock();

  // Record every attempted question into the shared attempt/mistake history
  s.questions.forEach((q, i) => {
    if (s.answers[i] === null) return;
    const correct = s.answers[i] === q.answerIndex;
    recordAttempt({
      topic: q.topic, difficulty: q.difficulty || "MEDIUM", correct,
      timeMs: Math.max(1000, s.questionTimeMs[i]),
      question: q.question, options: q.options, answerIndex: q.answerIndex, chosenIndex: s.answers[i],
      solution: q.solution, shortcut: q.shortcut, targetTime: q.targetTime
    });
  });

  location.hash = "#/mocktest/results";
}

function drawMockResults(content) {
  const s = mockSession;
  const attempted = s.answers.filter(a => a !== null).length;
  const correct = s.questions.filter((q, i) => s.answers[i] === q.answerIndex).length;
  const wrong = attempted - correct;
  const score = s.negMarking ? Math.round((correct - wrong * 0.25) * 100) / 100 : correct;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const totalTimeSec = Math.round(s.questionTimeMs.reduce((a, b) => a + b, 0) / 1000);

  // Per-topic breakdown
  const byTopic = {};
  s.questions.forEach((q, i) => {
    byTopic[q.topic] = byTopic[q.topic] || { total: 0, correct: 0, attempted: 0 };
    byTopic[q.topic].total++;
    if (s.answers[i] !== null) {
      byTopic[q.topic].attempted++;
      if (s.answers[i] === q.answerIndex) byTopic[q.topic].correct++;
    }
  });

  content.append(el(`
    <div class="ledger-card">
      <div class="eyebrow">Mock Test — Results</div>
      <h1 class="mt0">Score: ${score} / ${s.questions.length}</h1>
      <div class="pill-row">
        <span class="pill">Attempted: ${attempted}/${s.questions.length}</span>
        <span class="pill">Correct: ${correct}</span>
        <span class="pill">Wrong: ${wrong}</span>
        <span class="pill">Accuracy: ${accuracy}%</span>
        <span class="pill">Total time: ${totalTimeSec}s</span>
      </div>
      ${s.negMarking ? `<p class="muted">Score = correct − (0.25 × wrong). Unattempted questions carry no penalty.</p>` : ""}
      <a class="btn gold" href="#/mocktest">Take another test</a>
    </div>
    <div class="ledger-card">
      <h3>Topic-wise breakdown</h3>
      <table class="ledger">
        <thead><tr><th>Topic</th><th class="num">Questions</th><th class="num">Attempted</th><th class="num">Correct</th></tr></thead>
        <tbody>${Object.entries(byTopic).map(([topicId, d]) => {
          const t = TOPICS.find(x => x.id === topicId);
          return `<tr><td>${t ? t.name : topicId}</td><td class="num">${d.total}</td><td class="num">${d.attempted}</td><td class="num">${d.correct}</td></tr>`;
        }).join("")}</tbody>
      </table>
    </div>
    <div class="ledger-card"><h3>Review every question</h3></div>
    <div id="review-list"></div>
  `));

  const reviewList = content.querySelector("#review-list");
  s.questions.forEach((q, i) => {
    const chosen = s.answers[i];
    const wasCorrect = chosen === q.answerIndex;
    const status = chosen === null ? `<span class="stamp weak">Not attempted</span>` : wasCorrect ? `<span class="stamp correct">Correct</span>` : `<span class="stamp wrong">Wrong</span>`;
    reviewList.append(el(`
      <div class="ledger-card">
        <div class="pill-row">${status}<span class="pill">${TOPICS.find(t => t.id === q.topic)?.name || q.topic}</span><span class="pill">${Math.round(s.questionTimeMs[i] / 1000)}s</span></div>
        <p><strong>Q${i + 1}. ${q.question}</strong></p>
        <p>${chosen !== null ? `Your answer: <span class="num">${q.options[chosen]}</span> &nbsp; ` : ""}Correct: <span class="num">${q.options[q.answerIndex]}</span></p>
        <div class="solution-box">${q.solution}<br><em>Shortcut:</em> ${q.shortcut}</div>
      </div>
    `));
  });
}

// ============================================================ THEME MANAGEMENT
function initTheme() {
  const saved = localStorage.getItem("bqm_theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved === "dark" || (!saved && prefersDark);
  applyTheme(isDark);

  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      const curIsDark = document.body.classList.contains("dark-mode");
      applyTheme(!curIsDark);
      try {
        localStorage.setItem("bqm_theme", !curIsDark ? "dark" : "light");
      } catch (e) {}
    };
  }
}

function applyTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = isDark ? "☀️" : "🌙";
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute("content", isDark ? "#0F172A" : "#16233F");
}

// ============================================================ BOOT
document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
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
