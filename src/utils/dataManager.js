import { generateQuestionBank } from './questionGenerator';

const STORAGE_KEYS = {
  PROGRESS: 'bq_user_progress_v1',
  MISTAKES: 'bq_user_mistakes_v1',
  BOOKMARKS: 'bq_user_bookmarks_v1',
  NOTES: 'bq_user_notes_v1',
  READINESS: 'bq_user_readiness_v1',
  ACTIVE_PLAN: 'bq_user_active_plan_v1',
  SETTINGS: 'bq_user_settings_v1',
  CUSTOM_QUESTIONS: 'bq_custom_questions_v1'
};

// Safe localStorage helper
export const storage = {
  get(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing ${key} from localStorage:`, e);
    }
  }
};

let cachedBank = null;

// Load static curated questions + generated 500+ questions
export async function getAllQuestions() {
  if (cachedBank && cachedBank.length > 0) {
    return cachedBank;
  }

  let curated = [];
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/questions.json`);
    if (res.ok) {
      curated = await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch questions.json, falling back to generator', e);
  }

  const generated = generateQuestionBank(500);
  const custom = storage.get(STORAGE_KEYS.CUSTOM_QUESTIONS, []);

  cachedBank = [...curated, ...custom, ...generated];
  return cachedBank;
}

// User Progress & Analytics
export function getUserProgress() {
  return storage.get(STORAGE_KEYS.PROGRESS, {
    totalAttempted: 0,
    totalCorrect: 0,
    totalTimeSpentSec: 0,
    topicStats: {}, // topicId -> { attempted, correct, timeSpentSec }
    recentAttempts: []
  });
}

export function recordQuestionAttempt(questionId, topicId, isCorrect, timeSpentSec) {
  const progress = getUserProgress();
  progress.totalAttempted += 1;
  if (isCorrect) progress.totalCorrect += 1;
  progress.totalTimeSpentSec += timeSpentSec;

  if (!progress.topicStats[topicId]) {
    progress.topicStats[topicId] = { attempted: 0, correct: 0, timeSpentSec: 0 };
  }
  progress.topicStats[topicId].attempted += 1;
  if (isCorrect) progress.topicStats[topicId].correct += 1;
  progress.topicStats[topicId].timeSpentSec += timeSpentSec;

  progress.recentAttempts.unshift({
    questionId,
    topicId,
    isCorrect,
    timeSpentSec,
    timestamp: Date.now()
  });
  if (progress.recentAttempts.length > 200) {
    progress.recentAttempts.pop();
  }

  storage.set(STORAGE_KEYS.PROGRESS, progress);
  updateQuantReadinessScore();
  return progress;
}

// Mistake Notebook
export function getMistakes() {
  return storage.get(STORAGE_KEYS.MISTAKES, []);
}

export function addMistake(question, selectedOption, mistakeType, userNote = '') {
  const mistakes = getMistakes();
  const existingIdx = mistakes.findIndex(m => m.id === question.id);
  const mistakeItem = {
    ...question,
    selectedOption,
    mistakeType, // 'calculation_error' | 'formula_forgot' | 'question_misread' | 'time_panic' | 'concept_gap'
    userNote,
    addedAt: Date.now(),
    reviewed: false,
    revisionCount: 0
  };

  if (existingIdx >= 0) {
    mistakes[existingIdx] = mistakeItem;
  } else {
    mistakes.unshift(mistakeItem);
  }

  storage.set(STORAGE_KEYS.MISTAKES, mistakes);
  return mistakes;
}

export function markMistakeReviewed(questionId) {
  const mistakes = getMistakes();
  const item = mistakes.find(m => m.id === questionId);
  if (item) {
    item.reviewed = true;
    item.revisionCount = (item.revisionCount || 0) + 1;
    item.lastReviewedAt = Date.now();
    storage.set(STORAGE_KEYS.MISTAKES, mistakes);
  }
  return mistakes;
}

export function removeMistake(questionId) {
  let mistakes = getMistakes();
  mistakes = mistakes.filter(m => m.id !== questionId);
  storage.set(STORAGE_KEYS.MISTAKES, mistakes);
  return mistakes;
}

// Bookmarks
export function getBookmarks() {
  return storage.get(STORAGE_KEYS.BOOKMARKS, []);
}

export function toggleBookmark(question) {
  let bookmarks = getBookmarks();
  const idx = bookmarks.findIndex(b => b.id === question.id);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
  } else {
    bookmarks.unshift({ ...question, bookmarkedAt: Date.now() });
  }
  storage.set(STORAGE_KEYS.BOOKMARKS, bookmarks);
  return bookmarks;
}

export function isBookmarked(questionId) {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.id === questionId);
}

// Personal Topic Notes
export function getTopicNotes(topicId) {
  const allNotes = storage.get(STORAGE_KEYS.NOTES, {});
  return allNotes[topicId] || '';
}

export function saveTopicNotes(topicId, noteContent) {
  const allNotes = storage.get(STORAGE_KEYS.NOTES, {});
  allNotes[topicId] = noteContent;
  storage.set(STORAGE_KEYS.NOTES, allNotes);
  return allNotes;
}

// Quant Readiness Score (0 - 100)
export function getQuantReadinessScore() {
  return storage.get(STORAGE_KEYS.READINESS, {
    score: 35, // starting baseline
    speedFactor: 30,
    accuracyFactor: 40,
    syllabusCoverageFactor: 30,
    lastCalculated: Date.now()
  });
}

export function updateQuantReadinessScore() {
  const progress = getUserProgress();
  if (progress.totalAttempted === 0) return;

  const accuracy = (progress.totalCorrect / progress.totalAttempted) * 100;
  const avgTimePerQ = progress.totalTimeSpentSec / progress.totalAttempted;

  // Speed factor: 100 if avgTime <= 25s, scales down to 0 if >= 90s
  let speedFactor = Math.max(0, Math.min(100, Math.round(100 - ((avgTimePerQ - 25) / 65) * 100)));

  // Coverage factor: number of distinct topics attempted out of 32
  const topicsCovered = Object.keys(progress.topicStats).length;
  const coverageFactor = Math.min(100, Math.round((topicsCovered / 15) * 100));

  // Accuracy factor: scales from 0 to 100
  const accuracyFactor = Math.round(accuracy);

  // Weighted overall score: 40% accuracy, 35% speed, 25% coverage
  const score = Math.round(accuracyFactor * 0.40 + speedFactor * 0.35 + coverageFactor * 0.25);

  const readiness = {
    score: Math.max(10, Math.min(99, score)),
    speedFactor,
    accuracyFactor,
    syllabusCoverageFactor: coverageFactor,
    lastCalculated: Date.now()
  };

  storage.set(STORAGE_KEYS.READINESS, readiness);
  return readiness;
}

// Backup & Restore
export function exportUserData() {
  return {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    progress: getUserProgress(),
    mistakes: getMistakes(),
    bookmarks: getBookmarks(),
    notes: storage.get(STORAGE_KEYS.NOTES, {}),
    readiness: getQuantReadinessScore(),
    activePlan: storage.get(STORAGE_KEYS.ACTIVE_PLAN, null)
  };
}

export function importUserData(jsonData) {
  try {
    if (!jsonData || typeof jsonData !== 'object') return false;
    if (jsonData.progress) storage.set(STORAGE_KEYS.PROGRESS, jsonData.progress);
    if (jsonData.mistakes) storage.set(STORAGE_KEYS.MISTAKES, jsonData.mistakes);
    if (jsonData.bookmarks) storage.set(STORAGE_KEYS.BOOKMARKS, jsonData.bookmarks);
    if (jsonData.notes) storage.set(STORAGE_KEYS.NOTES, jsonData.notes);
    if (jsonData.readiness) storage.set(STORAGE_KEYS.READINESS, jsonData.readiness);
    if (jsonData.activePlan) storage.set(STORAGE_KEYS.ACTIVE_PLAN, jsonData.activePlan);
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}
