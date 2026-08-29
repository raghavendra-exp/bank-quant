// STORAGE — thin wrapper around localStorage. Single JSON blob keeps export/import trivial.
const STORAGE_KEY = "bqm_data_v1";

function defaultState() {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    attempts: [],      // every answered question: {id, topic, difficulty, correct, timeMs, ts, question, options, answerIndex, chosenIndex, solution, shortcut}
    mistakes: [],       // subset of attempts that were wrong, plus reviewCount
    streak: { count: 0, lastDate: null },
    settings: { warnSlowQuestions: true }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  } catch (e) {
    console.error("Storage read failed, starting fresh.", e);
    return defaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error("Storage write failed — progress may not persist.", e);
    return false;
  }
}

let STATE = loadState();

function recordAttempt(a) {
  a.ts = Date.now();
  STATE.attempts.push(a);
  if (!a.correct) {
    STATE.mistakes.push(Object.assign({ reviewCount: 0 }, a));
  }
  updateStreak();
  saveState(STATE);
}

function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  if (STATE.streak.lastDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  STATE.streak.count = STATE.streak.lastDate === yesterday ? STATE.streak.count + 1 : 1;
  STATE.streak.lastDate = today;
}

function exportData() {
  const blob = new Blob([JSON.stringify(STATE, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quant-progress-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file, onDone) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      STATE = Object.assign(defaultState(), parsed);
      saveState(STATE);
      onDone(true);
    } catch (e) {
      console.error("Import failed — file was not valid progress JSON.", e);
      onDone(false);
    }
  };
  reader.readAsText(file);
}

function resetData() {
  STATE = defaultState();
  saveState(STATE);
}

// ---- derived stats ----
function statsForTopic(topicId) {
  const rows = STATE.attempts.filter(a => a.topic === topicId);
  if (rows.length === 0) return { count: 0, accuracy: null, avgTimeSec: null };
  const correct = rows.filter(r => r.correct).length;
  const avgMs = rows.reduce((s, r) => s + r.timeMs, 0) / rows.length;
  return {
    count: rows.length,
    accuracy: Math.round((correct / rows.length) * 100),
    avgTimeSec: Math.round(avgMs / 100) / 10
  };
}

function overallStats() {
  const rows = STATE.attempts;
  if (rows.length === 0) return { count: 0, accuracy: null, avgTimeSec: null, fastestSec: null, slowestSec: null };
  const correct = rows.filter(r => r.correct).length;
  const times = rows.map(r => r.timeMs);
  return {
    count: rows.length,
    accuracy: Math.round((correct / rows.length) * 100),
    avgTimeSec: Math.round((times.reduce((a, b) => a + b, 0) / times.length) / 100) / 10,
    fastestSec: Math.round(Math.min(...times) / 100) / 10,
    slowestSec: Math.round(Math.max(...times) / 100) / 10
  };
}

function todayStats() {
  const today = new Date().toISOString().slice(0, 10);
  const rows = STATE.attempts.filter(a => new Date(a.ts).toISOString().slice(0, 10) === today);
  const topics = new Set(rows.map(r => r.topic));
  if (rows.length === 0) return { count: 0, accuracy: null, avgTimeSec: null, topics: 0 };
  const correct = rows.filter(r => r.correct).length;
  return {
    count: rows.length,
    accuracy: Math.round((correct / rows.length) * 100),
    avgTimeSec: Math.round((rows.reduce((s, r) => s + r.timeMs, 0) / rows.length) / 100) / 10,
    topics: topics.size
  };
}

// Quant Speed Index — documented, configurable formula (spec §28)
// weights: accuracy 40%, speed-vs-target 35%, consistency 25%
const SPEED_INDEX_WEIGHTS = { accuracy: 0.40, speed: 0.35, consistency: 0.25 };

function speedIndex() {
  const rows = STATE.attempts;
  if (rows.length < 5) return null;
  const accuracy = rows.filter(r => r.correct).length / rows.length; // 0-1
  const speedRatios = rows.filter(r => r.targetTime).map(r => Math.min(1.5, r.targetTime / (r.timeMs / 1000)));
  const avgSpeedRatio = speedRatios.length ? speedRatios.reduce((a, b) => a + b, 0) / speedRatios.length : 1;
  const speedScore = Math.min(1, avgSpeedRatio); // capped at 1
  const times = rows.map(r => r.timeMs / 1000);
  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const variance = times.reduce((s, t) => s + Math.pow(t - mean, 2), 0) / times.length;
  const cv = mean ? Math.sqrt(variance) / mean : 1; // coefficient of variation
  const consistency = Math.max(0, 1 - Math.min(1, cv));
  const score = (accuracy * SPEED_INDEX_WEIGHTS.accuracy) + (speedScore * SPEED_INDEX_WEIGHTS.speed) + (consistency * SPEED_INDEX_WEIGHTS.consistency);
  return Math.round(score * 100);
}
