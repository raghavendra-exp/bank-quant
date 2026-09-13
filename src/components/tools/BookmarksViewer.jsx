import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Trash2, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { getBookmarks, toggleBookmark } from '../../utils/dataManager';

export default function BookmarksViewer({ onPracticeQuestion }) {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  function handleRemove(q) {
    const updated = toggleBookmark(q);
    setBookmarks([...updated]);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
            <Bookmark className="w-4 h-4" />
            <span>Saved Questions</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Bookmarked Questions Library
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            High-yield questions and key tricks saved for fast last-minute pre-exam revision.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-slate-400 block uppercase font-mono">Saved</span>
          <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
            {bookmarks.length} Qs
          </span>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No bookmarked questions yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Click the bookmark icon on any question in Practice Arena to store it here for later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((q) => (
            <div
              key={q.id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {q.topicName || q.topic}
                </span>

                <button
                  onClick={() => handleRemove(q)}
                  className="p-1.5 text-amber-500 hover:text-rose-500 rounded-lg hover:bg-slate-50 transition-all"
                  title="Remove from bookmarks"
                >
                  <BookmarkCheck className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                {q.question}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {q.options?.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border ${
                      i === q.answerIndex
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{String.fromCharCode(65 + i)}. {opt}</span>
                    {i === q.answerIndex && <span className="ml-2">✓ (Correct)</span>}
                  </div>
                ))}
              </div>

              {q.topperMethod && (
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                    ⚡ Topper Speed Hack:
                  </span>
                  <p>{q.topperMethod.steps?.join(' → ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
